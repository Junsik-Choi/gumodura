# 🔮 그 뭐더라 - 생활 도구 종합 웹사이트

> 어르신도 쓰기 쉬운 생활, 파일, 놀이 도구 종합 웹사이트

## ✨ 주요 기능

- **AI 기능 검색**: 필요한 기능을 자연어로 물어보면 적합한 도구를 추천
- **카테고리별 분류**: 파일, 이미지, QR, 텍스트, 계산, 생활, 재미 도구
- **반응형 디자인**: 모바일 우선, 어르신 친화적 UI
- **확장 가능한 구조**: 새 기능 추가가 쉬운 레지스트리 기반 설계

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Libraries**: jsPDF, qrcode

## 🚀 시작하기

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 빌드

```bash
npm run build
npm start
```

## 📁 프로젝트 구조

```
src/
├── app/                  # Next.js App Router
│   ├── api/              # API Routes
│   ├── ai-search/        # AI 검색 결과 페이지
│   ├── category/[id]/    # 카테고리 페이지
│   ├── tools/[id]/       # 도구 페이지
│   └── page.tsx          # 홈페이지
├── components/           # React 컴포넌트
│   ├── tools/            # 개별 도구 컴포넌트
│   └── ...               # 공통 컴포넌트
└── lib/                  # 유틸리티 & 설정
    ├── registry.ts       # 도구 레지스트리 (핵심!)
    ├── categories.ts     # 카테고리 정의
    ├── search.ts         # 검색 로직
    └── types.ts          # 타입 정의
```

## 📖 기능 추가 방법

새 기능을 추가하려면 [EXTENSION_GUIDE.md](./EXTENSION_GUIDE.md)를 참조하세요.

간단 요약:
1. `src/lib/registry.ts`에 도구 정보 추가
2. `src/components/tools/`에 컴포넌트 생성
3. `src/app/tools/[id]/page.tsx`에 매핑 추가

## 🎨 디자인 원칙

- **접근성**: 큰 폰트, 명확한 대비, 충분한 버튼 크기
- **미니멀리즘**: 깔끔하고 집중된 UI
- **반응형**: 모바일 우선 설계
- **진행 표시**: 모든 처리에 단계/퍼센트 게이지 표시

## 📄 라이선스

MIT License
