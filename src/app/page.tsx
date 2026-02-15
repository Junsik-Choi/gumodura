import Link from 'next/link';
import CategoryCardExpanded from '@/components/CategoryCardExpanded';
import HomeSearchBar from '@/components/HomeSearchBar';
import QuickContactForm from '@/components/QuickContactForm';
import TranslatedText from '@/components/TranslatedText';
import { CATEGORIES } from '@/lib/categories';
import { getToolsByCategory } from '@/lib/registry';

/** 대표 서비스 바로가기 데이터 */
const QUICK_SERVICES = [
  { icon: '🎱', label: '추첨 시뮬레이터', href: '/tools/lottery-draw/', badge: 'NEW' },
  { icon: '📄', label: '이미지→PDF', href: '/tools/images-to-pdf/', badge: '' },
  { icon: '📲', label: 'QR 만들기', href: '/tools/qr-generator/', badge: '' },
  { icon: '🎬', label: '유튜브 썸네일', href: '/tools/youtube-thumbnail/', badge: '' },
  { icon: '💰', label: '연봉 계산기', href: '/tools/salary-calculator/', badge: '' },
  { icon: '✂️', label: '배경 제거', href: '/tools/background-remover/', badge: '' },
  { icon: '🪜', label: '사다리 타기', href: '/tools/ladder-game/', badge: '' },
  { icon: '🎖️', label: '전역일 계산', href: '/tools/military-discharge/', badge: '' },
];

/**
 * 홈페이지
 * - 히어로 섹션 + AI 검색창
 * - 대표 서비스 바로가기 버튼
 * - 🎱 로또 추첨 미니배너
 * - 카테고리별 둘러보기
 * - 간편 문의 폼
 */
export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* 히어로 섹션 + AI 검색창 */}
      <section className="text-center mb-6 sm:mb-10">
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

      {/* 대표 서비스 바로가기 - 한 줄 가로 스크롤 */}
      <section className="mb-6 sm:mb-10 -mx-3 sm:-mx-6 lg:-mx-8">
        <div className="flex gap-2 sm:gap-3 px-3 sm:px-6 lg:px-8 overflow-x-auto scrollbar-hide">
          {QUICK_SERVICES.map((svc) => (
            <Link key={svc.href} href={svc.href} className="shrink-0">
              <div className="
                relative flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2.5
                bg-white border border-purple-100
                text-gray-700 rounded-full
                shadow-sm hover:shadow-md hover:border-purple-200 hover:bg-purple-50
                hover:scale-[1.03] active:scale-[0.97]
                transition-all duration-200 cursor-pointer
                text-sm font-medium whitespace-nowrap
              ">
                <span className="text-base">{svc.icon}</span>
                <span><TranslatedText text={svc.label} /></span>
                {svc.badge && (
                  <span className="bg-purple-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                    {svc.badge}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🎱 로또 추첨 시뮬레이터 - 컴팩트 미니 배너 */}
      <section className="mb-8 sm:mb-10">
        <Link href="/tools/lottery-draw/">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-5 py-4 sm:px-8 sm:py-5 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.005] active:scale-[0.995] cursor-pointer group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute top-1 right-4 text-4xl sm:text-5xl opacity-15 group-hover:opacity-25 transition-opacity">🎱</div>
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow shrink-0">
                🎰
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base sm:text-lg font-extrabold truncate">
                    <TranslatedText text="로또 추첨 시뮬레이터" />
                  </span>
                  <span className="bg-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0">✨ NEW</span>
                </div>
                <p className="text-xs sm:text-sm text-white/80 truncate">
                  <TranslatedText text="물리법칙 기반 구슬 추첨! 이름/키워드를 넣고 뽑아보세요" />
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl font-bold text-sm transition-all shrink-0 group-hover:translate-x-0.5">
                <TranslatedText text="지금 해보기" />
                <span className="group-hover:translate-x-0.5 transition-transform">→</span>
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
