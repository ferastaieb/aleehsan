import { cookies } from "next/headers";

import { loadDetails } from "@/lib/db";
import { loginAdmin } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const AUTH_COOKIE = "charty_admin";
const AUTH_VALUE = "ok";

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
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get(AUTH_COOKIE)?.value === AUTH_VALUE;

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-brand-ivory text-brand-ink">
        <header className="border-b border-brand-dark/10 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-brand-dark/60">لوحة التفاصيل</p>
              <h1 className="font-display text-2xl text-brand-dark">
                تسجيل الدخول للوصول
              </h1>
            </div>
          </div>
        </header>
        <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12">
          <form
            action={loginAdmin}
            className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_-35px_rgba(15,46,28,0.3)]"
          >
            <input type="hidden" name="redirect_to" value="/details" />
            <label className="flex flex-col gap-2 text-sm">
              كلمة المرور
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                className="rounded-xl border border-brand-sand bg-brand-ivory px-4 py-2"
                required
              />
            </label>
            <button
              type="submit"
              className="mt-6 w-full rounded-full bg-brand-lime px-6 py-3 text-sm font-semibold text-brand-ink"
            >
              دخول
            </button>
          </form>
        </main>
      </div>
    );
  }

  const details = await loadDetails();
  const formatter = new Intl.NumberFormat("ar-SA");
  const formatDetailDate = (value: string) => {
    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp)
      ? "—"
      : new Date(timestamp).toLocaleDateString("ar-SA");
  };

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-ink">
      <header className="border-b border-brand-dark/10 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10">
          <p className="text-sm text-brand-dark/60">المدخلات والمخرجات</p>
          <h1 className="font-display text-3xl text-brand-dark">
            تفاصيل ما يدخل وما يُصرف
          </h1>
          <p className="max-w-3xl text-sm text-brand-dark/70">
            هذه القائمة توضح أبرز المدخلات والمخرجات والمساهمات العينية المرتبطة
            بالمبادرة لضمان وضوح كامل عند فتحها للعلن.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
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
      </main>
    </div>
  );
}
