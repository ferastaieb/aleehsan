/* eslint-disable @next/next/no-img-element */
import { getDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const { products } = await getDashboardData();
  const formatter = new Intl.NumberFormat("ar-SA");
  const formatMoney = (value: number) => `${formatter.format(value)} ليرة`;

  const totalSold = products.reduce((total, product) => total + product.sold, 0);

  return (
    <div className="min-h-screen bg-app-background text-app-foreground">
      <header className="border-b border-brand-dark/10 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10">
          <p className="text-sm text-brand-dark/60">منتجات المبادرة</p>
          <h1 className="font-display text-3xl text-brand-dark">المنتجات</h1>
          <p className="max-w-3xl text-sm text-brand-dark/70">
            منتجات تُصنع بأيدي العائلات المستفيدة، وريعها بالكامل يعود لتشغيلهم
            ودعم مشاريعهم.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)]">
            <p className="text-xs text-brand-dark/60">عدد المنتجات</p>
            <p className="mt-2 font-display text-2xl text-brand-dark tabular-nums">
              {formatter.format(products.length)}
            </p>
          </div>
          <div className="rounded-2xl border border-brand-sand bg-white p-5 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)]">
            <p className="text-xs text-brand-dark/60">إجمالي القطع المباعة</p>
            <p className="mt-2 font-display text-2xl text-brand-dark tabular-nums">
              {formatter.format(totalSold)}
            </p>
          </div>
        </section>

        <section className="mt-10">
          {products.length === 0 ? (
            <div className="rounded-3xl border border-brand-sand/50 bg-white/50 p-12 text-center text-brand-dark/60">
              <p>ستظهر المنتجات هنا عند إضافتها من لوحة الإدارة.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm transition-all hover:shadow-xl card-lift"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                    <img
                      src={product.image_url || "/place.png"}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="font-display text-xl font-bold text-brand-dark">
                      {product.name}
                    </h2>
                    {product.description ? (
                      <p className="mt-2 text-sm leading-relaxed text-brand-dark/70">
                        {product.description}
                      </p>
                    ) : null}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-brand-lime/15 p-3 text-center ring-1 ring-brand-lime/25">
                        <p className="text-[11px] text-brand-dark/60">
                          سعر القطعة
                        </p>
                        <p className="mt-1 font-display text-lg font-bold text-brand-dark tabular-nums">
                          {formatMoney(product.price)}
                        </p>
                      </div>
                      <div className="rounded-2xl bg-brand-gold/15 p-3 text-center ring-1 ring-brand-gold/25">
                        <p className="text-[11px] text-brand-dark/60">
                          القطع المباعة
                        </p>
                        <p className="mt-1 font-display text-lg font-bold text-brand-dark tabular-nums">
                          {formatter.format(product.sold)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
