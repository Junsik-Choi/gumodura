import { Tool, AISearchResult } from './types';
import { TOOLS_REGISTRY } from './registry';

/**
 * 클라이언트 사이드 검색 (GitHub Pages용)
 * API 라우트 대신 브라우저에서 직접 실행
 */

// 한글 자모 분리 (초성 검색용)
const CHOSUNG = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

function getChosung(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i) - 44032;
    if (code >= 0 && code <= 11171) {
      result += CHOSUNG[Math.floor(code / 588)];
    }
  }
  return result;
}

// 문자열 정규화
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
}

// Levenshtein 거리 (편집 거리)
function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}

// 유사도 계산 (0-1)
function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

// 도구별 점수 계산
function calculateScore(tool: Tool, query: string): number {
  const normalizedQuery = normalize(query);
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const queryChosung = getChosung(query);
  
  let score = 0;
  
  // 1. 이름 완전 일치 (가장 높은 점수)
  if (normalize(tool.name_ko).includes(normalizedQuery)) {
    score += 100;
  }
  
  // 2. 이름 유사도
  score += similarity(normalize(tool.name_ko), normalizedQuery) * 50;
  
  // 3. 설명에 포함
  if (normalize(tool.description_ko).includes(normalizedQuery)) {
    score += 30;
  }
  
  // 4. 키워드 매칭
  for (const keyword of tool.keywords) {
    const normalizedKeyword = normalize(keyword);
    
    // 정확히 일치
    if (normalizedKeyword === normalizedQuery) {
      score += 80;
      continue;
    }
    
    // 부분 일치
    if (normalizedKeyword.includes(normalizedQuery) || normalizedQuery.includes(normalizedKeyword)) {
      score += 40;
      continue;
    }
    
    // 각 단어별 매칭
    for (const word of queryWords) {
      const normalizedWord = normalize(word);
      if (normalizedKeyword.includes(normalizedWord) || normalizedWord.includes(normalizedKeyword)) {
        score += 25;
      }
      // 유사도
      const sim = similarity(normalizedKeyword, normalizedWord);
      if (sim > 0.6) {
        score += sim * 20;
      }
    }
  }
  
  // 5. 초성 검색
  const nameChosung = getChosung(tool.name_ko);
  if (nameChosung.includes(queryChosung) && queryChosung.length >= 2) {
    score += 30;
  }
  
  return score;
}

/**
 * 클라이언트 사이드 AI 검색
 */
export function clientSearch(query: string): AISearchResult {
  if (!query.trim()) {
    return {
      top: null,
      alternatives: [],
      confidence: 0,
      no_match: true,
      query,
    };
  }
  
  const tools = TOOLS_REGISTRY;
  
  // 모든 도구에 점수 부여
  const scored = tools.map(tool => ({
    tool,
    score: calculateScore(tool, query),
  }));
  
  // 점수순 정렬
  scored.sort((a, b) => b.score - a.score);
  
  // 상위 결과 추출
  const topResult = scored[0];
  const alternatives = scored.slice(1, 5);
  
  // 신뢰도 계산 (최대 점수 기준)
  const maxPossibleScore = 250;
  const confidence = Math.min(topResult?.score || 0, maxPossibleScore) / maxPossibleScore;
  
  // 임계치 (0.15 이상이면 매칭 성공)
  const CONFIDENCE_THRESHOLD = 0.15;
  const no_match = confidence < CONFIDENCE_THRESHOLD;
  
  return {
    top: no_match ? null : topResult?.tool || null,
    alternatives: no_match 
      ? [] 
      : alternatives.filter(a => a.score > 10).map(a => a.tool),
    confidence,
    no_match,
    query,
  };
}

/**
 * 기능 요청 저장 (localStorage 사용)
 */
export function saveFeatureRequest(query: string): boolean {
  try {
    const requests = JSON.parse(localStorage.getItem('feature-requests') || '[]');
    requests.push({
      query,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    });
    localStorage.setItem('feature-requests', JSON.stringify(requests));
    return true;
  } catch {
    return false;
  }
}
