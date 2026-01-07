/**
 * 진행 상태 표시 컴포넌트
 * - 단계별 진행 표시
 * - 퍼센트 게이지
 * - 디버깅 로그 (개발 모드)
 */

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  progress: number; // 0-100
  message?: string;
  showDebug?: boolean;
}

export default function ProgressIndicator({
  steps,
  currentStep,
  progress,
  message,
  showDebug = false,
}: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* 퍼센트 표시 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-lg font-semibold text-gray-700">
          진행 중...
        </span>
        <span className="text-2xl font-bold text-ai-primary">
          {Math.round(progress)}%
        </span>
      </div>

      {/* 진행 바 */}
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-ai-primary to-ai-primary-light transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 현재 작업 메시지 */}
      {message && (
        <p className="text-center text-base text-gray-600 mb-4">
          {message}
        </p>
      )}

      {/* 단계 표시 */}
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              flex items-center gap-3 p-3 rounded-lg
              ${step.status === 'in-progress' ? 'bg-ai-primary/10' : ''}
              ${step.status === 'completed' ? 'bg-green-50' : ''}
              ${step.status === 'error' ? 'bg-red-50' : ''}
            `}
          >
            {/* 상태 아이콘 */}
            <div className="w-8 h-8 flex items-center justify-center">
              {step.status === 'pending' && (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
              )}
              {step.status === 'in-progress' && (
                <div className="w-6 h-6 rounded-full border-2 border-ai-primary border-t-transparent animate-spin" />
              )}
              {step.status === 'completed' && (
                <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {step.status === 'error' && (
                <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </div>

            {/* 단계 번호 + 라벨 */}
            <div className="flex-1">
              <span className={`
                text-base font-medium
                ${step.status === 'completed' ? 'text-green-700' : ''}
                ${step.status === 'in-progress' ? 'text-ai-primary' : ''}
                ${step.status === 'error' ? 'text-red-700' : ''}
                ${step.status === 'pending' ? 'text-gray-400' : ''}
              `}>
                {index + 1}. {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 디버그 로그 (개발 모드) */}
      {showDebug && (
        <div className="mt-4 p-3 bg-gray-900 rounded-lg text-xs font-mono text-gray-300">
          <div>Current Step: {currentStep}</div>
          <div>Progress: {progress}%</div>
          <div>Active: {steps[currentStep]?.id || 'none'}</div>
        </div>
      )}
    </div>
  );
}
