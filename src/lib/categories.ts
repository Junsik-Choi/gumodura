import { CategoryMeta, ToolCategory } from './types';

/**
 * 카테고리 메타 정보
 * 새 카테고리 추가 시 여기에 정의
 */
export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'file',
    name_ko: '파일 도구',
    name_en: 'File Tools',
    description_ko: 'PDF, 압축, 변환 등',
    description_en: 'PDF, compression, conversion',
    icon: '📁',
    color: 'bg-blue-500',
  },
  {
    id: 'image',
    name_ko: '이미지 도구',
    name_en: 'Image Tools',
    description_ko: '크기 조절, 변환, 편집',
    description_en: 'Resize, convert, edit',
    icon: '🖼️',
    color: 'bg-green-500',
  },
  {
    id: 'qr',
    name_ko: 'QR/바코드',
    name_en: 'QR/Barcode',
    description_ko: 'QR 생성, 스캔, 바코드',
    description_en: 'QR generation, scan, barcode',
    icon: '📱',
    color: 'bg-purple-500',
  },
  {
    id: 'text',
    name_ko: '텍스트 도구',
    name_en: 'Text Tools',
    description_ko: '글자 수, 변환, 비교',
    description_en: 'Character count, convert, compare',
    icon: '📝',
    color: 'bg-yellow-500',
  },
  {
    id: 'calc',
    name_ko: '계산/변환',
    name_en: 'Calculate/Convert',
    description_ko: '단위 변환, 계산기',
    description_en: 'Unit conversion, calculator',
    icon: '🔢',
    color: 'bg-red-500',
  },
  {
    id: 'life',
    name_ko: '생활 도구',
    name_en: 'Life Tools',
    description_ko: '날씨, 시간, 일정',
    description_en: 'Weather, time, schedule',
    icon: '🏠',
    color: 'bg-teal-500',
  },
  {
    id: 'fun',
    name_ko: '재미/놀이',
    name_en: 'Fun/Games',
    description_ko: '랜덤, 게임, 뽑기',
    description_en: 'Random, games, picker',
    icon: '🎮',
    color: 'bg-pink-500',
  },
  {
    id: 'finance',
    name_ko: '금융 계산기',
    name_en: 'Finance Calculator',
    description_ko: '연봉, 이자, 세금 계산',
    description_en: 'Salary, interest, tax calculation',
    icon: '💰',
    color: 'bg-emerald-500',
  },
  {
    id: 'health',
    name_ko: '건강/반려동물',
    name_en: 'Health/Pets',
    description_ko: 'BMI, 칼로리 계산',
    description_en: 'BMI, calorie calculation',
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
