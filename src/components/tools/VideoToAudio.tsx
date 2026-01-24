'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

interface ConversionState {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  message: string;
  audioUrl?: string;
  fileName?: string;
}

export default function VideoToAudio() {
  const [
    selectVideoLabel,
    supportedFormatsLabel,
    originalLabel,
    reselectLabel,
    processingLabel,
    convertBtnLabel,
    convertedLabel,
    downloadLabel,
    errorLabel,
    noVideoLabel,
    extractingAudioLabel,
    processingVideoLabel,
    completedLabel,
  ] = useTranslatedTexts([
    '영상을 선택하세요',
    'MP4, WebM, Ogg, MKV 지원',
    '원본',
    '다시 선택',
    '변환 중...',
    '오디오 추출하기',
    '변환 완료!',
    '다운로드',
    '오류',
    '영상을 선택해주세요',
    '오디오 추출 중...',
    '영상 처리 중...',
    '완료!',
  ]);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [conversionState, setConversionState] = useState<ConversionState>({
    status: 'idle',
    progress: 0,
    message: '',
  });
  const [ffmpegReady, setFfmpegReady] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // FFmpeg 초기화
  useEffect(() => {
    const initFFmpeg = async () => {
      try {
        const { FFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
        const ffmpeg = new FFmpeg();

        if (!ffmpeg.isLoaded()) {
          await ffmpeg.load();
        }
        setFfmpegReady(true);
      } catch (error) {
        console.log('FFmpeg 로드 실패. 대체 방법 사용 중...');
        // FFmpeg 로드 실패 시 사용자에게 알림
      }
    };

    initFFmpeg();
  }, []);

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 비디오 파일 형식 확인
    if (!file.type.startsWith('video/')) {
      setConversionState({
        status: 'error',
        progress: 0,
        message: '비디오 파일을 선택해주세요. (MP4, WebM, MKV 등)',
      });
      return;
    }

    setVideoFile(file);
    const preview = URL.createObjectURL(file);
    setVideoPreview(preview);
    setConversionState({
      status: 'idle',
      progress: 0,
      message: '',
    });
  };

  const extractAudio = async () => {
    if (!videoFile) {
      setConversionState({
        status: 'error',
        progress: 0,
        message: noVideoLabel,
      });
      return;
    }

    if (!ffmpegReady) {
      setConversionState({
        status: 'error',
        progress: 0,
        message: 'FFmpeg을 준비 중입니다. 잠시 후 다시 시도해주세요.',
      });
      return;
    }

    try {
      setConversionState({
        status: 'processing',
        progress: 10,
        message: processingVideoLabel,
      });

      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const ffmpeg = new FFmpeg();

      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

      const arrayBuffer = await videoFile.arrayBuffer();

      setConversionState({
        status: 'processing',
        progress: 30,
        message: extractingAudioLabel,
      });

      // 비디오 파일 쓰기
      ffmpeg.writeFile('input', new Uint8Array(arrayBuffer));

      // 오디오 추출 (MP3)
      await ffmpeg.exec(['-i', 'input', '-q:a', '9', '-n', 'output.mp3']);

      setConversionState({
        status: 'processing',
        progress: 80,
        message: completedLabel,
      });

      // 출력 파일 읽기
      const data = ffmpeg.readFile('output.mp3');
      const audioBlob = new Blob([data.buffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      // 파일명 생성
      const originalName = videoFile.name.substring(0, videoFile.name.lastIndexOf('.'));
      const audioFileName = `${originalName}_audio.mp3`;

      setConversionState({
        status: 'completed',
        progress: 100,
        message: convertedLabel,
        audioUrl,
        fileName: audioFileName,
      });

      // 정리
      ffmpeg.deleteFile('input');
      ffmpeg.deleteFile('output.mp3');
    } catch (error) {
      console.error('변환 오류:', error);
      setConversionState({
        status: 'error',
        progress: 0,
        message: `오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      });
    }
  };

  const downloadAudio = () => {
    if (!conversionState.audioUrl || !conversionState.fileName) return;

    const link = document.createElement('a');
    link.href = conversionState.audioUrl;
    link.download = conversionState.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setConversionState({
      status: 'idle',
      progress: 0,
      message: '',
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="space-y-6">
          {/* 파일 선택 영역 */}
          {!videoFile ? (
            <div
              className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-4xl mb-4">🎬</div>
              <p className="text-lg font-semibold text-gray-700 mb-2">
                {selectVideoLabel}
              </p>
              <p className="text-sm text-gray-500 mb-4">{supportedFormatsLabel}</p>
              <div className="text-xs text-gray-400">
                클릭하거나 파일을 드래그하세요
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* 비디오 미리보기 */}
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  src={videoPreview}
                  controls
                  className="w-full max-h-64 bg-black"
                />
              </div>

              {/* 파일 정보 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">파일명:</span>
                    <span className="font-semibold text-gray-900">
                      {videoFile.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">파일 크기:</span>
                    <span className="font-semibold text-gray-900">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">파일 형식:</span>
                    <span className="font-semibold text-gray-900">
                      {videoFile.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* 진행 상황 표시 */}
              {conversionState.status === 'processing' && (
                <div className="space-y-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${conversionState.progress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    {conversionState.message}
                  </p>
                </div>
              )}

              {/* 완료 상태 */}
              {conversionState.status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">✅</span>
                    <span className="font-semibold text-green-800">
                      {convertedLabel}
                    </span>
                  </div>
                  {conversionState.fileName && (
                    <p className="text-sm text-green-700 mb-4">
                      {conversionState.fileName}
                    </p>
                  )}
                  <button
                    onClick={downloadAudio}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    📥 {downloadLabel}
                  </button>
                </div>
              )}

              {/* 오류 상태 */}
              {conversionState.status === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">❌</span>
                    <span className="font-semibold text-red-800">
                      {errorLabel}
                    </span>
                  </div>
                  <p className="text-sm text-red-700 mb-4">
                    {conversionState.message}
                  </p>
                  <button
                    onClick={handleReset}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    {reselectLabel}
                  </button>
                </div>
              )}

              {/* 버튼 영역 */}
              {conversionState.status === 'idle' && (
                <div className="flex gap-3">
                  <button
                    onClick={extractAudio}
                    disabled={!ffmpegReady}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    🎵 {convertBtnLabel}
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition"
                  >
                    {reselectLabel}
                  </button>
                </div>
              )}

              {/* 재시작 버튼 */}
              {conversionState.status === 'completed' && (
                <button
                  onClick={handleReset}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
                >
                  {reselectLabel}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 안내 사항 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">💡 사용 팁</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• 모든 비디오 파일 형식을 지원합니다 (MP4, WebM, MKV 등)</li>
          <li>• 추출된 오디오는 MP3 형식으로 저장됩니다</li>
          <li>• 처리 시간은 영상 길이와 파일 크기에 따라 달라질 수 있습니다</li>
          <li>• 모든 처리는 브라우저에서 진행되므로 개인정보가 보호됩니다</li>
          <li>• 대용량 파일은 처리 시간이 오래 걸릴 수 있습니다</li>
        </ul>
      </div>
    </div>
  );
}
