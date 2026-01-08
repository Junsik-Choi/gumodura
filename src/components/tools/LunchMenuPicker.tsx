'use client';

import { useState, useCallback } from 'react';
import { useTranslatedTexts } from '@/lib/use-translations';

interface MenuCategory {
  id: string;
  name: string;
  emoji: string;
  menus: string[];
}

const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'korean',
    name: '한식',
    emoji: '🍚',
    menus: [
      '김치찌개', '된장찌개', '순두부찌개', '부대찌개', '비빔밥', '돌솥비빔밥',
      '불고기', '제육볶음', '삼겹살', '갈비탕', '설렁탕', '삼계탕',
      '김밥', '떡볶이', '라면', '칼국수', '냉면', '콩국수',
      '보쌈', '족발', '감자탕', '닭볶음탕', '해물탕', '순대국'
    ],
  },
  {
    id: 'chinese',
    name: '중식',
    emoji: '🥟',
    menus: [
      '짜장면', '짬뽕', '볶음밥', '잡채밥', '탕수육', '깐풍기',
      '마파두부', '고추잡채', '양장피', '유산슬', '팔보채', '난자완스',
      '깐쇼새우', '라조기', '동파육', '유린기', '마라탕', '훠궈'
    ],
  },
  {
    id: 'japanese',
    name: '일식',
    emoji: '🍣',
    menus: [
      '초밥', '사시미', '우동', '소바', '라멘', '돈카츠',
      '가츠동', '규동', '오야코동', '텐동', '오므라이스', '카레',
      '야키토리', '타코야키', '오코노미야키', '장어덮밥', '연어덮밥', '참치덮밥'
    ],
  },
  {
    id: 'western',
    name: '양식',
    emoji: '🍝',
    menus: [
      '파스타', '피자', '스테이크', '햄버거', '리조또', '샐러드',
      '그라탕', '라자냐', '필라프', '치킨까스', '생선까스', '오믈렛',
      '수프', '샌드위치', '브런치', '타코', '부리또', '나쵸'
    ],
  },
  {
    id: 'asian',
    name: '아시안',
    emoji: '🍜',
    menus: [
      '쌀국수', '팟타이', '똠양꿍', '분짜', '반미', '월남쌈',
      '나시고랭', '미고랭', '카레', '탄두리치킨', '난', '비리야니',
      '양꼬치', '마라샹궈', '훠궈', '딤섬', '팟카파오', '그린커리'
    ],
  },
  {
    id: 'snack',
    name: '분식/간식',
    emoji: '🍢',
    menus: [
      '떡볶이', '순대', '튀김', '김밥', '라면', '쫄면',
      '비빔국수', '잔치국수', '어묵탕', '핫도그', '토스트', '붕어빵',
      '호떡', '만두', '찐빵', '컵밥', '삼각김밥', '도시락'
    ],
  },
  {
    id: 'chicken',
    name: '치킨',
    emoji: '🍗',
    menus: [
      '후라이드', '양념치킨', '간장치킨', '마늘치킨', '허니버터', '파닭',
      '뿌링클', '고추바사삭', '굽네치킨', 'BBQ황금올리브', '교촌허니콤보',
      '네네치킨', '페리카나', '치킨플러스', '맥시카나', '멕시칸치킨'
    ],
  },
  {
    id: 'fastfood',
    name: '패스트푸드',
    emoji: '🍔',
    menus: [
      '빅맥', '와퍼', '불고기버거', '새우버거', '치킨버거', '치즈버거',
      '프렌치프라이', '어니언링', '너겟', '핫윙', '콜슬로', '애플파이',
      '맥모닝', '써브웨이', '타코벨', '피자헛', '도미노피자', '파파존스'
    ],
  },
];

