'use client';

import { useState } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import { useTranslatedTexts } from '@/lib/use-translations';

/**
 * 홈페이지 하단 간편 문의 폼
 * - 기능 요청/문의를 바로 보낼 수 있음
 * - CTA 배너에 통합
 */
export default function QuickContactForm() {
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { language } = useLanguage();

  const [
    title,
    subtitle,
    messagePlaceholder,
    emailPlaceholder,
    sendButton,
    sendingButton,
    successMessage,
    errorMessage,
  ] = useTranslatedTexts([
    '찾는 기능이 없으신가요?',
    '원하는 기능을 알려주세요! 빠르게 추가해 드릴게요 ✨',
    '이런 기능이 있으면 좋겠어요...',
    '답변받을 이메일 (선택)',
    '보내기',
    '전송 중...',
    '감사합니다! 소중한 의견 잘 받았어요 💜',
    '오류가 발생했습니다. 다시 시도해주세요.',
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://formspree.io/f/xvgzjzbz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: '홈페이지 빠른 문의',
          email: email || 'noreply@gumodura.com',
          message: `[기능 요청]\n${message}`,
          language: language,
          timestamp: new Date().toISOString(),
          source: 'home-quick-contact',
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setMessage('');
        setEmail('');
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-ai-primary to-ai-primary-light rounded-2xl sm:rounded-3xl p-6 sm:p-10 text-white">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-2">
          {title}
        </h2>
        <p className="text-sm sm:text-lg opacity-90">
          {subtitle}
        </p>
      </div>

      {submitted ? (
        <div className="flex items-center justify-center gap-2 py-4 bg-white/20 rounded-xl text-white font-medium animate-fade-in">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
          {/* 메시지 입력 */}
          <div className="mb-3">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={messagePlaceholder}
              rows={3}
              className="
                w-full px-4 py-3 rounded-xl
                bg-white/95 text-gray-800 placeholder-gray-400
                border-2 border-transparent
                focus:border-white focus:outline-none
                resize-none
                text-base
              "
              required
            />
          </div>

          {/* 이메일 + 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={emailPlaceholder}
              className="
                flex-1 px-4 py-3 rounded-xl
                bg-white/95 text-gray-800 placeholder-gray-400
                border-2 border-transparent
                focus:border-white focus:outline-none
                text-base
              "
            />
            <button
              type="submit"
              disabled={submitting || !message.trim()}
              className="
                px-6 py-3 rounded-xl
                bg-white text-ai-primary font-bold
                hover:bg-gray-100 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all
                text-base
                flex items-center justify-center gap-2
                whitespace-nowrap
              "
            >
              {submitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {sendingButton}
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {sendButton}
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-center text-red-200 text-sm">
              {error}
            </p>
          )}
        </form>
      )}
    </section>
  );
}
