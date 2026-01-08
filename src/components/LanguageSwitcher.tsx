'use client';

import { useEffect, useRef, useState } from 'react';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { useLanguage } from '@/components/LanguageProvider';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const current = SUPPORTED_LANGUAGES[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:border-ai-primary/40 hover:text-ai-primary active:scale-95"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className="text-lg" aria-hidden>
          {current.flag}
        </span>
        <span className="hidden sm:inline">{current.name}</span>
        <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-3 w-44 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl animate-slide-up"
          role="menu"
        >
          <div className="absolute -top-2 right-6 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white" />
          {(
            Object.entries(SUPPORTED_LANGUAGES) as [
              keyof typeof SUPPORTED_LANGUAGES,
              typeof SUPPORTED_LANGUAGES['ko']
            ][]
          ).map(([lang, { flag, name }]) => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                setLanguage(lang);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm transition-all hover:bg-ai-primary/10 ${
                language === lang ? 'bg-ai-primary/10 text-ai-primary' : 'text-gray-700'
              }`}
              role="menuitem"
            >
              <span className="text-lg" aria-hidden>
                {flag}
              </span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
