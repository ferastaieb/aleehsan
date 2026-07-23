/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import FireworksIntro from "@/components/FireworksIntro";
import FloatingQuickActions from "@/components/FloatingQuickActions";
import ScrollReveal from "@/components/ScrollReveal";
import { loadDetails } from "@/lib/db";
import { getDashboardData } from "@/lib/data";
import type { GalleryItem } from "@/lib/types";

export const dynamic = "force-dynamic";

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  compact?: boolean;
};

function StatCard({ label, value, icon, compact = false }: StatCardProps) {
  if (compact) {
    return (
      <div className="glass-card flex flex-col items-center rounded-2xl border-transparent p-3 text-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-lime/30 to-brand-lime/10 text-brand-dark ring-1 ring-brand-lime/30">
          {icon}
        </div>
        <p className="mt-2 text-[10px] font-medium leading-tight text-brand-dark/70">{label}</p>
        <p className="mt-1 font-display text-xl font-bold leading-snug tracking-tight text-brand-dark tabular-nums">
          {value}
        </p>
      </div>
    );
  }
  return (
    <div className="glass-card flex min-w-[160px] flex-col rounded-2xl border-transparent p-5 transition-transform motion-safe:hover:-translate-y-1 focus-within:-translate-y-1 motion-reduce:transform-none">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-lime/30 to-brand-lime/10 text-brand-dark ring-1 ring-brand-lime/30 shadow-[0_4px_12px_-6px_rgba(201,242,92,0.7)]">
        {icon}
      </div>
      <p className="mt-4 text-xs font-medium tracking-wide text-brand-dark/70">{label}</p>
      <p className="mt-1 font-display text-[1.7rem] font-bold leading-snug tracking-tight text-brand-dark tabular-nums">
        {value}
      </p>
    </div>
  );
}

const VIDEO_FILE_PATTERN = /\.(mp4|webm|ogg)(\?.*)?$/i;

function getVideoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/embed/")) return url;
      const id = parsed.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host === "player.vimeo.com" && parsed.pathname.startsWith("/video/")) {
      return url;
    }
  } catch {
    return null;
  }
  return null;
}

