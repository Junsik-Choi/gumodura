'use client';

import { useState, useRef, useCallback } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

interface ImageFile {
  file: File;
  preview: string;
  originalSize: number;
  compressedSize?: number;
  compressedUrl?: string;
}

export default function ImageCompress() {
  const [
    bestQualityText,
    highQualityText,
    mediumText,
    smallSizeText,
    almostOriginalText,
    recommendedText,
    balancedText,
    sizePriorityText,
    selectOrDragText,
    multiSelectText,
    compressionQualityText,
    qualityControlText,
    maxWidthLimitText,
    compressingText,
    compressImagesText,
    compressionCompleteText,
    savedText,
    downloadAllText,
    startNewText,
  ] = useTranslatedTexts([
    '최고 품질',
    '고품질',
    '중간',
    '작은 용량',
    '거의 원본',
    '추천',
    '균형잡힌',
    '용량 우선',
    '이미지 선택 또는 드래그',
    '여러 장 선택 가능',
    '압축 품질',
    '품질 조절',
    '최대 너비 제한 (선택)',
    '압축 중...',
    '개 이미지 압축하기',
    '압축 완료!',
    '절약!',
    '전체 다운로드',
    '새로 시작',
  ]);

  const QUALITY_PRESETS = [
    { name: bestQualityText, quality: 95, icon: '💎', desc: almostOriginalText },
    { name: highQualityText, quality: 85, icon: '✨', desc: recommendedText },
    { name: mediumText, quality: 70, icon: '⚖️', desc: balancedText },
    { name: smallSizeText, quality: 50, icon: '📦', desc: sizePriorityText },
  ];
  const [images, setImages] = useState<ImageFile[]>([]);
  const [quality, setQuality] = useState(85);
  const [maxWidth, setMaxWidth] = useState<number | ''>('');
  const [processing, setProcessing] = useState(false);
  const [compressed, setCompressed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles: ImageFile[] = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        imageFiles.push({
          file,
          preview: event.target?.result as string,
          originalSize: file.size,
        });
        if (imageFiles.length === files.length) {
          setImages((prev) => [...prev, ...imageFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
    setCompressed(false);
  }, []);

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const compressImage = async (imgFile: ImageFile): Promise<ImageFile> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imgFile);
          return;
        }

        let width = img.width;
        let height = img.height;

        // 최대 너비 제한
        if (maxWidth && width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedUrl = URL.createObjectURL(blob);
              resolve({
                ...imgFile,
                compressedSize: blob.size,
                compressedUrl,
              });
            } else {
              resolve(imgFile);
            }
          },
          'image/jpeg',
          quality / 100
        );
      };
      img.src = imgFile.preview;
    });
  };

  const compressAll = async () => {
    setProcessing(true);
    try {
      const compressedImages = await Promise.all(images.map(compressImage));
      setImages(compressedImages);
      setCompressed(true);
    } catch (error) {
      console.error('Compress error:', error);
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = (img: ImageFile, index: number) => {
    if (!img.compressedUrl) return;
    const link = document.createElement('a');
    link.download = `compressed_${index + 1}.jpg`;
    link.href = img.compressedUrl;
    link.click();
  };

  const downloadAll = () => {
    images.forEach((img, index) => {
      if (img.compressedUrl) {
        setTimeout(() => downloadImage(img, index), index * 300);
      }
    });
  };

  const totalOriginal = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressed = images.reduce((sum, img) => sum + (img.compressedSize || 0), 0);
  const savedPercent = totalOriginal > 0 ? Math.round((1 - totalCompressed / totalOriginal) * 100) : 0;

  const reset = () => {
    setImages([]);
    setCompressed(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      {/* 파일 업로드 */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-3 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-ai-primary hover:bg-ai-primary/5 transition-all"
      >
        <div className="text-5xl mb-4">📉</div>
        <p className="text-lg font-semibold text-gray-700 mb-2">
          {selectOrDragText}
        </p>
        <p className="text-sm text-gray-500">{multiSelectText}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* 이미지 목록 */}
      {images.length > 0 && (
        <>
          <div className="space-y-3">
            {images.map((img, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white border-2 border-gray-200 rounded-xl p-3"
              >
                <img
                  src={img.compressedUrl || img.preview}
                  alt={`이미지 ${index + 1}`}
                  className="w-14 h-14 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{img.file.name}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">{formatSize(img.originalSize)}</span>
                    {img.compressedSize && (
                      <>
                        <span className="text-gray-400">→</span>
                        <span className="text-green-600 font-semibold">
                          {formatSize(img.compressedSize)}
                        </span>
                        <span className="text-green-500 text-xs">
                          (-{Math.round((1 - img.compressedSize / img.originalSize) * 100)}%)
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {img.compressedUrl && (
                  <button
                    onClick={() => downloadImage(img, index)}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium hover:bg-green-200"
                  >
                    📥
                  </button>
                )}
                <button
                  onClick={() => removeImage(index)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* 품질 프리셋 */}
          <div>
            <p className="font-semibold text-gray-700 mb-3">✨ {compressionQualityText}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {QUALITY_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setQuality(preset.quality)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    quality === preset.quality
                      ? 'border-ai-primary bg-ai-primary/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-2xl block mb-1">{preset.icon}</span>
                  <span className="font-medium text-gray-700 block text-sm">{preset.name}</span>
                  <span className="text-xs text-gray-500">{preset.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 추가 옵션 */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-4">
            <div>
              <label className="font-medium text-gray-700 mb-2 block">
                🎚️ {qualityControlText}: {quality}%
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700 mb-2 block">
                📐 {maxWidthLimitText}
              </label>
              <div className="flex gap-2">
                {[800, 1200, 1920, 2560].map((w) => (
                  <button
                    key={w}
                    onClick={() => setMaxWidth(maxWidth === w ? '' : w)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      maxWidth === w
                        ? 'bg-ai-primary text-white'
                        : 'bg-white border border-gray-300 hover:border-ai-primary'
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 압축 버튼 */}
          <button
            onClick={compressAll}
            disabled={processing}
            className="w-full py-4 bg-ai-primary hover:bg-ai-primary-dark disabled:bg-gray-400 text-white font-bold text-xl rounded-2xl transition-colors"
          >
            {processing ? compressingText : `📉 ${images.length}${compressImagesText}`}
          </button>

          {/* 압축 결과 */}
          {compressed && totalCompressed > 0 && (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center space-y-4">
              <div className="text-4xl">🎉</div>
              <p className="text-xl font-bold text-green-700">{compressionCompleteText}</p>
              <div className="text-lg text-gray-700">
                {formatSize(totalOriginal)} → {formatSize(totalCompressed)}
                <span className="ml-2 text-green-600 font-bold">
                  ({savedPercent}% {savedText})
                </span>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={downloadAll}
                  className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-colors"
                >
                  📥 {downloadAllText}
                </button>
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
                >
                  🔄 {startNewText}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
