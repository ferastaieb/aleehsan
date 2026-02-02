/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";

import { getDashboardData } from "@/lib/data";
import type { GalleryItem } from "@/lib/types";
import DonationCalculator from "@/components/DonationCalculator";
import FireworksIntro from "@/components/FireworksIntro";
import SalesPointsModal from "@/components/SalesPointsModal";

export const dynamic = "force-dynamic";

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
  className?: string;
  style?: CSSProperties;
};

function StatCard({ label, value, icon, className, style }: StatCardProps) {
  return (
    <div
      className={`flex h-full flex-col rounded-2xl bg-brand-dark p-5 text-white shadow-[0_18px_40px_-30px_rgba(15,46,28,0.7)] ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-white/10 p-2 text-white">
          {icon}
        </div>
        <span className="text-xs text-white/60">محدث الآن</span>
      </div>
      <p className="mt-6 text-xs text-white/60">{label}</p>
      <p className="mt-2 font-display text-4xl text-brand-lime">{value}</p>
    </div>
  );
}

const VIDEO_FILE_PATTERN = /\.(mp4|webm|ogg)(\?.*)?$/i;

function getVideoEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/embed/")) {
        return url;
      }
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
  const { settings, stories, gallery } = await getDashboardData({
    incrementVisitors: true,
  });
  const formatter = new Intl.NumberFormat("ar-SA");
  const progress = Math.min(100, Math.max(0, settings.progress_percent));
  const hasGallery = Array.isArray(gallery) && gallery.length > 0;

  const progressStyle: CSSProperties = {
    width: `${progress}%`,
  };

  const salesPoints = settings.sales_points
    ? settings.sales_points
        .split("\n")
        .map((point) => point.trim())
        .filter(Boolean)
    : [];

  const disksValue =
    settings.disks_sold === 1
      ? "قرص واحد"
      : `${formatter.format(settings.disks_sold)} قرص`;
  const familiesValue =
    settings.families_supported === 1
      ? "عائلة واحدة"
      : `${formatter.format(settings.families_supported)} عائلة`;
  const projectsValue =
    settings.projects_launched === 1
      ? "مشروع واحد"
      : `${formatter.format(settings.projects_launched)} مشروع`;

  const stats = [
    {
      label: "عدد الأقراص المُباعة",
      value: disksValue,
      icon: (
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 11h16" />
          <path d="M6 7h12" />
          <path d="M6 15h12" />
          <path d="M5 5h14v14H5z" />
        </svg>
      ),
    },
    {
      label: "العائلات المستفيدة",
      value: familiesValue,
      icon: (
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 11a3 3 0 1 0-6 0v2" />
          <path d="M7 21v-3a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v3" />
          <circle cx="6" cy="9" r="2" />
          <circle cx="18" cy="9" r="2" />
          <path d="M3 21v-2a3 3 0 0 1 3-3" />
          <path d="M21 21v-2a3 3 0 0 0-3-3" />
        </svg>
      ),
    },
    {
      label: "مشاريع تم إطلاقها",
      value: projectsValue,
      icon: (
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20h16" />
          <path d="M8 20V8l4-4 4 4v12" />
          <path d="M8 10h8" />
          <path d="M10 14h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-ink">
      <FireworksIntro />
      <header className="relative overflow-hidden bg-brand-dark text-white">
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand-lime/20 blur-3xl float-slow" />
        <div className="pointer-events-none absolute -right-20 -top-10 h-60 w-60 rounded-full bg-white/10 blur-3xl float-slow float-delay-1" />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center reveal-up">
          <img
            src="/logo.png"
            alt="الإحسان"
            className="h-36 w-auto sm:h-44 md:h-56 lg:h-72"
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2 text-sm">
            <span className="text-white/60">مبادرة الأثر الشفاف</span>
          </div>
          <h1 className="font-display text-3xl leading-tight md:text-5xl">
            شكراً لأنك شريك في الخير
          </h1>
          <p className="max-w-2xl text-lg text-white/80">
            بشرائك لقرص المحبة، أنت لم تُمتِّع نفسك فقط، بل بنيت مستقبلاً لغيرك.
          </p>
        </div>
      </header>

      <main className="relative z-10 -mt-10 pb-16">
        <section className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl bg-white/90 p-8 shadow-[0_24px_60px_-40px_rgba(15,46,28,0.5)] backdrop-blur-sm reveal-up reveal-delay-1">
            <div className="flex flex-col gap-2 text-right md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-brand-dark/60">لوحة العدادات الحية</p>
                <h2 className="font-display text-2xl text-brand-dark">
                  الأثر بالأرقام
                </h2>
              </div>
              <div className="text-sm text-brand-dark/50">
                كل رقم يعكس مشروعاً قيد النمو
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-brand-sand bg-brand-ivory/60 p-4 text-right text-sm text-brand-dark/70 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-xs text-brand-dark/50">تواصل معنا للتبرع أو التعاون</p>
                <a
                  href="tel:+963947511335"
                  className="font-display text-lg text-brand-dark"
                  dir="ltr"
                >
                  +963947511335
                </a>
              </div>
              <div className="space-y-1">
                <a
                  href="https://www.instagram.com/26_alehsan"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-sand bg-white text-brand-dark transition hover:-translate-y-0.5 hover:shadow-md"
                  aria-label="Instagram"
                  title="Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                    <circle cx="12" cy="12" r="3.5" />
                    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
              </div>
              <p className="text-xs text-brand-dark/60 md:max-w-xs">
                If you want to donate from any spot in the world, just contact us
                at this number.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                  className="reveal-up"
                  style={{ animationDelay: `${index * 120}ms` }}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-6xl px-6">
          <DonationCalculator
            basePrice={settings.base_price}
            impactValue={settings.extra_price}
          />
          <div className="mt-4 flex flex-col items-start gap-2 text-right sm:flex-row sm:items-center sm:justify-start sm:gap-4">
            <a
              href="/details"
              className="order-2 inline-flex items-center justify-center rounded-full bg-brand-dark px-5 py-2 text-sm font-semibold text-white !text-white shadow-sm transition hover:opacity-90 self-start sm:order-1 sm:self-auto ml-auto"
            >
              اضغط هنا للتفاصيل المالية
            </a>
            <div className="order-1 space-y-2 text-sm text-brand-dark/70 sm:order-2">
              <p className="font-semibold text-brand-dark">
                الشفافية المالية تعرف على رحلة كل ليرة تدفعها:
              </p>
              <p>
                تكلفة الإنتاج والتشغيل: لضمان جودة المنتج واستمرار عمل المبادرة.
              </p>
              <p>
                عائد الأثر (صافي الربح): يذهب 100% لتمويل مشاريع العائلات (شراء
                الأصول والمعدات). يمكنك مشاهدة التقارير المالية المحدثة هنا.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-6xl px-6">
          <div className="flex flex-col gap-2 text-right md:flex-row md:items-center md:justify-between reveal-up">
            <div>
              <p className="text-sm text-brand-dark/60">قصص النجاح</p>
              <h2 className="font-display text-2xl text-brand-dark">
                شاهد أين ذهب تبرعك
              </h2>
            </div>
            <p className="text-sm text-brand-dark/50">
              اسحب لمشاهدة المزيد من المشاريع
            </p>
          </div>
          <div className="mt-6 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
            {stories.map((story, index) => (
              <article
                key={story.id}
                className="min-w-[260px] max-w-sm snap-start rounded-3xl bg-white shadow-[0_18px_50px_-35px_rgba(15,46,28,0.4)] reveal-up"
                style={{ animationDelay: `${index * 140}ms` }}
              >
                <img
                  src={story.image_url || "/place.png"}
                  alt={`صورة مؤقتة لـ ${story.title}`}
                  className="h-48 w-full rounded-3xl object-cover"
                />
                <div className="p-5">
                  <h3 className="font-display text-lg text-brand-dark">
                    {story.title}
                  </h3>
                  <p className="mt-2 text-sm text-brand-dark/70">
                    {story.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {hasGallery ? (
          <section className="mx-auto mt-12 max-w-6xl px-6">
            <div className="flex flex-col gap-2 text-right md:flex-row md:items-center md:justify-between reveal-up">
              <div>
                <p className="text-sm text-brand-dark/60">معرض الصور والفيديو</p>
                <h2 className="font-display text-2xl text-brand-dark">
                  لحظات حية من الميدان
                </h2>
              </div>
              <p className="text-sm text-brand-dark/50">
                اسحب يميناً ويساراً لاكتشاف الصور والفيديوهات.
              </p>
            </div>
            <div className="mt-6 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
              {gallery.map((item, index) => (
                <article
                  key={item.id}
                  className="w-[82%] min-w-[260px] max-w-sm snap-start rounded-3xl border border-brand-sand/70 bg-white shadow-[0_18px_50px_-35px_rgba(15,46,28,0.35)] reveal-up"
                  style={{ animationDelay: `${index * 140}ms` }}
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-sand/50">
                    {renderGalleryMedia(item)}
                    <span className="absolute right-4 top-4 rounded-full bg-brand-dark/80 px-3 py-1 text-xs text-white">
                      {item.media_type === "video" ? "فيديو" : "صورة"}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg text-brand-dark">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-brand-dark/70">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto mt-12 max-w-6xl px-6">
          <div className="rounded-3xl bg-brand-dark p-8 text-white shadow-[0_25px_70px_-45px_rgba(15,46,28,0.8)] reveal-up">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm text-white/70">شريط الحالة للمشروع القادم</p>
                <h2 className="font-display text-2xl">
                  مشروعنا الحالي: {settings.project_title}
                </h2>
                <p className="text-sm text-white/80">
                  باقي {formatter.format(settings.remaining_amount)} ليرة فقط
                  لاكتمال هذا المشروع!
                </p>
              </div>
              <div className="w-full lg:w-[45%]">
                <div className="h-3 w-full rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-brand-lime transition-all"
                    style={progressStyle}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-white/70">
                  <span>0%</span>
                  <span className="font-display text-sm">{progress}%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-brand-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg">الإحسان.. عطاء يثمر.</p>
            <p className="text-sm text-white/70">
              كن شريكاً دائماً في بناء فرص جديدة.
            </p>
          </div>
          <SalesPointsModal points={salesPoints} />
        </div>
      </footer>
    </div>
  );
}
