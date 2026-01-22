"use client";

import { useMemo } from "react";

type DonationCalculatorProps = {
  basePrice: number;
  impactValue: number;
  currencyLabel?: string;
};

const DEFAULT_CURRENCY_LABEL = "ليرة";

export default function DonationCalculator({
  basePrice,
  impactValue,
  currencyLabel = DEFAULT_CURRENCY_LABEL,
}: DonationCalculatorProps) {
  const formatter = useMemo(() => new Intl.NumberFormat("ar-SA"), []);
  const formattedBasePrice = formatter.format(basePrice);
  const formattedImpactValue = formatter.format(impactValue);

  return (
    <div className="grid gap-8 rounded-3xl bg-white p-8 shadow-[0_20px_55px_-35px_rgba(15,46,28,0.35)] lg:grid-cols-[1.1fr_0.9fr] reveal-up">
      <div className="flex flex-col gap-4 reveal-up">
        <h2 className="font-display text-2xl text-brand-dark">
          كيف يعمل نموذجنا؟
        </h2>
        <p className="text-sm text-brand-dark/70">
          "شراؤك هو وقود العطاء المستدام" لضمان استمرار المبادرة وتوسعها، نقدم لك
          منتجنا بسعر ثابت ومدروس. كيف تُقسم قيمة المنتج؟ جزء يغطي تكاليف الإنتاج
          والتشغيل لضمان بقاء المبادرة، وصافي الربح بالكامل يتحول فوراً إلى رأس
          مال لمشاريع إنتاجية للعائلات المستفيدة. بشرائك، أنت تدعم استمرارية الخير
          وتصنع أثراً حقيقياً.
        </p>
        <div className="rounded-2xl bg-brand-ivory p-4 text-sm text-brand-dark/80">
          نحن لا نوزع المال كإعانات تنتهي باستهلاكها، بل نشتري معدات وأدوات
          (ماكينات خياطة، بسطات، أدوات صيانة) للعائلات ليعملوا ويعيلوا أنفسهم.
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-2xl border border-brand-sand bg-brand-ivory px-4 py-4 reveal-up reveal-delay-1">
          <p className="text-sm text-brand-dark/60">سعر المنتج</p>
          <p className="mt-2 font-display text-3xl text-brand-dark">
            {formattedBasePrice} {currencyLabel}
          </p>
        </div>
        <div className="rounded-2xl bg-brand-lime/15 p-4 text-sm text-brand-dark/80 reveal-pulse reveal-delay-2">
          <p className="text-sm text-brand-dark/60">قيمة الأثر من هذا المنتج</p>
          <p className="mt-2 font-display text-3xl text-brand-dark">
            {formattedImpactValue} {currencyLabel}
          </p>
        </div>
        <div className="rounded-2xl border border-brand-lime/40 bg-white p-4 text-sm text-brand-dark/80 reveal-up reveal-delay-3">
          <p className="font-display text-lg text-brand-dark">
            كل قطعة لها أثر محدد
          </p>
          <p className="mt-2">
            معادلتنا بسيطة: منتج تقتنيه بحب = مشروع تزرعه لأخيك. حددنا سعراً ثابتاً
            لنضمن تدفقاً مستمراً للدعم، فكلما زادت مبيعاتنا، زاد عدد المشاريع التي
            نطلقها (ماكينات خياطة، عربات طعام، معدات زراعية).
          </p>
        </div>
        <div className="rounded-2xl bg-white p-4 text-sm text-brand-dark/70 shadow-[0_12px_35px_-25px_rgba(15,46,28,0.35)] reveal-up reveal-delay-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-dark" />
            <span>
              تكلفة الإنتاج والتشغيل: لضمان جودة المنتج واستمرار عمل المبادرة.
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand-lime" />
            <span>
              عائد الأثر (صافي الربح): يذهب 100% لتمويل مشاريع العائلات (شراء
              الأصول والمعدات).
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
