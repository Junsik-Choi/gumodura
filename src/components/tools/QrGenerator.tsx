'use client';

import { useState, useEffect, useRef } from 'react';
import ProgressIndicator from '@/components/ProgressIndicator';

// Canvas roundRect 타입 확장
declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, w: number, h: number, r: number | number[]): void;
  }
}

// QR 스타일 프리셋
const QR_PRESETS = [
  { id: 'default', name: '기본', fg: '#000000', bg: '#FFFFFF' },
  { id: 'purple', name: '퍼플', fg: '#7C3AED', bg: '#F5F3FF' },
  { id: 'blue', name: '블루', fg: '#2563EB', bg: '#EFF6FF' },
  { id: 'green', name: '그린', fg: '#059669', bg: '#ECFDF5' },
  { id: 'red', name: '레드', fg: '#DC2626', bg: '#FEF2F2' },
  { id: 'orange', name: '오렌지', fg: '#EA580C', bg: '#FFF7ED' },
  { id: 'pink', name: '핑크', fg: '#DB2777', bg: '#FDF2F8' },
  { id: 'dark', name: '다크', fg: '#FFFFFF', bg: '#1F2937' },
];

// QR 패턴 스타일
const QR_PATTERNS = [
  { id: 'square', name: '정사각형', type: 'square' },
  { id: 'rounded', name: '둥근모서리', type: 'rounded' },
  { id: 'dots', name: '점 패턴', type: 'dots' },
];

// 이모지 프리셋
const EMOJI_PRESETS = [
  '😀', '❤️', '⭐', '🎉', '🚀', '🌟', '🎁', '💡',
  '📱', '💻', '🌍', '✅', '🔥', '💰', '🎯', '🏆',
];

// 예시 QR 코드 데이터
const EXAMPLE_QR_CODES = [
  { name: '웹사이트', value: 'https://www.google.com' },
  { name: '전화번호', value: 'tel:010-1234-5678' },
  { name: '문자', value: 'sms:010-1234-5678' },
  { name: '이메일', value: 'mailto:example@email.com' },
  { name: '와이파이', value: 'WIFI:T:WPA;S:홈네트워크;P:password123;;' },
];

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

/**
 * 고급 QR 코드 생성기
 * 이모지, 이미지, 다양한 스타일 지원
 */
