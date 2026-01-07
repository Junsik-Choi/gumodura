'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

/**
 * 헤더 컴포넌트
 * - 사이트 로고
 * - AI 기능 검색창 (우측 상단)
 * - 반응형 + 고정 헤더
 * - 모바일 최적화
 */
export default function Header() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/ai-search/?q=${encodeURIComponent(query.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm safe-area-top">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* 메인 헤더 */}
        <div className="flex items-center justify-between h-14 sm:h-20">
          {/* 로고 */}
          <Link 
            href="/" 
            className="flex items-center gap-1.5 sm:gap-2 group shrink-0"
          >
            <span className="text-2xl sm:text-3xl">🔮</span>
            <span className="text-lg sm:text-2xl font-bold text-gray-800 group-hover:text-ai-primary transition-colors">
              그 뭐더라
            </span>
          </Link>

          {/* 데스크탑 검색창 */}
          <form 
            onSubmit={handleSearch}
            className="hidden sm:flex flex-1 max-w-xl ml-8"
          >
            <div 
              className={`
                relative flex items-center w-full
                rounded-full border-2 transition-all duration-300
                ${isFocused 
                  ? 'border-ai-primary shadow-lg shadow-ai-primary/20' 
                  : 'border-gray-200 hover:border-ai-primary-light'
                }
                bg-white
              `}
            >
              {/* AI 아이콘 */}
              <div className="pl-4 pr-2">
                <svg 
                  className={`w-5 h-5 transition-colors ${isFocused ? 'text-ai-primary' : 'text-gray-400'}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
                  />
                </svg>
              </div>

              {/* 입력창 */}
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="AI에게 필요한 기능을 물어보세요"
                className="
                  flex-1 py-3 pr-4 
                  text-base sm:text-lg
                  text-gray-700 placeholder-gray-400
                  bg-transparent outline-none
                  min-w-0
                "
              />

              {/* 검색 버튼 */}
              <button
                type="submit"
                className="
                  mr-2 px-4 py-2
                  bg-ai-primary hover:bg-ai-primary-dark active:scale-95
                  text-white font-medium
                  rounded-full
                  transition-all
                  text-sm sm:text-base
                  whitespace-nowrap
                "
              >
                검색
              </button>
            </div>
          </form>

          {/* 모바일 검색 버튼 */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="sm:hidden flex items-center justify-center w-11 h-11 rounded-full bg-ai-primary/10 text-ai-primary active:scale-95 transition-transform"
            aria-label="검색"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* 모바일 검색창 (펼침) */}
        {mobileSearchOpen && (
          <div className="sm:hidden pb-3 animate-fade-in">
            <form onSubmit={handleSearch}>
              <div className="flex items-center rounded-2xl border-2 border-ai-primary bg-white shadow-lg shadow-ai-primary/10">
                <div className="pl-3">
                  <svg className="w-5 h-5 text-ai-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="예: 사진 PDF로, QR 만들기"
                  className="flex-1 py-3 px-2 text-base text-gray-700 placeholder-gray-400 bg-transparent outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="mr-2 px-4 py-2 bg-ai-primary active:bg-ai-primary-dark text-white font-medium rounded-xl text-sm"
                >
                  검색
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
