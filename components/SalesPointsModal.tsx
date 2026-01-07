"use client";

import { useState } from "react";

type SalesPointsModalProps = {
  points: string[];
};

export default function SalesPointsModal({ points }: SalesPointsModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-white/30 px-5 py-2 text-sm text-white transition hover:border-white/60"
      >
        نقاط البيع
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 text-brand-ink shadow-[0_30px_80px_-50px_rgba(0,0,0,0.6)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-brand-dark">
                نقاط البيع
              </h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-brand-sand px-3 py-1 text-xs text-brand-dark/70"
              >
                إغلاق
              </button>
            </div>
            {points.length > 0 ? (
              <ul className="mt-4 space-y-2 text-sm text-brand-dark/70">
                {points.map((point, index) => (
                  <li key={`${point}-${index}`} className="rounded-xl bg-brand-ivory px-3 py-2">
                    {point}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-brand-dark/60">
                لا توجد أماكن مضافة بعد.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
