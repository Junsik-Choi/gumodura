'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { useTranslatedTexts } from '@/lib/use-translations';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { language } = useLanguage();
  const [
    headerTitle,
    pageTitle,
    pageSubtitle,
    successLabel,
    successDescription,
    errorLabel,
    nameLabel,
    emailLabel,
    messageLabel,
    submitLabel,
    submittingLabel,
    directEmailLabel,
  ] = useTranslatedTexts([
    '그 뭐더라',
    '문의하기',
    '궁금한 점이 있으신가요? 언제든지 연락주세요!',
    '감사합니다! 곧 연락드리겠습니다.',
    '이메일로 확인을 드리겠습니다.',
    '오류가 발생했습니다. 다시 시도해주세요.',
    '이름',
    '이메일',
    '메시지',
    '전송',
    '전송 중...',
    '📧 또는 직접 이메일을 보내주세요: ',
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Formspree를 사용한 이메일 발송
      const response = await fetch('https://formspree.io/f/xvgzjzbz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          language: language,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(errorLabel);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(errorLabel);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-3xl">🔮</span>
            <span className="text-2xl font-bold text-gray-900">{headerTitle}</span>
          </Link>
        </div>

        {/* 페이지 제목 */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {pageTitle}
          </h1>
          <p className="text-xl text-gray-600">
            {pageSubtitle}
          </p>
        </div>

        {/* 폼 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {submitted && (
            <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
              <p className="font-semibold">{successLabel}</p>
              <p className="text-sm">{successDescription}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 이름 */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                {nameLabel} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-ai-primary focus:ring-2 focus:ring-ai-primary/20 outline-none"
                placeholder={nameLabel}
              />
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                {emailLabel} *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-ai-primary focus:ring-2 focus:ring-ai-primary/20 outline-none"
                placeholder="your@email.com"
              />
            </div>

            {/* 메시지 */}
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">
                {messageLabel} *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-xl focus:border-ai-primary focus:ring-2 focus:ring-ai-primary/20 outline-none resize-none"
                placeholder={messageLabel}
              />
            </div>

            {/* 제출 버튼 */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-ai-primary hover:bg-ai-primary-dark disabled:bg-gray-400 text-white font-bold text-xl rounded-2xl transition-colors"
            >
              {submitting ? submittingLabel : submitLabel}
            </button>
          </form>
        </div>

        {/* 추가 정보 */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 text-center">
          <p className="text-gray-600 text-lg">
            {directEmailLabel}
            <a href="mailto:jschoi5334@gmail.com" className="font-bold text-ai-primary hover:underline">
              jschoi5334@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
