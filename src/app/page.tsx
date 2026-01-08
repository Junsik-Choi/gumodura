import CategoryCard from '@/components/CategoryCard';
import ToolCard from '@/components/ToolCard';
import TranslatedText from '@/components/TranslatedText';
import { CATEGORIES } from '@/lib/categories';
import { getPopularTools, getNewTools, getToolsByCategory } from '@/lib/registry';

/**
 * 홈페이지
 * - 카테고리 카드 그리드
 * - 인기 도구 섹션
 * - 새로 추가된 도구 섹션
 * - 모바일 최적화
 */
export default function HomePage() {
  const popularTools = getPopularTools();
  const newTools = getNewTools();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* 히어로 섹션 */}
      <section className="text-center mb-8 sm:mb-16">
        <TranslatedText
          as="h1"
          className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4"
          text="필요한 기능, 다 있어요! 🔮"
        />
        <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto">
          <TranslatedText text="“그 뭐더라...” 싶을 때 찾아오세요." />
          <br className="hidden sm:block" />
          <span className="text-ai-primary font-semibold">
            <TranslatedText text="AI에게 물어보면" />
          </span>{' '}
          <TranslatedText text="딱 맞는 기능을 찾아드려요!" />
        </p>
      </section>

      {/* 인기 도구 */}
      {popularTools.length > 0 && (
        <section className="mb-8 sm:mb-16">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl">🔥</span>
            <TranslatedText
              as="h2"
              className="text-xl sm:text-3xl font-bold text-gray-800"
              text="인기 도구"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {popularTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} showCategory />
            ))}
          </div>
        </section>
      )}

      {/* 새로 추가된 도구 */}
      {newTools.length > 0 && (
        <section className="mb-8 sm:mb-16">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl">✨</span>
            <TranslatedText
              as="h2"
              className="text-xl sm:text-3xl font-bold text-gray-800"
              text="새로 추가됨"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {newTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} showCategory />
            ))}
          </div>
        </section>
      )}

      {/* 카테고리별 둘러보기 */}
      <section className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 mb-4 sm:mb-6">
            <span className="text-xl sm:text-2xl">📚</span>
            <TranslatedText
              as="h2"
              className="text-xl sm:text-3xl font-bold text-gray-800"
              text="카테고리별 둘러보기"
            />
          </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {CATEGORIES.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              toolCount={getToolsByCategory(category.id).length}
            />
          ))}
        </div>
      </section>

      {/* CTA 배너 */}
      <section className="bg-gradient-to-r from-ai-primary to-ai-primary-light rounded-3xl p-8 sm:p-12 text-center text-white">
        <TranslatedText
          as="h2"
          className="text-2xl sm:text-3xl font-bold mb-4"
          text="찾는 기능이 없으신가요?"
        />
        <p className="text-lg sm:text-xl opacity-90 mb-6">
          <TranslatedText text="AI 검색창에 필요한 기능을 말씀해 주세요." />
          <br />
          <TranslatedText text="없는 기능은 요청하시면 빠르게 추가해 드려요!" />
        </p>
        <div className="inline-flex items-center gap-2 bg-white text-ai-primary px-6 py-3 rounded-full font-semibold text-lg">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <TranslatedText text="상단 검색창을 이용해보세요" />
        </div>
      </section>
    </div>
  );
}
