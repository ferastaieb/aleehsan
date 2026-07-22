import { getDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

type SalesPoint = { name: string; phone: string | null };

function parseSalesPoint(line: string): SalesPoint {
  const separatorIndex = line.indexOf("|");
  if (separatorIndex === -1) {
    return { name: line.trim(), phone: null };
  }
  const name = line.slice(0, separatorIndex).trim();
  const rawPhone = line.slice(separatorIndex + 1).trim();
  return {
    name: name || rawPhone,
    phone: rawPhone || null,
  };
}

function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const arabicOrdinals = [
  "الأول",
  "الثاني",
  "الثالث",
  "الرابع",
  "الخامس",
  "السادس",
  "السابع",
  "الثامن",
  "التاسع",
  "العاشر",
] as const;

export default async function PartnersPage() {
  const { settings } = await getDashboardData();
  const formatter = new Intl.NumberFormat("ar-SA");

  const salesPoints: SalesPoint[] = settings.sales_points
    ? settings.sales_points
      .split("\n")
      .map((point) => point.trim())
      .filter(Boolean)
      .map(parseSalesPoint)
      .filter((point) => point.name.length > 0)
    : [];

  const getPartnerLabel = (index: number) => {
    const ordinal = arabicOrdinals[index];
    if (ordinal) return `الشريك ${ordinal}`;
    return `الشريك رقم ${formatter.format(index + 1)}`;
  };

  return (
    <div className="min-h-screen bg-app-background text-app-foreground">
      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <section className="relative overflow-hidden rounded-3xl bg-brand-dark/95 py-12">
          <div className="absolute top-0 right-0 h-96 w-96 bg-brand-gold/10 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 left-0 h-72 w-72 bg-brand-lime/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 mb-10 px-6 text-center">
            <span className="inline-block text-brand-gold text-xs tracking-[0.2em] font-bold mb-3 px-3 py-1 bg-brand-gold/10 rounded-full border border-brand-gold/20">
              نقاط البيع
            </span>
            <h1 className="font-display text-4xl font-bold text-gradient-gold mb-4 pb-1">
              شركاء النجاح
            </h1>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-brand-gold to-transparent mx-auto opacity-70" />
            <p className="text-white/60 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
              نفتخر بشراكتنا مع نخبة من نقاط البيع التي ساهمت في إيصال رسالة
              الإحسان. يمكنك زيارة أي نقطة أو الاتصال بها مباشرة.
            </p>
          </div>

          <div className="relative z-10 px-6">
            {salesPoints.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {salesPoints.map((point, index) => (
                  <div
                    key={`${point.name}-${index}`}
                    className="group relative flex items-center gap-5 rounded-2xl border border-white/5 bg-white/[0.03] p-5 backdrop-blur-sm transition-all duration-500 hover:border-brand-gold/30 hover:bg-white/[0.08] hover:shadow-[0_0_30px_rgba(217,182,90,0.1)] focus-within:border-brand-gold/30 focus-within:bg-white/[0.08]"
                  >
                    <div className="badge-foil flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-brand-gold font-display font-bold text-xl group-hover:scale-110 transition-transform duration-500">
                      {formatter.format(index + 1)}
                    </div>
                    <div className="flex min-w-0 flex-col">
                      <span className="text-[10px] text-brand-gold/60 tracking-wider mb-1 font-medium">
                        {getPartnerLabel(index)}
                      </span>
                      <span className="font-display font-bold text-white text-lg tracking-wide group-hover:text-brand-gold group-focus-within:text-brand-gold transition-colors">
                        {point.name}
                      </span>
                    </div>

                    {point.phone ? (
                      <a
                        href={telHref(point.phone)}
                        dir="ltr"
                        className="ms-auto inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 bg-brand-gold/10 text-brand-gold shadow-inner transition-all duration-300 hover:scale-110 hover:bg-brand-gold hover:text-brand-dark active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
                        aria-label={`اتصال بـ ${point.name}`}
                        title="اتصال مباشر"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M6.54 4.98a1.5 1.5 0 0 1 1.57-.34l2.2.73a1.5 1.5 0 0 1 1.02 1.24l.19 2.23a1.5 1.5 0 0 1-.43 1.2l-1.1 1.1a13.4 13.4 0 0 0 3.87 3.87l1.1-1.1a1.5 1.5 0 0 1 1.2-.43l2.23.19a1.5 1.5 0 0 1 1.24 1.02l.73 2.2a1.5 1.5 0 0 1-.34 1.57l-1.3 1.3a2.5 2.5 0 0 1-2.47.65c-2.58-.65-4.97-2.24-7.18-4.45-2.21-2.21-3.8-4.6-4.45-7.18a2.5 2.5 0 0 1 .65-2.47l1.3-1.3Z" />
                        </svg>
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-white/60">
                ستظهر نقاط البيع هنا عند إضافتها.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
