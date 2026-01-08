'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

interface ImageData {
  file: File;
  preview: string;
  width: number;
  height: number;
}

export default function ImageResize() {
  const [
    profileLabel,
    snsSquareLabel,
    kakaoLabel,
    a4PrintLabel,
    selectImageLabel,
    supportedFormatsLabel,
    originalLabel,
    reselectLabel,
    quickSizeLabel,
    sizeSettingLabel,
    keepRatioLabel,
    widthLabel,
    heightLabel,
    formatLabel,
    qualityLabel,
    smallSizeLabel,
    highQualityLabel,
    processingLabel,
    convertBtnLabel,
    convertedLabel,
    convertedImageLabel,
    downloadLabel,
  ] = useTranslatedTexts([
    '프로필',
    'SNS 정사각형',
    '카카오톡',
    'A4 인쇄',
    '이미지를 선택하세요',
    'JPG, PNG, WebP 지원',
    '원본',
    '다시 선택',
    '빠른 크기 선택',
    '크기 설정',
    '비율 유지',
    '너비 (px)',
    '높이 (px)',
    '파일 형식',
    '품질',
    '작은 용량',
    '고품질',
    '변환 중...',
    '이미지 변환하기',
    '변환 완료!',
    '변환된 이미지',
    '다운로드',
  ]);

  const PRESET_SIZES = [
    { name: profileLabel, width: 200, height: 200, icon: '👤' },
    { name: 'HD', width: 1280, height: 720, icon: '📺' },
    { name: 'Full HD', width: 1920, height: 1080, icon: '🖥️' },
    { name: snsSquareLabel, width: 1080, height: 1080, icon: '📱' },
    { name: kakaoLabel, width: 720, height: 720, icon: '💬' },
    { name: a4PrintLabel, width: 2480, height: 3508, icon: '🖨️' },
  ];

  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [keepAspectRatio, setKeepAspectRatio] = useState(true);
  const [quality, setQuality] = useState(90);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aspectRatioRef = useRef<number>(1);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const data: ImageData = {
          file,
          preview: event.target?.result as string,
          width: img.width,
          height: img.height,
        };
        setImageData(data);
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        aspectRatioRef.current = img.width / img.height;
        setResizedImage(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleWidthChange = (value: number) => {
    setTargetWidth(value);
    if (keepAspectRatio && aspectRatioRef.current) {
      setTargetHeight(Math.round(value / aspectRatioRef.current));
    }
  };

  const handleHeightChange = (value: number) => {
    setTargetHeight(value);
    if (keepAspectRatio && aspectRatioRef.current) {
      setTargetWidth(Math.round(value * aspectRatioRef.current));
    }
  };

  const applyPreset = (preset: typeof PRESET_SIZES[0]) => {
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
    setKeepAspectRatio(false);
  };

  const resizeImage = async () => {
    if (!imageData) return;

    setProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const img = new Image();
      img.src = imageData.preview;
      await new Promise((resolve) => { img.onload = resolve; });

      // 고품질 리사이징
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'png' ? 'image/png' : 'image/webp';
      const dataUrl = canvas.toDataURL(mimeType, quality / 100);
      setResizedImage(dataUrl);
    } catch (error) {
      console.error('Resize error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!resizedImage) return;

    const link = document.createElement('a');
    link.download = `resized_${targetWidth}x${targetHeight}.${format}`;
    link.href = resizedImage;
    link.click();
  };

  const reset = () => {
    setImageData(null);
    setResizedImage(null);
    setTargetWidth(0);
    setTargetHeight(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* 파일 업로드 */}
      {!imageData && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-3 border-dashed border-gray-300 rounded-2xl p-8 sm:p-12 text-center cursor-pointer hover:border-ai-primary hover:bg-ai-primary/5 transition-all"
        >
          <div className="text-5xl sm:text-6xl mb-4">🖼️</div>
          <p className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            {selectImageLabel}
          </p>
          <p className="text-sm text-gray-500">{supportedFormatsLabel}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {/* 이미지 선택됨 */}
      {imageData && (
        <div className="space-y-6">
          {/* 원본 정보 */}
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
            <img
              src={imageData.preview}
              alt={originalLabel}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{imageData.file.name}</p>
              <p className="text-sm text-gray-500">
                {originalLabel}: {imageData.width} × {imageData.height}px
              </p>
            </div>
            <button
              onClick={reset}
              className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              {reselectLabel}
            </button>
          </div>

          {/* 프리셋 크기 */}
          <div>
            <p className="font-semibold text-gray-700 mb-3">📐 {quickSizeLabel}</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {PRESET_SIZES.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-ai-primary hover:bg-ai-primary/5 transition-all text-center"
                >
                  <span className="text-2xl block mb-1">{preset.icon}</span>
                  <span className="text-xs font-medium text-gray-600 block">{preset.name}</span>
                  <span className="text-xs text-gray-400">{preset.width}×{preset.height}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 크기 입력 */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-gray-700">📏 {sizeSettingLabel}</p>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepAspectRatio}
                  onChange={(e) => setKeepAspectRatio(e.target.checked)}
                  className="w-5 h-5 rounded text-ai-primary"
                />
                <span className="text-sm text-gray-600">{keepRatioLabel} 🔗</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-500 mb-1 block">{widthLabel}</label>
                <input
                  type="number"
                  value={targetWidth}
                  onChange={(e) => handleWidthChange(Number(e.target.value))}
                  min={1}
                  max={10000}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-ai-primary outline-none"
                />
              </div>
              <span className="text-2xl text-gray-400 pt-6">×</span>
              <div className="flex-1">
                <label className="text-sm text-gray-500 mb-1 block">{heightLabel}</label>
                <input
                  type="number"
                  value={targetHeight}
                  onChange={(e) => handleHeightChange(Number(e.target.value))}
                  min={1}
                  max={10000}
                  className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:border-ai-primary outline-none"
                />
              </div>
            </div>
          </div>

          {/* 포맷 & 품질 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-3">📁 {formatLabel}</p>
              <div className="flex gap-2">
                {(['jpeg', 'png', 'webp'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                      format === f
                        ? 'bg-ai-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-3">✨ {qualityLabel}: {quality}%</p>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{smallSizeLabel}</span>
                <span>{highQualityLabel}</span>
              </div>
            </div>
          </div>

          {/* 변환 버튼 */}
          <button
            onClick={resizeImage}
            disabled={processing || !targetWidth || !targetHeight}
            className="w-full py-4 bg-ai-primary hover:bg-ai-primary-dark disabled:bg-gray-400 text-white font-bold text-xl rounded-2xl transition-colors"
          >
            {processing ? processingLabel : `✨ ${convertBtnLabel}`}
          </button>

          {/* 결과 */}
          {resizedImage && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center space-y-4">
              <p className="text-lg font-semibold text-green-700">✅ {convertedLabel}</p>
              <img
                src={resizedImage}
                alt={convertedImageLabel}
                className="max-w-full max-h-64 mx-auto rounded-lg shadow-lg"
              />
              <p className="text-sm text-gray-600">
                {targetWidth} × {targetHeight}px · {format.toUpperCase()}
              </p>
              <button
                onClick={downloadImage}
                className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
              >
                📥 {downloadLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
