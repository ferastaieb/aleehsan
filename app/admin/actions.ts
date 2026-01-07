"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDb, initDb } from "@/lib/db";

const ADMIN_PASSWORD = "1234@@Ff";
const AUTH_COOKIE = "charty_admin";
const AUTH_VALUE = "ok";

function toNumber(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toText(value: FormDataEntryValue | null, fallback = "") {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;
  if (token !== AUTH_VALUE) {
    redirect("/admin?auth=0");
  }
}

export async function loginAdmin(formData: FormData) {
  const password = formData.get("password");
  if (typeof password !== "string" || password !== ADMIN_PASSWORD) {
    redirect("/admin?auth=0");
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, AUTH_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  redirect("/admin");
}

export async function updateAdminData(formData: FormData) {
  await requireAuth();
  initDb();
  const db = getDb();

  const totalSurplus = toNumber(formData.get("total_surplus"));
  const disksSold = toNumber(formData.get("disks_sold"));
  const familiesSupported = toNumber(formData.get("families_supported"));
  const projectsLaunched = toNumber(formData.get("projects_launched"));
  const visitorsCount = toNumber(formData.get("visitors_count"));
  const basePrice = toNumber(formData.get("base_price"));
  const extraPrice = toNumber(formData.get("extra_price"));
  const projectTitle = toText(formData.get("project_title"));
  const salesPoints = toText(formData.get("sales_points"));
  const progressPercent = Math.min(
    100,
    Math.max(0, toNumber(formData.get("progress_percent"))),
  );
  const remainingAmount = toNumber(formData.get("remaining_amount"));

  db.prepare(
    `
    UPDATE settings
    SET
      total_surplus = ?,
      disks_sold = ?,
      families_supported = ?,
      projects_launched = ?,
      visitors_count = ?,
      base_price = ?,
      extra_price = ?,
      project_title = ?,
      progress_percent = ?,
      remaining_amount = ?,
      sales_points = ?,
      updated_at = ?
    WHERE id = 1
  `,
  ).run(
    totalSurplus,
    disksSold,
    familiesSupported,
    projectsLaunched,
    visitorsCount,
    basePrice,
    extraPrice,
    projectTitle || "مشروع جديد قيد الإطلاق",
    progressPercent,
    remainingAmount,
    salesPoints,
    new Date().toISOString(),
  );

  const storyIds = formData
    .getAll("story_id")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  if (storyIds.length > 0) {
    const updateStory = db.prepare(
      `
      UPDATE stories
      SET title = ?, description = ?, image_url = ?
      WHERE id = ?
    `,
    );

    for (const id of storyIds) {
      const title = toText(formData.get(`story_title_${id}`), "قصة جديدة");
      const description = toText(
        formData.get(`story_description_${id}`),
        "تفاصيل المشروع ستضاف قريباً.",
      );
      const imageUrl = toText(
        formData.get(`story_image_${id}`),
        "/place.png",
      );

      updateStory.run(title, description, imageUrl, id);
    }
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}

export async function addStory() {
  await requireAuth();
  initDb();
  const db = getDb();

  const nextPosition = (
    db
      .prepare("SELECT COALESCE(MAX(position), 0) + 1 as nextPosition FROM stories")
      .get() as { nextPosition: number }
  ).nextPosition;

  db.prepare(
    `
    INSERT INTO stories (title, description, image_url, position)
    VALUES (?, ?, ?, ?)
  `,
  ).run(
    "قصة جديدة",
    "تفاصيل المشروع ستضاف قريباً.",
    "/place.png",
    nextPosition,
  );

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?added=1");
}

export async function deleteStory(storyId: number) {
  await requireAuth();
  initDb();
  const db = getDb();

  if (!Number.isFinite(storyId)) {
    redirect("/admin");
  }

  db.prepare("DELETE FROM stories WHERE id = ?").run(storyId);

  const remainingStories = db
    .prepare("SELECT id FROM stories ORDER BY position ASC")
    .all() as { id: number }[];
  const updatePosition = db.prepare(
    "UPDATE stories SET position = ? WHERE id = ?",
  );
  remainingStories.forEach((story, index) => {
    updatePosition.run(index + 1, story.id);
  });

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?deleted=1");
}
