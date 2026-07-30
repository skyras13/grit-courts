'use client';

import { DEFAULT_CONFIG, type CourtConfig } from './configurator';
import { DEFAULT_DESIGN, type DesignConfig } from './court-designer';

/** Persists the in-progress court config across the /design → /preview hop. */
const KEY = 'grit:court-config';
const DESIGN_KEY = 'grit:court-design';

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

// ── New Court Designer (multi-sport, per-zone colors, logo) ──────────────────
export function saveDesign(design: DesignConfig): void {
  try {
    sessionStorage.setItem(DESIGN_KEY, JSON.stringify(design));
  } catch {
    /* ignore */
  }
}

export function loadDesign(): DesignConfig {
  try {
    const raw = sessionStorage.getItem(DESIGN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DesignConfig;
      return { ...DEFAULT_DESIGN, ...parsed, zones: { ...DEFAULT_DESIGN.zones, ...parsed.zones } };
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_DESIGN;
}
