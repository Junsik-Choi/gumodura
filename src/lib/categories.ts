import { CategoryMeta, ToolCategory } from './types';

/**
 * 카테고리 메타 정보
 * 새 카테고리 추가 시 여기에 정의
 */
export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'file',
    name_ko: '파일 도구',
    description_ko: 'PDF, 압축, 변환 등',
    icon: '📁',
    color: 'bg-blue-500',
  },
  {
    id: 'image',
    name_ko: '이미지 도구',
    description_ko: '크기 조절, 변환, 편집',
    icon: '🖼️',
    color: 'bg-green-500',
  },
  {
    id: 'qr',
    name_ko: 'QR/바코드',
    description_ko: 'QR 생성, 스캔, 바코드',
    icon: '📱',
    color: 'bg-purple-500',
  },
  {
    id: 'text',
    name_ko: '텍스트 도구',
    description_ko: '글자 수, 변환, 비교',
    icon: '📝',
    color: 'bg-yellow-500',
  },
  {
    id: 'calc',
    name_ko: '계산/변환',
    description_ko: '단위 변환, 계산기',
    icon: '🔢',
    color: 'bg-red-500',
  },
  {
    id: 'life',
    name_ko: '생활 도구',
    description_ko: '날씨, 시간, 일정',
    icon: '🏠',
    color: 'bg-teal-500',
  },
  {
    id: 'fun',
    name_ko: '재미/놀이',
    description_ko: '랜덤, 게임, 뽑기',
    icon: '🎮',
    color: 'bg-pink-500',
  },
  {
    id: 'finance',
    name_ko: '금융 계산기',
    description_ko: '연봉, 이자, 세금 계산',
    icon: '💰',
    color: 'bg-emerald-500',
  },
  {
    id: 'health',
    name_ko: '건강/반려동물',
    description_ko: 'BMI, 칼로리 계산',
    icon: '🏥',
    color: 'bg-rose-500',
  },
];

/**
 * 카테고리 ID로 메타 정보 조회
 */
export function getCategoryMeta(id: ToolCategory): CategoryMeta | undefined {
  return CATEGORIES.find(cat => cat.id === id);
}
