'use client';

import { useState, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES, t, detectUserLanguage } from '@/lib/i18n';
import Link from 'next/link';

export default function TermsPage() {
  const [language, setLanguage] = useState<Language>('ko');

  useEffect(() => {
    detectUserLanguage().then(setLanguage);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-3xl">🔮</span>
            <span className="text-2xl font-bold text-gray-900">{t('header.title', language)}</span>
          </Link>

          {/* 언어 선택 */}
          <div className="flex gap-2">
            {(Object.entries(SUPPORTED_LANGUAGES) as [Language, typeof SUPPORTED_LANGUAGES['ko']][]).map(
              ([lang, { flag }]) => (
                <button
                  key={lang}
                  onClick={() => {
                    setLanguage(lang);
                    localStorage.setItem('language', lang);
                  }}
                  className={`text-2xl px-3 py-2 rounded-lg transition-all ${
                    language === lang ? 'bg-ai-primary/20 ring-2 ring-ai-primary' : 'hover:bg-gray-200'
                  }`}
                >
                  {flag}
                </button>
              )
            )}
          </div>
        </div>

        {/* 페이지 제목 */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-12">
          {t('page.termsTitle', language)}
        </h1>

        {/* 약관 내용 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 prose prose-sm max-w-none">
          {language === 'ko' && (
            <>
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 서비스 이용약관</h2>
                <p className="text-gray-700">
                  본 서비스는 사용자가 자유롭게 다양한 생활 유틸리티 도구를 사용할 수 있도록 제공됩니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 서비스 변경 및 중단</h2>
                <p className="text-gray-700">
                  운영자는 서비스의 전부 또는 일부를 언제든지 변경하거나 중단할 수 있습니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 사용자의 책임</h2>
                <p className="text-gray-700">
                  사용자는 본 서비스를 통해 생성된 콘텐츠에 대한 모든 책임을 집니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 면책조항</h2>
                <p className="text-gray-700">
                  본 서비스는 &apos;있는 그대로&apos; 제공되며, 어떤 보증도 하지 않습니다.
                </p>
              </section>
            </>
          )}

          {language === 'en' && (
            <>
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Terms of Service</h2>
                <p className="text-gray-700">
                  This service is provided to allow users to freely use various lifestyle utility tools.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Service Modification and Suspension</h2>
                <p className="text-gray-700">
                  The operator may change or suspend the service at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibility</h2>
                <p className="text-gray-700">
                  Users are responsible for all content generated through this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Disclaimer</h2>
                <p className="text-gray-700">
                  This service is provided &quot;as is&quot; without any warranties.
                </p>
              </section>
            </>
          )}

          {language === 'ja' && (
            <>
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. サービス利用規約</h2>
                <p className="text-gray-700">
                  本サービスは、ユーザーが様々なライフスタイルユーティリティツールを自由に使用できるように提供されています。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. サービスの変更および停止</h2>
                <p className="text-gray-700">
                  運営者はいつでもサービスの全部または一部を変更または停止することができます。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. ユーザーの責任</h2>
                <p className="text-gray-700">
                  ユーザーは本サービスを通じて生成されたコンテンツのすべてについて責任を負います。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 免責事項</h2>
                <p className="text-gray-700">
                  本サービスは「現状のまま」提供され、いかなる保証もありません。
                </p>
              </section>
            </>
          )}

          {language === 'zh' && (
            <>
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 服务条款</h2>
                <p className="text-gray-700">
                  本服务旨在让用户自由使用各种生活实用工具。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 服务修改和暂停</h2>
                <p className="text-gray-700">
                  运营者可随时更改或暂停全部或部分服务。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 用户责任</h2>
                <p className="text-gray-700">
                  用户对通过本服务生成的所有内容负责。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 免责声明</h2>
                <p className="text-gray-700">
                  本服务按&quot;现状&quot;提供，不提供任何保证。
                </p>
              </section>
            </>
          )}

          {language === 'es' && (
            <>
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Términos de Servicio</h2>
                <p className="text-gray-700">
                  Este servicio se proporciona para permitir a los usuarios utilizar libremente varias herramientas de utilidad de estilo de vida.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Modificación y Suspensión del Servicio</h2>
                <p className="text-gray-700">
                  El operador puede cambiar o suspender el servicio en cualquier momento.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Responsabilidad del Usuario</h2>
                <p className="text-gray-700">
                  Los usuarios son responsables de todo el contenido generado a través de este servicio.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Descargo de Responsabilidad</h2>
                <p className="text-gray-700">
                  Este servicio se proporciona &quot;tal como está&quot; sin garantías.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
