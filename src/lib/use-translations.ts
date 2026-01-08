'use client';

import { useEffect, useMemo, useState } from 'react';
import { translateTexts } from '@/lib/translation-client';
import { useLanguage } from '@/components/LanguageProvider';
import { Language } from '@/lib/i18n';

export function useTranslatedTexts(texts: string[], sourceLanguage: Language = 'ko') {
  const { language } = useLanguage();
  const [translatedTexts, setTranslatedTexts] = useState(texts);
  const signature = useMemo(() => texts.join('||'), [texts]);

  useEffect(() => {
    let active = true;

    translateTexts(texts, language, sourceLanguage).then(result => {
      if (active) {
        setTranslatedTexts(result);
      }
    });

    return () => {
      active = false;
    };
  }, [language, signature]);

  return translatedTexts;
}

export function useTranslatedText(text: string, sourceLanguage: Language = 'ko') {
  const [translated] = useTranslatedTexts([text], sourceLanguage);
  return translated;
}
