/**
 * 푸터 컴포넌트
 * - 저작권
 * - 링크들
 */

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 로고 + 저작권 */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <span className="text-lg font-bold text-gray-700">그 뭐더라</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500 text-sm">
              © {new Date().getFullYear()} 모든 권리 보유
            </span>
          </div>

          {/* 링크들 */}
          <nav className="flex items-center gap-6 text-base">
            <a href="#" className="text-gray-600 hover:text-ai-primary transition-colors">
              이용약관
            </a>
            <a href="#" className="text-gray-600 hover:text-ai-primary transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="text-gray-600 hover:text-ai-primary transition-colors">
              문의하기
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
