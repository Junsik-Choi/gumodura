'use client';

import Link from 'next/link';
import TranslatedText from '@/components/TranslatedText';

/**
 * 도구 페이지 푸터 - 뒤로가기 버튼 (클라이언트 컴포넌트)
 * - 번역 지원
 */
export default function ToolPageFooter() {
  return (
    <div className="mt-6 sm:mt-8 text-center">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-ai-primary hover:text-ai-primary-dark font-medium text-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <TranslatedText text="홈으로 돌아가기" />
      </Link>
    </div>
  );
}
