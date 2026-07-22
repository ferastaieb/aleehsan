import LedgerList from "@/components/LedgerList";
import { loadDetails } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function IncomePage() {
  const details = await loadDetails();
  const formatter = new Intl.NumberFormat("ar-SA");
  const formatMoney = (value: number) => `${formatter.format(value)} ليرة`;

  const incomeEntries = details.filter((entry) => entry.kind === "income");
  const donationEntries = details.filter(
    (entry) => entry.kind === "donation" || entry.kind === "in-kind",
  );

  const sumAmounts = (entries: typeof details) =>
    entries.reduce((total, entry) => total + (entry.amount ?? 0), 0);

  const incomeTotal = sumAmounts(incomeEntries);
  const donationTotal = sumAmounts(donationEntries);
  let biggestDonation: number | null = null;
  for (const entry of donationEntries) {
    if (entry.amount !== null) {
      biggestDonation =
        biggestDonation === null
          ? entry.amount
          : Math.max(biggestDonation, entry.amount);
    }
  }

  return (
    <div className="min-h-screen bg-app-background text-app-foreground">
      <header className="border-b border-brand-dark/10 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10">
          <p className="text-sm text-brand-dark/60">الشفافية المالية</p>
          <h1 className="font-display text-3xl text-brand-dark">الداخل</h1>
          <p className="max-w-3xl text-sm text-brand-dark/70">
            كل ما يدخل للمبادرة من مداخيل وتبرعات، مع فصل التبرعات في قسم مستقل
            لضمان وضوح كامل.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)]">
            <p className="text-xs text-brand-dark/60">إجمالي المداخيل</p>
            <p className="mt-2 font-display text-2xl text-brand-dark tabular-nums">
              {formatMoney(incomeTotal)}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)]">
            <p className="text-xs text-brand-dark/60">إجمالي التبرعات</p>
            <p className="mt-2 font-display text-2xl text-brand-dark tabular-nums">
              {formatMoney(donationTotal)}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)]">
            <p className="text-xs text-brand-dark/60">أكبر تبرع</p>
            <p className="mt-2 font-display text-2xl text-brand-dark tabular-nums">
              {biggestDonation === null
                ? "لا توجد بيانات"
                : formatMoney(biggestDonation)}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-brand-dark">
              المداخيل
            </h2>
            <div className="h-px flex-1 mx-6 bg-gradient-to-l from-transparent via-brand-dark/15 to-transparent" />
          </div>
          <LedgerList
            entries={incomeEntries}
            emptyMessage="لا توجد مداخيل مسجلة بعد."
          />
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-brand-dark">
              التبرعات
            </h2>
            <div className="h-px flex-1 mx-6 bg-gradient-to-l from-transparent via-brand-dark/15 to-transparent" />
          </div>
          <p className="mb-4 text-sm text-brand-dark/60">
            التبرعات النقدية والمساهمات العينية مفصولة هنا عن مداخيل البيع.
          </p>
          <LedgerList
            entries={donationEntries}
            emptyMessage="لا توجد تبرعات مسجلة بعد."
          />
        </section>
      </main>
    </div>
  );
}
