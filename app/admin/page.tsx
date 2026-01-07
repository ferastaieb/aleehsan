/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { cookies } from "next/headers";

import { getDashboardData } from "@/lib/data";

import {
  addStory,
  deleteStory,
  loginAdmin,
  logoutAdmin,
  updateAdminData,
} from "./actions";

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams?: {
    auth?: string;
    saved?: string;
    added?: string;
    deleted?: string;
  };
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const cookieStore = await cookies();
  const isAuthed = cookieStore.get("charty_admin")?.value === "ok";
  const authFailed = searchParams?.auth === "0";

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-brand-ivory text-brand-ink">
        <header className="border-b border-brand-dark/10 bg-white/90 backdrop-blur-sm">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-brand-dark/60">لوحة الإدارة</p>
              <h1 className="font-display text-2xl text-brand-dark">
                تسجيل الدخول
              </h1>
            </div>
            <Link
              href="/"
              className="text-sm text-brand-dark/70 underline decoration-brand-lime underline-offset-4"
            >
              العودة للواجهة الرئيسية
            </Link>
          </div>
        </header>
        <main className="mx-auto flex max-w-md flex-col gap-6 px-6 py-12">
          {authFailed ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              كلمة المرور غير صحيحة.
            </div>
          ) : null}
          <form
            action={loginAdmin}
            className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_-35px_rgba(15,46,28,0.3)]"
          >
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

  const { settings, stories } = getDashboardData();
  const saved = searchParams?.saved === "1";
  const added = searchParams?.added === "1";
  const deleted = searchParams?.deleted === "1";
  const updatedTimestamp = Date.parse(settings.updated_at);
  const updatedAt = Number.isNaN(updatedTimestamp)
    ? "—"
    : new Date(updatedTimestamp).toLocaleString("ar-SA");

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-ink">
      <header className="border-b border-brand-dark/10 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-brand-dark/60">لوحة الإدارة</p>
            <h1 className="font-display text-2xl text-brand-dark">
              إدخال وتحديث المعلومات
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-brand-dark/70 underline decoration-brand-lime underline-offset-4"
            >
              العودة للواجهة الرئيسية
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-full border border-brand-dark/10 px-4 py-2 text-xs text-brand-dark"
              >
                تسجيل الخروج
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
        {saved ? (
          <div className="rounded-2xl border border-brand-lime/40 bg-brand-lime/20 px-4 py-3 text-sm text-brand-dark">
            تم حفظ البيانات بنجاح.
          </div>
        ) : null}
        {added ? (
          <div className="rounded-2xl border border-brand-lime/40 bg-brand-lime/10 px-4 py-3 text-sm text-brand-dark">
            تمت إضافة قصة جديدة.
          </div>
        ) : null}
        {deleted ? (
          <div className="rounded-2xl border border-brand-sand bg-brand-ivory px-4 py-3 text-sm text-brand-dark">
            تم حذف القصة بنجاح.
          </div>
        ) : null}

        <form action={updateAdminData} className="grid gap-8">
          <section className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_-35px_rgba(15,46,28,0.3)]">
            <div className="mb-6">
              <h2 className="font-display text-xl text-brand-dark">
                لوحة العدادات الحية
              </h2>
              <p className="text-sm text-brand-dark/60">
                حدّث الأرقام الأساسية التي تظهر للزوار مباشرةً.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                إجمالي فائض التبرعات
                <input
                  name="total_surplus"
                  type="number"
                  min="0"
                  defaultValue={settings.total_surplus}
                  className="rounded-xl border border-brand-sand bg-brand-ivory px-4 py-2"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                عدد الأقراص المُباعة
                <input
                  name="disks_sold"
                  type="number"
                  min="0"
                  defaultValue={settings.disks_sold}
                  className="rounded-xl border border-brand-sand bg-brand-ivory px-4 py-2"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                العائلات المستفيدة
                <input
                  name="families_supported"
                  type="number"
                  min="0"
                  defaultValue={settings.families_supported}
                  className="rounded-xl border border-brand-sand bg-brand-ivory px-4 py-2"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                مشاريع تم إطلاقها
                <input
                  name="projects_launched"
                  type="number"
                  min="0"
                  defaultValue={settings.projects_launched}
                  className="rounded-xl border border-brand-sand bg-brand-ivory px-4 py-2"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_-35px_rgba(15,46,28,0.3)]">
            <div className="mb-6">
              <h2 className="font-display text-xl text-brand-dark">
                الشفافية المالية
              </h2>
              <p className="text-sm text-brand-dark/60">
                أدخل سعر التكلفة والمبلغ الزائد الذي يذهب للتمكين.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm">
                سعر القرص الأساسي
                <input
                  name="base_price"
                  type="number"
                  min="0"
                  defaultValue={settings.base_price}
                  className="rounded-xl border border-brand-sand bg-brand-ivory px-4 py-2"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                أي مبلغ إضافي (جميعه يذهب لدعم المشاريع)
                <input
                  name="extra_price"
                  type="number"
                  min="0"
                  defaultValue={settings.extra_price}
                  className="rounded-xl border border-brand-sand bg-brand-ivory px-4 py-2"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_-35px_rgba(15,46,28,0.3)]">
            <div className="mb-6">
              <h2 className="font-display text-xl text-brand-dark">
                شريط حالة المشروع القادم
              </h2>
              <p className="text-sm text-brand-dark/60">
                خصص المشروع الحالي ونسبة الإنجاز.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm md:col-span-2">
                عنوان المشروع
                <input
                  name="project_title"
                  type="text"
                  defaultValue={settings.project_title}
                  className="rounded-xl border border-brand-sand bg-brand-ivory px-4 py-2"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                نسبة الإنجاز (%)
                <input
                  name="progress_percent"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={settings.progress_percent}
                  className="rounded-xl border border-brand-sand bg-brand-ivory px-4 py-2"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                المبلغ المتبقي (ليرة)
                <input
                  name="remaining_amount"
                  type="number"
                  min="0"
                  defaultValue={settings.remaining_amount}
                  className="rounded-xl border border-brand-sand bg-brand-ivory px-4 py-2"
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_-35px_rgba(15,46,28,0.3)]">
            <div className="mb-6">
              <h2 className="font-display text-xl text-brand-dark">نقاط البيع</h2>
              <p className="text-sm text-brand-dark/60">
                أضف كل نقطة بيع في سطر مستقل ليظهر للزوار في النافذة المنبثقة.
              </p>
            </div>
            <label className="flex flex-col gap-2 text-sm">
              قائمة الأماكن
              <textarea
                name="sales_points"
                rows={5}
                defaultValue={settings.sales_points}
                className="rounded-xl border border-brand-sand bg-brand-ivory px-4 py-2"
              />
            </label>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-[0_20px_50px_-35px_rgba(15,46,28,0.3)]">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-display text-xl text-brand-dark">
                  قصص النجاح
                </h2>
                <p className="text-sm text-brand-dark/60">
                  أدخل عناوين القصص والوصف، واستمر باستخدام صورة place.png مؤقتاً.
                </p>
              </div>
              <button
                type="submit"
                formAction={addStory}
                className="rounded-full border border-brand-dark/10 bg-brand-white px-4 py-2 text-sm text-brand-dark shadow-sm"
              >
                إضافة قصة جديدة
              </button>
            </div>
            <div className="grid gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="grid gap-4 rounded-2xl border border-brand-sand bg-brand-ivory p-4 md:grid-cols-[140px_1fr]"
                >
                  <input type="hidden" name="story_id" value={story.id} />
                  <img
                    src={story.image_url || "/place.png"}
                    alt="صورة مؤقتة"
                    className="h-32 w-full rounded-xl object-cover"
                  />
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-brand-dark/60">
                        قصة رقم {story.position}
                      </span>
                      <button
                        type="submit"
                        formAction={deleteStory.bind(null, story.id)}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 transition hover:bg-red-50"
                      >
                        حذف القصة
                      </button>
                    </div>
                    <label className="flex flex-col gap-2 text-sm">
                      عنوان القصة
                      <input
                        name={`story_title_${story.id}`}
                        type="text"
                        defaultValue={story.title}
                        className="rounded-xl border border-brand-sand bg-white px-4 py-2"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      وصف مختصر
                      <textarea
                        name={`story_description_${story.id}`}
                        rows={3}
                        defaultValue={story.description}
                        className="rounded-xl border border-brand-sand bg-white px-4 py-2"
                      />
                    </label>
                    <label className="flex flex-col gap-2 text-sm">
                      رابط الصورة (place.png مؤقتاً)
                      <input
                        name={`story_image_${story.id}`}
                        type="text"
                        defaultValue={story.image_url}
                        className="rounded-xl border border-brand-sand bg-white px-4 py-2"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="flex flex-col items-start gap-2">
            <button
              type="submit"
              className="rounded-full bg-brand-lime px-6 py-3 text-sm font-semibold text-brand-ink"
            >
              حفظ البيانات
            </button>
            <p className="text-xs text-brand-dark/60">
              آخر تحديث: {updatedAt}
            </p>
          </section>
        </form>
      </main>
    </div>
  );
}
