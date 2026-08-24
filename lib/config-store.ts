'use client';

import { DEFAULT_DESIGN, type DesignConfig } from './court-designer';

/** Persists the in-progress court design across the /design → /planner → /preview hops. */
const DESIGN_KEY = 'grit:court-design';

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
