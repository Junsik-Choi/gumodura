'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface Participant {
  name: string;
  color: string;
}

interface LadderLine {
  from: number;
  to: number;
  y: number;
}

const COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
];

export default function LadderGame() {
  const [participants, setParticipants] = useState<Participant[]>([
    { name: '참가자1', color: COLORS[0] },
    { name: '참가자2', color: COLORS[1] },
    { name: '참가자3', color: COLORS[2] },
  ]);
  const [results, setResults] = useState<string[]>(['당첨!', '꽝', '꽝']);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [ladder, setLadder] = useState<LadderLine[]>([]);
  const [finalMapping, setFinalMapping] = useState<number[]>([]);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);
  const [animationPath, setAnimationPath] = useState<{ x: number; y: number }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 참가자 추가
  const addParticipant = () => {
    if (participants.length >= 10) return;
    const newIndex = participants.length;
    setParticipants([
      ...participants,
      { name: `참가자${newIndex + 1}`, color: COLORS[newIndex % COLORS.length] },
    ]);
    setResults([...results, '꽝']);
  };

  // 참가자 삭제
  const removeParticipant = (index: number) => {
    if (participants.length <= 2) return;
    setParticipants(participants.filter((_, i) => i !== index));
    setResults(results.filter((_, i) => i !== index));
  };

  // 참가자 이름 변경
  const updateParticipant = (index: number, name: string) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], name };
    setParticipants(updated);
  };

  // 결과 변경
  const updateResult = (index: number, result: string) => {
    const updated = [...results];
    updated[index] = result;
    setResults(updated);
  };

  // 사다리 생성
  const generateLadder = useCallback(() => {
    const n = participants.length;
    const lines: LadderLine[] = [];
    const rows = 8; // 가로줄 행 수

    for (let row = 0; row < rows; row++) {
      const y = (row + 1) / (rows + 1);
      // 각 행에서 랜덤하게 가로줄 생성
      for (let col = 0; col < n - 1; col++) {
        // 연속 가로줄 방지
        const prevLine = lines.find(
          (l) => l.y === y && (l.from === col - 1 || l.to === col + 1)
        );
        if (!prevLine && Math.random() > 0.5) {
          lines.push({ from: col, to: col + 1, y });
        }
      }
    }

    setLadder(lines);
    return lines;
  }, [participants.length]);

  // 사다리 결과 계산
  const calculateResults = useCallback(
    (ladderLines: LadderLine[]) => {
      const n = participants.length;
      const mapping: number[] = [];

      for (let start = 0; start < n; start++) {
        let current = start;
        let y = 0;

        // 위에서 아래로 내려가면서 가로줄 만나면 이동
        const sortedLines = [...ladderLines].sort((a, b) => a.y - b.y);

        for (const line of sortedLines) {
          if (line.from === current) {
            current = line.to;
          } else if (line.to === current) {
            current = line.from;
          }
        }

        mapping.push(current);
      }

      setFinalMapping(mapping);
      return mapping;
    },
    [participants.length]
  );

  // 게임 시작
  const startGame = () => {
    setIsPlaying(true);
    setShowResult(false);
    setAnimatingIndex(null);
    setAnimationPath([]);

    const newLadder = generateLadder();
    const mapping = calculateResults(newLadder);

    // 3초 후 결과 표시
    setTimeout(() => {
      setShowResult(true);
      setIsPlaying(false);
    }, 1500);
  };

  // 사다리 그리기
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const n = participants.length;
    const padding = 40;
    const colWidth = (width - padding * 2) / (n - 1);

    ctx.clearRect(0, 0, width, height);

    // 세로줄 그리기
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 3;
    for (let i = 0; i < n; i++) {
      const x = padding + i * colWidth;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 가로줄 그리기
    if (isPlaying || showResult) {
      ctx.strokeStyle = '#7C3AED';
      ctx.lineWidth = 3;
      for (const line of ladder) {
        const x1 = padding + line.from * colWidth;
        const x2 = padding + line.to * colWidth;
        const y = line.y * height;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();
      }
    }

    // 결과 경로 그리기 (showResult일 때)
    if (showResult && animatingIndex !== null) {
      // 특정 참가자의 경로를 그림
    }
  }, [participants.length, ladder, isPlaying, showResult, animatingIndex]);

  // 결과 셔플
  const shuffleResults = () => {
    const shuffled = [...results];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setResults(shuffled);
  };

  return (
    <div className="space-y-6">
      {/* 참가자 설정 */}
      <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-700">👥 참가자 설정</h3>
          <button
            onClick={addParticipant}
            disabled={participants.length >= 10}
            className="px-4 py-2 bg-ai-primary text-white rounded-lg text-sm font-medium disabled:opacity-50"
          >
            + 추가
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {participants.map((p, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: p.color }}
              />
              <input
                type="text"
                value={p.name}
                onChange={(e) => updateParticipant(index, e.target.value)}
                className="flex-1 p-2 text-sm border-2 border-gray-200 rounded-lg focus:border-ai-primary focus:outline-none"
                placeholder={`참가자${index + 1}`}
              />
              {participants.length > 2 && (
                <button
                  onClick={() => removeParticipant(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 결과 설정 */}
      <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-700">🎁 결과 설정</h3>
          <button
            onClick={shuffleResults}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
          >
            🔀 섞기
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {results.map((r, index) => (
            <input
              key={index}
              type="text"
              value={r}
              onChange={(e) => updateResult(index, e.target.value)}
              className="p-2 text-sm text-center border-2 border-gray-200 rounded-lg focus:border-ai-primary focus:outline-none"
              placeholder={`결과${index + 1}`}
            />
          ))}
        </div>
        <p className="text-sm text-gray-500">
          💡 당첨, 꽝, 벌칙 등 원하는 결과를 입력하세요
        </p>
      </div>

      {/* 사다리 캔버스 */}
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-4">
        {/* 상단 참가자 */}
        <div className="flex justify-between mb-2 px-4">
          {participants.map((p, index) => (
            <div
              key={index}
              className="text-center"
              style={{ width: `${100 / participants.length}%` }}
            >
              <div
                className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: p.color }}
              >
                {p.name.slice(0, 2)}
              </div>
              <p className="text-xs text-gray-600 truncate">{p.name}</p>
            </div>
          ))}
        </div>

        {/* 사다리 */}
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-48 sm:h-64"
        />

        {/* 하단 결과 */}
        <div className="flex justify-between mt-2 px-4">
          {results.map((r, index) => (
            <div
              key={index}
              className={`text-center transition-all ${
                showResult ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ width: `${100 / participants.length}%` }}
            >
              <div
                className={`px-2 py-1 rounded-lg text-sm font-medium ${
                  r === '당첨!' || r.includes('당첨')
                    ? 'bg-yellow-100 text-yellow-800'
                    : r === '꽝' || r.includes('꽝')
                    ? 'bg-gray-100 text-gray-600'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {r}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 시작 버튼 */}
      <button
        onClick={startGame}
        disabled={isPlaying}
        className={`w-full py-5 rounded-2xl text-xl font-bold transition-all ${
          isPlaying
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-ai-primary to-purple-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg'
        }`}
      >
        {isPlaying ? '🎲 사다리 타는 중...' : '🎲 사다리 타기 시작!'}
      </button>

      {/* 결과 표시 */}
      {showResult && (
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-5 text-white">
          <h3 className="text-lg font-bold text-center mb-4">🎉 결과 발표!</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {participants.map((p, index) => (
              <div
                key={index}
                className="bg-white/20 rounded-xl p-3 text-center"
              >
                <div
                  className="w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-xs"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name.slice(0, 2)}
                </div>
                <p className="font-medium truncate">{p.name}</p>
                <p className="text-xl font-bold mt-1">
                  {results[finalMapping[index]]}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 사용 팁 */}
      <div className="bg-yellow-50 rounded-xl p-4">
        <h3 className="font-bold text-yellow-800 mb-2">💡 사용 팁</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• 2~10명까지 참가 가능해요</li>
          <li>• 결과를 원하는 대로 자유롭게 수정하세요</li>
          <li>• &ldquo;섞기&rdquo; 버튼으로 결과 순서를 랜덤으로 바꿀 수 있어요</li>
          <li>• 야유회, 내기, 순서 정하기 등에 활용해보세요!</li>
        </ul>
      </div>
    </div>
  );
}
