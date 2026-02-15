'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

// ============ 물리 엔진 (간단한 2D) ============
interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  label: string;
  color: string;
  drawn: boolean;       // 뽑힘 여부
  drawOrder: number;    // 뽑힌 순서 (0 = 아직 안뽑힘)
  beingDrawn: boolean;  // 현재 빨려들어가는 중
  drawProgress: number; // 빨려들어가는 애니메이션 진행도 0~1
}

const BALL_COLORS = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
  '#14B8A6', '#E11D48', '#7C3AED', '#0EA5E9', '#D946EF',
  '#FB923C', '#A3E635', '#38BDF8', '#C084FC', '#FB7185',
];

const GRAVITY = 0.3;
const FRICTION = 0.995;
const BOUNCE = 0.6;
const WIND_STRENGTH = 0.8;
const TUBE_WIDTH = 40;

function getContainerRadius(ballCount: number): number {
  // 공 수에 따라 가변적 크기
  const base = 140;
  const perBall = 6;
  return Math.min(Math.max(base, base + (ballCount - 5) * perBall), 280);
}

function getBallRadius(ballCount: number): number {
  if (ballCount <= 10) return 22;
  if (ballCount <= 20) return 18;
  if (ballCount <= 40) return 15;
  return 12;
}

function randomColor(index: number): string {
  return BALL_COLORS[index % BALL_COLORS.length];
}

