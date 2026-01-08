'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES, t, detectUserLanguage } from '@/lib/i18n';

/**
 * 푸터 컴포넌트
 * - 저작권
 * - 링크들
 * - 언어 선택
 */
export default function Footer() {
  const [language, setLanguage] = useState<Language>('ko');

  useEffect(() => {
    detectUserLanguage().then(setLanguage);
  }, []);

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          {/* 로고 + 저작권 */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔮</span>
            <div>
              <span className="text-lg font-bold text-gray-700 block">{t('header.title', language)}</span>
              <span className="text-gray-500 text-sm">
                © {new Date().getFullYear()} {t('footer.copyright', language)}
              </span>
            </div>
          </div>

          {/* 언어 선택 */}
          <div className="flex flex-wrap gap-2 items-center justify-start sm:justify-end">
            {(Object.entries(SUPPORTED_LANGUAGES) as [Language, typeof SUPPORTED_LANGUAGES['ko']][]).map(
              ([lang, { flag, name }]) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    localStorage.setItem('language', lang);
                  }}
                  title={name}
                  className={`
                    text-xl px-2 py-1 rounded transition-all text-sm sm:text-base
                    ${language === lang 
                      ? 'bg-ai-primary/20 ring-2 ring-ai-primary' 
                      : 'hover:bg-gray-200'
                    }
                  `}
                >
                  {flag}
                </button>
              )
            )}
          </div>
        </div>

        {/* 링크들 */}
        <nav className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-base">
          <Link 
            href="/terms" 
            className="text-gray-600 hover:text-ai-primary transition-colors font-medium"
          >
            {t('footer.termsOfService', language)}
          </Link>
          <span className="hidden sm:block text-gray-300">|</span>
          <Link 
            href="/privacy" 
            className="text-gray-600 hover:text-ai-primary transition-colors font-medium"
          >
            {t('footer.privacyPolicy', language)}
          </Link>
          <span className="hidden sm:block text-gray-300">|</span>
          <Link 
            href="/contact" 
            className="text-gray-600 hover:text-ai-primary transition-colors font-medium"
          >
            {t('footer.contact', language)}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
