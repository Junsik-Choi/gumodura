'use client';

import { useState, useEffect } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

interface IpInfo {
  ip: string;
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  timezone?: string;
}

export default function MyIpAddress() {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedState, setCopiedState] = useState(false);

  const [
    myPublicIp,
    copied,
    copyIp,
    ipDetailInfo,
    country,
    region,
    city,
    isp,
    timezone,
    checking,
    checkAgain,
    whatIsIp,
    publicIpDesc,
    publicIpDescFull,
    ipUsageDesc,
    notes,
    note1,
    note2,
    note3,
    ipVersion,
    currentIpIs,
    formatIs,
    ipv4Desc,
    errorFetchingIp,
    errorMessage,
  ] = useTranslatedTexts([
    '🌐 내 공인 IP 주소',
    '✅ 복사됨!',
    '📋 IP 복사하기',
    '📍 IP 상세 정보',
    '국가',
    '지역',
    '도시',
    '인터넷 서비스 제공자',
    '타임존',
    '⏳ 확인 중...',
    '🔄 다시 확인하기',
    '💡 IP 주소란?',
    '공인 IP 주소',
    '는 인터넷에서 여러분의 기기를 식별하는 고유 주소예요.',
    '웹사이트 접속, 이메일 전송 등 모든 인터넷 활동에 이 주소가 사용돼요.',
    '⚠️ 참고사항',
    '• VPN이나 프록시를 사용 중이면 실제 IP와 다를 수 있어요',
    '• 가정용 인터넷은 주기적으로 IP가 변경될 수 있어요',
    '• 위치 정보는 대략적인 위치이며 정확하지 않을 수 있어요',
    '🔢 IP 버전',
    '현재 IP는',
    '형식이에요.',
    'IPv4: 0~255 범위의 4개 숫자 조합',
    'IP 주소를 가져올 수 없습니다',
    'IP 정보를 가져오는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
  ]);

  const fetchIpInfo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 여러 API를 순차적으로 시도
      const apis = [
        'https://api.ipify.org?format=json',
        'https://api.ip.sb/jsonip',
        'https://ipinfo.io/json',
      ];

      let ipData: IpInfo | null = null;

      for (const api of apis) {
        try {
          const response = await fetch(api);
          if (response.ok) {
            const data = await response.json();
            ipData = {
              ip: data.ip || data.query,
              country: data.country,
              region: data.region || data.regionName,
              city: data.city,
              isp: data.isp || data.org,
              timezone: data.timezone,
            };
            break;
          }
        } catch {
          continue;
        }
      }

      if (ipData) {
        setIpInfo(ipData);
        
        // 추가 정보 가져오기 (ip-api.com)
        try {
          const detailResponse = await fetch(`http://ip-api.com/json/${ipData.ip}`);
          if (detailResponse.ok) {
            const detailData = await detailResponse.json();
            if (detailData.status === 'success') {
              setIpInfo({
                ip: ipData.ip,
                country: detailData.country,
                region: detailData.regionName,
                city: detailData.city,
                isp: detailData.isp,
                timezone: detailData.timezone,
              });
            }
          }
        } catch {
          // 추가 정보 실패해도 기본 IP는 표시
        }
      } else {
        throw new Error(errorFetchingIp);
      }
    } catch {
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpInfo();
  }, []);

  const copyIpToClipboard = async () => {
    if (ipInfo?.ip) {
      await navigator.clipboard.writeText(ipInfo.ip);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* 메인 IP 표시 */}
      <div className="bg-gradient-to-br from-ai-primary to-purple-600 rounded-2xl p-8 text-white text-center">
        <p className="text-lg opacity-90 mb-4">{myPublicIp}</p>
        
        {loading ? (
          <div className="animate-pulse">
            <div className="h-12 bg-white/20 rounded-lg w-3/4 mx-auto"></div>
          </div>
        ) : error ? (
          <p className="text-white/80">{error}</p>
        ) : (
          <>
            <p className="text-4xl sm:text-5xl font-mono font-bold tracking-wider">
              {ipInfo?.ip}
            </p>
            <button
              onClick={copyIpToClipboard}
              className="mt-4 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors inline-flex items-center gap-2"
            >
              {copiedState ? (
                <>{copied}</>
              ) : (
                <>{copyIp}</>
              )}
            </button>
          </>
        )}
      </div>

      {/* 상세 정보 */}
      {ipInfo && !loading && !error && (
        <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
          <h3 className="font-bold text-gray-800">{ipDetailInfo}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ipInfo.country && (
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500">{country}</p>
                <p className="font-medium text-gray-800">{ipInfo.country}</p>
              </div>
            )}
            {ipInfo.region && (
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500">{region}</p>
                <p className="font-medium text-gray-800">{ipInfo.region}</p>
              </div>
            )}
            {ipInfo.city && (
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500">{city}</p>
                <p className="font-medium text-gray-800">{ipInfo.city}</p>
              </div>
            )}
            {ipInfo.isp && (
              <div className="bg-white rounded-xl p-4">
                <p className="text-sm text-gray-500">{isp}</p>
                <p className="font-medium text-gray-800 text-sm">{ipInfo.isp}</p>
              </div>
            )}
            {ipInfo.timezone && (
              <div className="bg-white rounded-xl p-4 sm:col-span-2">
                <p className="text-sm text-gray-500">{timezone}</p>
                <p className="font-medium text-gray-800">{ipInfo.timezone}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 새로고침 버튼 */}
      <button
        onClick={fetchIpInfo}
        disabled={loading}
        className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-gray-700 transition-colors disabled:opacity-50"
      >
        {loading ? checking : checkAgain}
      </button>

      {/* IP 관련 정보 */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-blue-800 mb-3">{whatIsIp}</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>
            <strong>{publicIpDesc}</strong>{publicIpDescFull}
          </p>
          <p>
            {ipUsageDesc}
          </p>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-yellow-50 rounded-xl p-4">
        <h3 className="font-bold text-yellow-800 mb-2">{notes}</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>{note1}</li>
          <li>{note2}</li>
          <li>{note3}</li>
        </ul>
      </div>

      {/* IPv4/IPv6 구분 */}
      {ipInfo?.ip && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-bold text-gray-700 mb-2">{ipVersion}</h3>
          <p className="text-gray-600">
            {currentIpIs}{' '}
            <span className="font-bold text-ai-primary">
              {ipInfo.ip.includes(':') ? 'IPv6' : 'IPv4'}
            </span>
            {' '}{formatIs}
          </p>
          {!ipInfo.ip.includes(':') && (
            <p className="text-sm text-gray-500 mt-1">
              {ipInfo.ip.split('.').length === 4 ? ipv4Desc : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
