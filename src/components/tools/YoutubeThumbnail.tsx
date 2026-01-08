'use client';

import { useState, useMemo } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

interface ThumbnailResult {
  videoId: string;
  title?: string;
  thumbnails: {
    quality: string;
    url: string;
    resolution: string;
  }[];
}

function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export default function YoutubeThumbnail() {
  const [
    labelYoutubeUrl,
    placeholderUrl,
    helperText,
    errorInvalidUrl,
    errorNoMaxRes,
    errorDownload,
    thumbnailPreview,
    downloadByResolution,
    bestQuality,
    downloading,
    downloadBtn,
    downloadAll,
    emptyStateText,
    supportedFormats,
    notesTitle,
    note1,
    note2,
    note3,
  ] = useTranslatedTexts([
    '🎬 YouTube URL 입력',
    'https://youtube.com/watch?v=... 또는 youtu.be/...',
    'YouTube 동영상 URL을 붙여넣으면 썸네일을 추출할 수 있어요',
    '올바른 YouTube URL을 입력해주세요',
    '최고 해상도 썸네일이 없어요. 다른 해상도를 선택해주세요.',
    '다운로드 중 오류가 발생했어요',
    '🖼️ 썸네일 미리보기',
    '📥 해상도별 다운로드',
    '최고화질',
    '⏳ 다운로드 중...',
    '💾 다운로드',
    '📦 모든 해상도 다운로드',
    'YouTube URL을 입력하면\n썸네일 이미지를 추출할 수 있어요',
    '💡 지원하는 URL 형식',
    '📌 참고사항',
    'Max Resolution(1280×720)은 모든 영상에서 제공되지 않을 수 있어요',
    '고화질 썸네일이 없는 경우 자동으로 차선책이 표시돼요',
    '썸네일 저작권은 원본 영상 제작자에게 있어요',
  ]);

  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [downloadingQuality, setDownloadingQuality] = useState<string | null>(null);

  const result = useMemo<ThumbnailResult | null>(() => {
    if (!url.trim()) return null;

    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      setError(errorInvalidUrl);
      return null;
    }

    setError(null);
    return {
      videoId,
      thumbnails: [
        {
          quality: 'Max Resolution',
          url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          resolution: '1280×720',
        },
        {
          quality: 'Standard',
          url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
          resolution: '640×480',
        },
        {
          quality: 'High',
          url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          resolution: '480×360',
        },
        {
          quality: 'Medium',
          url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          resolution: '320×180',
        },
        {
          quality: 'Default',
          url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
          resolution: '120×90',
        },
      ],
    };
  }, [url]);

  const downloadThumbnail = async (thumbnailUrl: string, quality: string) => {
    setDownloadingQuality(quality);
    
    try {
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      
      // maxresdefault가 없으면 sddefault로 폴백
      if (blob.size < 1000 && quality === 'Max Resolution') {
        setError(errorNoMaxRes);
        setDownloadingQuality(null);
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `youtube_thumbnail_${result?.videoId}_${quality.toLowerCase().replace(' ', '_')}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      setError(errorDownload);
    } finally {
      setDownloadingQuality(null);
    }
  };

  const openInNewTab = (thumbnailUrl: string) => {
    window.open(thumbnailUrl, '_blank');
  };

  const clearInput = () => {
    setUrl('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* URL 입력 */}
      <div className="space-y-3">
        <label className="block font-semibold text-gray-700">
          {labelYoutubeUrl}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={placeholderUrl}
            className="flex-1 p-4 border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
          />
          {url && (
            <button
              onClick={clearInput}
              className="px-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
            >
              ✕
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500">
          {helperText}
        </p>
      </div>

      {/* 에러 */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
          ⚠️ {error}
        </div>
      )}

      {/* 결과 */}
      {result && (
        <div className="space-y-6">
          {/* 미리보기 */}
          <div className="bg-gray-50 rounded-2xl p-5">
            <h3 className="font-bold text-gray-800 mb-4">{thumbnailPreview}</h3>
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              <img
                src={result.thumbnails[0].url}
                alt="YouTube Thumbnail"
                className="w-full"
                onError={(e) => {
                  // maxresdefault가 없으면 hqdefault로 폴백
                  const target = e.target as HTMLImageElement;
                  if (target.src.includes('maxresdefault')) {
                    target.src = result.thumbnails[2].url;
                  }
                }}
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-3">
              Video ID: <span className="font-mono">{result.videoId}</span>
            </p>
          </div>

          {/* 다운로드 옵션 */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-800">{downloadByResolution}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.thumbnails.map((thumb) => (
                <div
                  key={thumb.quality}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-ai-primary transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <p className="font-medium text-gray-800">{thumb.quality}</p>
                      <p className="text-sm text-gray-500">{thumb.resolution}</p>
                    </div>
                    {thumb.quality === 'Max Resolution' && (
                      <span className="px-2 py-1 bg-ai-primary/10 text-ai-primary text-xs rounded-full">
                        {bestQuality}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadThumbnail(thumb.url, thumb.quality)}
                      disabled={downloadingQuality === thumb.quality}
                      className="flex-1 py-2 bg-ai-primary text-white rounded-lg hover:bg-ai-primary-dark transition-colors disabled:opacity-50"
                    >
                      {downloadingQuality === thumb.quality ? downloading : downloadBtn}
                    </button>
                    <button
                      onClick={() => openInNewTab(thumb.url)}
                      className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      title="새 탭에서 열기"
                    >
                      🔗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 모든 해상도 다운로드 */}
          <button
            onClick={() => {
              result.thumbnails.forEach((thumb, index) => {
                setTimeout(() => downloadThumbnail(thumb.url, thumb.quality), index * 500);
              });
            }}
            className="w-full py-4 bg-gradient-to-r from-ai-primary to-purple-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            {downloadAll}
          </button>
        </div>
      )}

      {/* 빈 상태 */}
      {!result && !error && (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <p className="text-5xl mb-4">🎬</p>
          <p className="text-gray-600 mb-2">
            {emptyStateText.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
          </p>
        </div>
      )}

      {/* 지원 URL 형식 */}
      <div className="bg-blue-50 rounded-xl p-4">
        <h3 className="font-bold text-blue-800 mb-2">{supportedFormats}</h3>
        <ul className="text-sm text-blue-700 space-y-1 font-mono">
          <li>• youtube.com/watch?v=VIDEO_ID</li>
          <li>• youtu.be/VIDEO_ID</li>
          <li>• youtube.com/shorts/VIDEO_ID</li>
          <li>• youtube.com/embed/VIDEO_ID</li>
        </ul>
      </div>

      {/* 참고사항 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h3 className="font-bold text-gray-700 mb-2">{notesTitle}</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• {note1}</li>
          <li>• {note2}</li>
          <li>• {note3}</li>
        </ul>
      </div>
    </div>
  );
}
