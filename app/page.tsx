/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";

import { getDashboardData } from "@/lib/data";
import FireworksIntro from "@/components/FireworksIntro";
import SalesPointsModal from "@/components/SalesPointsModal";

export const dynamic = "force-dynamic";

type StatCardProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-brand-dark p-5 text-white shadow-[0_18px_40px_-30px_rgba(15,46,28,0.7)]">
      <div className="flex items-center justify-between">
        <div className="rounded-full bg-white/10 p-2 text-brand-lime">
          {icon}
        </div>
        <span className="text-xs text-white/60">محدث الآن</span>
      </div>
      <p className="mt-6 text-sm text-white/70">{label}</p>
      <p className="mt-2 font-display text-3xl text-brand-lime">{value}</p>
    </div>
  );
}

export default async function Home() {
  const { settings, stories } = await getDashboardData({
    incrementVisitors: true,
  });
  const formatter = new Intl.NumberFormat("ar-SA");
  const totalPrice = settings.base_price + settings.extra_price;
  const hasPrice = totalPrice > 0;
  const basePercent = hasPrice
    ? Math.round((settings.base_price / totalPrice) * 100)
    : 0;
  const safeBase = Math.min(100, Math.max(0, basePercent));
  const progress = Math.min(100, Math.max(0, settings.progress_percent));

  const pieStyle: CSSProperties = hasPrice
    ? {
        background: `conic-gradient(var(--color-brand-dark) 0 ${safeBase}%, var(--color-brand-lime) ${safeBase}% 100%)`,
      }
    : {
        background: "conic-gradient(var(--color-brand-sand) 0 100%)",
      };

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
      : `${formatter.format(settings.projects_launched)} مشاريع`;

  const stats = [
    {
      label: "إجمالي فائض التبرعات",
      value: `${formatter.format(settings.total_surplus)} ليرة`,
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
          <path d="M12 3v18" />
          <path d="M7 7h8a3 3 0 0 1 0 6H9a3 3 0 0 0 0 6h8" />
        </svg>
      ),
    },
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
        <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-brand-lime/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 -top-10 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
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
            بشراؤك لقرص المحبة، أنت لم تطعم نفسك فقط، بل بنيت مستقبلاً لغيرك.
          </p>
        </div>
      </header>

      <main className="relative z-10 -mt-10 pb-16">
        <section className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl bg-white/90 p-8 shadow-[0_24px_60px_-40px_rgba(15,46,28,0.5)] backdrop-blur-sm">
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
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <StatCard
                  key={stat.label}
                  label={stat.label}
                  value={stat.value}
                  icon={stat.icon}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-6xl px-6">
          <div className="grid gap-8 rounded-3xl bg-white p-8 shadow-[0_20px_55px_-35px_rgba(15,46,28,0.35)] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col gap-4">
              <h2 className="font-display text-2xl text-brand-dark">
                كيف يعمل نموذجنا؟
              </h2>
              <p className="text-sm text-brand-dark/70">
                الشفافية المالية هي جوهر المبادرة، ويمكنك شراء القرص بسعر
                التكلفة أو إضافة أي مبلغ تراه مناسباً فوق التكلفة، وجميعه يذهب
                لدعم المشاريع.
              </p>
              <div className="rounded-2xl bg-brand-ivory p-4 text-sm text-brand-dark/80">
                نحن لا نوزع المال كإعانات تنتهي باستهلاكها، بل نشتري معدات
                وأدوات (ماكينات خياطة، بسطات، أدوات صيانة) للعائلات ليعملوا
                ويعيلوا أنفسهم.
              </div>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between rounded-xl border border-brand-sand bg-white px-4 py-3">
                  <span>سعر القرص الأساسي</span>
                  <span className="font-display text-lg text-brand-dark">
                    {formatter.format(settings.base_price)} ليرة
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-brand-sand bg-white px-4 py-3">
                  <div className="flex flex-col">
                    <span>أي مبلغ إضافي</span>
                    <span className="text-xs text-brand-dark/60">
                      جميعه يذهب لدعم المشاريع
                    </span>
                  </div>
                  <span className="font-display text-lg text-brand-gold">
                    {formatter.format(settings.extra_price)} ليرة مثلا
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-6">
              <div
                className="relative h-56 w-56 rounded-full shadow-[0_18px_40px_-30px_rgba(15,46,28,0.5)]"
                style={pieStyle}
                aria-label="نسبة توزيع الأموال"
              >
                <div className="absolute inset-6 rounded-full bg-white" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-brand-dark px-4 py-2 text-sm text-white">
                    شفافية كاملة
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-brand-dark" />
                    <span>التكلفة التشغيلية</span>
                  </div>
                  <span className="font-display text-base">
                    {safeBase}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-brand-lime" />
                    <span>التمكين المباشر</span>
                  </div>
                  <span className="text-xs text-brand-dark/70">
                    جميع ما تدفعه فوق سعر التكلفة
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-6xl px-6">
          <div className="flex flex-col gap-2 text-right md:flex-row md:items-center md:justify-between">
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
            {stories.map((story) => (
              <article
                key={story.id}
                className="min-w-[260px] max-w-sm snap-start rounded-3xl bg-white shadow-[0_18px_50px_-35px_rgba(15,46,28,0.4)]"
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

        <section className="mx-auto mt-12 max-w-6xl px-6">
          <div className="rounded-3xl bg-brand-dark p-8 text-white shadow-[0_25px_70px_-45px_rgba(15,46,28,0.8)]">
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
          <div className="flex flex-col gap-2 text-sm text-white/80">
            <span>تواصل معنا للتبرع أو التعاون</span>
            <a
              href="tel:+963991353511"
              className="font-display text-lg text-brand-lime"
              dir="ltr"
            >
              +963991353511
            </a>
          </div>
          <SalesPointsModal points={salesPoints} />
        </div>
      </footer>
    </div>
  );
}
