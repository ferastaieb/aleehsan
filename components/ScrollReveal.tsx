"use client";

import { useEffect } from "react";

/**
 * Reveals any [data-reveal] element once it scrolls into view by toggling
 * `is-visible`. Renders nothing. Uses a passive scroll/resize listener with a
 * rAF guard (universally reliable across browsers) and reveals everything
 * immediately when the user prefers reduced motion — so content is never left
 * hidden.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (els.length === 0) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReduced) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    let pending = els.slice();
    let frame = 0;

    const cleanup = () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) cancelAnimationFrame(frame);
    };

    const check = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      pending = pending.filter((el) => {
        const rect = el.getBoundingClientRect();
        const inView = rect.top < viewportHeight * 0.88 && rect.bottom > 0;
        if (inView) {
          el.classList.add("is-visible");
          return false;
        }
        return true;
      });
      if (pending.length === 0) cleanup();
    };

    function schedule() {
      if (!frame) frame = requestAnimationFrame(check);
    }

    // Safety net: never leave content hidden if something prevents scrolling.
    const safety = window.setTimeout(() => {
      pending.forEach((el) => el.classList.add("is-visible"));
      pending = [];
      cleanup();
    }, 4000);

    check();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cleanup();
      clearTimeout(safety);
    };
  }, []);

  return null;
}
