import CategoryCardExpanded from '@/components/CategoryCardExpanded';
import HomeSearchBar from '@/components/HomeSearchBar';
import QuickContactForm from '@/components/QuickContactForm';
import TranslatedText from '@/components/TranslatedText';
import { CATEGORIES } from '@/lib/categories';
import { getToolsByCategory } from '@/lib/registry';

/**
 * 홈페이지
 * - 히어로 섹션 + AI 검색창
 * - 카테고리별 둘러보기 (메인, 상단 배치)
 *   - 각 카테고리에 인기순 3개 도구 미리보기
 *   - 더보기 클릭 시 애니메이션으로 펼침
 * - 간편 문의 폼
 * - 모바일 최적화
 */
export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* 히어로 섹션 + AI 검색창 */}
      <section className="text-center mb-8 sm:mb-12">
        <TranslatedText
          as="h1"
          className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-3"
          text="필요한 기능, 다 있어요! 🔮"
        />
        <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto mb-6 sm:mb-8">
          <span className="text-ai-primary font-semibold">
            <TranslatedText text="카테고리에서 찾거나" />
          </span>
          {' '}
          <TranslatedText text="AI 검색으로 바로 찾아보세요" />
        </p>
        
        {/* AI 검색창 */}
        <HomeSearchBar />
      </section>

      {/* 카테고리별 둘러보기 (메인 섹션) */}
      <section className="mb-8 sm:mb-12">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <span className="text-xl sm:text-2xl">📚</span>
          <TranslatedText
            as="h2"
            className="text-xl sm:text-2xl font-bold text-gray-800"
            text="카테고리별 둘러보기"
          />
        </div>
        
        {/* 카테고리 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {CATEGORIES.map(category => {
            const tools = getToolsByCategory(category.id);
            return (
              <CategoryCardExpanded
                key={category.id}
                category={category}
                tools={tools}
              />
            );
          })}
        </div>
      </section>

      {/* 간편 문의 폼 */}
      <QuickContactForm />
    </div>
  );
}
