'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

declare global {
  interface Window {
    daum: {
      Postcode: new (config: {
        oncomplete: (data: PostcodeResult) => void;
        onclose?: () => void;
      }) => {
        open: () => void;
        embed: (element: HTMLElement) => void;
      };
    };
  }
}

interface PostcodeResult {
  zonecode: string; // 우편번호
  address: string; // 기본 주소
  addressEnglish: string; // 영문 주소
  addressType: string; // 주소 타입 (R: 도로명, J: 지번)
  roadAddress: string; // 도로명 주소
  roadAddressEnglish: string; // 영문 도로명 주소
  jibunAddress: string; // 지번 주소
  jibunAddressEnglish: string; // 영문 지번 주소
  buildingCode: string; // 건물코드
  buildingName: string; // 건물명
  apartment: string; // 아파트 여부 (Y/N)
  sido: string; // 시/도
  sigungu: string; // 시/군/구
  bname: string; // 법정동/법정리
  bname1: string; // 법정동/법정리
  bname2: string; // 법정동/법정리
  query: string; // 검색어
}

export default function PostcodeSearch() {
  const [result, setResult] = useState<PostcodeResult | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const [
    searchPostcode,
    loading,
    clickToSearch,
    postalCode,
    copiedText,
    copy,
    copyText,
    addressInfo,
    roadAddressLabel,
    jibunAddressLabel,
    englishAddress,
    detailInfo,
    sido,
    sigungu,
    bname,
    addressType,
    roadType,
    jibunType,
    buildingCode,
    copyFullAddress,
    searchAgain,
    searchGuide,
    searchExample,
    searchTips,
    tipRoad,
    tipRoadSearch,
    tipBuilding,
    tipBuildingSearch,
    tipJibun,
    tipJibunSearch,
    tipApartment,
    tipApartmentSearch,
    notes,
    note1,
    note2,
    note3,
  ] = useTranslatedTexts([
    '🔍 우편번호 검색하기',
    '⏳ 로딩 중...',
    '클릭하면 주소 검색 창이 열려요',
    '📮 우편번호',
    '✅ 복사됨!',
    '📋 복사',
    '복사',
    '📍 주소 정보',
    '도로명 주소',
    '지번 주소',
    '영문 주소',
    '📋 상세 정보',
    '시/도',
    '시/군/구',
    '법정동',
    '주소 타입',
    '도로명',
    '지번',
    '건물코드',
    '📋 전체 주소 복사',
    '🔄 다시 검색',
    '도로명, 지번, 건물명으로 검색할 수 있어요',
    '예: 판교역로, 삼성동 159, 롯데타워',
    '💡 검색 팁',
    '도로명',
    '으로 검색: 세종대로, 테헤란로',
    '건물명',
    '으로 검색: 63빌딩, 코엑스',
    '지번',
    '으로 검색: 역삼동 123',
    '아파트명',
    '으로 검색: 래미안, 자이',
    '📌 참고사항',
    '카카오(다음) 우편번호 서비스를 이용합니다',
    '2015년 8월부터 시행된 새 우편번호(5자리)가 표시됩니다',
    '검색 결과는 실시간으로 업데이트됩니다',
  ]);

  useEffect(() => {
    // Daum Postcode API 스크립트 로드
    if (typeof window !== 'undefined' && !window.daum) {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => setIsLoaded(true);
      document.head.appendChild(script);
    } else if (window.daum) {
      setIsLoaded(true);
    }
  }, []);

  const openPostcode = useCallback(() => {
    if (!isLoaded || !window.daum) return;

    new window.daum.Postcode({
      oncomplete: (data: PostcodeResult) => {
        setResult(data);
      },
    }).open();
  }, [isLoaded]);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const resetSearch = () => {
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* 검색 버튼 */}
      <div className="text-center">
        <button
          onClick={openPostcode}
          disabled={!isLoaded}
          className="w-full py-6 bg-gradient-to-r from-ai-primary to-purple-600 text-white font-bold text-xl rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoaded ? (
            <>{searchPostcode}</>
          ) : (
            <>{loading}</>
          )}
        </button>
        <p className="text-sm text-gray-500 mt-2">
          {clickToSearch}
        </p>
      </div>

      {/* 결과 */}
      {result && (
        <div className="space-y-4">
          {/* 우편번호 */}
          <div className="bg-gradient-to-br from-ai-primary to-purple-600 rounded-2xl p-6 text-white text-center">
            <p className="text-lg opacity-90 mb-2">{postalCode}</p>
            <p className="text-5xl font-mono font-bold tracking-wider">
              {result.zonecode}
            </p>
            <button
              onClick={() => copyToClipboard(result.zonecode, 'zonecode')}
              className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors"
            >
              {copied === 'zonecode' ? copiedText : copy}
            </button>
          </div>

          {/* 주소 정보 */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-gray-800">{addressInfo}</h3>

            {/* 도로명 주소 */}
            {result.roadAddress && (
              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">{roadAddressLabel}</span>
                  <button
                    onClick={() => copyToClipboard(result.roadAddress, 'road')}
                    className="text-sm text-ai-primary hover:underline"
                  >
                    {copied === 'road' ? copiedText : copyText}
                  </button>
                </div>
                <p className="font-medium text-gray-800">{result.roadAddress}</p>
                {result.buildingName && (
                  <p className="text-sm text-gray-500 mt-1">({result.buildingName})</p>
                )}
              </div>
            )}

            {/* 지번 주소 */}
            {result.jibunAddress && (
              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">{jibunAddressLabel}</span>
                  <button
                    onClick={() => copyToClipboard(result.jibunAddress, 'jibun')}
                    className="text-sm text-ai-primary hover:underline"
                  >
                    {copied === 'jibun' ? copiedText : copyText}
                  </button>
                </div>
                <p className="font-medium text-gray-800">{result.jibunAddress}</p>
              </div>
            )}

            {/* 영문 주소 */}
            {result.addressEnglish && (
              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">{englishAddress}</span>
                  <button
                    onClick={() => copyToClipboard(result.addressEnglish, 'english')}
                    className="text-sm text-ai-primary hover:underline"
                  >
                    {copied === 'english' ? copiedText : copyText}
                  </button>
                </div>
                <p className="font-medium text-gray-800 text-sm">{result.addressEnglish}</p>
              </div>
            )}
          </div>

          {/* 상세 정보 */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-bold text-gray-700 mb-3">{detailInfo}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-500">{sido}</p>
                <p className="font-medium">{result.sido}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-500">{sigungu}</p>
                <p className="font-medium">{result.sigungu}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-500">{bname}</p>
                <p className="font-medium">{result.bname || '-'}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-gray-500">{addressType}</p>
                <p className="font-medium">
                  {result.addressType === 'R' ? roadType : jibunType}
                </p>
              </div>
              {result.buildingCode && (
                <div className="bg-white rounded-lg p-3 col-span-2">
                  <p className="text-gray-500">{buildingCode}</p>
                  <p className="font-mono text-sm">{result.buildingCode}</p>
                </div>
              )}
            </div>
          </div>

          {/* 전체 복사 버튼 */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => copyToClipboard(
                `(${result.zonecode}) ${result.roadAddress || result.jibunAddress}`,
                'full'
              )}
              className="py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
            >
              {copied === 'full' ? copiedText : copyFullAddress}
            </button>
            <button
              onClick={resetSearch}
              className="py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors"
            >
              {searchAgain}
            </button>
          </div>
        </div>
      )}

      {/* 검색 전 안내 */}
      {!result && (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <p className="text-5xl mb-4">📬</p>
          <p className="text-gray-600 mb-2">
            {searchGuide}
          </p>
          <p className="text-sm text-gray-400">
            {searchExample}
          </p>
        </div>
      )}

      {/* 사용 팁 */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-blue-800 mb-2">{searchTips}</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>{tipRoad}</strong>{tipRoadSearch}</li>
          <li>• <strong>{tipBuilding}</strong>{tipBuildingSearch}</li>
          <li>• <strong>{tipJibun}</strong>{tipJibunSearch}</li>
          <li>• <strong>{tipApartment}</strong>{tipApartmentSearch}</li>
        </ul>
      </div>

      {/* 안내사항 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-700 mb-2">{notes}</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• {note1}</li>
          <li>• {note2}</li>
          <li>• {note3}</li>
        </ul>
      </div>
    </div>
  );
}
