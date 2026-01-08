'use client';

import Link from 'next/link';
import { useTranslatedTexts } from '@/lib/use-translations';

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. 수집하는 정보',
      body: '본 서비스는 사용자가 자발적으로 입력한 정보(이름, 이메일)만 수집합니다.',
    },
    {
      title: '2. 정보의 사용',
      body: '수집된 정보는 문의사항에 대한 응답, 서비스 개선을 위해서만 사용됩니다.',
    },
    {
      title: '3. 쿠키 정책',
      body: '본 서비스는 사용자의 언어 선택을 저장하기 위해 로컬스토리지를 사용합니다.',
    },
    {
      title: '4. 정보 보호',
      body: '사용자의 개인정보는 안전하게 보호되며, 제3자와 공유하지 않습니다.',
    },
    {
      title: '5. 정보 삭제',
      body: '사용자는 언제든지 본인의 정보 삭제를 요청할 수 있습니다.',
    },
  ];
  const translatedSections = useTranslatedTexts(sections.flatMap(section => [section.title, section.body]));
  const [headerTitle, pageTitle] = useTranslatedTexts(['그 뭐더라', '개인정보처리방침']);

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

        {/* 개인정보처리방침 내용 */}
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
