"use client";

import { useMemo } from "react";

type DonationCalculatorProps = {
  basePrice: number;
  impactValue: number;
  currencyLabel?: string;
  showImpactValue?: boolean;
};

const DEFAULT_CURRENCY_LABEL = "ليرة";

export default function DonationCalculator({
  basePrice,
  impactValue,
  currencyLabel = DEFAULT_CURRENCY_LABEL,
  showImpactValue = true,
}: DonationCalculatorProps) {
  const formatter = useMemo(() => new Intl.NumberFormat("ar-SA"), []);
  const formattedBasePrice = formatter.format(basePrice);
  const formattedImpactValue = formatter.format(impactValue);

  return (
    <div className="rounded-3xl bg-white p-8 shadow-[0_20px_55px_-35px_rgba(15,46,28,0.35)] reveal-up">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-brand-sand bg-brand-ivory px-4 py-4 reveal-up reveal-delay-1">
          <p className="text-sm text-brand-dark/60">السعر الرسمي للقرص</p>
          <p className="mt-2 font-display text-3xl text-brand-dark">
            {formattedBasePrice} {currencyLabel}
          </p>
        </div>
        {showImpactValue ? (
          <div className="rounded-2xl bg-brand-lime/15 p-4 text-sm text-brand-dark/80 reveal-pulse reveal-delay-2">
            <p className="text-sm text-brand-dark/60">قيمة الأثر من هذا المنتج</p>
            <p className="mt-2 font-display text-3xl text-brand-dark">
              {formattedImpactValue} {currencyLabel}
            </p>
          </div>
        ) : null}
        <div className="rounded-2xl border border-brand-lime/40 bg-white p-4 text-sm text-brand-dark/80 reveal-up reveal-delay-3">
          <p className="font-display text-lg text-brand-dark">
            التبرع الإضافي يبقى متاحاً
          </p>
          <p className="mt-2">
            معادلتنا الجديدة: سعر رسمي ثابت + دعم اختياري. جميع الأرباح مخصصة
            لدعم الأرامل والأيتام عبر مشاريع تمكين فقط، دون أي عائد ربحي خاص.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-sm text-brand-dark/70 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)] reveal-up reveal-delay-2 lg:col-span-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-dark" />
            <span>
              تكلفة الإنتاج والتشغيل: لضمان جودة المنتج واستمرار المبادرة.
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-lime" />
            <span>
              صافي الربح بالكامل: يذهب لمشاريع دعم وتمكين الأرامل والأيتام دون
              أي عائد ربحي.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
