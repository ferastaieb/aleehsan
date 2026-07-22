import LedgerList from "@/components/LedgerList";
import { loadDetails } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ExpensesPage() {
  const details = await loadDetails();
  const formatter = new Intl.NumberFormat("ar-SA");
  const formatMoney = (value: number) => `${formatter.format(value)} ليرة`;

  const expenseEntries = details.filter((entry) => entry.kind === "expense");
  const expensesTotal = expenseEntries.reduce(
    (total, entry) => total + (entry.amount ?? 0),
    0,
  );
  let biggestExpense: number | null = null;
  for (const entry of expenseEntries) {
    if (entry.amount !== null) {
      biggestExpense =
        biggestExpense === null
          ? entry.amount
          : Math.max(biggestExpense, entry.amount);
    }
  }

  return (
    <div className="min-h-screen bg-app-background text-app-foreground">
      <header className="border-b border-brand-dark/10 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10">
          <p className="text-sm text-brand-dark/60">الشفافية المالية</p>
          <h1 className="font-display text-3xl text-brand-dark">الخارج</h1>
          <p className="max-w-3xl text-sm text-brand-dark/70">
            كل شيء نشتريه وندفعه لتشغيل المبادرة، مسجل هنا بندًا بندًا.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)]">
            <p className="text-xs text-brand-dark/60">إجمالي المصروفات</p>
            <p className="mt-2 font-display text-2xl text-brand-dark tabular-nums">
              {formatMoney(expensesTotal)}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)]">
            <p className="text-xs text-brand-dark/60">أكبر صرف</p>
            <p className="mt-2 font-display text-2xl text-brand-dark tabular-nums">
              {biggestExpense === null
                ? "لا توجد بيانات"
                : formatMoney(biggestExpense)}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)]">
            <p className="text-xs text-brand-dark/60">عدد البنود</p>
            <p className="mt-2 font-display text-2xl text-brand-dark tabular-nums">
              {formatter.format(expenseEntries.length)}
            </p>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-brand-dark">
              المصروفات
            </h2>
            <div className="h-px flex-1 mx-6 bg-gradient-to-l from-transparent via-brand-dark/15 to-transparent" />
          </div>
          <LedgerList
            entries={expenseEntries}
            emptyMessage="لا توجد مصروفات مسجلة بعد."
          />
        </section>
      </main>
    </div>
  );
}
