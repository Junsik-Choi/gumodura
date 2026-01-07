# 🔮 그 뭐더라 - 기능 추가 가이드

> 새로운 기능(도구)을 추가하는 방법을 5단계로 안내합니다.

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── api/
│   │   ├── ai-search/route.ts    # AI 검색 API
│   │   └── feature-request/route.ts  # 기능 요청 API
│   ├── ai-search/page.tsx        # AI 검색 결과 페이지
│   ├── category/[id]/page.tsx    # 카테고리별 페이지
│   ├── tools/[id]/page.tsx       # 도구 동적 페이지
│   ├── layout.tsx                # 전체 레이아웃
│   ├── page.tsx                  # 홈페이지
│   └── globals.css               # 전역 스타일
├── components/
│   ├── tools/                    # 개별 도구 컴포넌트
│   │   ├── ImagesToPdf.tsx
│   │   ├── QrGenerator.tsx
│   │   └── ComingSoon.tsx
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ToolCard.tsx
│   ├── CategoryCard.tsx
│   └── ProgressIndicator.tsx
└── lib/
    ├── types.ts                  # 타입 정의
    ├── registry.ts               # ⭐ 도구 레지스트리 (핵심!)
    ├── categories.ts             # 카테고리 정보
    └── search.ts                 # 검색 로직
```

---

## 🚀 기능 추가 5단계

### Step 1: 레지스트리에 도구 등록

**파일**: `src/lib/registry.ts`

```typescript
// TOOLS_REGISTRY 배열에 새 항목 추가
{
  id: 'my-new-tool',              // URL에 사용될 ID (영문 소문자, 하이픈)
  name_ko: '나의 새 도구',          // 한글 이름
  description_ko: '이 도구가 하는 일을 설명해요',  // 한글 설명
  category: 'file',               // 카테고리 ID (types.ts 참조)
  keywords: [                     // 검색 키워드 (많을수록 좋음)
    '키워드1', '키워드2', '키워드3',
    '관련단어', '비슷한표현', '영어', 'english'
  ],
  route: '/tools/my-new-tool',    // 라우트 경로
  icon: '🆕',                      // 이모지 아이콘
  isNew: true,                    // 새 기능 뱃지 (선택)
  isPopular: false,               // 인기 뱃지 (선택)
  isPro: false,                   // 프로 기능 (선택)
},
```

**키워드 작성 팁**:
- 한글/영어 모두 포함
- 동의어, 유사어 포함
- 오타를 감안한 변형 포함
- 실제 사용자가 검색할 법한 표현 추가

---

### Step 2: 도구 컴포넌트 생성

**파일**: `src/components/tools/MyNewTool.tsx`

```typescript
'use client';

import { useState } from 'react';
import ProgressIndicator from '@/components/ProgressIndicator';

