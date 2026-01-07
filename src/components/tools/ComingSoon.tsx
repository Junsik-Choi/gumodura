/**
 * 아직 구현되지 않은 도구용 Coming Soon 컴포넌트
 */
export default function ComingSoon() {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-6">🚧</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        준비 중인 기능이에요
      </h2>
      <p className="text-lg text-gray-600 mb-6">
        이 기능은 곧 사용할 수 있어요.
        <br />
        조금만 기다려 주세요!
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-ai-primary hover:bg-ai-primary-dark text-white font-semibold rounded-xl transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        다른 기능 둘러보기
      </a>
    </div>
  );
}
