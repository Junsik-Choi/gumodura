// 다국어 지원 시스템
export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'es';

export const DEFAULT_LANGUAGE: Language = 'ko';

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

export const DEEPL_LANGUAGE_MAP: Record<Language, string> = {
  ko: 'KO',
  en: 'EN',
  ja: 'JA',
  zh: 'ZH',
  es: 'ES',
};

export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && (savedLanguage as Language) in SUPPORTED_LANGUAGES) {
    return savedLanguage as Language;
  }
  return null;
}

export function setStoredLanguage(language: Language) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('language', language);
}

// 사용자의 국가 자동 감지
export async function detectUserLanguage(): Promise<Language> {
  try {
    // localStorage에 저장된 언어 확인 (사용자 선택 우선)
    const savedLanguage = getStoredLanguage();
    if (savedLanguage) {
      return savedLanguage;
    }

    // IP 기반 국가 감지 API (공개 API 사용)
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    const countryCode = data.country_code?.toUpperCase();

    if (countryCode && countryCode in COUNTRY_TO_LANGUAGE) {
      return COUNTRY_TO_LANGUAGE[countryCode];
    }

    // 기본값
    return DEFAULT_LANGUAGE;
  } catch (error) {
    console.error('Failed to detect language:', error);
    return DEFAULT_LANGUAGE;
  }
}
