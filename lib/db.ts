import "server-only";

import fs from "fs";
import path from "path";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";

import type { Settings, Store, Story } from "./types";

const CHARTY_TABLE_NAME = "ChartyTable";
const STORE_KEY = "STORE";

const projectDataDir = path.join(process.cwd(), "data");
const projectStorePath = path.join(projectDataDir, "store.json");

const region =
  process.env.AWS_REGION ??
  process.env.AWS_DEFAULT_REGION ??
  "us-east-1";

const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region }),
  { marshallOptions: { removeUndefinedValues: true } },
);
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

function readSeedStoreFile(): Store | null {
  if (!fs.existsSync(projectStorePath)) {
    return null;
  }
  try {
    const raw = fs.readFileSync(projectStorePath, "utf8");
    return JSON.parse(raw) as Store;
  } catch {
    return null;
  }
}

async function readStoreItem(): Promise<Store | null> {
  const response = await docClient.send(
    new GetCommand({
      TableName: CHARTY_TABLE_NAME,
      Key: { pk: STORE_KEY },
    }),
  );
  if (!response.Item) {
    return null;
  }
  const item = response.Item as Partial<Store> & { pk?: string };
  return {
    settings: item.settings as Settings,
    stories: item.stories as Story[],
  };
}

async function writeStoreItem(store: Store): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: CHARTY_TABLE_NAME,
      Item: {
        pk: STORE_KEY,
        settings: store.settings,
        stories: store.stories,
      },
    }),
  );
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

export async function loadStore(): Promise<Store> {
  const raw = await readStoreItem();
  const seed = raw ?? readSeedStoreFile();
  const { store, changed } = normalizeStore(seed);
  if (!raw || changed) {
    await writeStoreItem(store);
  }
  return store;
}

export async function saveStore(store: Store) {
  await writeStoreItem(store);
}
