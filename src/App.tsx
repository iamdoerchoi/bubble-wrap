import { useCallback, useState } from 'react';
import { playPop, playRefill } from './sound';
import './App.css';

const COLS = 6;
const ROWS = 14;
const SHEET_SIZE = COLS * ROWS;
const TOTAL_KEY = 'bubble-wrap-total-popped';

function readTotal() {
  const stored = Number(localStorage.getItem(TOTAL_KEY));
  return Number.isFinite(stored) ? stored : 0;
}

function App() {
  const [popped, setPopped] = useState<boolean[]>(() =>
    Array(SHEET_SIZE).fill(false),
  );
  const [sheetKey, setSheetKey] = useState(0);
  const [total, setTotal] = useState(readTotal);

  const poppedCount = popped.filter(Boolean).length;
  const isCleared = poppedCount === SHEET_SIZE;

  const handlePop = useCallback((index: number) => {
    setPopped((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
    playPop();
    setTotal((prev) => {
      const next = prev + 1;
      localStorage.setItem(TOTAL_KEY, String(next));
      return next;
    });
  }, []);

  const handleRefill = useCallback(() => {
    playRefill();
    setPopped(Array(SHEET_SIZE).fill(false));
    setSheetKey((key) => key + 1);
  }, []);

  return (
    <div className="app-shell">
      <header className="header">
        <h1>무한 뽁뽁이</h1>
        <p className="subtitle">눌러도 눌러도 안 질려요</p>
        <p className="total-count">지금까지 총 {total.toLocaleString()}개 팡!</p>
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
              className={`bubble${isPopped ? ' popped' : ''}`}
              onPointerDown={() => handlePop(i)}
              aria-label={isPopped ? '터진 뽁뽁이' : '뽁뽁이'}
              disabled={isPopped}
            />
          ))}
        </div>
      </div>

      <footer className="footer">
        <p className="progress">
          {poppedCount} / {SHEET_SIZE} 팡
        </p>
        {isCleared && (
          <button type="button" className="primary-btn" onClick={handleRefill}>
            새 뽁뽁이 한 장 더
          </button>
        )}
      </footer>
    </div>
  );
}

export default App;
