/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";

import FireworksIntro from "@/components/FireworksIntro";
import FloatingQuickActions from "@/components/FloatingQuickActions";
import { loadDetails } from "@/lib/db";
import { getDashboardData } from "@/lib/data";
import type { GalleryItem } from "@/lib/types";

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
      className={`card-lift flex h-full flex-col rounded-2xl bg-brand-dark p-5 text-white shadow-[0_18px_40px_-30px_rgba(15,46,28,0.7)] ${className ?? ""}`}
      style={style}
    >
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-white/10 p-2 text-white">{icon}</div>
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
  const [dashboardData, details] = await Promise.all([
    getDashboardData({
      incrementVisitors: true,
    }),
    loadDetails(),
  ]);
  const { settings, gallery } = dashboardData;
  const formatter = new Intl.NumberFormat("ar-SA");
  const hasGallery = Array.isArray(gallery) && gallery.length > 0;

  const salesPoints = settings.sales_points
    ? settings.sales_points
        .split("\n")
        .map((point) => point.trim())
        .filter(Boolean)
    : [];

  const formatMoney = (value: number) => `${formatter.format(value)} ليرة`;
  let biggestDonation: number | null = null;
  for (const entry of details) {
    if (entry.kind === "income" && entry.amount !== null) {
      biggestDonation =
        biggestDonation === null
          ? entry.amount
          : Math.max(biggestDonation, entry.amount);
    }
  }
  const biggestDonationText =
    biggestDonation === null ? "لا توجد بيانات" : formatMoney(biggestDonation);

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
  const visitorsValue =
    settings.visitors_count === 1
      ? "زائر واحد"
      : `${formatter.format(settings.visitors_count)} زائر`;

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
    {
      label: "عدد الزوار",
      value: visitorsValue,
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
          <circle cx="12" cy="8" r="3" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      ),
    },
  ];

  const monthHighlights = [
    {
      title: "إنجاز الشهر الأول",
      description: "انطلقت أول خطوة عملية نحو استقلال المشروع.",
    },
    {
      title: "هدف الشهر القادم",
      description: "ترسيخ التشغيل الذاتي ليستمر المشروع بثبات.",
    },
    {
      title: "دعم المجتمع",
      description:
        "الشهر الأول نال دعماً كبيراً: متبرعون بالوقت، وآخرون بالتوصيل، وآخرون بالتغليف.",
    },
  ];

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-ink">
      <FireworksIntro />

      <header className="relative overflow-hidden bg-brand-dark text-white">
        <div className="pointer-events-none absolute -left-24 top-8 h-72 w-72 rounded-full bg-brand-lime/20 blur-3xl float-slow" />
        <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl float-slow float-delay-1" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-dark to-transparent" />

        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-14 text-center reveal-up">
          <img
            src="/logo.png"
            alt="الإحسان"
            className="h-32 w-auto sm:h-44 md:h-52 lg:h-64"
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-brand-lime pulse-dot" />
            <span>تحديث بعد مرور شهر من الإطلاق</span>
          </div>
          <h1 className="font-display text-3xl leading-tight md:text-5xl">
            نفس الهدف.. واستراتيجية أكثر استدامة
          </h1>
          <p className="max-w-3xl text-base text-white/85 md:text-lg">
            سعر القرص الآن ثابت وواضح للجميع، ومع ذلك تبقى الفكرة كما هي: صافي
            الأرباح بالكامل يذهب لدعم الأرامل والأيتام عبر مشاريع تمكين فقط دون
            أي عائد ربحي. وما زال بإمكان المشتري إضافة أي تبرع فوق السعر الرسمي.
          </p>

          <div className="grid w-full max-w-4xl gap-3 text-right sm:grid-cols-3">
            <div className="card-lift rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
              <p className="text-white/70">المنتج</p>
              <p className="mt-1 font-semibold text-white">سعر رسمي ثابت وواضح</p>
            </div>
            <div className="card-lift rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
              <p className="text-white/70">الدعم الإضافي</p>
              <p className="mt-1 font-semibold text-white">تبرع اختياري حسب الرغبة</p>
            </div>
            <div className="card-lift rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
              <p className="text-white/70">استخدام الربح</p>
              <p className="mt-1 font-semibold text-white">
                100% لمشاريع الأرامل والأيتام
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 -mt-8 pb-16">
        <section className="mx-auto max-w-6xl px-6">
          <div className="grid gap-4 md:grid-cols-3">
            {monthHighlights.map((item, index) => (
              <article
                key={item.title}
                className="card-lift reveal-up rounded-3xl border border-brand-sand bg-white p-6 shadow-[0_16px_42px_-30px_rgba(15,46,28,0.35)]"
                style={{ animationDelay: `${index * 110}ms` }}
              >
                <p className="text-xs text-brand-dark/60">{item.title}</p>
                <p className="mt-2 text-sm font-semibold text-brand-dark">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-6xl px-6">
          <div className="surface-shimmer reveal-up rounded-3xl bg-white/95 p-8 shadow-[0_24px_60px_-40px_rgba(15,46,28,0.45)]">
            <div className="flex flex-col gap-4 text-right md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-display text-2xl text-brand-dark">
                  ملخص مالي سريع وواضح
                </h2>
              </div>
              <a
                href="/details"
                className="inline-flex items-center justify-center rounded-full bg-brand-dark px-5 py-2 text-sm font-semibold !text-white transition hover:opacity-90"
                style={{ color: "#fff" }}
              >
                <span className="!text-white">عرض الجدول المالي الكامل</span>
              </a>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="card-lift rounded-2xl border border-brand-sand bg-brand-ivory/70 p-5">
                <p className="text-xs text-brand-dark/60">السعر الرسمي للقرص</p>
                <p className="mt-2 font-display text-3xl text-brand-dark">
                  {formatMoney(settings.base_price)}
                </p>
              </div>
              <div className="card-lift rounded-2xl border border-brand-sand bg-brand-ivory/70 p-5">
                <p className="text-xs text-brand-dark/60">إجمالي فائض التبرعات</p>
                <p className="mt-2 font-display text-3xl text-brand-dark">
                  {formatMoney(settings.total_surplus)}
                </p>
              </div>
              <div className="card-lift rounded-2xl border border-brand-sand bg-brand-ivory/70 p-5">
                <p className="text-xs text-brand-dark/60">أكبر تبرع</p>
                <p className="mt-2 font-display text-3xl text-brand-dark">
                  {biggestDonationText}
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm text-brand-dark/70">
              حتى مع السعر الثابت، جميع الأرباح مخصصة لدعم الأرامل والأيتام
              بالمشاريع فقط، دون أي عائد ربحي. والتبرع الإضافي فوق السعر الرسمي
              يبقى خياراً متاحاً لمن يرغب.
            </p>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-6xl px-6">
          <div className="rounded-3xl bg-white/90 p-8 shadow-[0_24px_60px_-40px_rgba(15,46,28,0.5)] backdrop-blur-sm reveal-up">
            <div className="flex flex-col gap-2 text-right md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-brand-dark/60">لوحة العدادات الحية</p>
                <h2 className="font-display text-2xl text-brand-dark">
                  الأثر بالأرقام
                </h2>
              </div>
              <div className="text-sm text-brand-dark/50">
                كل رقم يعكس العمل الميداني الفعلي
              </div>
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
          <div className="relative overflow-hidden rounded-3xl bg-brand-dark p-8 text-white shadow-[0_25px_70px_-45px_rgba(15,46,28,0.8)] reveal-up">
            <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-3xl bg-brand-lime/25" />
            <div className="pointer-events-none absolute left-0 bottom-0 h-16 w-16 rounded-tr-3xl bg-white/15" />
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-brand-lime/20 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute right-12 top-6 text-brand-lime/90">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.5 14.4 9.6l7.1 2.4-7.1 2.4-2.4 7.1-2.4-7.1-7.1-2.4 7.1-2.4L12 2.5Z" />
              </svg>
            </div>
            <div className="pointer-events-none absolute left-10 top-10 text-white/75">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3.2 13.8 8.5 19 10.2l-5.2 1.8L12 17.2l-1.8-5.2L5 10.2l5.2-1.7L12 3.2Z" />
              </svg>
            </div>
            <div className="relative flex flex-col gap-5 text-right">
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs">
                <span className="h-2 w-2 rounded-full bg-brand-lime pulse-dot" />
                إنجاز احتفالي
              </p>
              <h2 className="font-display text-3xl">
                وفرنا سعر الغاز والفرن كخطوة أولى
              </h2>
              <p className="max-w-3xl text-sm text-white/85">
                هذا الإنجاز يمثّل بداية الاستقلال الفعلي للمشروع، والقادم هو
                تثبيت التشغيل الذاتي واستمرار التمكين.
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="card-lift rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
                  <p className="text-white/70">المشروع</p>
                  <p className="mt-1 font-semibold text-white">
                    {settings.project_title}
                  </p>
                </div>
                <div className="card-lift rounded-2xl border border-white/20 bg-white/10 p-4 text-sm">
                  <p className="text-white/70">الهدف التالي</p>
                  <p className="mt-1 font-semibold text-white">
                    مشروع مستقل يعمل دون اعتماد على التبرعات.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="success-partners" className="mx-auto mt-12 max-w-6xl px-6">
          <div className="reveal-up rounded-3xl border border-brand-sand bg-white p-7 shadow-[0_18px_40px_-30px_rgba(15,46,28,0.35)]">
            <div className="flex flex-col gap-2 text-right md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-brand-dark/60">شركاء النجاح</p>
                <h2 className="font-display text-2xl text-brand-dark">
                  نقاط البيع المعتمدة
                </h2>
              </div>
              <p className="text-sm text-brand-dark/50">
                شركاء ساهموا في نشر المنتج وتعزيز الأثر لوجه الله
              </p>
            </div>
            <div className="mt-4 h-px bg-gradient-to-l from-brand-lime/70 via-brand-sand to-transparent" />
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-sand bg-brand-ivory px-4 py-1 text-sm font-semibold text-brand-dark">
              <span className="h-2 w-2 rounded-full bg-brand-lime" />
              عدد الشركاء: {formatter.format(salesPoints.length)}
            </div>
            {salesPoints.length > 0 ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {salesPoints.map((point, index) => (
                  <article
                    key={`${point}-${index}`}
                    className="card-lift reveal-up group relative overflow-hidden rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_16px_40px_-28px_rgba(15,46,28,0.35)]"
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-lime to-brand-dark" />
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-full border border-brand-sand bg-brand-lime/20 px-2 py-1 text-xs font-bold text-brand-dark">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="text-xs text-brand-dark/50">شريك نجاح</p>
                        <p className="mt-1 text-sm font-semibold text-brand-dark">
                          {point}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-brand-sand bg-white p-5 text-sm text-brand-dark/65">
                لا توجد نقاط بيع مضافة حالياً.
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-6xl px-6">
          <div className="flex flex-col gap-2 text-right md:flex-row md:items-center md:justify-between reveal-up">
            <div>
              <p className="text-sm text-brand-dark/60">صور وفيديوهات</p>
              <h2 className="font-display text-2xl text-brand-dark">
                لحظات حية من الميدان
              </h2>
            </div>
            <p className="text-sm text-brand-dark/50">
              اسحب يميناً ويساراً لاكتشاف الصور والفيديوهات.
            </p>
          </div>
          {hasGallery ? (
            <div className="mt-6 flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
              {gallery.map((item, index) => (
                <article
                  key={item.id}
                  className="card-lift w-[82%] min-w-[260px] max-w-sm snap-start rounded-3xl border border-brand-sand/70 bg-white shadow-[0_18px_50px_-35px_rgba(15,46,28,0.35)] reveal-up"
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
          ) : (
            <div className="mt-6 rounded-2xl border border-brand-sand bg-white p-6 text-sm text-brand-dark/70">
              سيتم إضافة صور وفيديوهات جديدة قريباً.
            </div>
          )}
        </section>
      </main>

      <FloatingQuickActions
        phoneHref="tel:+963947511335"
        instagramHref="https://www.instagram.com/26_alehsan"
        partnersAnchorId="success-partners"
      />

      <footer className="bg-brand-ink text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-right md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-lg">الإحسان.. عطاء يثمر.</p>
            <p className="text-sm text-white/70">
              نموذج مستدام يفتح باب التمكين ويوسّع أثر الخير.
            </p>
          </div>
          <div className="space-y-2 text-sm text-white/75">
            <a href="tel:+963947511335" className="block" dir="ltr">
              +963947511335
            </a>
            <a href="https://www.instagram.com/26_alehsan" className="block">
              Instagram: 26_alehsan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
