'use client';

import Link from 'next/link';
import { Tool } from '@/lib/types';
import { getCategoryMeta } from '@/lib/categories';
import { useTranslatedTexts } from '@/lib/use-translations';

interface ToolCardProps {
  tool: Tool;
  showCategory?: boolean;
  isTop?: boolean;
}

/**
 * 도구 카드 컴포넌트
 * - 아이콘, 이름, 설명
 * - 새로운/인기 뱃지
 * - 클릭 시 해당 도구 페이지로 이동
 * - 모바일 최적화
 */
export default function ToolCard({ tool, showCategory = false, isTop = false }: ToolCardProps) {
  const category = getCategoryMeta(tool.category);
  const [
    name,
    description,
    topBadge,
    newBadge,
    popularBadge,
    proBadge,
    categoryName,
    ctaLabel,
  ] = useTranslatedTexts([
    tool.name_ko,
    tool.description_ko,
    '최적 추천',
    'NEW',
    '인기',
    'PRO',
    category?.name_ko || '',
    '바로 사용',
  ]);

  return (
    <Link
      href={`${tool.route}/`}
      className={`
        block p-4 sm:p-6
        bg-white rounded-2xl
        border-2 transition-all duration-200
        hover:shadow-lg hover:-translate-y-1
        active:scale-[0.98]
        ${isTop 
          ? 'border-ai-primary shadow-lg shadow-ai-primary/10' 
          : 'border-gray-100 hover:border-ai-primary-light'
        }
      `}
    >
      {/* 상단: 아이콘 + 뱃지 */}
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <span className="text-3xl sm:text-5xl">{tool.icon}</span>
        
        <div className="flex flex-col items-end gap-1">
          {isTop && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-ai-primary text-white rounded-full">
              {topBadge}
            </span>
          )}
          {tool.isNew && !isTop && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-green-500 text-white rounded-full">
              {newBadge}
            </span>
          )}
          {tool.isPopular && !isTop && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded-full">
              {popularBadge}
            </span>
          )}
          {tool.isPro && (
            <span className="px-2 py-0.5 text-xs font-semibold bg-yellow-500 text-gray-900 rounded-full">
              {proBadge}
            </span>
          )}
        </div>
      </div>

      {/* 이름 */}
      <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
        {name}
      </h3>

      {/* 설명 */}
      <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 line-clamp-2">
        {description}
      </p>

      {/* 카테고리 표시 (옵션) */}
      {showCategory && category && (
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-0">
          <span>{category.icon}</span>
          <span>{categoryName}</span>
        </div>
      )}

      {/* 바로 사용 버튼 */}
      <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100">
        <span className={`
          inline-flex items-center gap-1 sm:gap-2
          text-sm sm:text-base font-semibold
          ${isTop ? 'text-ai-primary' : 'text-gray-600'}
        `}>
          {ctaLabel}
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
