"use client";

import { useEffect, useState, useRef } from "react";

type FloatingQuickActionsProps = {
  phoneHref: string;
  instagramHref: string;
};

export default function FloatingQuickActions({
  phoneHref,
  instagramHref,
}: FloatingQuickActionsProps) {
  const [showPhoneHint, setShowPhoneHint] = useState(true);
  const phoneHintTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isPhone = window.matchMedia("(max-width: 768px)").matches;
    if (!isPhone) return;
    phoneHintTimerRef.current = setTimeout(() => {
      setShowPhoneHint(false);
    }, 5000);
    return () => {
      if (phoneHintTimerRef.current) clearTimeout(phoneHintTimerRef.current);
    };
  }, []);

  return (
    <>
      {/* bottom-24 on phones keeps the buttons clear of the bottom tab bar */}
      <div dir="ltr" className="fixed bottom-24 right-4 z-[60] flex items-center gap-2 md:bottom-5">
        {showPhoneHint ? (
          <span className="floating-phone-hint pointer-events-none select-none rounded-full border border-brand-sand bg-white px-4 py-1 text-xs font-semibold text-brand-dark shadow-md" dir="rtl">
            للتبرع او الطلب اضغط هنا
          </span>
        ) : null}
        <a
          href={phoneHref}
          dir="ltr"
          className="animate-fab-in inline-flex h-14 w-14 items-center justify-center rounded-full border-2 border-brand-lime/50 bg-white text-brand-dark shadow-[0_20px_40px_-22px_rgba(15,46,28,0.8)] transition motion-safe:hover:-translate-y-1 hover:shadow-[0_24px_45px_-20px_rgba(15,46,28,0.9)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-app-background"
          aria-label="الاتصال بنا"
          title="اتصال"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M6.54 4.98a1.5 1.5 0 0 1 1.57-.34l2.2.73a1.5 1.5 0 0 1 1.02 1.24l.19 2.23a1.5 1.5 0 0 1-.43 1.2l-1.1 1.1a13.4 13.4 0 0 0 3.87 3.87l1.1-1.1a1.5 1.5 0 0 1 1.2-.43l2.23.19a1.5 1.5 0 0 1 1.24 1.02l.73 2.2a1.5 1.5 0 0 1-.34 1.57l-1.3 1.3a2.5 2.5 0 0 1-2.47.65c-2.58-.65-4.97-2.24-7.18-4.45-2.21-2.21-3.8-4.6-4.45-7.18a2.5 2.5 0 0 1 .65-2.47l1.3-1.3Z" />
          </svg>
        </a>
      </div>

      <a
        href={instagramHref}
        className="animate-fab-in fixed bottom-24 left-4 z-[60] inline-flex h-14 w-14 items-center justify-center rounded-full border border-brand-sand bg-white text-brand-dark shadow-[0_20px_40px_-22px_rgba(15,46,28,0.5)] transition motion-safe:hover:-translate-y-1 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 focus-visible:ring-offset-app-background md:bottom-5"
        aria-label="Instagram"
        title="Instagram"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="3.5" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </>
  );
}
