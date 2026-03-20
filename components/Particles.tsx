'use client';
import { useEffect, useRef } from 'react';

export default function Particles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      const size = 2 + Math.random() * 3;
      const colors = ['#FFD700', '#FFA500', '#00E5FF', '#00FF88'];
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${size}px; height: ${size}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        animation-duration: ${10 + Math.random() * 15}s;
        animation-delay: ${Math.random() * 10}s;
        opacity: 0;
      `;
      container.appendChild(p);
      particles.push(p);
    }
    return () => particles.forEach(p => p.remove());
  }, []);

  return <div ref={containerRef} className="fixed inset-0 z-[2] pointer-events-none overflow-hidden" />;
}
