'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslatedTexts } from '@/lib/use-translations';

/**
 * 홈페이지용 AI 검색창
 * - 히어로 섹션 아래 배치
 * - 큰 사이즈, 눈에 띄는 디자인
 * - 포커스 시 부드러운 효과
 */
export default function HomeSearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderFontSize, setPlaceholderFontSize] = useState('1rem');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const [
    placeholder,
    searchButton,
    exampleLabel,
  ] = useTranslatedTexts([
    'AI에게 필요한 기능을 물어보세요',
    '검색',
    '예: 이미지 압축, QR코드 만들기, PDF 합치기',
  ]);

  // placeholder 텍스트가 길면 폰트 크기 자동 조절
  useEffect(() => {
    if (!inputRef.current || !placeholder) return;
    
    const input = inputRef.current;
    const containerWidth = input.offsetWidth - 20; // 여유 공간
    
    // 임시 span으로 텍스트 너비 측정
    const measureSpan = document.createElement('span');
    measureSpan.style.visibility = 'hidden';
    measureSpan.style.position = 'absolute';
    measureSpan.style.whiteSpace = 'nowrap';
    measureSpan.style.font = getComputedStyle(input).font;
    measureSpan.textContent = placeholder;
    document.body.appendChild(measureSpan);
    
    const textWidth = measureSpan.offsetWidth;
    document.body.removeChild(measureSpan);
    
    // 텍스트가 너무 길면 폰트 크기 축소
    if (textWidth > containerWidth && containerWidth > 0) {
      const ratio = containerWidth / textWidth;
      const baseFontSize = window.innerWidth >= 640 ? 18 : 16; // sm:text-lg : text-base
      const newSize = Math.max(baseFontSize * ratio, 12); // 최소 12px
      setPlaceholderFontSize(`${newSize}px`);
    } else {
      setPlaceholderFontSize('');
    }
  }, [placeholder]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/ai-search/?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSearch}>
        <div 
          className={`
            relative flex items-center w-full
            rounded-2xl transition-all duration-300
            bg-white border-2
            ${isFocused 
              ? 'border-ai-primary shadow-xl shadow-ai-primary/15' 
              : 'border-gray-200 shadow-lg hover:border-ai-primary-light hover:shadow-xl'
            }
          `}
        >
          {/* AI 아이콘 */}
          <div className="pl-4 sm:pl-5 pr-2 sm:pr-3">
            <svg 
              className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${isFocused ? 'text-ai-primary' : 'text-gray-400'}`}
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
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="
              flex-1 py-4 sm:py-5 pr-3
              text-base sm:text-lg
              text-gray-700 placeholder-gray-400
              bg-transparent outline-none
              min-w-0
            "
            style={placeholderFontSize ? { fontSize: placeholderFontSize } as React.CSSProperties : undefined}
          />

          {/* 검색 버튼 */}
          <button
            type="submit"
            className="
              mr-2 sm:mr-3 px-5 sm:px-6 py-2.5 sm:py-3
              bg-ai-primary hover:bg-ai-primary-dark active:scale-95
              text-white font-semibold
              rounded-xl
              transition-all
              text-base sm:text-lg
              whitespace-nowrap
              shadow-md hover:shadow-lg
            "
          >
            {searchButton}
          </button>
        </div>
      </form>

      {/* 예시 텍스트 */}
      <p className="mt-3 text-center text-sm text-gray-500">
        {exampleLabel}
      </p>
    </div>
  );
}
