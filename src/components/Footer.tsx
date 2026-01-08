'use client';

import Link from 'next/link';
import { useTranslatedTexts } from '@/lib/use-translations';

/**
 * 푸터 컴포넌트
 * - 저작권
 * - 링크들
 * - 언어 선택
 */
export default function Footer() {
  const [
    headerTitle,
    copyrightLabel,
    termsLabel,
    privacyLabel,
    contactLabel,
  ] = useTranslatedTexts([
    '그 뭐더라',
    '모든 권리 보유',
    '이용약관',
    '개인정보처리방침',
    '문의하기',
  ]);

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* 로고 + 저작권 */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <div>
              <span className="text-lg font-bold text-gray-700 block">{headerTitle}</span>
              <span className="text-gray-500 text-sm">
                © {new Date().getFullYear()} {copyrightLabel}
              </span>
            </div>
          </div>
        </div>

        {/* 링크들 */}
        <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-base">
          <Link 
            href="/terms" 
            className="text-gray-600 hover:text-ai-primary transition-colors font-medium"
          >
            {termsLabel}
          </Link>
          <span className="hidden sm:block text-gray-300">|</span>
          <Link 
            href="/privacy" 
            className="text-gray-600 hover:text-ai-primary transition-colors font-medium"
          >
            {privacyLabel}
          </Link>
          <span className="hidden sm:block text-gray-300">|</span>
          <Link 
            href="/contact" 
            className="text-gray-600 hover:text-ai-primary transition-colors font-medium"
          >
            {contactLabel}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
