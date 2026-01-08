'use client';

import { Tool } from '@/lib/types';
import TranslatedText from '@/components/TranslatedText';

interface ToolPageHeaderProps {
  tool: Tool;
}

/**
 * 도구 페이지 헤더 (클라이언트 컴포넌트)
 * - 번역 지원
 */
export default function ToolPageHeader({ tool }: ToolPageHeaderProps) {
  return (
    <header className="mb-6 sm:mb-8 text-center">
      <span className="text-4xl sm:text-6xl mb-3 sm:mb-4 block">{tool.icon}</span>
      <TranslatedText
        as="h1"
        className="text-xl sm:text-3xl font-bold text-gray-800 mb-2"
        text={tool.name_ko}
      />
      <TranslatedText
        as="p"
        className="text-base sm:text-lg text-gray-600"
        text={tool.description_ko}
      />
      {tool.isPro && (
        <span className="inline-block mt-3 px-3 py-1 bg-yellow-500 text-gray-900 font-semibold text-sm rounded-full">
          <TranslatedText text="PRO 기능" />
        </span>
      )}
    </header>
  );
}
