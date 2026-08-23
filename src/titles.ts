export interface Title {
  min: number;
  label: string;
}

export const TITLES: Title[] = [
  { min: 0, label: '뽁뽁이 새싹' },
  { min: 10, label: '뽁뽁이 견습생' },
  { min: 50, label: '뽁뽁이 중독자' },
  { min: 100, label: '뽁뽁이 장인' },
  { min: 300, label: '뽁뽁이 도인' },
  { min: 600, label: '뽁뽁이의 신' },
  { min: 1000, label: '손가락에 굳은살 박힌 자' },
  { min: 3000, label: '이 정도면 직업병' },
  { min: 10000, label: '전설의 뽁뽁이' },
];

export function getTitle(total: number): Title {
  let current = TITLES[0];
  for (const t of TITLES) {
    if (total >= t.min) current = t;
    else break;
  }
  return current;
}

export function getNextTitle(total: number): Title | null {
  return TITLES.find((t) => t.min > total) ?? null;
}
