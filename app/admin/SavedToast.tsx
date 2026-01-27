"use client";

import { useEffect, useState } from "react";

type SavedToastProps = {
  show: boolean;
  message: string;
  durationMs?: number;
};

export default function SavedToast({
  show,
  message,
  durationMs = 2400,
}: SavedToastProps) {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [show, durationMs]);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div
        className="rounded-full border border-brand-lime/40 bg-brand-lime/90 px-5 py-2 text-sm text-brand-ink shadow-lg"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {message}
      </div>
    </div>
  );
}
