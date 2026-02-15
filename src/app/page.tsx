import Link from 'next/link';
import CategoryCardExpanded from '@/components/CategoryCardExpanded';
import HomeSearchBar from '@/components/HomeSearchBar';
import QuickContactForm from '@/components/QuickContactForm';
import TranslatedText from '@/components/TranslatedText';
import { CATEGORIES } from '@/lib/categories';
import { getToolsByCategory } from '@/lib/registry';

/**
 * 홈페이지
 * - 히어로 섹션 + AI 검색창
 * - 🎱 로또 추첨 배너 (특별 서비스)
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

      {/* 🎱 로또 추첨 시뮬레이터 - 특별 서비스 배너 */}
      <section className="mb-8 sm:mb-12">
        <Link href="/tools/lottery-draw/">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-5 sm:p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer group">
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
            <div className="absolute top-4 right-8 text-5xl sm:text-7xl opacity-20 group-hover:opacity-30 transition-opacity animate-bounce">🎱</div>
            
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg">
                  🎰
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                      ✨ NEW
                    </span>
                    <span className="bg-white/20 text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full">
                      Special
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold">
                    <TranslatedText text="🎱 로또 추첨 시뮬레이터" />
                  </h2>
                </div>
              </div>
              <div className="flex-1 sm:ml-2">
                <p className="text-sm sm:text-base text-white/90 mb-3">
                  <TranslatedText text="물리법칙이 적용된 구슬이 회전하며 추첨! 이름, 키워드를 넣고 로또처럼 뽑아보세요." />
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all group-hover:translate-x-1">
                  <TranslatedText text="지금 추첨하기" />
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
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
