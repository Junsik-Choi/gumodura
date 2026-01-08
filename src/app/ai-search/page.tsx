'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import ToolCard from '@/components/ToolCard';
import { AISearchResult } from '@/lib/types';
import { clientSearch, saveFeatureRequest } from '@/lib/client-search';

/**
 * AI 검색 결과 페이지
 * - 최적 추천 + 대안 표시
 * - 매칭 실패 시 기능 요청 UI
 * - GitHub Pages용 클라이언트 사이드 검색
 */

function AISearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [result, setResult] = useState<AISearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestSent, setRequestSent] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  // 검색 실행 (클라이언트 사이드)
  useEffect(() => {
    if (!query) return;
    
    setLoading(true);
    setError(null);
    setRequestSent(false);
    
    // 약간의 딜레이로 UX 개선
    const timer = setTimeout(() => {
      try {
        const searchResult = clientSearch(query);
        setResult(searchResult);
      } catch {
        setError('검색 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);

  // 검색 입력 동기화
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  // 새 검색
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim() && searchInput.trim() !== query) {
      router.push(`/ai-search/?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  // 기능 요청 보내기 (localStorage + 이메일)
  const handleFeatureRequest = async () => {
    setSendingRequest(true);
    try {
      await new Promise(r => setTimeout(r, 500)); // UX용 딜레이
      const success = await saveFeatureRequest(query);
      if (success) {
        setRequestSent(true);
      } else {
        setError('요청 저장에 실패했습니다.');
      }
    } catch {
      setError('요청 전송 중 오류가 발생했습니다.');
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 검색창 */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative flex items-center rounded-2xl border-2 border-ai-primary shadow-lg shadow-ai-primary/10 bg-white">
          <div className="pl-5 pr-3">
            <svg 
              className="w-6 h-6 text-ai-primary"
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
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="AI에게 필요한 기능을 물어보세요"
            className="flex-1 py-4 pr-4 text-lg text-gray-700 placeholder-gray-400 bg-transparent outline-none"
          />
          <button
            type="submit"
            className="mr-3 px-6 py-2.5 bg-ai-primary hover:bg-ai-primary-dark text-white font-semibold rounded-xl transition-colors"
          >
            검색
          </button>
        </div>
      </form>

      {/* 검색어 표시 */}
      {query && (
        <div className="mb-6">
          <p className="text-lg text-gray-600">
            <span className="font-semibold text-ai-primary">&ldquo;{query}&rdquo;</span> 검색 결과
          </p>
        </div>
      )}

      {/* 로딩 */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="spinner mb-4" style={{ width: 48, height: 48 }} />
          <p className="text-lg text-gray-600">적합한 기능을 찾고 있어요...</p>
        </div>
      )}

      {/* 에러 */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <p className="text-lg text-red-700">{error}</p>
        </div>
      )}

      {/* 결과 */}
      {!loading && !error && result && (
        <div className="animate-fade-in">
          {/* 매칭 성공 */}
          {!result.no_match && result.top && (
            <>
              {/* 최적 추천 */}
              <section className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">🎯</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                    가장 적합한 기능
                  </h2>
                </div>
                <ToolCard tool={result.top} showCategory isTop />
              </section>

              {/* 대안 */}
              {result.alternatives.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">💡</span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      이런 기능도 있어요
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.alternatives.map(tool => (
                      <ToolCard key={tool.id} tool={tool} showCategory />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}

          {/* 매칭 실패 */}
          {result.no_match && (
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 sm:p-12 text-center">
              <div className="text-6xl mb-6">🤔</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                아직 이 기능이 없어요
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                &ldquo;{query}&rdquo;에 맞는 기능을 찾지 못했어요.
                <br />
                개발자에게 요청을 보내드릴까요?
              </p>

              {!requestSent ? (
                <button
                  onClick={handleFeatureRequest}
                  disabled={sendingRequest}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-ai-primary hover:bg-ai-primary-dark disabled:bg-gray-400 text-white font-semibold text-lg rounded-2xl transition-colors"
                >
                  {sendingRequest ? (
                    <>
                      <div className="spinner" />
                      요청 보내는 중...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      네, 요청 보내기
                    </>
                  )}
                </button>
              ) : (
                <div className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-white font-semibold text-lg rounded-2xl">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  요청이 접수되었습니다!
                </div>
              )}

              <p className="mt-6 text-base text-gray-500">
                요청해 주시면 검토 후 빠르게 추가해 드릴게요 🙏
              </p>
            </div>
          )}
        </div>
      )}

      {/* 검색어 없음 */}
      {!query && !loading && (
        <div className="text-center py-16">
          <div className="text-6xl mb-6">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            어떤 기능이 필요하세요?
          </h2>
          <p className="text-lg text-gray-600">
            상단 검색창에 필요한 기능을 입력해 주세요.
            <br />
            예: &ldquo;사진 여러 장 PDF로&rdquo;, &ldquo;예쁜 QR 만들기&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

export default function AISearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="spinner" style={{ width: 48, height: 48 }} />
      </div>
    }>
      <AISearchContent />
    </Suspense>
  );
}
