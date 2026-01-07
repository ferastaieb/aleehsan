import "server-only";

import { getDb, initDb } from "./db";

export type Settings = {
  id: number;
  total_surplus: number;
  disks_sold: number;
  families_supported: number;
  projects_launched: number;
  base_price: number;
  extra_price: number;
  project_title: string;
  progress_percent: number;
  remaining_amount: number;
  sales_points: string;
  updated_at: string;
};

export type Story = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  position: number;
};

export function getDashboardData() {
  initDb();
  const db = getDb();
  const settings = db
    .prepare(
      `
      SELECT
        id,
        total_surplus,
        disks_sold,
        families_supported,
        projects_launched,
        base_price,
        extra_price,
        project_title,
        progress_percent,
        remaining_amount,
        sales_points,
        updated_at
      FROM settings
      WHERE id = 1
    `,
    )
    .get() as Settings;

  const stories = db
    .prepare(
      `
      SELECT id, title, description, image_url, position
      FROM stories
      ORDER BY position ASC
    `,
    )
    .all() as Story[];

  return { settings, stories };
}
