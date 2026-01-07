/**
 * 도구(기능) 레지스트리 타입 정의
 * 모든 기능은 이 인터페이스를 따라야 합니다
 */

// 카테고리 타입
export type ToolCategory = 
  | 'file'      // 파일 도구
  | 'image'     // 이미지 도구
  | 'qr'        // QR/바코드
  | 'text'      // 텍스트 도구
  | 'calc'      // 계산기/변환기
  | 'life'      // 생활 도구
  | 'fun';      // 재미/놀이

// 카테고리 메타 정보
export interface CategoryMeta {
  id: ToolCategory;
  name_ko: string;
  description_ko: string;
  icon: string;
  color: string;
}

// 도구 정의
export interface Tool {
  id: string;
  name_ko: string;
  description_ko: string;
  category: ToolCategory;
  keywords: string[];
  route: string;
  icon: string;
  isNew?: boolean;
  isPro?: boolean;
  isPopular?: boolean;
}

// AI 검색 결과 타입
export interface AISearchResult {
  top: Tool | null;
  alternatives: Tool[];
  confidence: number;
  no_match: boolean;
  query: string;
}

// 기능 요청 타입
export interface FeatureRequest {
  query: string;
  timestamp: string;
  user_agent: string;
  category_guess?: string;
}

// 검색 프로바이더 인터페이스 (확장성)
export interface SearchProvider {
  search(query: string, tools: Tool[]): Promise<AISearchResult>;
}
