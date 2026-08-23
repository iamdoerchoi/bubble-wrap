import { SHEET_SIZE } from './constants';

interface StatsModalProps {
  total: number;
  goldenTotal: number;
  onClose: () => void;
}

function StatsModal({ total, goldenTotal, onClose }: StatsModalProps) {
  const sheets = Math.floor(total / SHEET_SIZE);
  const lengthM = (total * 2.2) / 100;
  const busCount = lengthM / 11;
  const minutesSpent = (total * 0.4) / 60;
  const ramyunTimes = minutesSpent / 3;
  const kcal = total * 0.03;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>쓸모없는 통계</h2>
        <ul className="stats-list">
          <li>
            지금까지 터뜨린 뽁뽁이: <b>{total.toLocaleString()}개</b>
          </li>
          <li>
            다 채운 시트: <b>{sheets}장</b> (알아서 뭐하나요)
          </li>
          <li>
            일렬로 늘어놓으면: <b>{lengthM.toFixed(1)}m</b> — 시내버스{' '}
            {busCount.toFixed(1)}대 길이
          </li>
          <li>
            여기 쏟은 시간: 약 <b>{minutesSpent.toFixed(1)}분</b> — 라면{' '}
            {ramyunTimes.toFixed(1)}봉지 끓일 시간
          </li>
          <li>
            소모 칼로리(추정): <b>{kcal.toFixed(1)}kcal</b> — 정말 아무 의미
            없음
          </li>
          <li>
            황금 뽁뽁이 발견: <b>{goldenTotal}개</b>{' '}
            {goldenTotal === 0 && '(아직 인연이 없네요)'}
          </li>
        </ul>
        <button type="button" className="primary-btn" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
}

export default StatsModal;
