'use client';

import { ElementType } from 'react';
import { useTranslatedText } from '@/lib/use-translations';
import { Language } from '@/lib/i18n';

interface TranslatedTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  sourceLanguage?: Language;
}

export default function TranslatedText({
  text,
  as: Component = 'span',
  className,
  sourceLanguage = 'ko',
}: TranslatedTextProps) {
  const translated = useTranslatedText(text, sourceLanguage);
  return <Component className={className}>{translated}</Component>;
}
