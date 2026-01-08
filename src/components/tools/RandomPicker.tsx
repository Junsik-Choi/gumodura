'use client';

import { useState, useCallback } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

interface Item {
  id: number;
  text: string;
}

const SAMPLE_LISTS_DATA = [
  { nameKey: '점심 메뉴', icon: '🍽️', items: ['김치찌개', '된장찌개', '비빔밥', '냉면', '라면', '짜장면', '짬뽕', '치킨', '피자', '햄버거'] },
  { nameKey: '숫자 1-10', icon: '🔢', items: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
  { nameKey: '가위바위보', icon: '✊', items: ['가위', '바위', '보'] },
  { nameKey: '동전 던지기', icon: '🪙', items: ['앞면', '뒷면'] },
];

export default function RandomPicker() {
  const [
    lunchMenuLabel,
    numbers1to10Label,
    rockPaperScissorsLabel,
    coinFlipLabel,
    sampleListsLabel,
    inputPlaceholder,
    addLabel,
    multiLineLabel,
    multiLinePlaceholder,
    itemListLabel,
    countLabel,
    clearAllLabel,
    pickCountLabel,
    excludePickedLabel,
    resetExcludedLabel,
    spinningLabel,
    pickButtonLabel,
    allPickedLabel,
    congratsLabel,
    historyLabel,
  ] = useTranslatedTexts([
    '점심 메뉴',
    '숫자 1-10',
    '가위바위보',
    '동전 던지기',
    '🎯 샘플 목록',
    '항목 입력 (Enter로 추가)',
    '추가',
    '여러 줄 한번에 입력하기',
    '한 줄에 하나씩 입력 후 버튼 클릭',
    '📋 항목 목록',
    '개',
    '전체 삭제',
    '뽑을 개수:',
    '뽑은 항목 제외',
    '제외 목록 초기화',
    '🎰 뽑는 중...',
    '🎲 랜덤 뽑기!',
    '모든 항목을 뽑았습니다!',
    '축하합니다!',
    '📜 기록',
  ]);

  // Create a lookup object for dynamic sample name access
  const sampleNameTranslations: Record<string, string> = {
    '점심 메뉴': lunchMenuLabel,
    '숫자 1-10': numbers1to10Label,
    '가위바위보': rockPaperScissorsLabel,
    '동전 던지기': coinFlipLabel,
  };

  const SAMPLE_LISTS = SAMPLE_LISTS_DATA.map((sample) => ({
    ...sample,
    name: sampleNameTranslations[sample.nameKey] || sample.nameKey,
  }));

  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [pickCount, setPicnkCount] = useState(1);
  const [excludePicked, setExcludePicked] = useState(false);
  const [pickedItems, setPickedItems] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  const addItem = () => {
    const trimmed = newItem.trim();
    if (trimmed) {
      setItems((prev) => [...prev, { id: Date.now(), text: trimmed }]);
      setNewItem('');
    }
  };

  const addMultipleItems = (text: string) => {
    const lines = text.split('\n').map((s) => s.trim()).filter((s) => s.length > 0);
    const newItems = lines.map((text, i) => ({ id: Date.now() + i, text }));
    setItems((prev) => [...prev, ...newItems]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearAll = () => {
    setItems([]);
    setResult(null);
    setPickedItems([]);
    setHistory([]);
  };

  const loadSample = (sampleItems: string[]) => {
    const newItems = sampleItems.map((text, i) => ({ id: Date.now() + i, text }));
    setItems(newItems);
    setResult(null);
    setPickedItems([]);
  };

  const pick = useCallback(() => {
    const availableItems = excludePicked 
      ? items.filter(item => !pickedItems.includes(item.text))
      : items;

    if (availableItems.length === 0) {
      if (excludePicked && pickedItems.length > 0) {
        setResult(allPickedLabel);
      }
      return;
    }

    setIsSpinning(true);
    setResult(null);

    // 애니메이션 효과
    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      setResult(randomItem.text);
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        
        // 최종 선택
        const picks: string[] = [];
        const tempAvailable = [...availableItems];
        
        for (let i = 0; i < Math.min(pickCount, tempAvailable.length); i++) {
          const randomIndex = Math.floor(Math.random() * tempAvailable.length);
          picks.push(tempAvailable[randomIndex].text);
          tempAvailable.splice(randomIndex, 1);
        }
        
        const finalResult = picks.join(', ');
        setResult(finalResult);
        setHistory((prev) => [finalResult, ...prev.slice(0, 9)]);
        
        if (excludePicked) {
          setPickedItems((prev) => [...prev, ...picks]);
        }
        
        setIsSpinning(false);
      }
    }, 80);
  }, [items, pickCount, excludePicked, pickedItems]);

  const resetPicked = () => {
    setPickedItems([]);
    setResult(null);
  };

  return (
    <div className="space-y-6">
      {/* 샘플 목록 */}
      <div>
        <p className="font-semibold text-gray-700 mb-3">{sampleListsLabel}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SAMPLE_LISTS.map((sample) => (
            <button
              key={sample.name}
              onClick={() => loadSample(sample.items)}
              className="p-3 rounded-xl border-2 border-gray-200 hover:border-ai-primary hover:bg-ai-primary/5 transition-all"
            >
              <span className="text-2xl block mb-1">{sample.icon}</span>
              <span className="font-medium text-gray-700 text-sm">{sample.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 항목 입력 */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addItem()}
            placeholder={inputPlaceholder}
            className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
          />
          <button
            onClick={addItem}
            className="px-4 py-3 bg-ai-primary text-white font-medium rounded-xl hover:bg-ai-primary-dark transition-colors"
          >
            {addLabel}
          </button>
        </div>
        
        <details className="text-sm text-gray-500">
          <summary className="cursor-pointer hover:text-gray-700">{multiLineLabel}</summary>
          <textarea
            placeholder={multiLinePlaceholder}
            className="w-full mt-2 p-3 border-2 border-gray-200 rounded-xl resize-none h-24"
            onBlur={(e) => {
              if (e.target.value.trim()) {
                addMultipleItems(e.target.value);
                e.target.value = '';
              }
            }}
          />
        </details>
      </div>

      {/* 항목 목록 */}
      {items.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="font-semibold text-gray-700">{itemListLabel} ({items.length}{countLabel})</p>
            <button
              onClick={clearAll}
              className="text-sm text-red-500 hover:text-red-700"
            >
              {clearAllLabel}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <span
                key={item.id}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm ${
                  pickedItems.includes(item.text)
                    ? 'bg-gray-200 text-gray-400 line-through'
                    : 'bg-ai-primary/10 text-ai-primary'
                }`}
              >
                {item.text}
                <button
                  onClick={() => removeItem(item.id)}
                  className="hover:text-red-500 ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 옵션 */}
      {items.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">{pickCountLabel}</label>
              <select
                value={pickCount}
                onChange={(e) => setPicnkCount(Number(e.target.value))}
                className="p-2 border-2 border-gray-200 rounded-lg bg-white"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}{countLabel}</option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={excludePicked}
                onChange={(e) => setExcludePicked(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-ai-primary focus:ring-ai-primary"
              />
              <span className="text-sm text-gray-700">{excludePickedLabel}</span>
            </label>

            {excludePicked && pickedItems.length > 0 && (
              <button
                onClick={resetPicked}
                className="text-sm text-ai-primary hover:underline"
              >
                {resetExcludedLabel}
              </button>
            )}
          </div>
        </div>
      )}

      {/* 뽑기 버튼 */}
      <button
        onClick={pick}
        disabled={items.length === 0 || isSpinning}
        className="w-full py-5 bg-gradient-to-r from-ai-primary to-purple-600 hover:from-ai-primary-dark hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-2xl rounded-2xl transition-all transform hover:scale-[1.02] disabled:scale-100"
      >
        {isSpinning ? spinningLabel : pickButtonLabel}
      </button>

      {/* 결과 */}
      {result && (
        <div className={`rounded-2xl p-8 text-center ${
          isSpinning 
            ? 'bg-gray-100' 
            : 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300'
        }`}>
          <p className={`font-bold ${isSpinning ? 'text-2xl text-gray-600' : 'text-4xl text-orange-600'}`}>
            {isSpinning ? result : `🎉 ${result}`}
          </p>
          {!isSpinning && result !== allPickedLabel && (
            <p className="text-gray-500 mt-2">{congratsLabel}</p>
          )}
        </div>
      )}

      {/* 히스토리 */}
      {history.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="font-semibold text-gray-700 mb-3">{historyLabel}</p>
          <div className="space-y-2">
            {history.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-gray-400">{history.length - index}.</span>
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
