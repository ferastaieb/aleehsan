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
    keyframeName: string;
  }>>([]);

  useEffect(() => {
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
    const newParticles = Array.from({ length: 150 }, (_, i) => {
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
        animationDelay: `${Math.random() * 1.5}s`,
        tx: `${tx}vw`,
        ty: `${ty}vh`,
        rotation: Math.random() * 720 - 360,
        keyframeName: `fw-p-${i}`,
      };
    });

    setParticles(newParticles);

    const timer = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  // Build a single style block with ALL unique keyframes
  const keyframesCSS = particles
    .map(
      (p) => `
      @keyframes ${p.keyframeName} {
        0% { transform: translate(0, 0) rotate(0deg) scale(0); opacity: 1; }
        50% { opacity: 1; }
        100% { transform: translate(${p.tx}, ${p.ty}) rotate(${p.rotation}deg) scale(0.5); opacity: 0; }
      }`
    )
    .join("\n");

  return (
    <div className="fireworks-overlay overflow-hidden" aria-hidden="true">
      <style dangerouslySetInnerHTML={{ __html: keyframesCSS }} />
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
            boxShadow: `0 0 10px 2px ${p.color}`,
            opacity: 0,
            animation: `${p.keyframeName} 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards ${p.animationDelay}`,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
