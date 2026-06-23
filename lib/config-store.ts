'use client';

import { DEFAULT_CONFIG, type CourtConfig } from './configurator';

/** Persists the in-progress court config across the /design → /preview hop. */
const KEY = 'grit:court-config';

export function saveConfig(config: CourtConfig): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(config));
  } catch {
    /* ignore */
  }
}

export function loadConfig(): CourtConfig {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return { ...DEFAULT_CONFIG, ...(JSON.parse(raw) as CourtConfig) };
  } catch {
    /* ignore */
  }
  return DEFAULT_CONFIG;
}
