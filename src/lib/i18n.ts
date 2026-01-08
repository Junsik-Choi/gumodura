// 다국어 지원 시스템
export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'es';

export const SUPPORTED_LANGUAGES: Record<Language, { name: string; flag: string }> = {
  ko: { name: '한국어', flag: '🇰🇷' },
  en: { name: 'English', flag: '🇺🇸' },
  ja: { name: '日本語', flag: '🇯🇵' },
  zh: { name: '中文', flag: '🇨🇳' },
  es: { name: 'Español', flag: '🇪🇸' },
};

// 국가 코드 → 언어 매핑
export const COUNTRY_TO_LANGUAGE: Record<string, Language> = {
  KR: 'ko',
  US: 'en',
  GB: 'en',
  JP: 'ja',
  CN: 'zh',
  TW: 'zh',
  ES: 'es',
  MX: 'es',
};

// 번역 데이터
export const translations: Record<Language, Record<string, string>> = {
  ko: {
    // 헤더
    'header.search': 'AI 기능 검색',
    'header.searchPlaceholder': '찾고 싶은 기능을 말해보세요...',
    'header.title': '그 뭐더라',
    
    // 푸터
    'footer.termsOfService': '이용약관',
    'footer.privacyPolicy': '개인정보처리방침',
    'footer.contact': '문의하기',
    'footer.copyright': '모든 권리 보유',
    
    // 푸터 페이지
    'page.termsTitle': '이용약관',
    'page.privacyTitle': '개인정보처리방침',
    'page.contactTitle': '문의하기',
    'page.aboutTitle': '그 뭐더라란?',
    
    // 문의하기
    'contact.name': '이름',
    'contact.email': '이메일',
    'contact.message': '메시지',
    'contact.submit': '전송',
    'contact.success': '감사합니다! 곧 연락드리겠습니다.',
    'contact.error': '오류가 발생했습니다. 다시 시도해주세요.',
    
    // 검색 없음
    'search.notFound': '죄송합니다. 찾는 기능이 없습니다.',
    'search.reportFeature': '기능 보고',
    'search.reportSuccess': '기능 요청이 접수되었습니다!',
    'search.reportEmail': '이메일로 확인을 드리겠습니다.',
  },
  en: {
    'header.search': 'AI Feature Search',
    'header.searchPlaceholder': 'Tell me the feature you\'re looking for...',
    'header.title': 'What was that?',
    
    'footer.termsOfService': 'Terms of Service',
    'footer.privacyPolicy': 'Privacy Policy',
    'footer.contact': 'Contact',
    'footer.copyright': 'All rights reserved',
    
    'page.termsTitle': 'Terms of Service',
    'page.privacyTitle': 'Privacy Policy',
    'page.contactTitle': 'Contact Us',
    'page.aboutTitle': 'About What was that?',
    
    'contact.name': 'Name',
    'contact.email': 'Email',
    'contact.message': 'Message',
    'contact.submit': 'Submit',
    'contact.success': 'Thank you! We\'ll get back to you soon.',
    'contact.error': 'An error occurred. Please try again.',
    
    'search.notFound': 'Sorry, the feature you\'re looking for doesn\'t exist.',
    'search.reportFeature': 'Report Feature',
    'search.reportSuccess': 'Feature request submitted!',
    'search.reportEmail': 'We\'ll confirm via email.',
  },
  ja: {
    'header.search': 'AI機能検索',
    'header.searchPlaceholder': 'お探しの機能をお知らせください...',
    'header.title': 'あれなんだっけ',
    
    'footer.termsOfService': '利用規約',
    'footer.privacyPolicy': 'プライバシーポリシー',
    'footer.contact': 'お問い合わせ',
    'footer.copyright': '著作権所有',
    
    'page.termsTitle': '利用規約',
    'page.privacyTitle': 'プライバシーポリシー',
    'page.contactTitle': 'お問い合わせ',
    'page.aboutTitle': 'あれなんだっけとは？',
    
    'contact.name': '名前',
    'contact.email': 'メール',
    'contact.message': 'メッセージ',
    'contact.submit': '送信',
    'contact.success': 'ありがとうございます。すぐにご連絡させていただきます。',
    'contact.error': 'エラーが発生しました。もう一度お試しください。',
    
    'search.notFound': '申し訳ございません。お探しの機能は見つかりません。',
    'search.reportFeature': '機能レポート',
    'search.reportSuccess': '機能リクエストが送信されました！',
    'search.reportEmail': 'メールで確認いたします。',
  },
  zh: {
    'header.search': 'AI 功能搜索',
    'header.searchPlaceholder': '告诉我您要查找的功能...',
    'header.title': '那是什么',
    
    'footer.termsOfService': '服务条款',
    'footer.privacyPolicy': '隐私政策',
    'footer.contact': '联系我们',
    'footer.copyright': '版权所有',
    
    'page.termsTitle': '服务条款',
    'page.privacyTitle': '隐私政策',
    'page.contactTitle': '联系我们',
    'page.aboutTitle': '关于那是什么',
    
    'contact.name': '姓名',
    'contact.email': '电子邮件',
    'contact.message': '消息',
    'contact.submit': '提交',
    'contact.success': '谢谢！我们很快会与您联系。',
    'contact.error': '出错了。请重试。',
    
    'search.notFound': '对不起，找不到您要查找的功能。',
    'search.reportFeature': '报告功能',
    'search.reportSuccess': '已提交功能请求！',
    'search.reportEmail': '我们会通过电子邮件确认。',
  },
  es: {
    'header.search': 'Búsqueda de funciones con IA',
    'header.searchPlaceholder': 'Cuéntame la función que buscas...',
    'header.title': '¿Qué era eso?',
    
    'footer.termsOfService': 'Términos de servicio',
    'footer.privacyPolicy': 'Política de privacidad',
    'footer.contact': 'Contacto',
    'footer.copyright': 'Todos los derechos reservados',
    
    'page.termsTitle': 'Términos de servicio',
    'page.privacyTitle': 'Política de privacidad',
    'page.contactTitle': 'Contáctenos',
    'page.aboutTitle': '¿Qué es eso?',
    
    'contact.name': 'Nombre',
    'contact.email': 'Correo electrónico',
    'contact.message': 'Mensaje',
    'contact.submit': 'Enviar',
    'contact.success': '¡Gracias! Nos comunicaremos con usted pronto.',
    'contact.error': 'Ocurrió un error. Por favor, inténtelo de nuevo.',
    
    'search.notFound': 'Lo sentimos, la función que buscas no existe.',
    'search.reportFeature': 'Reportar función',
    'search.reportSuccess': '¡Solicitud de función enviada!',
    'search.reportEmail': 'Te confirmaremos por correo electrónico.',
  },
};

// 번역 함수
export function t(key: string, lang: Language = 'ko'): string {
  return translations[lang]?.[key] || translations.ko[key] || key;
}

// 사용자의 국가 자동 감지
export async function detectUserLanguage(): Promise<Language> {
  try {
    // localStorage에 저장된 언어 확인 (사용자 선택 우선)
    const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    if (savedLanguage && (savedLanguage as Language) in SUPPORTED_LANGUAGES) {
      return savedLanguage as Language;
    }

    // IP 기반 국가 감지 API (공개 API 사용)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code?.toUpperCase();
    
    if (countryCode && countryCode in COUNTRY_TO_LANGUAGE) {
      return COUNTRY_TO_LANGUAGE[countryCode];
    }

    // 기본값
    return 'ko';
  } catch (error) {
    console.error('Failed to detect language:', error);
    return 'ko';
  }
}
