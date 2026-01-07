'use client';

import { useState, useEffect, useRef } from 'react';
import ProgressIndicator from '@/components/ProgressIndicator';

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

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

/**
 * 예쁜 QR 코드 생성기
 * 다양한 스타일 프리셋으로 QR 코드 생성
 */
export default function QrGenerator() {
  const [text, setText] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(QR_PRESETS[0]);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('');
  const [steps, setSteps] = useState<Step[]>([
    { id: 'validate', label: '입력 확인', status: 'pending' },
    { id: 'generate', label: 'QR 코드 생성', status: 'pending' },
    { id: 'style', label: '스타일 적용', status: 'pending' },
  ]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 단계 상태 업데이트
  const updateStep = (stepIndex: number, status: Step['status']) => {
    setSteps(prev => prev.map((step, i) => ({
      ...step,
      status: i === stepIndex ? status : (i < stepIndex ? 'completed' : step.status),
    })));
    setCurrentStep(stepIndex);
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
      setProgress(50);

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
      
      setProgress(80);
      updateStep(1, 'completed');

      // Step 3: 스타일 적용 완료
      updateStep(2, 'in-progress');
      setMessage('스타일 적용 완료!');
      await new Promise(r => setTimeout(r, 300));
      setProgress(100);
      
      // Data URL 저장
      if (canvasRef.current) {
        setQrDataUrl(canvasRef.current.toDataURL('image/png'));
      }
      
      updateStep(2, 'completed');
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
          { id: 'style', label: '스타일 적용', status: 'pending' },
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

  // 프리셋 변경 시 자동 재생성
  useEffect(() => {
    if (qrDataUrl && text.trim()) {
      generateQR();
    }
  }, [selectedPreset]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-8">
      {/* 입력 영역 */}
      <div className="space-y-4">
        <label className="block">
          <span className="text-lg font-semibold text-gray-700 mb-2 block">
            QR 코드에 담을 내용
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="URL, 텍스트, 전화번호 등을 입력하세요"
            className="w-full p-4 text-lg border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:ring-2 focus:ring-ai-primary/20 outline-none resize-none"
            rows={3}
          />
        </label>
        <p className="text-sm text-gray-500">
          예: https://example.com, 010-1234-5678, 안녕하세요!
        </p>
      </div>

      {/* 스타일 프리셋 선택 */}
      <div>
        <span className="text-lg font-semibold text-gray-700 mb-4 block">
          스타일 선택
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {QR_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset)}
              className={`
                flex flex-col items-center p-3 rounded-xl border-2 transition-all
                ${selectedPreset.id === preset.id 
                  ? 'border-ai-primary bg-ai-primary/5' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
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

      {/* 생성 버튼 */}
      <button
        onClick={generateQR}
        disabled={!text.trim() || processing}
        className="w-full py-4 bg-ai-primary hover:bg-ai-primary-dark disabled:bg-gray-400 text-white font-bold text-xl rounded-2xl transition-colors"
      >
        {processing ? '생성 중...' : 'QR 코드 만들기'}
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
          <div className="inline-block p-4 bg-white rounded-2xl shadow-lg">
            <img 
              src={qrDataUrl} 
              alt="생성된 QR 코드" 
              className="w-64 h-64 sm:w-72 sm:h-72"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={downloadQR}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              이미지 다운로드
            </button>
            
            <button
              onClick={() => {
                setQrDataUrl(null);
                setText('');
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
