export const GOLDEN_MESSAGES = [
  '대박!! 황금 뽁뽁이 발견 🎉',
  '오늘 운세 최상급입니다',
  '이걸 터뜨리다니... 축하드려요',
  '황금 뽁뽁이는 아무나 못 터뜨려요',
  '이 정도면 로또 한 장 사셔야 해요',
];

export interface ComboMessage {
  threshold: number;
  text: string;
}

export const COMBO_MESSAGES: ComboMessage[] = [
  { threshold: 5, text: '오, 시작이 좋은데요?' },
  { threshold: 10, text: '우다다다!!' },
  { threshold: 20, text: '이성을 잃었다' },
  { threshold: 35, text: '손가락에 모터 달았나요?' },
  { threshold: 50, text: '이제 그만 주무셔야죠' },
];
