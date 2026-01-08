import { NextResponse } from 'next/server';
import { DEEPL_LANGUAGE_MAP, Language } from '@/lib/i18n';

interface TranslateRequestBody {
  texts?: string[];
  targetLanguage?: Language;
  sourceLanguage?: Language;
}

export async function POST(request: Request) {
  const body = (await request.json()) as TranslateRequestBody;
  const texts = body.texts || [];
  const targetLanguage = body.targetLanguage;
  const sourceLanguage = body.sourceLanguage;

  if (!Array.isArray(texts) || texts.length === 0 || !targetLanguage) {
    return NextResponse.json({ translations: texts });
  }

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ translations: texts });
  }

  const endpoint = process.env.DEEPL_API_URL || 'https://api.deepl.com/v2/translate';

  const params = new URLSearchParams();
  texts.forEach(text => {
    params.append('text', text);
  });
  params.append('target_lang', DEEPL_LANGUAGE_MAP[targetLanguage]);
  if (sourceLanguage) {
    params.append('source_lang', DEEPL_LANGUAGE_MAP[sourceLanguage]);
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      return NextResponse.json({ translations: texts });
    }

    const data = await response.json();
    const translations = Array.isArray(data.translations)
      ? data.translations.map((item: { text?: string }) => item.text || '')
      : texts;

    return NextResponse.json({ translations });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json({ translations: texts });
  }
}
