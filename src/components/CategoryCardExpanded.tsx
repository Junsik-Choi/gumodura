'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CategoryMeta, Tool } from '@/lib/types';
import { useLanguage } from '@/components/LanguageProvider';
import { useTranslatedTexts } from '@/lib/use-translations';

interface CategoryCardExpandedProps {
  category: CategoryMeta;
  tools: Tool[];
}

/**
 * 확장 가능한 카테고리 카드 컴포넌트
 * - 상단: 카테고리 아이콘 + 이름 + 도구 개수
 * - 인기순 상위 3개 도구 미리보기 (1등 강조)
 * - 더보기 버튼 클릭 시 나머지 도구 애니메이션으로 펼침
 * - 그리드 구조 유지를 위해 내부에서만 확장
 */
export default function CategoryCardExpanded({ category, tools }: CategoryCardExpandedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { language } = useLanguage();
  
  // 번역 텍스트
  const [
    t_tools,
    t_popular,
    t_collapse,
    t_showMore,
  ] = useTranslatedTexts([
    '개 도구',
    '인기',
    '접기',
    '개 더보기',
  ]);

  // 인기순 정렬 (isPopular > isNew > 일반)
  const sortedTools = [...tools].sort((a, b) => {
    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;
    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;
    return 0;
  });

  const previewTools = sortedTools.slice(0, 3);
  const remainingTools = sortedTools.slice(3);
  const hasMoreTools = remainingTools.length > 0;

  // 언어에 따른 이름 선택
  const getCategoryName = () => {
    const names: Record<string, string> = {
      ko: category.name_ko,
      en: category.name_en,
      ja: category.name_ja,
      zh: category.name_zh,
      es: category.name_es,
    };
    return names[language] || category.name_en;
  };

  const getToolName = (tool: Tool) => {
    const names: Record<string, string> = {
      ko: tool.name_ko,
      en: tool.name_en,
      ja: tool.name_ja,
      zh: tool.name_zh,
      es: tool.name_es,
    };
    return names[language] || tool.name_en;
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border-2 border-gray-200 shadow-md hover:shadow-lg hover:border-ai-primary-light transition-all duration-300 overflow-hidden">
      {/* 카테고리 헤더 */}
      <Link
        href={`/category/${category.id}/`}
        className="block p-4 sm:p-5 hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 transition-all duration-200"
      >
        <div className="flex items-center gap-3">
          {/* 아이콘 */}
          <div className={`
            w-12 h-12 sm:w-14 sm:h-14
            flex items-center justify-center
            rounded-xl
            ${category.color} bg-opacity-15 shadow-sm
          `}>
            <span className="text-2xl sm:text-3xl">{category.icon}</span>
          </div>
          
          {/* 이름 + 개수 */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {getCategoryName()}
            </h3>
            <p className="text-sm text-gray-500">
              {tools.length}{t_tools}
            </p>
          </div>

          {/* 화살표 */}
          <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </Link>

      {/* 인기 도구 미리보기 (3개) */}
      {previewTools.length > 0 && (
        <div className="px-4 sm:px-5 pb-3">
          <div className="space-y-2">
            {previewTools.map((tool, index) => (
              <ToolPreviewItem 
                key={tool.id} 
                tool={tool}
                toolName={getToolName(tool)}
                isFirst={index === 0}
                popularLabel={t_popular}
              />
            ))}
          </div>
        </div>
      )}

      {/* 더보기 펼침 영역 */}
      {hasMoreTools && (
        <>
          {/* 펼쳐지는 나머지 도구들 */}
          <div
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <div className="px-4 sm:px-5 pb-3 space-y-2">
              {remainingTools.map((tool) => (
                <ToolPreviewItem 
                  key={tool.id} 
                  tool={tool}
                  toolName={getToolName(tool)}
                  isFirst={false}
                  popularLabel={t_popular}
                />
              ))}
            </div>
          </div>

          {/* 더보기/접기 버튼 */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }}
            className="w-full py-3 px-4 bg-gradient-to-r from-slate-100 to-blue-100 hover:from-slate-200 hover:to-blue-200 transition-all border-t border-gray-200 flex items-center justify-center gap-2 text-sm font-medium text-gray-700"
          >
            <span>{isExpanded ? t_collapse : `+${remainingTools.length}${t_showMore}`}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}

/**
 * 도구 미리보기 아이템
 */
function ToolPreviewItem({ 
  tool, 
  toolName,
  isFirst,
  popularLabel,
}: { 
  tool: Tool; 
  toolName: string;
  isFirst: boolean;
  popularLabel: string;
}) {
  return (
    <Link
      href={`${tool.route}`}
      className={`
        flex items-center gap-3 p-2.5 sm:p-3 rounded-xl transition-all
        ${isFirst 
          ? 'bg-gradient-to-r from-ai-primary/5 to-purple-500/5 border border-ai-primary/20 hover:border-ai-primary/40' 
          : 'bg-gray-50 hover:bg-gray-100'
        }
      `}
    >
      {/* 아이콘 */}
      <span className={`text-xl sm:text-2xl ${isFirst ? '' : 'opacity-80'}`}>
        {tool.icon}
      </span>
      
      {/* 이름 */}
      <span className={`
        flex-1 truncate text-sm sm:text-base
        ${isFirst ? 'font-semibold text-gray-800' : 'text-gray-700'}
      `}>
        {toolName}
      </span>

      {/* 뱃지 */}
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {isFirst && (
          <span className="px-2 py-0.5 text-xs font-bold bg-ai-primary text-white rounded-full">
            {popularLabel}
          </span>
        )}
        {tool.isNew && !isFirst && (
          <span className="px-1.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded">
            NEW
          </span>
        )}
      </div>

      {/* 화살표 */}
      <svg className={`w-4 h-4 flex-shrink-0 ${isFirst ? 'text-ai-primary' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
