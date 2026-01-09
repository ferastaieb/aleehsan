"use client";

import { useMemo, useState } from "react";

type DonationCalculatorProps = {
  basePrice: number;
  defaultExtraPrice: number;
  currencyLabel?: string;
};

const DEFAULT_CURRENCY_LABEL = "ليرة";

export default function DonationCalculator({
  basePrice,
  defaultExtraPrice,
  currencyLabel = DEFAULT_CURRENCY_LABEL,
}: DonationCalculatorProps) {
  const formatter = useMemo(() => new Intl.NumberFormat("ar-SA"), []);
  const initialExtraAmount =
    Number.isFinite(defaultExtraPrice) && defaultExtraPrice > 0
      ? String(defaultExtraPrice)
      : "";
  const placeholderAmount =
    Number.isFinite(defaultExtraPrice) && defaultExtraPrice > 0
      ? formatter.format(defaultExtraPrice)
      : "1000";

  const [extraAmount, setExtraAmount] = useState(initialExtraAmount);

  const parsedExtra = Number(extraAmount);
  const safeExtra =
    Number.isFinite(parsedExtra) && parsedExtra >= 0 ? parsedExtra : 0;
  const totalPrice = basePrice + safeExtra;
  const basePercent =
    totalPrice > 0 ? Math.round((basePrice / totalPrice) * 100) : 0;
  const safeBase = Math.min(100, Math.max(0, basePercent));

  const pieStyle =
    totalPrice > 0
      ? {
          background: `conic-gradient(var(--color-brand-dark) 0 ${safeBase}%, var(--color-brand-lime) ${safeBase}% 100%)`,
        }
      : {
          background: "conic-gradient(var(--color-brand-sand) 0 100%)",
        };

  return (
    <div className="grid gap-8 rounded-3xl bg-white p-8 shadow-[0_20px_55px_-35px_rgba(15,46,28,0.35)] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col gap-4">
        <h2 className="font-display text-2xl text-brand-dark">
          كيف يعمل نموذجنا؟
        </h2>
        <p className="text-sm text-brand-dark/70">
          نبيعك المنتج بسعر المواد الخام فقط. لا نأخذ أجراً على التصنيع، وأي
          مبلغ تضيفه يذهب 100% لدعم مشاريع العائلات.
        </p>
        <div className="rounded-2xl bg-brand-ivory p-4 text-sm text-brand-dark/80">
          نحن لا نوزع المال كإعانات تنتهي باستهلاكها، بل نشتري معدات وأدوات
          (ماكينات خياطة، بسطات، أدوات صيانة) للعائلات ليعملوا ويعيلوا أنفسهم.
        </div>
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between rounded-xl border border-brand-sand bg-white px-4 py-3">
            <span>سعر التكلفة (مواد فقط)</span>
            <span className="font-display text-lg text-brand-dark">
              {formatter.format(basePrice)} {currencyLabel}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-sand bg-white px-4 py-3">
            <div className="flex flex-col">
              <span>أي مبلغ إضافي</span>
              <span className="text-xs text-brand-dark/60">
                يذهب 100% لدعم مشاريع العائلات
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="1"
                value={extraAmount}
                onChange={(event) => setExtraAmount(event.target.value)}
                placeholder={`مثلاً ${placeholderAmount}`}
                className="w-28 rounded-lg border border-brand-lime/60 bg-brand-ivory px-3 py-2 text-center font-display text-base text-brand-gold shadow-sm transition hover:border-brand-lime/80 focus:border-brand-lime focus:outline-none focus:ring-2 focus:ring-brand-lime/30"
                aria-label="أدخل أي مبلغ إضافي"
              />
              <span className="text-xs text-brand-dark/60">{currencyLabel}</span>
            </div>
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
              توزيع السعر
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-brand-dark" />
              <span>سعر المواد الخام</span>
            </div>
            <span className="font-display text-base">{safeBase}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-brand-lime" />
              <span>دعمك للعائلات</span>
            </div>
            <span className="text-xs text-brand-dark/70">
              جميع ما تدفعه فوق سعر التكلفة
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
