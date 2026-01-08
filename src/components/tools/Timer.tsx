'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const PRESETS = [
  { name: '1분', seconds: 60, icon: '☕' },
  { name: '3분', seconds: 180, icon: '🍜' },
  { name: '5분', seconds: 300, icon: '🥚' },
  { name: '10분', seconds: 600, icon: '📖' },
  { name: '15분', seconds: 900, icon: '🧘' },
  { name: '25분', seconds: 1500, icon: '🍅' },
  { name: '30분', seconds: 1800, icon: '🏃' },
  { name: '1시간', seconds: 3600, icon: '📚' },
];

export default function Timer() {
  const [totalSeconds, setTotalSeconds] = useState(300); // 기본 5분
  const [remainingSeconds, setRemainingSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [customSeconds, setCustomSeconds] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 타이머 로직
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            // 알람 소리
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds]);

  const playAlarm = () => {
    // Web Audio API로 알람음 생성
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      
      // 비프음 패턴
      let count = 0;
      const beepInterval = setInterval(() => {
        count++;
        if (count >= 6) {
          clearInterval(beepInterval);
          oscillator.stop();
          return;
        }
        if (count % 2 === 0) {
          gainNode.gain.value = 0.3;
        } else {
          gainNode.gain.value = 0;
        }
      }, 200);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const setPreset = (seconds: number) => {
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(false);
    setIsFinished(false);
  };

  const setCustomTime = () => {
    const mins = parseInt(customMinutes) || 0;
    const secs = parseInt(customSeconds) || 0;
    const total = mins * 60 + secs;
    if (total > 0) {
      setPreset(total);
      setCustomMinutes('');
      setCustomSeconds('');
    }
  };

  const toggleTimer = () => {
    if (isFinished) {
      reset();
      return;
    }
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setRemainingSeconds(totalSeconds);
    setIsRunning(false);
    setIsFinished(false);
  };

  const addTime = (seconds: number) => {
    const newTotal = Math.max(0, remainingSeconds + seconds);
    setRemainingSeconds(newTotal);
    if (newTotal > totalSeconds) setTotalSeconds(newTotal);
    setIsFinished(false);
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - remainingSeconds) / totalSeconds) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* 프리셋 */}
      <div>
        <p className="font-semibold text-gray-700 mb-3">⏱️ 빠른 설정</p>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setPreset(preset.seconds)}
              className={`p-2 sm:p-3 rounded-xl border-2 transition-all ${
                totalSeconds === preset.seconds && !isFinished
                  ? 'border-ai-primary bg-ai-primary/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-xl block">{preset.icon}</span>
              <span className="font-medium text-gray-700 text-xs sm:text-sm">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 커스텀 시간 */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="font-medium text-gray-700 mb-3">⚙️ 직접 설정</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            placeholder="분"
            className="w-20 p-3 text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
            min={0}
          />
          <span className="text-xl">:</span>
          <input
            type="number"
            value={customSeconds}
            onChange={(e) => setCustomSeconds(e.target.value)}
            placeholder="초"
            className="w-20 p-3 text-center border-2 border-gray-200 rounded-xl focus:border-ai-primary focus:outline-none"
            min={0}
            max={59}
          />
          <button
            onClick={setCustomTime}
            className="px-4 py-3 bg-ai-primary text-white font-medium rounded-xl hover:bg-ai-primary-dark transition-colors"
          >
            설정
          </button>
        </div>
      </div>

      {/* 타이머 디스플레이 */}
      <div className={`relative rounded-3xl p-8 text-center overflow-hidden ${
        isFinished ? 'bg-gradient-to-br from-red-500 to-orange-500' : 'bg-gradient-to-br from-ai-primary to-purple-600'
      }`}>
        {/* 진행바 배경 */}
        <div 
          className="absolute inset-0 bg-white/20 origin-left transition-transform duration-1000"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
        
        <div className="relative">
          <p className={`text-6xl sm:text-8xl font-mono font-bold text-white ${
            remainingSeconds <= 10 && remainingSeconds > 0 ? 'animate-pulse' : ''
          }`}>
            {formatTime(remainingSeconds)}
          </p>
          
          {isFinished && (
            <div className="mt-4 text-white">
              <span className="text-4xl animate-bounce inline-block">🎉</span>
              <p className="text-xl font-bold mt-2">시간 종료!</p>
            </div>
          )}
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => addTime(-30)}
          disabled={isRunning || remainingSeconds < 30}
          className="px-4 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-colors"
        >
          -30초
        </button>
        
        <button
          onClick={toggleTimer}
          className={`px-8 py-4 rounded-xl font-bold text-xl transition-all ${
            isFinished
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : isRunning
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-ai-primary hover:bg-ai-primary-dark text-white'
          }`}
        >
          {isFinished ? '⏮️ 다시' : isRunning ? '⏸️ 일시정지' : '▶️ 시작'}
        </button>

        <button
          onClick={reset}
          disabled={!isRunning && remainingSeconds === totalSeconds}
          className="px-4 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-colors"
        >
          🔄 리셋
        </button>

        <button
          onClick={() => addTime(30)}
          disabled={isRunning}
          className="px-4 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-colors"
        >
          +30초
        </button>
      </div>

      {/* 추가 정보 */}
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">설정 시간</p>
          <p className="text-lg font-bold text-gray-700">{formatTime(totalSeconds)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">경과 시간</p>
          <p className="text-lg font-bold text-gray-700">{formatTime(totalSeconds - remainingSeconds)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-500">진행률</p>
          <p className="text-lg font-bold text-gray-700">{Math.round(progress)}%</p>
        </div>
      </div>
    </div>
  );
}
