'use client';

import { useState, useEffect } from 'react';
import { Language, SUPPORTED_LANGUAGES, t, detectUserLanguage } from '@/lib/i18n';
import Link from 'next/link';

export default function PrivacyPage() {
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
          {t('page.privacyTitle', language)}
        </h1>

        {/* 개인정보처리방침 내용 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8 prose prose-sm max-w-none">
          {language === 'ko' && (
            <>
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 수집하는 정보</h2>
                <p className="text-gray-700">
                  본 서비스는 사용자가 자발적으로 입력한 정보(이름, 이메일)만 수집합니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 정보의 사용</h2>
                <p className="text-gray-700">
                  수집된 정보는 문의사항에 대한 응답, 서비스 개선을 위해서만 사용됩니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 쿠키 정책</h2>
                <p className="text-gray-700">
                  본 서비스는 사용자의 언어 선택을 저장하기 위해 로컬스토리지를 사용합니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 정보 보호</h2>
                <p className="text-gray-700">
                  사용자의 개인정보는 안전하게 보호되며, 제3자와 공유하지 않습니다.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 정보 삭제</h2>
                <p className="text-gray-700">
                  사용자는 언제든지 본인의 정보 삭제를 요청할 수 있습니다.
                </p>
              </section>
            </>
          )}

          {language === 'en' && (
            <>
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
                <p className="text-gray-700">
                  This service only collects information that users voluntarily provide (name, email).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Information</h2>
                <p className="text-gray-700">
                  Collected information is used only to respond to inquiries and improve the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookie Policy</h2>
                <p className="text-gray-700">
                  This service uses local storage to save user language preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Protection</h2>
                <p className="text-gray-700">
                  User personal information is protected securely and is not shared with third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Deletion</h2>
                <p className="text-gray-700">
                  Users can request deletion of their information at any time.
                </p>
              </section>
            </>
          )}

          {language === 'ja' && (
            <>
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 収集する情報</h2>
                <p className="text-gray-700">
                  本サービスは、ユーザーが自発的に提供した情報（名前、メール）のみを収集します。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 情報の使用</h2>
                <p className="text-gray-700">
                  収集された情報は、お問い合わせへの対応とサービス改善にのみ使用されます。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. クッキーポリシー</h2>
                <p className="text-gray-700">
                  本サービスはユーザーの言語選択を保存するためにローカルストレージを使用します。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. データ保護</h2>
                <p className="text-gray-700">
                  ユーザーの個人情報は安全に保護され、第三者と共有されません。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. データ削除</h2>
                <p className="text-gray-700">
                  ユーザーはいつでも自分の情報の削除をリクエストできます。
                </p>
              </section>
            </>
          )}

          {language === 'zh' && (
            <>
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 我们收集的信息</h2>
                <p className="text-gray-700">
                  本服务仅收集用户自愿提供的信息（姓名、电子邮件）。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 信息的使用</h2>
                <p className="text-gray-700">
                  收集的信息仅用于回复问询和改进服务。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Cookie政策</h2>
                <p className="text-gray-700">
                  本服务使用本地存储来保存用户的语言偏好。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 数据保护</h2>
                <p className="text-gray-700">
                  用户个人信息受到安全保护，不与第三方共享。
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 数据删除</h2>
                <p className="text-gray-700">
                  用户可随时请求删除其信息。
                </p>
              </section>
            </>
          )}

          {language === 'es' && (
            <>
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Información que recopilamos</h2>
                <p className="text-gray-700">
                  Este servicio solo recopila información que los usuarios proporcionan voluntariamente (nombre, correo electrónico).
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Uso de la información</h2>
                <p className="text-gray-700">
                  La información recopilada se utiliza solo para responder consultas y mejorar el servicio.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Política de cookies</h2>
                <p className="text-gray-700">
                  Este servicio utiliza almacenamiento local para guardar las preferencias de idioma del usuario.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Protección de datos</h2>
                <p className="text-gray-700">
                  La información personal del usuario está protegida de forma segura y no se comparte con terceros.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Eliminación de datos</h2>
                <p className="text-gray-700">
                  Los usuarios pueden solicitar la eliminación de su información en cualquier momento.
                </p>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