function renderGalleryMedia(item: GalleryItem): ReactNode {
  const mediaUrl = item.media_url || "/place.png";
  if (item.media_type === "video") {
    const embedUrl = getVideoEmbedUrl(mediaUrl);
    if (embedUrl) {
      return (
        <iframe
          title={item.title}
          src={embedUrl}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      );
    }
    if (VIDEO_FILE_PATTERN.test(mediaUrl)) {
      return (
        <video
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        >
          <source src={mediaUrl} />
        </video>
      );
    }
    return (
      <img
        src="/place.png"
        alt={item.title}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <img
      src={mediaUrl}
      alt={item.title}
      className="h-full w-full object-cover"
      loading="lazy"
    />
  );
}

export default async function Home() {
  const [dashboardData, details] = await Promise.all([
    getDashboardData({ incrementVisitors: true }),
    loadDetails(),
  ]);
  const { settings, gallery } = dashboardData;
  const formatter = new Intl.NumberFormat("ar-SA");
  const hasGallery = Array.isArray(gallery) && gallery.length > 0;

  const formatMoney = (value: number) => `${formatter.format(value)} \u0644\u064a\u0631\u0629`;
  let biggestDonation: number | null = null;
  for (const entry of details) {
    if (
      (entry.kind === "donation" || entry.kind === "income") &&
      entry.amount !== null
    ) {
      biggestDonation =
        biggestDonation === null
          ? entry.amount
          : Math.max(biggestDonation, entry.amount);
    }
  }
  const biggestDonationText =
    biggestDonation === null ? "\u0644\u0627 \u062a\u0648\u062c\u062f \u0628\u064a\u0627\u0646\u0627\u062a" : formatMoney(biggestDonation);

  // Product figures (price, pieces sold) live on /products only.
  const stats = [
    {
      label: "\u0627\u0644\u0639\u0627\u0626\u0644\u0627\u062a \u0627\u0644\u0645\u0633\u062a\u0641\u064a\u062f\u0629",
      value: formatter.format(settings.families_supported),
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      label: "\u0627\u0644\u0645\u0634\u0627\u0631\u064a\u0639",
      value: formatter.format(settings.projects_launched),
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    },
    {
      label: "\u0639\u062f\u062f \u0627\u0644\u0632\u0648\u0627\u0631",
      value: formatter.format(settings.visitors_count),
      icon: (
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];
  return (
    <div className="min-h-screen bg-app-background text-app-foreground selection:bg-brand-lime selection:text-brand-dark">
      {/* Without JS, never leave scroll-reveal content hidden. */}
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            "<style>[data-reveal]{opacity:1 !important;transform:none !important}</style>",
        }}
      />
      <FireworksIntro />

      {/* --- HERO SECTION --- */}
      {/* Natural height on phones: a fixed vh minimum left a large empty
          dark band between the hero content and the stats cards. */}
      <header className="relative flex flex-col overflow-hidden bg-brand-dark pb-20 pt-16 md:min-h-[85vh] md:justify-center md:pb-0 md:pt-0">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -left-[20%] -top-[20%] h-[60vh] w-[60vh] rounded-full bg-brand-lime/10 blur-[120px] animate-pulse-glow" />
          <div className="absolute -right-[10%] top-[40%] h-[50vh] w-[50vh] rounded-full bg-brand-gold/5 blur-[100px] animate-float-drift" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent" />
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-6 text-center">
          <div className="animate-reveal-up" style={{ animationDelay: "0ms" }}>
            <img
              src="/logo.png"
              alt={"\u0627\u0644\u0625\u062d\u0633\u0627\u0646"}
              className="h-36 w-auto drop-shadow-2xl md:h-56 lg:h-64"
            />
          </div>

          <div
            className="mt-8 animate-reveal-up"
            style={{ animationDelay: "150ms" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-brand-lime backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-lime animate-pulse" />
              {"\u062a\u062d\u062f\u064a\u062b \u0627\u0644\u0634\u0647\u0631 \u0627\u0644\u0623\u0648\u0644"}
            </span>
          </div>

          <h1
            className="mt-6 font-display text-4xl font-bold leading-[1.15] tracking-tight text-white text-balance md:text-6xl lg:text-7xl animate-reveal-up"
            style={{ animationDelay: "300ms" }}
          >
            {"\u0634\u0643\u0631\u0627\u064b \u0644\u0623\u0646\u0643 "}<span className="text-gradient-lime">{"\u0634\u0631\u064a\u0643 \u0641\u064a \u0627\u0644\u062e\u064a\u0631"}</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-base leading-[1.9] text-white/75 md:text-lg animate-reveal-up"
            style={{ animationDelay: "450ms" }}
          >
            {"بشرائك لقرص المحبة، أنت لم تُمتع نفسك فقط، بل بنيت مستقبلاً لغيرك. أي مبلغ إضافي بالإضافة لأرباح هذا المشروع سيُستخدم لبناء مشاريع أخرى لتشغيل الأرامل والأيتام."}
          </p>

          <div
            className="mt-10 flex w-full flex-col gap-4 sm:flex-row sm:justify-center animate-reveal-up"
            style={{ animationDelay: "600ms" }}
          >
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm mx-auto md:max-w-lg">
              <div className="rounded-xl bg-white/5 p-3 backdrop-blur-sm border border-white/5 card-lift">
                <div className="text-brand-gold font-bold text-lg">100%</div>
                <div className="text-[10px] text-white/75">{"\u0644\u0644\u0645\u0634\u0627\u0631\u064a\u0639"}</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3 backdrop-blur-sm border border-white/5 card-lift">
                <div className="text-white font-bold text-lg">{"\u0627\u062e\u062a\u064a\u0627\u0631\u064a"}</div>
                <div className="text-[10px] text-white/75">{"\u062f\u0639\u0645 \u0625\u0636\u0627\u0641\u064a"}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* No hero overlap on phones: the marquee fades smeared white over
          the dark hero and the cards were clipped right at the fold. */}
      <main className="relative z-20 mt-0 px-4 pb-20 md:-mt-10 md:px-8">
        {/* --- STATS: static grid on phones, marquee on md+ --- */}
        <section className="mx-auto max-w-7xl py-4">
          <div className="grid grid-cols-3 gap-2 pt-6 md:hidden">
            {stats.map((stat) => (
              <StatCard key={`stat-mobile-${stat.label}`} {...stat} compact />
            ))}
          </div>
          <div className="slider-marquee slider-marquee--stats hidden md:block" dir="ltr">
            <div className="slider-marquee__fade slider-marquee__fade--left" />
            <div className="slider-marquee__fade slider-marquee__fade--right" />
            <div className="slider-marquee__track">
              {[0, 1].map((copyIndex) => (
                <div
                  key={`stats-group-${copyIndex}`}
                  className="slider-marquee__group py-4"
                  aria-hidden={copyIndex === 1}
                >
                  {stats.map((stat, statIndex) => (
                    <div
                      key={`stat-${copyIndex}-${stat.label}-${statIndex}`}
                      className="shrink-0 w-[200px]"
                      dir="rtl"
                    >
                      <StatCard {...stat} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- MILESTONE CARD --- */}
        <section className="mx-auto mt-8 max-w-7xl" data-reveal>
          <div className="group relative overflow-hidden rounded-3xl bg-brand-dark p-8 md:p-12 text-white shadow-2xl">
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-lime/20 blur-[80px] transition-transform duration-1000 group-hover:scale-125" />
            <div className="absolute left-0 bottom-0 h-40 w-40 translate-y-1/3 -translate-x-1/3 rounded-full bg-white/10 blur-[60px]" />

            <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center">
              <div className="relative">
                <div className="pointer-events-none absolute -right-4 top-20 h-40 w-1 rounded-full bg-gradient-to-b from-brand-lime/60 via-white/20 to-transparent" />
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-3 py-1 text-xs font-bold text-brand-dark mb-4">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {"\u0625\u0646\u062c\u0627\u0632 \u0643\u0628\u064a\u0631"}
                </div>
                <h2 className="font-display text-3xl font-bold md:text-5xl leading-tight">
                  {"\u0648\u0641\u0631\u0646\u0627 \u0633\u0639\u0631 \u0627\u0644\u063a\u0627\u0632 \u0648\u0627\u0644\u0641\u0631\u0646 "}<br className="hidden md:block" /> <span className="text-brand-lime/90">{"\u0643\u062e\u0637\u0648\u0629 \u0623\u0648\u0644\u0649"}</span>
                </h2>
                <p className="mt-4 text-white/80 md:text-lg max-w-xl">
                  {"\u0647\u0630\u0627 \u0627\u0644\u0625\u0646\u062c\u0627\u0632 \u064a\u0645\u062b\u0644 \u0628\u062f\u0627\u064a\u0629 \u0627\u0644\u0627\u0633\u062a\u0642\u0644\u0627\u0644 \u0627\u0644\u0641\u0639\u0644\u064a \u0644\u0644\u0645\u0634\u0631\u0648\u0639. \u0647\u062f\u0641\u0646\u0627 \u0627\u0644\u0642\u0627\u062f\u0645 \u0647\u0648 \u062a\u062b\u0628\u064a\u062a \u0627\u0644\u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u0630\u0627\u062a\u064a \u0648\u0627\u0633\u062a\u0645\u0631\u0627\u0631 \u0627\u0644\u062a\u0645\u0643\u064a\u0646 \u062f\u0648\u0646 \u0627\u0644\u062d\u0627\u062c\u0629 \u0644\u062f\u0639\u0645 \u0645\u0633\u062a\u0645\u0631."}
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-lime/90" />
                  <span className="h-px flex-1 bg-gradient-to-r from-brand-lime/70 via-brand-gold/40 to-transparent" />
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10">
                    <svg className="h-4 w-4 text-brand-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /><circle cx="12" cy="12" r="8" /></svg>
                  </span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10">
                    <svg className="h-4 w-4 text-brand-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5v14" /></svg>
                  </span>
                </div>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl border border-white/5" />
                <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10 transition-colors hover:bg-white/15 card-lift">
                  <p className="text-sm text-brand-lime/80">{"\u0627\u0644\u0645\u0634\u0631\u0648\u0639 \u0627\u0644\u062d\u0627\u0644\u064a"}</p>
                  <p className="mt-2 text-xl font-bold">{settings.project_title}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10 transition-colors hover:bg-white/15 card-lift">
                  <p className="text-sm text-brand-lime/80">{"\u0627\u0644\u0647\u062f\u0641 \u0627\u0644\u062a\u0627\u0644\u064a"}</p>
                  <p className="mt-2 text-xl font-bold">{"\u0645\u0634\u0631\u0648\u0639 \u0645\u0633\u062a\u0642\u0644 \u0630\u0627\u062a\u064a\u0627\u064b"}</p>
                </div>
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-lime/80" />
                  <span className="h-px w-10 bg-white/20" />
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-gold/80" />
                  <span className="h-px w-10 bg-white/20" />
                  <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- FINANCIAL HIGHLIGHTS --- */}
        <section
          className="mx-auto mt-6 max-w-7xl grid gap-6 md:grid-cols-3"
          data-reveal
        >
          <div className="glass-card md:col-span-2 rounded-3xl p-8 relative overflow-hidden group">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-lime/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="font-display text-2xl font-bold text-brand-dark mb-6 relative z-10">{"\u0645\u0644\u062e\u0635 \u0645\u0627\u0644\u064a \u0634\u0641\u0627\u0641"}</h3>

            <div className="space-y-6 relative z-10">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{"\u0627\u0644\u0631\u0635\u064a\u062f"}</span>
                  <span className="font-display font-bold tabular-nums text-brand-dark">{formatMoney(settings.total_surplus)}</span>
                </div>
                <div className="h-2.5 w-full bg-brand-dark/[0.06] rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(11,36,22,0.12)]">
                  <div className="h-full w-[85%] rounded-full bg-gradient-to-l from-brand-lime to-[#a8d93f] shadow-[0_0_14px_-2px_rgba(201,242,92,0.8)]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium">{"\u0623\u0643\u0628\u0631 \u062a\u0628\u0631\u0639 \u0641\u0631\u062f\u064a"}</span>
                  <span className="font-display font-bold tabular-nums text-brand-gold">{biggestDonationText}</span>
                </div>
                <div className="h-2.5 w-full bg-brand-dark/[0.06] rounded-full overflow-hidden shadow-[inset_0_1px_2px_rgba(11,36,22,0.12)]">
                  <div className="h-full w-[65%] rounded-full bg-gradient-to-l from-brand-gold to-[#c79f3e] shadow-[0_0_14px_-2px_rgba(217,182,90,0.7)]" />
                </div>
              </div>
            </div>

            <div className="mt-8 relative z-10 flex flex-wrap gap-x-6 gap-y-2">
              <a
                href="/income"
                className="group/income inline-flex items-center gap-2 rounded-lg text-sm font-bold text-brand-dark transition-colors hover:text-brand-lime"
              >
                {"تفاصيل الداخل والتبرعات"}
                <svg className="w-4 h-4 rtl:rotate-180 transition-transform motion-safe:group-hover/income:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <a
                href="/expenses"
                className="group/details inline-flex items-center gap-2 rounded-lg text-sm font-bold text-brand-dark transition-colors hover:text-brand-lime"
              >
                {"\u062a\u0641\u0627\u0635\u064a\u0644 \u0627\u0644\u062e\u0627\u0631\u062c \u0648\u0627\u0644\u0645\u0635\u0631\u0648\u0641\u0627\u062a"}
                <svg className="w-4 h-4 rtl:rotate-180 transition-transform motion-safe:group-hover/details:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
              <a
                href="/products"
                className="group/products inline-flex items-center gap-2 rounded-lg text-sm font-bold text-brand-dark transition-colors hover:text-brand-lime"
              >
                {"\u0627\u0644\u0645\u0646\u062a\u062c\u0627\u062a \u0648\u0627\u0644\u0623\u0633\u0639\u0627\u0631"}
                <svg className="w-4 h-4 rtl:rotate-180 transition-transform motion-safe:group-hover/products:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-8 flex flex-col justify-between bg-brand-sand/20">
            <div>
              <h3 className="font-display text-xl font-bold text-brand-dark">{"\u062b\u0648\u0627\u0628\u062a \u0627\u0644\u0645\u0634\u0631\u0648\u0639"}</h3>
              <ul className="mt-4 space-y-4">
                {[
                  "100% \u0645\u0646 \u0627\u0644\u0631\u0628\u062d \u0644\u0644\u0623\u064a\u062a\u0627\u0645",
                  "\u0644\u0627 \u062a\u0648\u062c\u062f \u0645\u0635\u0627\u0631\u064a\u0641 \u0625\u062f\u0627\u0631\u064a\u0629 \u0645\u062e\u0641\u064a\u0629",
                  "\u0634\u0641\u0627\u0641\u064a\u0629 \u062a\u0627\u0645\u0629 \u0641\u064a \u0627\u0644\u0623\u0631\u0642\u0627\u0645"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-brand-dark/80">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-dark" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 pt-6 border-t border-brand-dark/10">
              <p className="text-xs text-brand-dark/60 leading-relaxed">
                {"\u0627\u0644\u0647\u062f\u0641 \u0644\u064a\u0633 \u0641\u0642\u0637 \u062c\u0645\u0639 \u0627\u0644\u0645\u0627\u0644\u060c \u0628\u0644 \u0628\u0646\u0627\u0621 \u062b\u0642\u0629 \u0648\u0646\u0645\u0648\u0630\u062c \u064a\u062d\u062a\u0630\u0649 \u0628\u0647 \u0641\u064a \u0627\u0644\u0639\u0645\u0644 \u0627\u0644\u062e\u064a\u0631\u064a \u0627\u0644\u0645\u0633\u062a\u062f\u0627\u0645."}
              </p>
            </div>
          </div>
        </section>

        <div className="section-divider mx-auto my-16 max-w-3xl" aria-hidden="true" />

        {/* --- GALLERY SECTION --- */}
        <section className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8" data-reveal>
            <h2 className="font-display text-3xl font-bold text-brand-dark">{"\u0645\u0646 \u0627\u0644\u0645\u064a\u062f\u0627\u0646"}</h2>
            <div className="h-px flex-1 mx-6 bg-gradient-to-l from-transparent via-brand-dark/15 to-transparent" />
          </div>

          {hasGallery ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-xl card-lift"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <div className="h-full w-full transition-transform duration-700 group-hover:scale-105">
                      {renderGalleryMedia(item)}
                    </div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pt-20 text-white">
                    <div className="translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                      <h3 className="font-display text-lg font-bold">{item.title}</h3>
                      {item.description && (
                        <p className="mt-2 line-clamp-2 text-sm text-white/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {item.description}
                        </p>
                      )}
                    </div>
                    <span className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur-md px-3 py-1 text-xs font-medium">
                      {item.media_type === "video" ? "\u0641\u064a\u062f\u064a\u0648" : "\u0635\u0648\u0631\u0629"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-brand-sand/50 bg-white/50 p-12 text-center text-brand-dark/60">
              <p>{"\u0633\u064a\u062a\u0645 \u0625\u0636\u0627\u0641\u0629 \u0635\u0648\u0631 \u0648\u0641\u064a\u062f\u064a\u0648\u0647\u0627\u062a \u0642\u0631\u064a\u0628\u0627\u064b \u0644\u062a\u0648\u062b\u064a\u0642 \u0627\u0644\u0623\u062b\u0631."}</p>
            </div>
          )}
        </section>
      </main>

      <FloatingQuickActions
        phoneHref="tel:+963947511335"
        instagramHref="https://www.instagram.com/26_alehsan"
      />
      <ScrollReveal />

      <footer className="relative z-10 overflow-hidden bg-brand-dark text-white pt-16 pb-8 border-t border-brand-lime/15">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-brand-gold/50 to-transparent" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 h-48 w-[40rem] -translate-x-1/2 rounded-full bg-brand-lime/10 blur-[90px]" />
        <div className="relative mx-auto px-6 max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-right border-b border-white/[0.08] pb-8">
            <div>
              <h4 className="font-display text-2xl font-bold text-gradient-lime">{"\u0627\u0644\u0625\u062d\u0633\u0627\u0646.. \u0639\u0637\u0627\u0621 \u064a\u062b\u0645\u0631"}</h4>
              <p className="mt-2 text-white/60 text-sm max-w-md">{"\u0646\u0633\u0639\u0649 \u0644\u062a\u0645\u0643\u064a\u0646 \u0627\u0644\u0623\u0633\u0631 \u0627\u0644\u0645\u062d\u062a\u0627\u062c\u0629 \u0639\u0628\u0631 \u0645\u0634\u0627\u0631\u064a\u0639 \u062a\u0646\u0645\u0648\u064a\u0629 \u0645\u0633\u062a\u062f\u0627\u0645\u0629\u060c \u0628\u0634\u0641\u0627\u0641\u064a\u0629 \u062a\u0627\u0645\u0629 \u0648\u0634\u0631\u0627\u0643\u0629 \u0645\u062c\u062a\u0645\u0639\u064a\u0629 \u0641\u0627\u0639\u0644\u0629."}</p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/26_alehsan"
                className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center transition hover:bg-white/10 motion-safe:hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a
                href="tel:+963947511335"
                className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center transition hover:bg-white/10 motion-safe:hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-lime focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                aria-label="Call"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg>
              </a>
            </div>
          </div>
          <div className="pt-8 text-center text-xs text-white/30">
            &copy; {new Date().getFullYear()} {"\u0641\u0631\u064a\u0642 \u0627\u0644\u0625\u062d\u0633\u0627\u0646 \u0627\u0644\u062a\u0637\u0648\u0639\u064a. \u062c\u0645\u064a\u0639 \u0627\u0644\u062d\u0642\u0648\u0642 \u0645\u062d\u0641\u0648\u0638\u0629."}
          </div>
        </div>
      </footer>
    </div>
  );
}
