import "server-only";

import { loadStore, saveStore } from "./db";
import type { Settings, Story } from "./types";

type DashboardOptions = {
  incrementVisitors?: boolean;
};

export function getDashboardData(options: DashboardOptions = {}) {
  const store = loadStore();
  if (options.incrementVisitors) {
    store.settings.visitors_count += 1;
    saveStore(store);
  }
  const settings = store.settings as Settings;
  const stories = store.stories as Story[];
  return { settings, stories };
}
