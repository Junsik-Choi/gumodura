'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

export default function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [
    imageOnlyAlert,
    featureInProgress,
    featureDescription,
    featureComingSoon,
    dragOrClick,
    supportedFormats,
    selectFile,
    uploadedImage,
    selectAnother,
    upcomingFeatures,
    aiAutoRecognition,
    aiAutoRecognitionDesc,
    fastProcessing,
    fastProcessingDesc,
    transparentBackground,
    transparentBackgroundDesc,
    privacyProtection,
    privacyProtectionDesc,
    useCases,
    idPhoto,
    productImage,
    snsContent,
    designWork,
    useNow,
    tryFreeServices,
    removeBgDesc,
    photoRoomDesc,
  ] = useTranslatedTexts([
    '이미지 파일만 업로드 가능합니다.',
    '기능 준비 중',
    '배경 제거 기능은 현재 개발 중이에요.',
    '곧 AI 기반 자동 배경 제거 기능이 추가될 예정이에요!',
    '이미지를 드래그하거나 클릭하여 업로드',
    'JPG, PNG, WEBP 형식 지원',
    '파일 선택',
    '업로드된 이미지',
    '🗑️ 다른 이미지 선택',
    '✨ 예정된 기능',
    'AI 자동 인식',
    '인물, 사물을 자동으로 인식해요',
    '빠른 처리',
    '몇 초 만에 배경 제거 완료',
    '투명 배경',
    'PNG 형식으로 투명 배경 저장',
    '개인정보 보호',
    '이미지는 서버에 저장되지 않아요',
    '💡 이런 곳에 활용해요',
    '증명사진',
    '상품 이미지',
    'SNS 콘텐츠',
    '디자인 작업',
    '🔗 지금 바로 사용하려면?',
    '아래 무료 서비스들을 이용해보세요:',
    '- 가장 유명한 배경 제거 서비스',
    '- 모바일 앱도 제공',
  ]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(imageOnlyAlert);
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [imageOnlyAlert]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert(imageOnlyAlert);
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, [imageOnlyAlert]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const resetImage = () => {
    setImage(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 안내 배너 */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 text-center">
        <p className="text-4xl mb-3">🚧</p>
        <h3 className="font-bold text-yellow-800 text-lg mb-2">{featureInProgress}</h3>
        <p className="text-yellow-700">
          {featureDescription}<br/>
          {featureComingSoon}
        </p>
      </div>

      {/* 이미지 업로드 영역 */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-ai-primary transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {!image ? (
          <>
            <div className="text-5xl mb-4">🖼️</div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {dragOrClick}
            </p>
            <p className="text-sm text-gray-500">
              {supportedFormats}
            </p>
            <button
              type="button"
              className="mt-4 px-6 py-2 bg-ai-primary text-white rounded-xl hover:bg-ai-primary-dark transition-colors"
            >
              {selectFile}
            </button>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{fileName}</p>
            <div className="relative inline-block max-w-full">
              <img
                src={image}
                alt={uploadedImage}
                className="max-h-64 max-w-full rounded-lg shadow-lg mx-auto"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                resetImage();
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
            >
              {selectAnother}
            </button>
          </div>
        )}
      </div>

      {/* 기능 미리보기 */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h3 className="font-bold text-gray-800 mb-4">{upcomingFeatures}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4">
            <p className="text-2xl mb-2">🤖</p>
            <p className="font-medium text-gray-700">{aiAutoRecognition}</p>
            <p className="text-sm text-gray-500">{aiAutoRecognitionDesc}</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-2xl mb-2">⚡</p>
            <p className="font-medium text-gray-700">{fastProcessing}</p>
            <p className="text-sm text-gray-500">{fastProcessingDesc}</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-2xl mb-2">🎨</p>
            <p className="font-medium text-gray-700">{transparentBackground}</p>
            <p className="text-sm text-gray-500">{transparentBackgroundDesc}</p>
          </div>
          <div className="bg-white rounded-xl p-4">
            <p className="text-2xl mb-2">🔒</p>
            <p className="font-medium text-gray-700">{privacyProtection}</p>
            <p className="text-sm text-gray-500">{privacyProtectionDesc}</p>
          </div>
        </div>
      </div>

      {/* 사용 용도 */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-blue-800 mb-3">{useCases}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-blue-700">
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xl mb-1">📸</p>
            <p>{idPhoto}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xl mb-1">🛍️</p>
            <p>{productImage}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xl mb-1">📱</p>
            <p>{snsContent}</p>
          </div>
          <div className="bg-white rounded-lg p-3 text-center">
            <p className="text-xl mb-1">🎨</p>
            <p>{designWork}</p>
          </div>
        </div>
      </div>

      {/* 대안 안내 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-700 mb-2">{useNow}</h3>
        <p className="text-sm text-gray-600 mb-3">
          {tryFreeServices}
        </p>
        <div className="space-y-2">
          <a
            href="https://www.remove.bg/ko"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg p-3 hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-ai-primary">remove.bg</span>
            <span className="text-gray-500 text-sm ml-2">{removeBgDesc}</span>
          </a>
          <a
            href="https://www.photoroom.com/ko/background-remover"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-white rounded-lg p-3 hover:bg-gray-100 transition-colors"
          >
            <span className="font-medium text-ai-primary">PhotoRoom</span>
            <span className="text-gray-500 text-sm ml-2">{photoRoomDesc}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
