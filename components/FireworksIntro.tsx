"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

export default function FireworksIntro() {
  const [visible, setVisible] = useState(true);
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: string;
    top: string;
    size: string;
    color: string;
    animationDelay: string;
    tx: string;
    ty: string;
    rotation: number;
  }>>([]);

  useEffect(() => {
    // Respect users who prefer reduced motion — skip the burst entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }

    const palette = [
      "#c9f25c", // brand-lime
      "#d9b65a", // brand-gold
      "#ffffff", // white
      "#FF5733", // vibrant orange
      "#33FF57", // vibrant green
      "#3357FF", // vibrant blue
      "#FF33F5"  // vibrant pink
    ];

    // Generate particles from BOTH sides
    const newParticles = Array.from({ length: 80 }, (_, i) => {
      const isLeft = i % 2 === 0;
      const startY = Math.random() * 80 + 10;

      // If left side, move RIGHT (+). If right side, move LEFT (-).
      const tx = (isLeft ? 1 : -1) * (Math.random() * 80 + 20);
      const ty = (Math.random() - 0.5) * 100;

      return {
        id: i,
        left: `${isLeft ? 0 : 100}%`,
        top: `${startY}%`,
        size: `${Math.random() * 6 + 3}px`,
        color: palette[Math.floor(Math.random() * palette.length)],
        animationDelay: `${Math.random() * 1.2}s`,
        tx: `${tx}vw`,
        ty: `${ty}vh`,
        rotation: Math.random() * 720 - 360,
      };
    });

    setParticles(newParticles);

    const timer = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fireworks-overlay overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 8px 1px ${p.color}`,
            opacity: 0,
            "--fw-tx": p.tx,
            "--fw-ty": p.ty,
            "--fw-rot": `${p.rotation}deg`,
            animation: `fw-burst 2.4s cubic-bezier(0.25, 1, 0.5, 1) forwards ${p.animationDelay}`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
