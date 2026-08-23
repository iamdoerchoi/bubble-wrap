import { useCallback, useEffect, useRef, useState } from 'react';
import { playPop, playRefill, playGolden, playRankUp } from './sound';
import { COLS, SHEET_SIZE, TOTAL_KEY, GOLDEN_KEY } from './constants';
import { getTitle, getNextTitle } from './titles';
import { GOLDEN_MESSAGES, COMBO_MESSAGES } from './messages';
import Confetti from './Confetti';
import StatsModal from './StatsModal';
import './App.css';

function readCount(key: string) {
  const stored = Number(localStorage.getItem(key));
  return Number.isFinite(stored) ? stored : 0;
}

function pickGoldenIndex(): number | null {
  return Math.random() < 0.25 ? Math.floor(Math.random() * SHEET_SIZE) : null;
}

function App() {
  const [popped, setPopped] = useState<boolean[]>(() =>
    Array(SHEET_SIZE).fill(false),
  );
  const [sheetKey, setSheetKey] = useState(0);
  const [total, setTotal] = useState(() => readCount(TOTAL_KEY));
  const [goldenTotal, setGoldenTotal] = useState(() => readCount(GOLDEN_KEY));
  const [goldenIndex, setGoldenIndex] = useState<number | null>(() =>
    pickGoldenIndex(),
  );
  const [comboText, setComboText] = useState<{ id: number; text: string } | null>(
    null,
  );
  const [toastQueue, setToastQueue] = useState<{ id: number; text: string }[]>(
    [],
  );
  const [confettiId, setConfettiId] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);

  const titleRef = useRef(getTitle(total));
  const comboCountRef = useRef(0);
  const comboTimerRef = useRef<number | null>(null);
  const idRef = useRef(0);

  const poppedCount = popped.filter(Boolean).length;
  const isCleared = poppedCount === SHEET_SIZE;
  const title = getTitle(total);
  const nextTitle = getNextTitle(total);

  const pushToast = useCallback((text: string) => {
    idRef.current += 1;
    setToastQueue((prev) => [...prev, { id: idRef.current, text }]);
  }, []);

  useEffect(() => {
    if (toastQueue.length === 0) return;
    const timer = window.setTimeout(() => {
      setToastQueue((prev) => prev.slice(1));
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [toastQueue]);

  useEffect(() => {
    if (confettiId === null) return;
    const timer = window.setTimeout(() => setConfettiId(null), 1200);
    return () => window.clearTimeout(timer);
  }, [confettiId]);

  const handlePop = useCallback(
    (index: number) => {
      const isGolden = index === goldenIndex;

      setPopped((prev) => {
        if (prev[index]) return prev;
        const next = [...prev];
        next[index] = true;
        return next;
      });

      playPop();

      comboCountRef.current += 1;
      if (comboTimerRef.current) window.clearTimeout(comboTimerRef.current);
      comboTimerRef.current = window.setTimeout(() => {
        comboCountRef.current = 0;
      }, 900);

      const combo = COMBO_MESSAGES.find(
        (c) => c.threshold === comboCountRef.current,
      );
      if (combo) {
        idRef.current += 1;
        setComboText({ id: idRef.current, text: combo.text });
      }

      setTotal((prev) => {
        const next = prev + 1 + (isGolden ? 9 : 0);
        localStorage.setItem(TOTAL_KEY, String(next));
        const newTitle = getTitle(next);
        if (newTitle.label !== titleRef.current.label) {
          titleRef.current = newTitle;
          playRankUp();
          pushToast(`🎉 승급! 이제 당신은 '${newTitle.label}' 입니다`);
        }
        return next;
      });

      if (isGolden) {
        playGolden();
        setGoldenIndex(null);
        setGoldenTotal((prev) => {
          const next = prev + 1;
          localStorage.setItem(GOLDEN_KEY, String(next));
          return next;
        });
        idRef.current += 1;
        setConfettiId(idRef.current);
        pushToast(
          GOLDEN_MESSAGES[Math.floor(Math.random() * GOLDEN_MESSAGES.length)],
        );
      }
    },
    [goldenIndex, pushToast],
  );

  const handleRefill = useCallback(() => {
    playRefill();
    setPopped(Array(SHEET_SIZE).fill(false));
    setSheetKey((key) => key + 1);
    setGoldenIndex(pickGoldenIndex());
  }, []);

  const currentToast = toastQueue[0] ?? null;

  return (
    <div className="app-shell">
      <header className="header">
        <h1>무한 뽁뽁이</h1>
        <p className="subtitle">눌러도 눌러도 안 질려요</p>
        <p className="total-count">지금까지 총 {total.toLocaleString()}개 팡!</p>
        <p className="rank-badge">
          현재 칭호: <b>{title.label}</b>
          {nextTitle ? (
            <span className="rank-next">
              {' '}
              · 다음 칭호까지 {nextTitle.min - total}개
            </span>
          ) : (
            <span className="rank-next"> · 최고 등급 달성!</span>
          )}
        </p>
      </header>

      <div className="sheet-wrap">
        <div
          className="sheet"
          key={sheetKey}
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        >
          {popped.map((isPopped, i) => (
            <button
              key={i}
              type="button"
              className={`bubble${isPopped ? ' popped' : ''}${
                !isPopped && i === goldenIndex ? ' golden' : ''
              }`}
              onPointerDown={() => handlePop(i)}
              aria-label={
                isPopped
                  ? '터진 뽁뽁이'
                  : i === goldenIndex
                    ? '황금 뽁뽁이'
                    : '뽁뽁이'
              }
              disabled={isPopped}
            />
          ))}
        </div>
      </div>

      {comboText && (
        <div key={comboText.id} className="combo-text">
          {comboText.text}
        </div>
      )}

      {currentToast && (
        <div key={currentToast.id} className="toast">
          {currentToast.text}
        </div>
      )}

      {confettiId !== null && <Confetti key={confettiId} />}

      <footer className="footer">
        <p className="progress">
          {poppedCount} / {SHEET_SIZE} 팡
        </p>
        <button
          type="button"
          className="ghost-btn"
          onClick={() => setShowStats(true)}
        >
          🧮 쓸모없는 통계 보기
        </button>
        {isCleared && (
          <button type="button" className="primary-btn" onClick={handleRefill}>
            새 뽁뽁이 한 장 더
          </button>
        )}
      </footer>

      {showStats && (
        <StatsModal
          total={total}
          goldenTotal={goldenTotal}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
}

export default App;
