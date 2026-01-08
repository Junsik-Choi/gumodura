'use client';

import Link from 'next/link';
import { CategoryMeta } from '@/lib/types';
import { useTranslatedTexts } from '@/lib/use-translations';

interface CategoryCardProps {
  category: CategoryMeta;
  toolCount: number;
}

/**
 * 카테고리 카드 컴포넌트
 * - 메인 페이지 그리드에 표시
 * - 아이콘, 이름, 설명, 도구 개수
 * - 모바일 최적화
 */
export default function CategoryCard({ category, toolCount }: CategoryCardProps) {
  const [name, description, toolCountLabel] = useTranslatedTexts([
    category.name_ko,
    category.description_ko,
    `${toolCount}개 도구`,
  ]);

  return (
    <Link
      href={`/category/${category.id}/`}
      className={`
        block p-4 sm:p-8
        bg-white rounded-2xl
        border-2 border-gray-100
        hover:border-ai-primary-light hover:shadow-lg hover:-translate-y-1
        active:scale-[0.98]
        transition-all duration-200
      `}
    >
      {/* 아이콘 */}
      <div className={`
        w-12 h-12 sm:w-20 sm:h-20
        flex items-center justify-center
        rounded-xl sm:rounded-2xl mb-3 sm:mb-4
        ${category.color} bg-opacity-10
      `}>
        <span className="text-2xl sm:text-5xl">{category.icon}</span>
      </div>

      {/* 이름 */}
      <h3 className="text-base sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
        {name}
      </h3>

      {/* 설명 */}
      <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-none">
        {description}
      </p>

      {/* 도구 개수 */}
      <span className="inline-flex items-center text-xs sm:text-sm font-medium text-ai-primary">
        {toolCountLabel}
        <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
