'use client';

import { useState, useCallback } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

interface TextStats {
  characters: number;
  charactersNoSpace: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  bytes: number;
  bytesNoSpace: number;
}

type CountMode = 'basic' | 'resume';

const SAMPLE_TEXTS_KEYS = [
  { key: 'tweet', limit: 280, icon: '🐦' },
  { key: 'instagram', limit: 2200, icon: '📸' },
  { key: 'sms', limit: 80, icon: '💬' },
  { key: 'blogTitle', limit: 60, icon: '📝' },
];

// 자소서 프리셋 (한글 바이트 기준)
const RESUME_PRESETS_KEYS = [
  { key: 'char500', charLimit: 500, icon: '📄' },
  { key: 'char700', charLimit: 700, icon: '📄' },
  { key: 'char1000', charLimit: 1000, icon: '📝' },
  { key: 'char1500', charLimit: 1500, icon: '📝' },
  { key: 'char2000', charLimit: 2000, icon: '📑' },
  { key: 'char3000', charLimit: 3000, icon: '📑' },
];

export default function TextCounter() {
  const [
    basicMode,
    resumeMode,
    resumePlaceholder,
    basicPlaceholder,
    copy,
    clear,
    resumeCharLimit,
    charLimitCheck,
    char,
    excludingSpaces,
    charExceeded,
    charRemaining,
    progress,
    appropriateLength,
    totalChars,
    excludeSpaces,
    words,
    sentences,
    paragraphs,
    bytes,
    additionalInfo,
    lineCount,
    lines,
    bytesExcludingSpaces,
    avgWordLength,
    readingTime,
    speakingTime,
    approx,
    minutes,
    koreanCharCount,
    tweet,
    instagram,
    sms,
    blogTitle,
    char500,
    char700,
    char1000,
    char1500,
    char2000,
    char3000,
  ] = useTranslatedTexts([
    '기본 모드',
    '자소서 모드',
    '자기소개서 내용을 입력하세요...',
    '텍스트를 입력하세요...',
    '복사',
    '지우기',
    '자소서 글자 수 제한',
    '글자 수 제한 확인',
    '자',
    '공백 제외',
    '자 초과!',
    '자 남음',
    '진행률',
    '적정 분량!',
    '전체 글자',
    '공백 제외',
    '단어',
    '문장',
    '단락',
    '바이트',
    '추가 정보',
    '줄 수',
    '줄',
    '공백 제외 바이트',
    '평균 단어 길이',
    '읽기 시간',
    '말하기 시간',
    '약',
    '분',
    '한글 글자 수',
    '트윗',
    '인스타그램',
    'SMS',
    '블로그 제목',
    '500자',
    '700자',
    '1000자',
    '1500자',
    '2000자',
    '3000자',
  ]);

  const translations: Record<string, string> = {
    tweet, instagram, sms, blogTitle,
    char500, char700, char1000, char1500, char2000, char3000,
  };

  const [text, setText] = useState('');
  const [selectedLimit, setSelectedLimit] = useState<number | null>(null);
  const [mode, setMode] = useState<CountMode>('basic');
  const [resumeLimit, setResumeLimit] = useState<number | null>(null);

  const countStats = useCallback((str: string): TextStats => {
    const characters = str.length;
    const charactersNoSpace = str.replace(/\s/g, '').length;
    
    // 단어 수 (영어/한글 모두 고려)
    const words = str.trim() === '' 
      ? 0 
      : str.trim().split(/\s+/).filter(w => w.length > 0).length;
    
    // 문장 수 (마침표, 물음표, 느낌표 기준)
    const sentences = str.trim() === ''
      ? 0
      : str.split(/[.!?。？！]+/).filter(s => s.trim().length > 0).length;
    
    // 단락 수 (빈 줄 기준)
    const paragraphs = str.trim() === ''
      ? 0
      : str.split(/\n\s*\n/).filter(p => p.trim().length > 0).length || (str.trim() ? 1 : 0);
    
    // 줄 수
    const lines = str.trim() === ''
      ? 0
      : str.split('\n').length;
    
    // 바이트 수 (UTF-8)
    const bytes = new TextEncoder().encode(str).length;
    const bytesNoSpace = new TextEncoder().encode(str.replace(/\s/g, '')).length;

    return { characters, charactersNoSpace, words, sentences, paragraphs, lines, bytes, bytesNoSpace };
  }, []);

  const stats = countStats(text);

  const getProgressColor = (current: number, limit: number) => {
    const percent = (current / limit) * 100;
    if (percent >= 100) return 'bg-red-500';
    if (percent >= 90) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const clearText = () => setText('');
  const copyText = async () => {
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* 모드 선택 */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            setMode('basic');
            setResumeLimit(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            mode === 'basic'
              ? 'bg-ai-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📊 {basicMode}
        </button>
        <button
          onClick={() => {
            setMode('resume');
            setSelectedLimit(null);
          }}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
            mode === 'resume'
              ? 'bg-ai-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          📝 {resumeMode}
        </button>
      </div>

      {/* 텍스트 입력 */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={mode === 'resume' ? resumePlaceholder : basicPlaceholder}
          className="w-full h-48 md:h-64 p-4 text-lg border-2 border-gray-200 rounded-2xl resize-none focus:border-ai-primary focus:outline-none transition-colors"
        />
        {text && (
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={copyText}
              className="p-2 bg-white/90 hover:bg-gray-100 rounded-lg text-sm"
              title={copy}
            >
              📋
            </button>
            <button
              onClick={clearText}
              className="p-2 bg-white/90 hover:bg-gray-100 rounded-lg text-sm"
              title={clear}
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* 자소서 모드 - 글자 수 제한 프리셋 */}
      {mode === 'resume' && (
        <div>
          <p className="font-semibold text-gray-700 mb-3">📋 {resumeCharLimit}</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {RESUME_PRESETS_KEYS.map((item) => (
              <button
                key={item.charLimit}
                onClick={() => setResumeLimit(resumeLimit === item.charLimit ? null : item.charLimit)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  resumeLimit === item.charLimit
                    ? 'border-ai-primary bg-ai-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xl block mb-1">{item.icon}</span>
                <span className="font-medium text-gray-700 text-sm">{translations[item.key]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 자소서 모드 - 진행 상황 */}
      {mode === 'resume' && resumeLimit && (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 border-2 border-ai-primary/20">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-lg text-gray-800">
              📝 {stats.charactersNoSpace.toLocaleString()} / {resumeLimit.toLocaleString()}{char}
              <span className="text-sm font-normal text-gray-500 ml-2">({excludingSpaces})</span>
            </span>
            <span className={`text-lg font-bold ${stats.charactersNoSpace > resumeLimit ? 'text-red-500' : 'text-green-600'}`}>
              {stats.charactersNoSpace > resumeLimit 
                ? `${(stats.charactersNoSpace - resumeLimit).toLocaleString()}${charExceeded}` 
                : `${(resumeLimit - stats.charactersNoSpace).toLocaleString()}${charRemaining}`}
            </span>
          </div>
          <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getProgressColor(stats.charactersNoSpace, resumeLimit)}`}
              style={{ width: `${Math.min((stats.charactersNoSpace / resumeLimit) * 100, 100)}%` }}
            />
          </div>
          <div className="mt-3 text-sm text-gray-600 flex justify-between">
            <span>{progress}: {((stats.charactersNoSpace / resumeLimit) * 100).toFixed(1)}%</span>
            <span className={stats.charactersNoSpace >= resumeLimit * 0.9 && stats.charactersNoSpace <= resumeLimit ? 'text-green-600 font-medium' : ''}>
              {stats.charactersNoSpace >= resumeLimit * 0.9 && stats.charactersNoSpace <= resumeLimit && `✅ ${appropriateLength}`}
            </span>
          </div>
        </div>
      )}

      {/* 기본 모드 - 제한 프리셋 */}
      {mode === 'basic' && (
        <div>
          <p className="font-semibold text-gray-700 mb-3">📏 {charLimitCheck}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SAMPLE_TEXTS_KEYS.map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedLimit(selectedLimit === item.limit ? null : item.limit)}
                className={`p-3 rounded-xl border-2 transition-all ${
                  selectedLimit === item.limit
                    ? 'border-ai-primary bg-ai-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl block mb-1">{item.icon}</span>
                <span className="font-medium text-gray-700 block text-sm">{translations[item.key]}</span>
                <span className="text-xs text-gray-500">{item.limit}{char}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 기본 모드 - 제한 진행바 */}
      {mode === 'basic' && selectedLimit && (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-gray-700">
              {stats.characters} / {selectedLimit}{char}
            </span>
            <span className={`text-sm font-bold ${stats.characters > selectedLimit ? 'text-red-500' : 'text-green-600'}`}>
              {stats.characters > selectedLimit 
                ? `${stats.characters - selectedLimit}${charExceeded}` 
                : `${selectedLimit - stats.characters}${charRemaining}`}
            </span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getProgressColor(stats.characters, selectedLimit)}`}
              style={{ width: `${Math.min((stats.characters / selectedLimit) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* 통계 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{stats.characters.toLocaleString()}</p>
          <p className="text-sm text-blue-700 mt-1">{totalChars}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{stats.charactersNoSpace.toLocaleString()}</p>
          <p className="text-sm text-purple-700 mt-1">{excludeSpaces}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{stats.words.toLocaleString()}</p>
          <p className="text-sm text-green-700 mt-1">{words}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">{stats.sentences.toLocaleString()}</p>
          <p className="text-sm text-yellow-700 mt-1">{sentences}</p>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-pink-600">{stats.paragraphs.toLocaleString()}</p>
          <p className="text-sm text-pink-700 mt-1">{paragraphs}</p>
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-indigo-600">{stats.bytes.toLocaleString()}</p>
          <p className="text-sm text-indigo-700 mt-1">{bytes}</p>
        </div>
      </div>

      {/* 추가 정보 */}
      {text && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="font-semibold text-gray-700 mb-3">📊 {additionalInfo}</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{lineCount}</span>
              <span className="font-medium">{stats.lines}{lines}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{bytesExcludingSpaces}</span>
              <span className="font-medium">{stats.bytesNoSpace.toLocaleString()} bytes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{avgWordLength}</span>
              <span className="font-medium">
                {stats.words > 0 ? (stats.charactersNoSpace / stats.words).toFixed(1) : 0}{char}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{readingTime}</span>
              <span className="font-medium">{approx} {Math.ceil(stats.words / 200)}{minutes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{speakingTime}</span>
              <span className="font-medium">{approx} {Math.ceil(stats.words / 130)}{minutes}</span>
            </div>
            {mode === 'resume' && (
              <div className="flex justify-between">
                <span className="text-gray-600">{koreanCharCount}</span>
                <span className="font-medium">
                  {(text.match(/[가-힣]/g) || []).length}{char}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
