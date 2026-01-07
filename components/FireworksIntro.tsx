"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

export default function FireworksIntro() {
  const [visible, setVisible] = useState(true);
  const rays = useMemo(() => Array.from({ length: 8 }), []);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fireworks-overlay" aria-hidden="true">
      <div className="firework firework-left">
        {rays.map((_, index) => (
          <span
            key={`left-${index}`}
            style={{ "--i": index } as CSSProperties}
          />
        ))}
      </div>
      <div className="firework firework-right">
        {rays.map((_, index) => (
          <span
            key={`right-${index}`}
            style={{ "--i": index } as CSSProperties}
          />
        ))}
      </div>
      <div className="firework firework-left firework-secondary">
        {rays.map((_, index) => (
          <span
            key={`left-secondary-${index}`}
            style={{ "--i": index } as CSSProperties}
          />
        ))}
      </div>
      <div className="firework firework-right firework-secondary">
        {rays.map((_, index) => (
          <span
            key={`right-secondary-${index}`}
            style={{ "--i": index } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
