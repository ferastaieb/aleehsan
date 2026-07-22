import type { DetailEntry, DetailKind } from "@/lib/types";

const kindLabels: Record<DetailKind, string> = {
  income: "مدخول",
  donation: "تبرع",
  expense: "صرف",
  "in-kind": "دعم عيني",
};

const kindClasses: Record<DetailKind, string> = {
  income: "bg-brand-lime/30 text-brand-dark",
  donation: "bg-brand-lime/50 text-brand-dark",
  expense: "bg-brand-gold/30 text-brand-dark",
  "in-kind": "bg-brand-sand text-brand-ink",
};

type LedgerListProps = {
  entries: DetailEntry[];
  emptyMessage: string;
};

const formatter = new Intl.NumberFormat("ar-SA");

function formatDate(value: string) {
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp)
    ? "—"
    : new Date(timestamp).toLocaleDateString("ar-SA");
}

function formatAmount(entry: DetailEntry) {
  return entry.amount !== null
    ? `${formatter.format(entry.amount)} ليرة`
    : "مساهمة غير نقدية";
}

export default function LedgerList({ entries, emptyMessage }: LedgerListProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-brand-sand bg-white p-6 text-sm text-brand-dark/70">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-4 md:hidden">
        {entries.map((entry) => (
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
              <span className="text-xs font-semibold text-brand-dark/70 tabular-nums">
                {formatAmount(entry)}
              </span>
            </div>
            <p className="mt-3 text-sm text-brand-dark">{entry.description}</p>
            <p className="mt-2 text-xs text-brand-dark/60">
              تاريخ الإضافة: {formatDate(entry.created_at)}
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
              {entries.map((entry, index) => (
                <tr
                  key={entry.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-brand-ivory/60"}
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
                  <td className="px-5 py-4 text-brand-dark tabular-nums">
                    {formatAmount(entry)}
                  </td>
                  <td className="px-5 py-4 text-brand-dark">
                    {formatDate(entry.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
