"use client";

import { useMemo } from "react";

type DonationCalculatorProps = {
  basePrice: number;
  currencyLabel?: string;
};

const DEFAULT_CURRENCY_LABEL = "ليرة";

export default function DonationCalculator({
  basePrice,
  currencyLabel = DEFAULT_CURRENCY_LABEL,
}: DonationCalculatorProps) {
  const formatter = useMemo(() => new Intl.NumberFormat("ar-SA"), []);
  const formattedBasePrice = formatter.format(basePrice);

  return (
    <div className="grid gap-8 rounded-3xl bg-white p-8 shadow-[0_20px_55px_-35px_rgba(15,46,28,0.35)] lg:grid-cols-[1.1fr_0.9fr] reveal-up">
      <div className="flex flex-col gap-4 reveal-up">
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
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-brand-sand bg-brand-ivory px-4 py-4 reveal-up reveal-delay-1">
          <p className="text-sm text-brand-dark/60">سعر التكلفة (مواد فقط)</p>
          <p className="mt-2 font-display text-3xl text-brand-dark">
            {formattedBasePrice} {currencyLabel}
          </p>
        </div>
        <div className="rounded-2xl bg-brand-lime/15 p-4 text-sm text-brand-dark/80 reveal-pulse reveal-delay-2">
          <p className="font-display text-lg text-brand-dark">
            دعمك مفتوح بلا سقف
          </p>
          <p className="mt-2">
            أي مبلغ تدفعه فوق سعر التكلفة يذهب 100% لدعم مشاريع العائلات، وكلما
            زاد دعمك زادت فرصنا لإطلاق مشاريع أكثر.
          </p>
        </div>
        <div className="rounded-2xl border border-brand-lime/40 bg-white p-4 text-sm text-brand-dark/80 reveal-up reveal-delay-3">
          <p className="font-semibold text-brand-dark">
            اختر دعماً سخياً قدر استطاعتك , دعمك الكبير يصنع فرقاً فورياً لعائلات
            أكثر.
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-sm text-brand-dark/70 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)] reveal-up reveal-delay-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-dark" />
            <span>سعر التكلفة = مواد خام فقط.</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-lime" />
            <span>ما يزيد عن التكلفة = دعم مشاريع العائلات.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