export default function LunchMenuPicker() {
  const texts = useTranslatedTexts([
    '🏷️ 카테고리 선택',
    '전체선택',
    '전체해제',
    '선택된 카테고리:',
    '개',
    '총 메뉴:',
    '🎰 돌리는 중...',
    '🎲 점심 메뉴 뽑기!',
    '🎉 오늘의 점심은!',
    '맛있게 드세요~ 😋',
    '🔄 다시 뽑기',
    '네이버 지도',
    '구글 지도',
    '📜 최근 뽑기 기록',
    '💡 사용 팁',
    '먹고 싶은 카테고리만 선택해서 뽑아보세요',
    '"주변 맛집 찾기" 버튼으로 바로 검색할 수 있어요',
    '친구들과 함께 뽑으면 더 재미있어요!',
    '계속 다시 뽑지 말고 처음 나온 걸로 도전해보세요 😄',
  ]);

  const [
    categorySelectionTitle,
    selectAllText,
    deselectAllText,
    selectedCategoriesLabel,
    countUnit,
    totalMenuLabel,
    spinningText,
    pickButtonText,
    resultTitle,
    enjoyMealText,
    retryText,
    naverMapText,
    googleMapText,
    historyTitle,
    tipsTitle,
    tip1,
    tip2,
    tip3,
    tip4,
  ] = texts;

  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(MENU_CATEGORIES.map((c) => c.id))
  );
  const [result, setResult] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedCategories(new Set(MENU_CATEGORIES.map((c) => c.id)));
  };

  const deselectAll = () => {
    setSelectedCategories(new Set());
  };

  const pickMenu = useCallback(() => {
    const availableMenus = MENU_CATEGORIES
      .filter((c) => selectedCategories.has(c.id))
      .flatMap((c) => c.menus);

    if (availableMenus.length === 0) return;

    setIsSpinning(true);
    setResult(null);

    // 룰렛 효과
    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableMenus.length);
      setResult(availableMenus[randomIndex]);
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        const finalIndex = Math.floor(Math.random() * availableMenus.length);
        const finalMenu = availableMenus[finalIndex];
        setResult(finalMenu);
        setIsSpinning(false);
        setHistory((prev) => [finalMenu, ...prev.slice(0, 9)]);
      }
    }, 100);
  }, [selectedCategories]);

  const getMenuEmoji = (menu: string): string => {
    for (const category of MENU_CATEGORIES) {
      if (category.menus.includes(menu)) {
        return category.emoji;
      }
    }
    return '🍽️';
  };

  return (
    <div className="space-y-6">
      {/* 카테고리 선택 */}
      <div className="bg-gray-50 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-gray-700">{categorySelectionTitle}</h3>
          <div className="space-x-2">
            <button
              onClick={selectAll}
              className="text-sm text-ai-primary hover:underline"
            >
              {selectAllText}
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={deselectAll}
              className="text-sm text-gray-500 hover:underline"
            >
              {deselectAllText}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MENU_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`py-3 px-2 rounded-xl font-medium transition-all ${
                selectedCategories.has(category.id)
                  ? 'bg-ai-primary text-white'
                  : 'bg-white border-2 border-gray-200 text-gray-500'
              }`}
            >
              {category.emoji} {category.name}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          {selectedCategoriesLabel}{' '}
          <span className="font-medium text-ai-primary">
            {selectedCategories.size}{countUnit}
          </span>
          {' / '}
          {totalMenuLabel}{' '}
          <span className="font-medium">
            {MENU_CATEGORIES.filter((c) => selectedCategories.has(c.id))
              .reduce((sum, c) => sum + c.menus.length, 0)}{countUnit}
          </span>
        </p>
      </div>

      {/* 룰렛 버튼 */}
      <button
        onClick={pickMenu}
        disabled={isSpinning || selectedCategories.size === 0}
        className={`w-full py-6 rounded-2xl text-2xl font-bold transition-all ${
          isSpinning
            ? 'bg-gray-400 cursor-not-allowed'
            : selectedCategories.size === 0
            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
            : 'bg-gradient-to-r from-ai-primary to-purple-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg'
        }`}
      >
        {isSpinning ? spinningText : pickButtonText}
      </button>

      {/* 결과 */}
      {result && (
        <div
          className={`bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white text-center transition-all ${
            isSpinning ? 'opacity-70 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          <p className="text-lg opacity-90 mb-2">
            {isSpinning ? spinningText : resultTitle}
          </p>
          <p className="text-5xl font-bold mb-2">
            {getMenuEmoji(result)} {result}
          </p>
          {!isSpinning && (
            <p className="text-sm opacity-80">{enjoyMealText}</p>
          )}
        </div>
      )}

      {/* 다시 뽑기 / 맛집 찾기 */}
      {result && !isSpinning && (
        <div className="space-y-3">
          <button
            onClick={pickMenu}
            className="w-full py-4 bg-white border-2 border-ai-primary text-ai-primary rounded-xl font-bold hover:bg-ai-primary/5 transition-colors"
          >
            {retryText}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                const menu = result;
                window.open(
                  `https://map.naver.com/v5/search/${encodeURIComponent(menu + ' 맛집')}`,
                  '_blank'
                );
              }}
              className="py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C7.03 2 3 6.03 3 11c0 4.17 2.77 7.7 6.57 8.85L12 22l2.43-2.15C18.23 18.7 21 15.17 21 11c0-4.97-4.03-9-9-9zm0 12c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
              </svg>
              {naverMapText}
            </button>
            <button
              onClick={() => {
                const menu = result;
                window.open(
                  `https://www.google.com/maps/search/${encodeURIComponent(menu + ' 맛집')}`,
                  '_blank'
                );
              }}
              className="py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              {googleMapText}
            </button>
          </div>
        </div>
      )}

      {/* 최근 뽑기 기록 */}
      {history.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-bold text-gray-700 mb-3">{historyTitle}</h3>
          <div className="flex flex-wrap gap-2">
            {history.map((menu, index) => (
              <span
                key={`${menu}-${index}`}
                className="px-3 py-1 bg-white rounded-full text-sm border border-gray-200"
              >
                {getMenuEmoji(menu)} {menu}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 사용 팁 */}
      <div className="bg-yellow-50 rounded-xl p-4">
        <h3 className="font-bold text-yellow-800 mb-2">{tipsTitle}</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• {tip1}</li>
          <li>• {tip2}</li>
          <li>• {tip3}</li>
          <li>• {tip4}</li>
        </ul>
      </div>
    </div>
  );
}
