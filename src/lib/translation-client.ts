'use client';

import { Language } from '@/lib/i18n';

const MEMORY_CACHE = new Map<string, string>();
const STORAGE_PREFIX = 'translation-cache-v1';
const GOOGLE_LANGUAGE_MAP: Record<Language, string> = {
  ko: 'ko',
  en: 'en',
  ja: 'ja',
  zh: 'zh-CN',
  es: 'es',
};

function getCacheKey(language: Language, text: string) {
  return `${STORAGE_PREFIX}:${language}:${text}`;
}

function getCachedTranslation(language: Language, text: string): string | null {
  const key = getCacheKey(language, text);
  const memoryValue = MEMORY_CACHE.get(key);
  if (memoryValue) return memoryValue;
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(key);
  if (stored) {
    MEMORY_CACHE.set(key, stored);
    return stored;
  }
  return null;
}

function setCachedTranslation(language: Language, text: string, translated: string) {
  const key = getCacheKey(language, text);
  MEMORY_CACHE.set(key, translated);
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, translated);
  }
}

export async function translateTexts(
  texts: string[],
  targetLanguage: Language,
  sourceLanguage?: Language
): Promise<string[]> {
  if (!texts.length || targetLanguage === (sourceLanguage || 'ko')) {
    return texts;
  }

  const uniqueTexts = Array.from(new Set(texts.filter(text => text.trim().length > 0)));
  const translations = new Map<string, string>();
  const missing: string[] = [];

  for (const text of uniqueTexts) {
    const cached = getCachedTranslation(targetLanguage, text);
    if (cached) {
      translations.set(text, cached);
    } else {
      missing.push(text);
    }
  }

  if (missing.length > 0) {
    const translatedTexts = await requestTranslations(missing, targetLanguage, sourceLanguage);
    translatedTexts.forEach((translated, index) => {
      const original = missing[index];
      if (original) {
        const finalText = translated || original;
        setCachedTranslation(targetLanguage, original, finalText);
        translations.set(original, finalText);
      }
    });
  }

  return texts.map(text => {
    if (!text.trim()) return text;
    return translations.get(text) || text;
  });
}

async function requestTranslations(
  texts: string[],
  targetLanguage: Language,
  sourceLanguage?: Language
): Promise<string[]> {
  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts,
        targetLanguage,
        sourceLanguage,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const translatedTexts: string[] = data.translations || [];
      if (translatedTexts.length) {
        return translatedTexts;
      }
    }
  } catch (error) {
    console.warn('API translation request failed, falling back:', error);
  }

  return translateViaGoogle(texts, targetLanguage);
}

async function translateViaGoogle(texts: string[], targetLanguage: Language): Promise<string[]> {
  const languageCode = GOOGLE_LANGUAGE_MAP[targetLanguage];
  const results = await Promise.all(
    texts.map(async text => {
      try {
        const params = new URLSearchParams({
          client: 'gtx',
          sl: 'auto',
          tl: languageCode,
          dt: 't',
          q: text,
        });
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params.toString()}`);
        if (!response.ok) {
          return text;
        }
        const data = await response.json();
        if (Array.isArray(data) && Array.isArray(data[0])) {
          return data[0].map((chunk: [string]) => chunk[0]).join('');
        }
        return text;
      } catch (error) {
        console.warn('Google translation failed:', error);
        return text;
      }
    })
  );

  return results;
}
