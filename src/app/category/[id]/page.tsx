import { notFound } from 'next/navigation';
import Link from 'next/link';
import ToolCard from '@/components/ToolCard';
import { CATEGORIES, getCategoryMeta } from '@/lib/categories';
import { getToolsByCategory } from '@/lib/registry';
import { ToolCategory } from '@/lib/types';

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

/**
 * 카테고리별 도구 목록 페이지
 */
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const category = getCategoryMeta(id as ToolCategory);

  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 헤더 */}
      <header className="mb-10">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-ai-primary hover:text-ai-primary-dark font-medium mb-4"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          홈으로
        </Link>
        
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 flex items-center justify-center rounded-2xl ${category.color} bg-opacity-10`}>
            <span className="text-4xl">{category.icon}</span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {category.name_ko}
            </h1>
            <p className="text-lg text-gray-600">
              {category.description_ko}
            </p>
          </div>
        </div>
      </header>

      {/* 도구 목록 */}
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-3xl">
          <div className="text-5xl mb-4">🔧</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            아직 준비 중이에요
          </h2>
          <p className="text-gray-600">
            이 카테고리의 도구를 열심히 준비하고 있어요!
          </p>
        </div>
      )}
    </div>
  );
}

// 정적 생성
export async function generateStaticParams() {
  return CATEGORIES.map(cat => ({ id: cat.id }));
}