interface Step {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

export default function MyNewTool() {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [message, setMessage] = useState('');
  const [steps, setSteps] = useState<Step[]>([
    { id: 'step1', label: '1단계', status: 'pending' },
    { id: 'step2', label: '2단계', status: 'pending' },
    { id: 'step3', label: '3단계', status: 'pending' },
  ]);

  // 단계 상태 업데이트 헬퍼
  const updateStep = (stepIndex: number, status: Step['status']) => {
    setSteps(prev => prev.map((step, i) => ({
      ...step,
      status: i === stepIndex ? status : (i < stepIndex ? 'completed' : step.status),
    })));
    setCurrentStep(stepIndex);
  };

  const handleProcess = async () => {
    setProcessing(true);
    
    try {
      // Step 1
      updateStep(0, 'in-progress');
      setMessage('1단계 처리 중...');
      // ... 로직
      setProgress(33);
      updateStep(0, 'completed');

      // Step 2
      updateStep(1, 'in-progress');
      setMessage('2단계 처리 중...');
      // ... 로직
      setProgress(66);
      updateStep(1, 'completed');

      // Step 3
      updateStep(2, 'in-progress');
      setMessage('완료!');
      setProgress(100);
      updateStep(2, 'completed');

    } catch (error) {
      setMessage('오류가 발생했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 입력 UI */}
      {!processing && (
        <div>
          {/* 여기에 입력 UI 구현 */}
          <button
            onClick={handleProcess}
            className="w-full py-4 bg-ai-primary hover:bg-ai-primary-dark text-white font-bold text-xl rounded-2xl"
          >
            시작하기
          </button>
        </div>
      )}

      {/* 진행 상태 */}
      {processing && (
        <ProgressIndicator
          steps={steps}
          currentStep={currentStep}
          progress={progress}
          message={message}
          showDebug={process.env.NODE_ENV === 'development'}
        />
      )}
    </div>
  );
}
```

---

### Step 3: 페이지에 컴포넌트 연결

**파일**: `src/app/tools/[id]/page.tsx`

```typescript
// 상단 import 추가
import MyNewTool from '@/components/tools/MyNewTool';

// toolComponents 객체에 추가
const toolComponents: Record<string, React.ComponentType> = {
  'images-to-pdf': ImagesToPdf,
  'qr-generator': QrGenerator,
  'my-new-tool': MyNewTool,  // ← 추가!
};
```

---

### Step 4: 테스트

```bash
# 개발 서버 실행
npm run dev

# 테스트할 것들:
# 1. 홈페이지에서 도구 카드 표시 확인
# 2. 직접 URL 접근: /tools/my-new-tool
# 3. AI 검색으로 찾기: 키워드 검색
# 4. 카테고리 페이지에서 확인
```

---

### Step 5: (선택) 카테고리 추가

새 카테고리가 필요한 경우:

**파일**: `src/lib/types.ts`
```typescript
export type ToolCategory = 
  | 'file'
  | 'image'
  // ... 기존 카테고리
  | 'my-category';  // ← 추가!
```

**파일**: `src/lib/categories.ts`
```typescript
export const CATEGORIES: CategoryMeta[] = [
  // ... 기존 카테고리
  {
    id: 'my-category',
    name_ko: '나의 카테고리',
    description_ko: '카테고리 설명',
    icon: '🆕',
    color: 'bg-indigo-500',
  },
];
```

---

## 📋 체크리스트

새 기능 추가 전 확인:

- [ ] `registry.ts`에 도구 정보 추가
- [ ] `keywords` 충분히 작성 (10개 이상 권장)
- [ ] 컴포넌트 파일 생성 (`components/tools/`)
- [ ] `tools/[id]/page.tsx`에 import 및 매핑 추가
- [ ] 진행 상태 표시 (ProgressIndicator) 적용
- [ ] 모바일 반응형 테스트
- [ ] AI 검색 테스트

---

## 💡 팁

### 1. 접근성 (어르신 친화적)
- 폰트 크기: 최소 16px (모바일 18px)
- 버튼 크기: 최소 44x44px
- 색상 대비: 4.5:1 이상
- 명확한 레이블과 안내 문구

### 2. 진행 상태 표시
- 모든 처리 과정에 ProgressIndicator 사용
- 각 단계별로 명확한 메시지 제공
- 디버그 모드(`showDebug`)로 개발 시 확인

### 3. 에러 처리
- try-catch로 모든 비동기 작업 감싸기
- 사용자 친화적인 에러 메시지
- 에러 시 상태 복구 가능하도록

### 4. 검색 최적화
- 키워드에 오타 변형 추가
- 동의어, 유사어 모두 포함
- 초성 검색 자동 지원

---

## 🔧 유용한 명령어

```bash
# 개발 서버
npm run dev

# 빌드
npm run build

# 린트
npm run lint

# 타입 체크
npx tsc --noEmit
```

---

## 📞 문의

기능 추가 중 문제가 있으면:
1. 기존 도구 코드 참고 (`ImagesToPdf.tsx`, `QrGenerator.tsx`)
2. `types.ts` 타입 정의 확인
3. 콘솔 에러 메시지 확인

Happy Coding! 🚀
