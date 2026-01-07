import "server-only";

import fs from "fs";
import path from "path";

import type { Settings, Store, Story } from "./types";

const projectDataDir = path.join(process.cwd(), "data");
const projectStorePath = path.join(projectDataDir, "store.json");
const runtimeDataDir = path.join(process.env.TMPDIR ?? "/tmp", "charty");
const runtimeStorePath = path.join(runtimeDataDir, "store.json");

function getWritableStorePath() {
  try {
    fs.accessSync(projectDataDir, fs.constants.W_OK);
    return projectStorePath;
  } catch {
    return runtimeStorePath;
  }
}

const writableStorePath = getWritableStorePath();
const defaultSalesPoints =
  "دمشق - سوق الحميدية\nحلب - السبع بحرات\nحمص - شارع الدبلان";

const defaultStories: Story[] = [
  {
    id: 1,
    title: "ماكينة خياطة",
    description: "عائلة أم أحمد بدأت مشروع تفصيل منزلي.",
    image_url: "/place.png",
    position: 1,
  },
  {
    id: 2,
    title: "عربة طعام",
    description: "الشاب خالد يعيل إخوته الآن.",
    image_url: "/place.png",
    position: 2,
  },
  {
    id: 3,
    title: "أدوات زراعية",
    description: "مشروع زراعة منزلية لعائلة متعففة.",
    image_url: "/place.png",
    position: 3,
  },
];

const defaultSettings: Settings = {
  id: 1,
  total_surplus: 15450,
  disks_sold: 5200,
  families_supported: 12,
  projects_launched: 8,
  visitors_count: 0,
  base_price: 12,
  extra_price: 1000,
  project_title: "شراء فرن منزلي للأرملة (س)",
  progress_percent: 70,
  remaining_amount: 300,
  sales_points: defaultSalesPoints,
  updated_at: new Date().toISOString(),
};

const defaultStore: Store = {
  settings: defaultSettings,
  stories: defaultStories,
};

function readStoreFile() {
  const preferredPath = fs.existsSync(runtimeStorePath)
    ? runtimeStorePath
    : projectStorePath;
  if (!fs.existsSync(preferredPath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(preferredPath, "utf8");
    return JSON.parse(raw) as Store;
  } catch {
    return null;
  }
}

function writeStoreFile(store: Store) {
  const targetPath = writableStorePath;
  try {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    const tempPath = `${targetPath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), "utf8");
    fs.renameSync(tempPath, targetPath);
  } catch (error) {
    console.error("Failed to write store.json", error);
  }
}

function normalizeStore(store: Store | null) {
  let changed = false;
  const safeNumber = (value: unknown, fallback: number) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      changed = true;
      return fallback;
    }
    if (parsed !== value) {
      changed = true;
    }
    return parsed;
  };
  const safeText = (value: unknown, fallback: string) => {
    if (typeof value !== "string") {
      changed = true;
      return fallback;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      changed = true;
      return fallback;
    }
    return trimmed;
  };

  const settingsInput = store?.settings ?? ({} as Partial<Settings>);
  const settings: Settings = {
    id: 1,
    total_surplus: safeNumber(
      settingsInput.total_surplus,
      defaultSettings.total_surplus,
    ),
    disks_sold: safeNumber(settingsInput.disks_sold, defaultSettings.disks_sold),
    families_supported: safeNumber(
      settingsInput.families_supported,
      defaultSettings.families_supported,
    ),
    projects_launched: safeNumber(
      settingsInput.projects_launched,
      defaultSettings.projects_launched,
    ),
    visitors_count: safeNumber(
      settingsInput.visitors_count,
      defaultSettings.visitors_count,
    ),
    base_price: safeNumber(settingsInput.base_price, defaultSettings.base_price),
    extra_price: safeNumber(
      settingsInput.extra_price,
      defaultSettings.extra_price,
    ),
    project_title: safeText(
      settingsInput.project_title,
      defaultSettings.project_title,
    ),
    progress_percent: safeNumber(
      settingsInput.progress_percent,
      defaultSettings.progress_percent,
    ),
    remaining_amount: safeNumber(
      settingsInput.remaining_amount,
      defaultSettings.remaining_amount,
    ),
    sales_points: safeText(
      settingsInput.sales_points,
      defaultSettings.sales_points,
    ),
    updated_at: safeText(
      settingsInput.updated_at,
      defaultSettings.updated_at,
    ),
  };

  const storiesInput = Array.isArray(store?.stories)
    ? store?.stories
    : defaultStories;
  const normalizedStories = storiesInput.map((story, index) => {
    const fallback = defaultStories[index];
    return {
      id: safeNumber(story?.id, fallback?.id ?? index + 1),
      title: safeText(story?.title, fallback?.title ?? "قصة جديدة"),
      description: safeText(
        story?.description,
        fallback?.description ?? "تفاصيل المشروع ستضاف قريباً.",
      ),
      image_url: safeText(story?.image_url, "/place.png"),
      position: safeNumber(story?.position, index + 1),
    };
  });

  normalizedStories.sort((first, second) => first.position - second.position);
  const stories = normalizedStories.map((story, index) => ({
    ...story,
    position: index + 1,
  }));

  return { store: { settings, stories }, changed };
}

export function loadStore(): Store {
  const raw = readStoreFile();
  const { store, changed } = normalizeStore(raw);
  if (!raw || changed) {
    writeStoreFile(store);
  }
  return store;
}

export function saveStore(store: Store) {
  writeStoreFile(store);
}
