import { useState } from 'react';

const COLORS = ['#ffd54f', '#ff8a65', '#4fc3f7', '#81c784', '#ba68c8'];

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  rotate: number;
  color: string;
}

function makeParticles(): Particle[] {
  return Array.from({ length: 22 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.15,
    duration: 0.9 + Math.random() * 0.6,
    rotate: Math.random() * 360,
    color: COLORS[i % COLORS.length],
  }));
}

function Confetti() {
  const [particles] = useState<Particle[]>(makeParticles);

  return (
    <div className="confetti-layer" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotate}deg)`,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

export default Confetti;
