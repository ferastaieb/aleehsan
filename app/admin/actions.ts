"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loadStore, saveStore } from "@/lib/db";

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
  const store = loadStore();

  const totalSurplus = toNumber(
    formData.get("total_surplus"),
    store.settings.total_surplus,
  );
  const disksSold = toNumber(
    formData.get("disks_sold"),
    store.settings.disks_sold,
  );
  const familiesSupported = toNumber(
    formData.get("families_supported"),
    store.settings.families_supported,
  );
  const projectsLaunched = toNumber(
    formData.get("projects_launched"),
    store.settings.projects_launched,
  );
  const visitorsCount = toNumber(
    formData.get("visitors_count"),
    store.settings.visitors_count,
  );
  const basePrice = toNumber(
    formData.get("base_price"),
    store.settings.base_price,
  );
  const extraPrice = toNumber(
    formData.get("extra_price"),
    store.settings.extra_price,
  );
  const projectTitle = toText(
    formData.get("project_title"),
    store.settings.project_title,
  );
  const salesPoints = toText(
    formData.get("sales_points"),
    store.settings.sales_points,
  );
  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      toNumber(formData.get("progress_percent"), store.settings.progress_percent),
    ),
  );
  const remainingAmount = toNumber(
    formData.get("remaining_amount"),
    store.settings.remaining_amount,
  );

  store.settings = {
    ...store.settings,
    total_surplus: totalSurplus,
    disks_sold: disksSold,
    families_supported: familiesSupported,
    projects_launched: projectsLaunched,
    visitors_count: visitorsCount,
    base_price: basePrice,
    extra_price: extraPrice,
    project_title: projectTitle || "مشروع جديد قيد الإطلاق",
    progress_percent: progressPercent,
    remaining_amount: remainingAmount,
    sales_points: salesPoints,
    updated_at: new Date().toISOString(),
  };

  const storyIds = formData
    .getAll("story_id")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  if (storyIds.length > 0) {
    const ids = new Set(storyIds);
    store.stories = store.stories.map((story) => {
      if (!ids.has(story.id)) {
        return story;
      }
      const title = toText(
        formData.get(`story_title_${story.id}`),
        story.title || "قصة جديدة",
      );
      const description = toText(
        formData.get(`story_description_${story.id}`),
        story.description || "تفاصيل المشروع ستضاف قريباً.",
      );
      const imageUrl = toText(
        formData.get(`story_image_${story.id}`),
        story.image_url || "/place.png",
      );

      return {
        ...story,
        title,
        description,
        image_url: imageUrl,
      };
    });
  }

  saveStore(store);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?saved=1");
}

export async function addStory() {
  await requireAuth();
  const store = loadStore();

  const nextId = store.stories.reduce(
    (maxId, story) => Math.max(maxId, story.id),
    0,
  );
  const nextPosition = store.stories.reduce(
    (maxPosition, story) => Math.max(maxPosition, story.position),
    0,
  );

  store.stories.push({
    id: nextId + 1,
    title: "قصة جديدة",
    description: "تفاصيل المشروع ستضاف قريباً.",
    image_url: "/place.png",
    position: nextPosition + 1,
  });

  saveStore(store);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?added=1");
}

export async function deleteStory(storyId: number) {
  await requireAuth();
  const store = loadStore();

  if (!Number.isFinite(storyId)) {
    redirect("/admin");
  }

  store.stories = store.stories.filter((story) => story.id !== storyId);
  store.stories = store.stories
    .sort((first, second) => first.position - second.position)
    .map((story, index) => ({ ...story, position: index + 1 }));

  saveStore(store);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?deleted=1");
}
