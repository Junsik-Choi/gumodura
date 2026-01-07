import { Tool } from './types';

/**
 * 도구 레지스트리 (핵심!)
 * 
 * 새 기능 추가 시:
 * 1. 이 배열에 도구 정보 추가
 * 2. /src/app/tools/[id]/page.tsx에서 렌더링됨
 * 3. 개별 도구 컴포넌트는 /src/components/tools/에 생성
 */
export const TOOLS_REGISTRY: Tool[] = [
  // ============ 파일 도구 ============
  {
    id: 'images-to-pdf',
    name_ko: '이미지 → PDF 만들기',
    description_ko: '여러 장의 이미지를 하나의 PDF 파일로 합쳐요',
    category: 'file',
    keywords: [
      '이미지', '사진', 'PDF', '피디에프', '합치기', '변환',
      '여러장', '묶기', '문서', '스캔', 'jpg', 'png', 'jpeg',
      '사진 PDF', '이미지 합치기', '사진 합치기', '이미지 변환'
    ],
    route: '/tools/images-to-pdf/',
    icon: '📄',
    isNew: true,
    isPopular: true,
  },
  
  // ============ QR/바코드 도구 ============
  {
    id: 'qr-generator',
    name_ko: '예쁜 QR 코드 만들기',
    description_ko: '다양한 스타일의 QR 코드를 만들어요',
    category: 'qr',
    keywords: [
      'QR', 'QR코드', '큐알', '큐알코드', '생성', '만들기',
      '예쁜', '디자인', '링크', 'URL', '바코드', '명함',
      'QR 생성', 'QR 만들기', '큐알 만들기'
    ],
    route: '/tools/qr-generator/',
    icon: '📲',
    isNew: true,
    isPopular: true,
  },

  // ============ 이미지 도구 ============
  {
    id: 'image-resize',
    name_ko: '이미지 크기 조절',
    description_ko: '이미지 크기를 원하는 대로 바꿔요',
    category: 'image',
    keywords: [
      '이미지', '사진', '크기', '조절', '리사이즈', 'resize',
      '줄이기', '키우기', '변경', '픽셀', '확대', '축소'
    ],
    route: '/tools/image-resize/',
    icon: '🔍',
  },

  {
    id: 'image-compress',
    name_ko: '이미지 용량 줄이기',
    description_ko: '이미지 파일 용량을 줄여요',
    category: 'image',
    keywords: [
      '이미지', '사진', '용량', '줄이기', '압축', '최적화',
      '가볍게', '파일 크기', 'compress', 'MB', 'KB'
    ],
    route: '/tools/image-compress/',
    icon: '📉',
  },

  // ============ 텍스트 도구 ============
  {
    id: 'text-counter',
    name_ko: '글자 수 세기',
    description_ko: '글자, 단어, 문장 수를 세어요',
    category: 'text',
    keywords: [
      '글자', '문자', '단어', '수', '세기', '카운트', 'count',
      '글자수', '문자수', '띄어쓰기', '공백'
    ],
    route: '/tools/text-counter/',
    icon: '🔢',
  },

  // ============ 계산/변환 도구 ============
  {
    id: 'unit-converter',
    name_ko: '단위 변환기',
    description_ko: '길이, 무게, 온도 등 단위를 변환해요',
    category: 'calc',
    keywords: [
      '단위', '변환', 'cm', 'inch', 'kg', 'lb', '섭씨', '화씨',
      '길이', '무게', '온도', '미터', '킬로', '파운드'
    ],
    route: '/tools/unit-converter/',
    icon: '⚖️',
  },

  // ============ 생활 도구 ============
  {
    id: 'timer',
    name_ko: '타이머',
    description_ko: '시간을 설정하고 알림 받아요',
    category: 'life',
    keywords: [
      '타이머', '시간', '알람', '알림', 'timer', '초시계',
      '분', '초', '카운트다운', '요리'
    ],
    route: '/tools/timer/',
    icon: '⏱️',
  },

  // ============ 재미/놀이 도구 ============
  {
    id: 'random-picker',
    name_ko: '랜덤 뽑기',
    description_ko: '목록에서 무작위로 하나를 뽑아요',
    category: 'fun',
    keywords: [
      '랜덤', '무작위', '뽑기', '추첨', '제비뽑기', 'random',
      '선택', '고르기', '룰렛', '당첨'
    ],
    route: '/tools/random-picker/',
    icon: '🎲',
  },
];

/**
 * 도구 ID로 조회
 */
export function getToolById(id: string): Tool | undefined {
  return TOOLS_REGISTRY.find(tool => tool.id === id);
}

/**
 * 카테고리별 도구 조회
 */
export function getToolsByCategory(category: string): Tool[] {
  return TOOLS_REGISTRY.filter(tool => tool.category === category);
}

/**
 * 인기 도구 조회
 */
export function getPopularTools(): Tool[] {
  return TOOLS_REGISTRY.filter(tool => tool.isPopular);
}

/**
 * 새로 추가된 도구 조회
 */
export function getNewTools(): Tool[] {
  return TOOLS_REGISTRY.filter(tool => tool.isNew);
}

/**
 * 모든 도구 조회
 */
export function getAllTools(): Tool[] {
  return TOOLS_REGISTRY;
}