export default function QrGenerator() {
  // Canvas roundRect 폴리필
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as any;
    if (ctx && !ctx.roundRect) {
      ctx.roundRect = function(x: number, y: number, w: number, h: number, r: number | number[]) {
        let radius = r as number;
        if (w < 2 * radius) radius = w / 2;
        if (h < 2 * radius) radius = h / 2;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.arcTo(x + w, y, x + w, y + h, radius);
        this.arcTo(x + w, y + h, x, y + h, radius);
        this.arcTo(x, y + h, x, y, radius);
        this.arcTo(x, y, x + w, y, radius);
        this.closePath();
      };
    }
  }, []);
  const [text, setText] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(QR_PRESETS[0]);
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    { id: 'validate', label: '입력 확인', status: 'pending' },
    { id: 'generate', label: 'QR 코드 생성', status: 'pending' },
    { id: 'decorate', label: '꾸미기', status: 'pending' },
    { id: 'compose', label: '합성', status: 'pending' },
  ]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // 단계 상태 업데이트
  const updateStep = (stepIndex: number, status: Step['status']) => {
    setSteps(prev => prev.map((step, i) => ({
      ...step,
      status: i === stepIndex ? status : (i < stepIndex ? 'completed' : step.status),
    })));
    setCurrentStep(stepIndex);
  };

  // 이미지 로드 핸들러
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 캔버스에 이미지 그리기 (중앙 로고)
  const drawLogoOnQR = async (
    baseCanvas: HTMLCanvasElement,
    logoDataUrl: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = baseCanvas.width;
        canvas.height = baseCanvas.height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // 기본 QR 코드 그리기
        ctx.drawImage(baseCanvas, 0, 0);
        
        // 로고 크기 (QR 코드의 약 20%)
        const logoSize = baseCanvas.width * 0.2;
        const x = (baseCanvas.width - logoSize) / 2;
        const y = (baseCanvas.height - logoSize) / 2;
        
        // 배경 (흰색 원 또는 사각형)
        ctx.fillStyle = selectedPreset.bg;
        ctx.beginPath();
        ctx.roundRect(x - 5, y - 5, logoSize + 10, logoSize + 10, 8);
        ctx.fill();
        
        ctx.strokeStyle = selectedPreset.fg;
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 로고 그리기
        ctx.drawImage(img, x, y, logoSize, logoSize);
        
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = logoDataUrl;
    });
  };

  // 캔버스에 이모지 그리기 (중앙)
  const drawEmojiOnQR = async (
    baseCanvas: HTMLCanvasElement,
    emoji: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = baseCanvas.width;
      canvas.height = baseCanvas.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // 기본 QR 코드 그리기
      ctx.drawImage(baseCanvas, 0, 0);
      
      // 배경
      const bgSize = baseCanvas.width * 0.25;
      const x = (baseCanvas.width - bgSize) / 2;
      const y = (baseCanvas.height - bgSize) / 2;
      
      ctx.fillStyle = selectedPreset.bg;
      ctx.beginPath();
      ctx.roundRect(x - 5, y - 5, bgSize + 10, bgSize + 10, 12);
      ctx.fill();
      
      ctx.strokeStyle = selectedPreset.fg;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 이모지 그리기
      ctx.font = `${Math.floor(bgSize * 0.7)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, baseCanvas.width / 2, baseCanvas.height / 2);
      
      resolve(canvas.toDataURL('image/png'));
    });
  };

  // QR 코드 생성
  const generateQR = async () => {
    if (!text.trim()) return;
    
    setProcessing(true);
    setProgress(0);
    setQrDataUrl(null);

    try {
      // Step 1: 입력 확인
      updateStep(0, 'in-progress');
      setMessage('입력 내용 확인 중...');
      await new Promise(r => setTimeout(r, 300));
      setProgress(20);
      updateStep(0, 'completed');

      // Step 2: QR 코드 생성
      updateStep(1, 'in-progress');
      setMessage('QR 코드 생성 중...');
      
      // qrcode 라이브러리 동적 로드
      const QRCode = await import('qrcode');
      setProgress(40);

      // Canvas에 QR 코드 그리기
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, text.trim(), {
          width: 300,
          margin: 2,
          color: {
            dark: selectedPreset.fg,
            light: selectedPreset.bg,
          },
          errorCorrectionLevel: 'H',
        });
      }
      
      setProgress(60);
      updateStep(1, 'completed');

      // Step 3: 데코레이션 (이모지 또는 로고)
      updateStep(2, 'in-progress');
      setMessage('꾸미기 중...');
      
      let finalDataUrl = canvasRef.current?.toDataURL('image/png') || '';
      
      if (selectedEmoji && canvasRef.current) {
        finalDataUrl = await drawEmojiOnQR(canvasRef.current, selectedEmoji);
      } else if (logoImage && canvasRef.current) {
        finalDataUrl = await drawLogoOnQR(canvasRef.current, logoImage);
      }
      
      setProgress(80);
      updateStep(2, 'completed');

      // Step 4: 합성 완료
      updateStep(3, 'in-progress');
      setMessage('합성 완료!');
      await new Promise(r => setTimeout(r, 300));
      setProgress(100);
      
      // Data URL 저장
      setQrDataUrl(finalDataUrl);
      
      updateStep(3, 'completed');
      setMessage('완료!');

    } catch (error) {
      console.error('QR 생성 오류:', error);
      setMessage('오류가 발생했습니다. 다시 시도해주세요.');
      setSteps(prev => prev.map((step, i) => ({
        ...step,
        status: i === currentStep ? 'error' : step.status,
      })));
    } finally {
      setTimeout(() => {
        setProcessing(false);
        setSteps([
          { id: 'validate', label: '입력 확인', status: 'pending' },
          { id: 'generate', label: 'QR 코드 생성', status: 'pending' },
          { id: 'decorate', label: '꾸미기', status: 'pending' },
          { id: 'compose', label: '합성', status: 'pending' },
        ]);
      }, 1000);
    }
  };

  // 다운로드
  const downloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `그뭐더라_QR_${new Date().toISOString().slice(0, 10)}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  // 로고 제거
  const removeLogo = () => {
    setLogoImage(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  // 예시 선택
  const selectExample = (value: string) => {
    setText(value);
    setShowExamples(false);
  };

  // 프리셋 변경 시 자동 재생성
  useEffect(() => {
    if (qrDataUrl && text.trim()) {
      generateQR();
    }
  }, [selectedPreset, selectedEmoji, logoImage]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-8">
      {/* 입력 영역 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block flex-1">
            <span className="text-lg font-semibold text-gray-700 mb-2 block">
              QR 코드에 담을 내용
            </span>
          </label>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
          >
            📋 예시 보기
          </button>
        </div>
        
        {/* 예시 드롭다운 */}
        {showExamples && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 mb-4">
            {EXAMPLE_QR_CODES.map((example) => (
              <button
                key={example.name}
                onClick={() => selectExample(example.value)}
                className="w-full text-left p-3 bg-white border border-blue-100 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <span className="font-semibold text-gray-700">{example.name}</span>
                <p className="text-sm text-gray-500 mt-1 break-all">{example.value}</p>
              </button>
            ))}
          </div>
        )}
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="URL, 텍스트, 전화번호, 이메일 등을 입력하세요"
          className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:ring-2 focus:ring-ai-primary/20 outline-none resize-none"
          rows={3}
        />
        <p className="text-sm text-gray-500">
          💡 예: https://example.com / 010-1234-5678 / example@email.com
        </p>
      </div>

      {/* 색상 스타일 프리셋 */}
      <div>
        <span className="text-lg font-semibold text-gray-700 mb-4 block">
          🎨 색상 스타일
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {QR_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset)}
              className={`
                flex flex-col items-center p-3 rounded-xl border-2 transition-all
                ${selectedPreset.id === preset.id 
                  ? 'border-ai-primary bg-ai-primary/5 scale-105' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              title={preset.name}
            >
              <div 
                className="w-10 h-10 rounded-lg mb-2"
                style={{ 
                  backgroundColor: preset.bg, 
                  border: `3px solid ${preset.fg}` 
                }}
              />
              <span className="text-xs font-medium text-gray-600">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 이모지 데코레이션*/}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-700">
            😀 이모지 추가 (선택사항)
          </span>
          {selectedEmoji && (
            <button
              onClick={() => setSelectedEmoji(null)}
              className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              제거
            </button>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`
              w-full p-4 border-2 rounded-xl font-semibold text-lg transition-all
              ${selectedEmoji
                ? 'border-ai-primary bg-ai-primary/5'
                : 'border-gray-200 hover:border-gray-300 bg-white'
              }
            `}
          >
            {selectedEmoji ? `선택됨: ${selectedEmoji}` : '이모지 선택하기'}
          </button>
          
          {showEmojiPicker && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl p-4 grid grid-cols-8 gap-2 shadow-lg z-10">
              {EMOJI_PRESETS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setSelectedEmoji(emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-3xl hover:scale-125 transition-transform p-2 rounded-lg hover:bg-gray-100"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 로고 이미지 업로드 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-semibold text-gray-700">
            🖼️ 로고 이미지 추가 (선택사항)
          </span>
          {logoImage && (
            <button
              onClick={removeLogo}
              className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              제거
            </button>
          )}
        </div>
        
        <label className="block">
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-ai-primary file:text-white
              hover:file:bg-ai-primary-dark
              cursor-pointer"
          />
          <p className="text-sm text-gray-500 mt-2">
            💡 PNG, JPG 형식의 로고를 업로드하면 QR 코드 중앙에 표시됩니다
          </p>
        </label>
        
        {logoImage && (
          <div className="mt-4 flex justify-center">
            <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-300 p-2 bg-gray-50">
              <img src={logoImage} alt="로고 미리보기" className="w-full h-full object-contain" />
            </div>
          </div>
        )}
      </div>

      {/* 생성 버튼 */}
      <button
        onClick={generateQR}
        disabled={!text.trim() || processing}
        className="w-full py-4 bg-ai-primary hover:bg-ai-primary-dark disabled:bg-gray-400 text-white font-bold text-xl rounded-2xl transition-colors"
      >
        {processing ? '생성 중...' : '✨ QR 코드 만들기'}
      </button>

      {/* 진행 상태 */}
      {processing && (
        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
          progress={progress}
          message={message}
          showDebug={process.env.NODE_ENV === 'development'}
        />
      )}

      {/* 캔버스 (숨김) */}
      <canvas ref={canvasRef} className="hidden" />

      {/* 결과 */}
      {qrDataUrl && !processing && (
        <div className="text-center space-y-6 animate-fade-in">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              ✅ QR 코드 생성 완료!
            </h3>
            <div className="inline-block p-6 bg-white rounded-2xl shadow-lg border-4 border-ai-primary/20">
              <img 
                src={qrDataUrl} 
                alt="생성된 QR 코드" 
                className="w-72 h-72 sm:w-80 sm:h-80"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={downloadQR}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              다운로드
            </button>
            
            <button
              onClick={() => {
                setQrDataUrl(null);
                setText('');
                setSelectedEmoji(null);
                setLogoImage(null);
              }}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-lg rounded-xl transition-colors"
            >
              새로 만들기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
