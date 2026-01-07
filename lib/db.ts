import "server-only";

import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

let db: Database.Database | null = null;
const dbPath = path.join(process.cwd(), "data", "charty.db");

function openDb() {
  if (db) {
    return db;
  }
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  return db;
}

export function initDb() {
  const database = openDb();
  database.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      total_surplus INTEGER NOT NULL,
      disks_sold INTEGER NOT NULL,
      families_supported INTEGER NOT NULL,
      projects_launched INTEGER NOT NULL,
      base_price INTEGER NOT NULL,
      extra_price INTEGER NOT NULL,
      project_title TEXT NOT NULL,
      progress_percent INTEGER NOT NULL,
      remaining_amount INTEGER NOT NULL,
      sales_points TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  database.exec(`
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image_url TEXT NOT NULL,
      position INTEGER NOT NULL
    );
  `);

  const settingsColumns = database
    .prepare("PRAGMA table_info(settings)")
    .all() as { name: string }[];
  const hasSalesPoints = settingsColumns.some(
    (column) => column.name === "sales_points",
  );
  if (!hasSalesPoints) {
    database.exec(
      "ALTER TABLE settings ADD COLUMN sales_points TEXT NOT NULL DEFAULT ''",
    );
  }

  const defaultSalesPoints =
    "دمشق - سوق الحميدية\nحلب - السبع بحرات\nحمص - شارع الدبلان";

  const settingsCount = database
    .prepare("SELECT COUNT(*) as count FROM settings")
    .get() as { count: number };
  if (settingsCount.count === 0) {
    database
      .prepare(
        `
        INSERT INTO settings (
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
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      )
      .run(
        1,
        15450,
        5200,
        12,
        8,
        12,
        1000,
        "شراء فرن منزلي للأرملة (س)",
        70,
        300,
        defaultSalesPoints,
        new Date().toISOString(),
      );
  }

  database
    .prepare(
      `
      UPDATE settings
      SET extra_price = ?, updated_at = ?
      WHERE id = 1 AND extra_price = 5
    `,
    )
    .run(1000, new Date().toISOString());

  database
    .prepare(
      `
      UPDATE settings
      SET sales_points = ?
      WHERE id = 1 AND (sales_points IS NULL OR sales_points = '')
    `,
    )
    .run(defaultSalesPoints);

  const storyCount = database
    .prepare("SELECT COUNT(*) as count FROM stories")
    .get() as { count: number };
  if (storyCount.count === 0) {
    const insertStory = database.prepare(
      `
      INSERT INTO stories (id, title, description, image_url, position)
      VALUES (?, ?, ?, ?, ?)
    `,
    );
    insertStory.run(
      1,
      "ماكينة خياطة",
      "عائلة أم أحمد بدأت مشروع تفصيل منزلي.",
      "/place.png",
      1,
    );
    insertStory.run(
      2,
      "عربة طعام",
      "الشاب خالد يعيل إخوته الآن.",
      "/place.png",
      2,
    );
    insertStory.run(
      3,
      "أدوات زراعية",
      "مشروع زراعة منزلية لعائلة متعففة.",
      "/place.png",
      3,
    );
  }

  database
    .prepare(
      `
      UPDATE stories
      SET image_url = '/place.png'
      WHERE image_url = '/placeholder.svg'
    `,
    )
    .run();

  return database;
}

export function getDb() {
  return openDb();
}
