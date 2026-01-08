'use client';

import Link from 'next/link';
import { useTranslatedTexts } from '@/lib/use-translations';

export default function TermsPage() {
  const sections = [
    {
      title: '1. 서비스 이용약관',
      body: '본 서비스는 사용자가 자유롭게 다양한 생활 유틸리티 도구를 사용할 수 있도록 제공됩니다.',
    },
    {
      title: '2. 서비스 변경 및 중단',
      body: '운영자는 서비스의 전부 또는 일부를 언제든지 변경하거나 중단할 수 있습니다.',
    },
    {
      title: '3. 사용자의 책임',
      body: '사용자는 본 서비스를 통해 생성된 콘텐츠에 대한 모든 책임을 집니다.',
    },
    {
      title: '4. 면책조항',
      body: '본 서비스는 \'있는 그대로\' 제공되며, 어떤 보증도 하지 않습니다.',
    },
  ];
  const translatedSections = useTranslatedTexts(sections.flatMap(section => [section.title, section.body]));
  const [headerTitle, pageTitle] = useTranslatedTexts(['그 뭐더라', '이용약관']);

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
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12">
          {pageTitle}
        </h1>

        {/* 약관 내용 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 prose prose-sm max-w-none">
          {sections.map((section, index) => {
            const title = translatedSections[index * 2];
            const body = translatedSections[index * 2 + 1];
            return (
              <section key={section.title}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
                <p className="text-gray-700">{body}</p>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
