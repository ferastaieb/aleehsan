import "server-only";

import { loadStore, saveStore } from "./db";
import type { Settings, Story } from "./types";

type DashboardOptions = {
  incrementVisitors?: boolean;
};

export async function getDashboardData(options: DashboardOptions = {}) {
  const store = await loadStore();
  if (options.incrementVisitors) {
    store.settings.visitors_count += 1;
    await saveStore(store);
  }
  const settings = store.settings as Settings;
  const stories = store.stories as Story[];
  return { settings, stories };
}
