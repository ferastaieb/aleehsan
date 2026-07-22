"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loadDetails, loadStore, saveDetails, saveStore } from "@/lib/db";

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

function toNullableNumber(
  value: FormDataEntryValue | null,
  fallback: number | null,
) {
  if (value === null || typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toDetailKind(
  value: FormDataEntryValue | null,
  fallback: "income" | "donation" | "expense" | "in-kind",
) {
  if (
    value === "income" ||
    value === "donation" ||
    value === "expense" ||
    value === "in-kind"
  ) {
    return value;
  }
  return fallback;
}

function toGalleryType(
  value: FormDataEntryValue | null,
  fallback: "image" | "video",
) {
  if (value === "image" || value === "video") {
    return value;
  }
  return fallback;
}

function toRedirectPath(value: FormDataEntryValue | null, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }
  const trimmed = value.trim();
  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }
  return trimmed;
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

  const redirectTo = toRedirectPath(formData.get("redirect_to"), "/admin");
  redirect(redirectTo);
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
  const store = await loadStore();
  const details = await loadDetails();

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

  const galleryIds = formData
    .getAll("gallery_id")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  if (galleryIds.length > 0) {
    const ids = new Set(galleryIds);
    store.gallery = store.gallery.map((item) => {
      if (!ids.has(item.id)) {
        return item;
      }
      const title = toText(
        formData.get(`gallery_title_${item.id}`),
        item.title || "عنصر معرض جديد",
      );
      const description = toText(
        formData.get(`gallery_description_${item.id}`),
        item.description || "تفاصيل المعرض ستضاف قريباً.",
      );
      const mediaUrl = toText(
        formData.get(`gallery_media_${item.id}`),
        item.media_url || "/place.png",
      );
      const mediaType = toGalleryType(
        formData.get(`gallery_type_${item.id}`),
        item.media_type,
      );

      return {
        ...item,
        title,
        description,
        media_url: mediaUrl,
        media_type: mediaType,
      };
    });
  }

  const productIds = formData
    .getAll("product_id")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  if (productIds.length > 0) {
    const ids = new Set(productIds);
    store.products = store.products.map((product) => {
      if (!ids.has(product.id)) {
        return product;
      }
      const name = toText(
        formData.get(`product_name_${product.id}`),
        product.name || "منتج جديد",
      );
      const description = toText(
        formData.get(`product_description_${product.id}`),
        product.description || "تفاصيل المنتج ستضاف قريباً.",
      );
      const imageUrl = toText(
        formData.get(`product_image_${product.id}`),
        product.image_url || "/place.png",
      );
      const price = toNumber(
        formData.get(`product_price_${product.id}`),
        product.price,
      );
      const sold = toNumber(
        formData.get(`product_sold_${product.id}`),
        product.sold,
      );

      return {
        ...product,
        name,
        description,
        image_url: imageUrl,
        price,
        sold,
      };
    });
  }

  const detailIds = formData
    .getAll("detail_id")
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  let nextDetails = details;
  if (detailIds.length > 0) {
    const ids = new Set(detailIds);
    nextDetails = details.map((entry) => {
      if (!ids.has(entry.id)) {
        return entry;
      }
      const description = toText(
        formData.get(`detail_description_${entry.id}`),
        entry.description,
      );
      const kind = toDetailKind(
        formData.get(`detail_kind_${entry.id}`),
        entry.kind,
      );
      const amount = toNullableNumber(
        formData.get(`detail_amount_${entry.id}`),
        entry.amount,
      );

      return {
        ...entry,
        description,
        kind,
        amount,
      };
    });
  }

  await saveStore(store);
  await saveDetails(nextDetails);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/income");
  revalidatePath("/expenses");
  revalidatePath("/products");
  revalidatePath("/partners");
  redirect("/admin?saved=1");
}

export async function addProduct() {
  await requireAuth();
  const store = await loadStore();

  const nextId = store.products.reduce(
    (maxId, product) => Math.max(maxId, product.id),
    0,
  );
  const nextPosition = store.products.reduce(
    (maxPosition, product) => Math.max(maxPosition, product.position),
    0,
  );

  store.products.push({
    id: nextId + 1,
    name: "منتج جديد",
    description: "تفاصيل المنتج ستضاف قريباً.",
    image_url: "/place.png",
    price: 0,
    sold: 0,
    position: nextPosition + 1,
  });

  await saveStore(store);
  revalidatePath("/products");
  revalidatePath("/admin");
  redirect("/admin?product_added=1");
}

export async function deleteProduct(productId: number) {
  await requireAuth();
  const store = await loadStore();

  if (!Number.isFinite(productId)) {
    redirect("/admin");
  }

  store.products = store.products.filter((product) => product.id !== productId);
  store.products = store.products
    .sort((first, second) => first.position - second.position)
    .map((product, index) => ({ ...product, position: index + 1 }));

  await saveStore(store);
  revalidatePath("/products");
  revalidatePath("/admin");
  redirect("/admin?product_deleted=1");
}

export async function addStory() {
  await requireAuth();
  const store = await loadStore();

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

  await saveStore(store);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?added=1");
}

export async function deleteStory(storyId: number) {
  await requireAuth();
  const store = await loadStore();

  if (!Number.isFinite(storyId)) {
    redirect("/admin");
  }

  store.stories = store.stories.filter((story) => story.id !== storyId);
  store.stories = store.stories
    .sort((first, second) => first.position - second.position)
    .map((story, index) => ({ ...story, position: index + 1 }));

  await saveStore(store);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?deleted=1");
}

export async function addGalleryItem() {
  await requireAuth();
  const store = await loadStore();

  const nextId = store.gallery.reduce(
    (maxId, item) => Math.max(maxId, item.id),
    0,
  );
  const nextPosition = store.gallery.reduce(
    (maxPosition, item) => Math.max(maxPosition, item.position),
    0,
  );

  store.gallery.push({
    id: nextId + 1,
    title: "عنصر معرض جديد",
    description: "تفاصيل المعرض ستضاف قريباً.",
    media_url: "/place.png",
    media_type: "image",
    position: nextPosition + 1,
  });

  await saveStore(store);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?gallery_added=1");
}

export async function deleteGalleryItem(itemId: number) {
  await requireAuth();
  const store = await loadStore();

  if (!Number.isFinite(itemId)) {
    redirect("/admin");
  }

  store.gallery = store.gallery.filter((item) => item.id !== itemId);
  store.gallery = store.gallery
    .sort((first, second) => first.position - second.position)
    .map((item, index) => ({ ...item, position: index + 1 }));

  await saveStore(store);
  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin?gallery_deleted=1");
}

export async function addDetailEntry() {
  await requireAuth();
  const details = await loadDetails();
  const nextId = details.reduce((maxId, entry) => Math.max(maxId, entry.id), 0);

  details.push({
    id: nextId + 1,
    kind: "income",
    description: "بند جديد",
    amount: null,
    created_at: new Date().toISOString(),
  });

  await saveDetails(details);
  revalidatePath("/admin");
  revalidatePath("/income");
  revalidatePath("/expenses");
  redirect("/admin?detail_added=1");
}

export async function deleteDetailEntry(detailId: number) {
  await requireAuth();
  const details = await loadDetails();

  if (!Number.isFinite(detailId)) {
    redirect("/admin");
  }

  const nextDetails = details.filter((entry) => entry.id !== detailId);
  await saveDetails(nextDetails);
  revalidatePath("/admin");
  revalidatePath("/income");
  revalidatePath("/expenses");
  redirect("/admin?detail_deleted=1");
}