// ============ 메인 컴포넌트 ============
export default function LotteryDraw() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animFrameRef = useRef<number>(0);
  const phaseRef = useRef<'idle' | 'mixing' | 'drawing' | 'done'>('idle');
  const drawCountRef = useRef(0);
  const drawTargetRef = useRef(1);
  const windAngleRef = useRef(0);
  const tubeTargetRef = useRef<Ball | null>(null);
  const drawTimerRef = useRef(0);

  // 입력 상태
  const [inputMode, setInputMode] = useState<'text' | 'csv'>('text');
  const [textInput, setTextInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [drawCount, setDrawCount] = useState(1);
  const [phase, setPhase] = useState<'idle' | 'mixing' | 'drawing' | 'done'>('idle');
  const [drawnResults, setDrawnResults] = useState<string[]>([]);
  const [containerSize, setContainerSize] = useState(180);

  // Canvas 크기
  const canvasWidth = 700;
  const canvasHeight = 580;

  // ---- 키워드 파싱 ----
  const parseKeywords = useCallback((raw: string): string[] => {
    // 쉼표, 줄바꿈, 탭으로 구분
    const items = raw.split(/[,\n\t]+/).map(s => s.trim()).filter(s => s.length > 0);
    return items;
  }, []);

  const handleTextSubmit = () => {
    const items = parseKeywords(textInput);
    if (items.length > 0) {
      setKeywords(items);
      setDrawnResults([]);
      phaseRef.current = 'idle';
      setPhase('idle');
    }
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const items = parseKeywords(text);
      if (items.length > 0) {
        setKeywords(items);
        setDrawnResults([]);
        phaseRef.current = 'idle';
        setPhase('idle');
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  // ---- 공 초기화 ----
  const initBalls = useCallback(() => {
    const r = getBallRadius(keywords.length);
    const containerR = getContainerRadius(keywords.length);
    setContainerSize(containerR);

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2 + 20;

    const balls: Ball[] = keywords.map((kw, i) => ({
      x: centerX + (Math.random() - 0.5) * containerR * 0.5,
      y: centerY - containerR + Math.random() * 40 - 100, // 위에서 떨어지게
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 2,
      radius: r,
      label: kw,
      color: randomColor(i),
      drawn: false,
      drawOrder: 0,
      beingDrawn: false,
      drawProgress: 0,
    }));
    ballsRef.current = balls;
    drawCountRef.current = 0;
    tubeTargetRef.current = null;
    drawTimerRef.current = 0;
  }, [keywords]);

  // ---- 물리 시뮬레이션 ----
  const simulate = useCallback(() => {
    const balls = ballsRef.current;
    const containerR = getContainerRadius(keywords.length);
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2 + 20;
    const currentPhase = phaseRef.current;

    windAngleRef.current += 0.02;

    for (const ball of balls) {
      if (ball.drawn || ball.beingDrawn) continue;

      // 중력
      ball.vy += GRAVITY;

      // 바람 효과 (혼합 시)
      if (currentPhase === 'mixing' || currentPhase === 'drawing') {
        const windX = Math.cos(windAngleRef.current) * WIND_STRENGTH;
        const windY = Math.sin(windAngleRef.current * 1.3) * WIND_STRENGTH * 0.5 - 0.6;
        ball.vx += windX;
        ball.vy += windY;
      }

      // 마찰
      ball.vx *= FRICTION;
      ball.vy *= FRICTION;

      // 속도 제한
      const maxSpeed = 8;
      const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
      if (speed > maxSpeed) {
        ball.vx = (ball.vx / speed) * maxSpeed;
        ball.vy = (ball.vy / speed) * maxSpeed;
      }

      // 위치 업데이트
      ball.x += ball.vx;
      ball.y += ball.vy;

      // 원형 컨테이너 충돌
      const dx = ball.x - centerX;
      const dy = ball.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = containerR - ball.radius;

      if (dist > maxDist) {
        const nx = dx / dist;
        const ny = dy / dist;
        ball.x = centerX + nx * maxDist;
        ball.y = centerY + ny * maxDist;

        // 반사
        const dot = ball.vx * nx + ball.vy * ny;
        ball.vx -= 2 * dot * nx * BOUNCE;
        ball.vy -= 2 * dot * ny * BOUNCE;
      }

      // 공끼리 충돌
      for (const other of balls) {
        if (other === ball || other.drawn || other.beingDrawn) continue;
        const ddx = other.x - ball.x;
        const ddy = other.y - ball.y;
        const ddist = Math.sqrt(ddx * ddx + ddy * ddy);
        const minDist = ball.radius + other.radius;
        if (ddist < minDist && ddist > 0) {
          const overlap = minDist - ddist;
          const nnx = ddx / ddist;
          const nny = ddy / ddist;
          ball.x -= nnx * overlap * 0.5;
          ball.y -= nny * overlap * 0.5;
          other.x += nnx * overlap * 0.5;
          other.y += nny * overlap * 0.5;

          const relVx = ball.vx - other.vx;
          const relVy = ball.vy - other.vy;
          const relDot = relVx * nnx + relVy * nny;
          if (relDot > 0) {
            ball.vx -= relDot * nnx * 0.5;
            ball.vy -= relDot * nny * 0.5;
            other.vx += relDot * nnx * 0.5;
            other.vy += relDot * nny * 0.5;
          }
        }
      }
    }

    // ---- 추첨 빨려가기 로직 ----
    if (currentPhase === 'drawing') {
      const tubeX = centerX;
      const tubeY = centerY - containerR - 20;

      if (!tubeTargetRef.current) {
        drawTimerRef.current++;
        if (drawTimerRef.current > 60) { // ~1초 후
          // 튜브 입구에 가장 가까운 공 선택
          let closest: Ball | null = null;
          let closestDist = Infinity;
          for (const b of balls) {
            if (b.drawn || b.beingDrawn) continue;
            const d = Math.sqrt((b.x - tubeX) ** 2 + (b.y - tubeY) ** 2);
            if (d < closestDist) {
              closestDist = d;
              closest = b;
            }
          }
          if (closest) {
            tubeTargetRef.current = closest;
            closest.beingDrawn = true;
            closest.drawProgress = 0;
          }
          drawTimerRef.current = 0;
        }
      }

      if (tubeTargetRef.current) {
        const target = tubeTargetRef.current;
        target.drawProgress += 0.025;

        // 빨려가기 애니메이션: 튜브 입구 → 위로 올라감
        const startX = target.x;
        const startY = target.y;
        if (target.drawProgress < 0.5) {
          // 튜브 입구로 이동
          const t = target.drawProgress / 0.5;
          target.x = startX + (tubeX - startX) * t * 0.15;
          target.y = startY + (tubeY - startY) * t * 0.15;
        } else {
          // 위로 빨려감
          target.x += (tubeX - target.x) * 0.15;
          target.y += (tubeY - 60 - target.y) * 0.1;
        }

        if (target.drawProgress >= 1.0) {
          target.drawn = true;
          target.beingDrawn = false;
          drawCountRef.current++;
          target.drawOrder = drawCountRef.current;
          tubeTargetRef.current = null;
          drawTimerRef.current = 0;

          // 결과 업데이트
          setDrawnResults(prev => [...prev, target.label]);

          // 모두 뽑았는지 확인
          if (drawCountRef.current >= drawTargetRef.current) {
            phaseRef.current = 'done';
            setPhase('done');
          }
        }
      }
    }
  }, [keywords]);

  // ---- Canvas 렌더링 ----
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerR = getContainerRadius(keywords.length);
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2 + 20;

    // DPR 대응
    const dpr = window.devicePixelRatio || 1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);

    // 배경 그라데이션
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    bgGrad.addColorStop(0, '#0f172a');
    bgGrad.addColorStop(1, '#1e293b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 별 효과
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    for (let i = 0; i < 40; i++) {
      const sx = ((i * 137.5) % canvasWidth);
      const sy = ((i * 73.1) % canvasHeight);
      ctx.beginPath();
      ctx.arc(sx, sy, Math.random() > 0.5 ? 1 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // ---- 뽑힌 공 표시 영역 (오른쪽) ----
    const resultAreaX = canvasWidth - 90;
    const resultAreaTop = 50;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 2;
    roundRect(ctx, resultAreaX - 40, resultAreaTop - 20, 80, canvasHeight - 100, 12);
    ctx.fill();
    ctx.stroke();

    // "결과" 라벨
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆 결과', resultAreaX, resultAreaTop);

    // 뽑힌 공들
    const drawnBalls = ballsRef.current.filter(b => b.drawn).sort((a, b) => a.drawOrder - b.drawOrder);
    drawnBalls.forEach((ball, i) => {
      const bx = resultAreaX;
      const by = resultAreaTop + 35 + i * (getBallRadius(keywords.length) * 2 + 6);
      drawBall(ctx, bx, by, ball.radius * 0.8, ball.color, ball.label, true);
      // 순서 번호
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`${i + 1}.`, bx - ball.radius * 0.8 - 5, by + 4);
    });

    // ---- 유리 원형 컨테이너 ----
    // 빛나는 효과
    const glowGrad = ctx.createRadialGradient(centerX, centerY, containerR * 0.8, centerX, centerY, containerR + 20);
    glowGrad.addColorStop(0, 'rgba(59,130,246,0)');
    glowGrad.addColorStop(1, 'rgba(59,130,246,0.15)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, containerR + 20, 0, Math.PI * 2);
    ctx.fill();

    // 유리 컨테이너
    ctx.beginPath();
    ctx.arc(centerX, centerY, containerR, 0, Math.PI * 2);
    const glassGrad = ctx.createRadialGradient(
      centerX - containerR * 0.3, centerY - containerR * 0.3, 0,
      centerX, centerY, containerR
    );
    glassGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
    glassGrad.addColorStop(0.7, 'rgba(255,255,255,0.04)');
    glassGrad.addColorStop(1, 'rgba(255,255,255,0.08)');
    ctx.fillStyle = glassGrad;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 하이라이트 (유리 느낌)
    ctx.beginPath();
    ctx.arc(centerX - containerR * 0.25, centerY - containerR * 0.3, containerR * 0.4, 0, Math.PI * 2);
    const hlGrad = ctx.createRadialGradient(
      centerX - containerR * 0.25, centerY - containerR * 0.3, 0,
      centerX - containerR * 0.25, centerY - containerR * 0.3, containerR * 0.4
    );
    hlGrad.addColorStop(0, 'rgba(255,255,255,0.12)');
    hlGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hlGrad;
    ctx.fill();

    // ---- 튜브 (위로 빨아들이는 관) ----
    const tubeX = centerX;
    const tubeY = centerY - containerR;
    ctx.fillStyle = 'rgba(148,163,184,0.3)';
    ctx.fillRect(tubeX - TUBE_WIDTH / 2, tubeY - 80, TUBE_WIDTH, 80);
    ctx.strokeStyle = 'rgba(148,163,184,0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(tubeX - TUBE_WIDTH / 2, tubeY - 80, TUBE_WIDTH, 80);

    // 튜브 입구 표시
    if (phaseRef.current === 'drawing') {
      ctx.beginPath();
      ctx.arc(tubeX, tubeY, 18, Math.PI, Math.PI * 2);
      const tubeGlow = ctx.createRadialGradient(tubeX, tubeY, 0, tubeX, tubeY, 25);
      tubeGlow.addColorStop(0, 'rgba(251,191,36,0.6)');
      tubeGlow.addColorStop(1, 'rgba(251,191,36,0)');
      ctx.fillStyle = tubeGlow;
      ctx.fill();

      // 빨아들이는 파티클 효과
      const t = Date.now() / 200;
      for (let i = 0; i < 5; i++) {
        const py = tubeY - (t + i * 15) % 60;
        const px = tubeX + Math.sin(t + i) * 8;
        ctx.fillStyle = `rgba(251,191,36,${0.5 - (((t + i * 15) % 60) / 60) * 0.5})`;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ---- 바람 효과 표시 ----
    if (phaseRef.current === 'mixing' || phaseRef.current === 'drawing') {
      const windTime = Date.now() / 300;
      for (let i = 0; i < 8; i++) {
        const wy = centerY + containerR - 30 + Math.sin(windTime + i) * 10;
        const wx = centerX - containerR * 0.6 + (i / 8) * containerR * 1.2;
        const wLen = 15 + Math.sin(windTime * 1.5 + i * 0.7) * 8;
        ctx.strokeStyle = `rgba(147,197,253,${0.2 + Math.sin(windTime + i) * 0.1})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(wx, wy);
        ctx.lineTo(wx, wy - wLen);
        ctx.stroke();
        // 작은 화살표
        ctx.beginPath();
        ctx.moveTo(wx - 3, wy - wLen + 5);
        ctx.lineTo(wx, wy - wLen);
        ctx.lineTo(wx + 3, wy - wLen + 5);
        ctx.stroke();
      }
    }

    // ---- 공 그리기 ----
    for (const ball of ballsRef.current) {
      if (ball.drawn) continue;
      const alpha = ball.beingDrawn ? (1 - ball.drawProgress * 0.5) : 1;
      const scale = ball.beingDrawn ? (1 - ball.drawProgress * 0.3) : 1;
      drawBall(ctx, ball.x, ball.y, ball.radius * scale, ball.color, ball.label, false, alpha);
    }

    // ---- 상태 텍스트 ----
    ctx.textAlign = 'center';
    if (phaseRef.current === 'mixing') {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('🌀 공을 섞는 중... 추첨 시작을 눌러주세요!', canvasWidth / 2 - 30, 30);
    } else if (phaseRef.current === 'drawing') {
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`🎰 추첨 중... (${drawCountRef.current}/${drawTargetRef.current})`, canvasWidth / 2 - 30, 30);
    } else if (phaseRef.current === 'done') {
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('🎉 추첨 완료!', canvasWidth / 2 - 30, 30);
    }

    ctx.restore();
  }, [keywords]);

  // ---- 공 그리기 헬퍼 ----
  function drawBall(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, r: number,
    color: string, label: string,
    small = false, alpha = 1
  ) {
    ctx.save();
    ctx.globalAlpha = alpha;

    // 그림자
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 2;

    // 공 본체
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
    grad.addColorStop(0, lightenColor(color, 40));
    grad.addColorStop(0.7, color);
    grad.addColorStop(1, darkenColor(color, 30));
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.shadowColor = 'transparent';

    // 하이라이트
    ctx.beginPath();
    ctx.arc(x - r * 0.25, y - r * 0.25, r * 0.35, 0, Math.PI * 2);
    const hlGrad = ctx.createRadialGradient(x - r * 0.25, y - r * 0.25, 0, x - r * 0.25, y - r * 0.25, r * 0.35);
    hlGrad.addColorStop(0, 'rgba(255,255,255,0.5)');
    hlGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hlGrad;
    ctx.fill();

    // 라벨
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const fontSize = small ? Math.max(8, r * 0.7) : Math.max(9, r * 0.65);
    ctx.font = `bold ${fontSize}px 'Noto Sans KR', sans-serif`;

    // 글자가 너무 길면 축소
    let displayLabel = label;
    const maxWidth = r * 1.6;
    if (ctx.measureText(label).width > maxWidth) {
      while (ctx.measureText(displayLabel + '…').width > maxWidth && displayLabel.length > 1) {
        displayLabel = displayLabel.slice(0, -1);
      }
      displayLabel += '…';
    }
    ctx.fillText(displayLabel, x, y);

    ctx.restore();
  }

  function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function lightenColor(hex: string, amount: number): string {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (num >> 16) + amount);
    const g = Math.min(255, ((num >> 8) & 0xff) + amount);
    const b = Math.min(255, (num & 0xff) + amount);
    return `rgb(${r},${g},${b})`;
  }

  function darkenColor(hex: string, amount: number): string {
    const num = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0xff) - amount);
    const b = Math.max(0, (num & 0xff) - amount);
    return `rgb(${r},${g},${b})`;
  }

  // ---- 애니메이션 루프 ----
  const loop = useCallback(() => {
    if (phaseRef.current !== 'idle') {
      simulate();
    }
    render();
    animFrameRef.current = requestAnimationFrame(loop);
  }, [simulate, render]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;

    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [loop]);

  // ---- 시뮬레이션 시작 ----
  const startMixing = () => {
    if (keywords.length < 2) return;
    initBalls();
    phaseRef.current = 'mixing';
    setPhase('mixing');
    setDrawnResults([]);
    drawCountRef.current = 0;
    drawTargetRef.current = drawCount;
  };

  // ---- 추첨 시작 ----
  const startDrawing = () => {
    if (phaseRef.current !== 'mixing') return;
    phaseRef.current = 'drawing';
    setPhase('drawing');
    drawTargetRef.current = drawCount;
    drawCountRef.current = 0;
    drawTimerRef.current = 0;
    tubeTargetRef.current = null;
  };

  // ---- 리셋 ----
  const resetAll = () => {
    phaseRef.current = 'idle';
    setPhase('idle');
    setDrawnResults([]);
    ballsRef.current = [];
    drawCountRef.current = 0;
    tubeTargetRef.current = null;
  };

  // 최대 뽑기 수
  const maxDraw = Math.max(1, keywords.length);

  return (
    <div className="space-y-6">
      {/* ===== 입력 섹션 ===== */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-5 border border-indigo-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          🎱 키워드 입력
        </h3>

        {/* 입력 모드 토글 */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setInputMode('text')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              inputMode === 'text'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            ✏️ 직접 입력
          </button>
          <button
            onClick={() => setInputMode('csv')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              inputMode === 'csv'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            📁 CSV 파일 업로드
          </button>
        </div>

        {inputMode === 'text' ? (
          <div className="space-y-3">
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="쉼표(,) 또는 줄바꿈으로 구분하여 입력하세요&#10;예: 홍길동, 김철수, 이영희, 박지민&#10;&#10;또는 한 줄에 하나씩:&#10;A팀&#10;B팀&#10;C팀"
              className="w-full h-32 p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none text-gray-700 resize-none text-sm"
            />
            <button
              onClick={handleTextSubmit}
              disabled={!textInput.trim()}
              className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-300 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
            >
              ✅ 키워드 등록 ({parseKeywords(textInput).length}개)
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-6 text-center hover:border-indigo-400 transition-colors">
              <input
                type="file"
                accept=".csv,.txt"
                onChange={handleCsvUpload}
                className="hidden"
                id="csv-upload"
              />
              <label
                htmlFor="csv-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <span className="text-4xl">📂</span>
                <span className="text-sm text-gray-600">
                  CSV 또는 TXT 파일을 선택하세요
                </span>
                <span className="text-xs text-gray-400">
                  쉼표, 줄바꿈, 탭으로 구분된 파일 지원
                </span>
              </label>
            </div>
          </div>
        )}

        {/* 등록된 키워드 표시 */}
        {keywords.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                등록된 키워드 ({keywords.length}개)
              </span>
              <button
                onClick={() => { setKeywords([]); resetAll(); }}
                className="text-xs text-red-400 hover:text-red-600"
              >
                전체 삭제
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-medium text-white shadow-sm"
                  style={{ backgroundColor: randomColor(i) }}
                >
                  {kw}
                  <button
                    onClick={() => {
                      setKeywords(prev => prev.filter((_, idx) => idx !== i));
                      resetAll();
                    }}
                    className="ml-1 opacity-70 hover:opacity-100"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== 설정 + 버튼 섹션 ===== */}
      {keywords.length >= 2 && (
        <div className="bg-white rounded-2xl p-5 border-2 border-gray-100 space-y-4">
          {/* 뽑기 수 설정 */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-bold text-gray-700 whitespace-nowrap">
              🎯 뽑을 개수
            </label>
            <input
              type="range"
              min={1}
              max={maxDraw}
              value={drawCount}
              onChange={(e) => setDrawCount(Number(e.target.value))}
              className="flex-1 accent-indigo-500"
              disabled={phase !== 'idle'}
            />
            <span className="text-lg font-bold text-indigo-600 min-w-[3rem] text-center">
              {drawCount}개
            </span>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3">
            {phase === 'idle' && (
              <button
                onClick={startMixing}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold text-lg rounded-2xl transition-all active:scale-[0.97] shadow-lg shadow-indigo-200"
              >
                🚀 시뮬레이션 시작
              </button>
            )}
            {phase === 'mixing' && (
              <button
                onClick={startDrawing}
                className="flex-1 py-4 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-bold text-lg rounded-2xl transition-all active:scale-[0.97] shadow-lg shadow-amber-200 animate-pulse"
              >
                🎰 추첨 시작!
              </button>
            )}
            {phase === 'drawing' && (
              <div className="flex-1 py-4 bg-gray-200 text-gray-500 font-bold text-lg rounded-2xl text-center">
                ⏳ 추첨 진행 중... ({drawnResults.length}/{drawCount})
              </div>
            )}
            {phase === 'done' && (
              <button
                onClick={resetAll}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-lg rounded-2xl transition-all active:scale-[0.97] shadow-lg shadow-emerald-200"
              >
                🔄 다시 하기
              </button>
            )}
          </div>
        </div>
      )}

      {/* ===== 시뮬레이션 캔버스 ===== */}
      {keywords.length >= 2 && (
        <div className="flex justify-center">
          <canvas
            ref={canvasRef}
            className="rounded-2xl shadow-2xl border-2 border-gray-800 max-w-full"
            style={{ width: canvasWidth, maxWidth: '100%', height: 'auto' }}
          />
        </div>
      )}

      {/* ===== 최종 결과 ===== */}
      {phase === 'done' && drawnResults.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border-2 border-amber-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            🎉 추첨 결과 발표
          </h3>
          <div className="space-y-3">
            {drawnResults.map((result, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-sm border border-amber-100"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md"
                  style={{ backgroundColor: randomColor(keywords.indexOf(result)) }}
                >
                  {i + 1}
                </div>
                <span className="text-lg font-bold text-gray-800">{result}</span>
                {i === 0 && <span className="ml-auto text-2xl">🥇</span>}
                {i === 1 && <span className="ml-auto text-2xl">🥈</span>}
                {i === 2 && <span className="ml-auto text-2xl">🥉</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== 사용 팁 ===== */}
      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
        <h4 className="font-bold text-gray-700 mb-2">💡 사용 팁</h4>
        <ul className="text-sm text-gray-500 space-y-1">
          <li>• 쉼표, 줄바꿈, 탭으로 구분하여 키워드를 입력할 수 있어요</li>
          <li>• CSV/TXT 파일을 업로드하면 자동으로 키워드를 읽어와요</li>
          <li>• 공의 수에 따라 유리 상자 크기가 자동으로 조절돼요</li>
          <li>• 시뮬레이션 시작 → 공이 섞인 후 → 추첨 시작 버튼을 눌러주세요</li>
          <li>• 뽑을 개수를 조절하여 원하는 만큼 추첨할 수 있어요</li>
        </ul>
      </div>
    </div>
  );
}
