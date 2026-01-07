"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

export default function FireworksIntro() {
  const [visible, setVisible] = useState(true);
  const confettiPieces = useMemo(() => {
    const palette = ["var(--brand-lime)", "var(--brand-gold)", "#ffffff"];
    return Array.from({ length: 18 }, (_, index) => {
      const top = (index * 9) % 88;
      const offset = (index * 6) % 26;
      const size = 8 + (index % 4) * 3;
      const delay = (index % 6) * 0.18;
      const duration = 2.2 + (index % 4) * 0.35;
      const color = palette[index % palette.length];
      return { top, offset, size, delay, duration, color };
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fireworks-overlay" aria-hidden="true">
      <div className="confetti-stream confetti-left">
        {confettiPieces.map((piece, index) => (
          <span
            key={`confetti-left-${index}`}
            className="confetti-piece"
            style={
              {
                top: `${piece.top}%`,
                left: `${piece.offset}%`,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="confetti-stream confetti-right">
        {confettiPieces.map((piece, index) => (
          <span
            key={`confetti-right-${index}`}
            className="confetti-piece"
            style={
              {
                top: `${piece.top}%`,
                right: `${piece.offset}%`,
                width: piece.size,
                height: piece.size,
                backgroundColor: piece.color,
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>
    </div>
  );
}
