import { loadDetails, loadStore } from "@/lib/db";

export const dynamic = "force-dynamic";


const kindLabels = {
  income: "مدخول",
  expense: "صرف",
  "in-kind": "دعم عيني",
} as const;

const kindClasses = {
  income: "bg-brand-lime/30 text-brand-dark",
  expense: "bg-brand-gold/30 text-brand-dark",
  "in-kind": "bg-brand-sand text-brand-ink",
} as const;

export default async function DetailsPage() {
  const details = await loadDetails();
  const store = await loadStore();
  const { settings } = store;
  const formatter = new Intl.NumberFormat("ar-SA");
  let biggestDonation: number | null = null;
  let biggestExpense: number | null = null;

  for (const entry of details) {
    if (entry.amount === null) {
      continue;
    }
    if (entry.kind === "income") {
      biggestDonation =
        biggestDonation === null
          ? entry.amount
          : Math.max(biggestDonation, entry.amount);
    } else if (entry.kind === "expense") {
      biggestExpense =
        biggestExpense === null
          ? entry.amount
          : Math.max(biggestExpense, entry.amount);
    }
  }

  const formatMoney = (value: number) => `${formatter.format(value)} ليرة`;
  const biggestDonationText =
    biggestDonation === null ? "لا توجد بيانات" : formatMoney(biggestDonation);
  const biggestExpenseText =
    biggestExpense === null ? "لا توجد بيانات" : formatMoney(biggestExpense);
  const formatDetailDate = (value: string) => {
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp)
      ? "—"
      : new Date(timestamp).toLocaleDateString("ar-SA");
  };

  return (
    <div className="min-h-screen bg-app-background text-app-foreground">
      <header className="border-b border-brand-dark/10 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10">
          <p className="text-sm text-brand-dark/60">المدخلات والمخرجات</p>
          <h1 className="font-display text-3xl text-brand-dark">
            تفاصيل ما يدخل وما يُصرف
          </h1>
          <p className="max-w-3xl text-sm text-brand-dark/70">
            هذه القائمة توضح أبرز المدخلات والمخرجات والمساهمات العينية المرتبطة
            بالمبادرة لضمان وضوح كامل .
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)]">
            <p className="text-xs text-brand-dark/60">إجمالي فائض التبرعات</p>
            <p className="mt-2 font-display text-2xl text-brand-dark">
              {formatMoney(settings.total_surplus)}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)]">
            <p className="text-xs text-brand-dark/60">أكبر تبرع</p>
            <p className="mt-2 font-display text-2xl text-brand-dark">
              {biggestDonationText}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)]">
            <p className="text-xs text-brand-dark/60">أكبر صرف</p>
            <p className="mt-2 font-display text-2xl text-brand-dark">
              {biggestExpenseText}
            </p>
          </div>
        </section>

        <div className="mt-8">
          {details.length === 0 ? (
          <div className="rounded-2xl border border-brand-sand bg-white p-6 text-sm text-brand-dark/70">
            لا توجد بنود بعد.
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:hidden">
              {details.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-2xl border border-brand-sand bg-white p-4 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)]"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${kindClasses[entry.kind]}`}
                    >
                      {kindLabels[entry.kind]}
                    </span>
                    <span className="text-xs text-brand-dark/60">
                      {entry.amount !== null
                        ? `${formatter.format(entry.amount)} ليرة`
                        : "مساهمة غير نقدية"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-brand-dark">
                    {entry.description}
                  </p>
                  <p className="mt-2 text-xs text-brand-dark/60">
                    تاريخ الإضافة: {formatDetailDate(entry.created_at)}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <div className="overflow-hidden rounded-2xl border border-brand-sand bg-white shadow-[0_18px_40px_-32px_rgba(15,46,28,0.35)]">
                <table className="w-full text-right text-sm">
                  <thead className="bg-brand-ivory text-brand-dark/70">
                    <tr>
                      <th className="px-5 py-3 font-semibold">النوع</th>
                      <th className="px-5 py-3 font-semibold">الوصف</th>
                      <th className="px-5 py-3 font-semibold">القيمة</th>
                      <th className="px-5 py-3 font-semibold">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {details.map((entry, index) => (
                      <tr
                        key={entry.id}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-brand-ivory/60"
                        }
                      >
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs ${kindClasses[entry.kind]}`}
                          >
                            {kindLabels[entry.kind]}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-brand-dark">
                          {entry.description}
                        </td>
                        <td className="px-5 py-4 text-brand-dark">
                          {entry.amount !== null
                            ? `${formatter.format(entry.amount)} ليرة`
                            : "مساهمة غير نقدية"}
                        </td>
                        <td className="px-5 py-4 text-brand-dark">
                          {formatDetailDate(entry.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
        </div>
      </main>
    </div>
  );
}
