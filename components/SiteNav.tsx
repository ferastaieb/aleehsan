"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  href: string;
  label: string;
  icon: ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    href: "/",
    label: "الرئيسية",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h5v-6h4v6h5V9.5" />
      </svg>
    ),
  },
  {
    href: "/income",
    label: "الداخل",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M4 21h16" />
      </svg>
    ),
  },
  {
    href: "/expenses",
    label: "الخارج",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 21V9" />
        <path d="m7 14 5-5 5 5" />
        <path d="M4 3h16" />
      </svg>
    ),
  },
  {
    href: "/products",
    label: "المنتجات",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M6 7h12l1 14H5L6 7z" />
        <path d="M9 10V6a3 3 0 0 1 6 0v4" />
      </svg>
    ),
  },
  {
    href: "/partners",
    label: "نقاط البيع",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
];

export default function SiteNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      data-sitenav
      aria-label="التنقل الرئيسي"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-brand-dark/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:sticky md:top-0 md:bottom-auto md:border-t-0 md:border-b md:border-white/10"
    >
      <div className="mx-auto flex max-w-7xl items-center md:gap-8 md:px-6">
        <Link
          href="/"
          className="hidden items-center gap-2 py-3 font-display text-lg font-bold text-white md:flex"
        >
          <span className="text-gradient-lime">الإحسان</span>
        </Link>
        <div className="grid w-full grid-cols-5 md:flex md:w-auto md:gap-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium transition-colors md:flex-row md:gap-2 md:rounded-full md:px-4 md:py-2 md:text-sm ${
                  active
                    ? "text-brand-lime md:bg-brand-lime/10"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span
                  className={`transition-transform ${active ? "scale-110 md:scale-100" : ""}`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
                <span
                  aria-hidden="true"
                  className={`h-1 w-1 rounded-full transition-opacity md:hidden ${
                    active ? "bg-brand-lime opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
