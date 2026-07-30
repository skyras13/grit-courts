/**
 * Court Designer model — parity with courtdesigner.builtwithgrit.com.
 *
 * Three sports (pickleball, basketball, tennis), per-zone surface colors from a
 * shared 15-color palette, court-size + basketball-overlay options, and a
 * center-court logo. NO pricing here (the live designer has none). The design is
 * handed to the AI previewer, which composites it into a photo of the yard.
 */
import type { CourtType as LeadCourtType } from './types';

export type Sport = 'pickleball' | 'basketball' | 'tennis';

/** The 15 named surface colors shown on the live designer's swatch grid. */
export interface SurfaceColor {
  id: string;
  name: string;
  hex: string;
}

export const SURFACE_COLORS: SurfaceColor[] = [
  { id: 'competition-green', name: 'Competition Green', hex: '#3f6f52' },
  { id: 'forest-green', name: 'Forest Green', hex: '#25412e' },
  { id: 'slate-gray', name: 'Slate Gray', hex: '#3c454d' },
  { id: 'silver-gray', name: 'Silver Gray', hex: '#8b929a' },
  { id: 'competition-blue', name: 'Competition Blue', hex: '#274a6d' },
  { id: 'royal-blue', name: 'Royal Blue', hex: '#175e9c' },
  { id: 'sky-blue', name: 'Sky Blue', hex: '#8fc0e3' },
  { id: 'sand', name: 'Sand', hex: '#b6a079' },
  { id: 'chestnut', name: 'Chestnut', hex: '#8a6a43' },
  { id: 'purple', name: 'Purple', hex: '#4a3f6b' },
  { id: 'maroon', name: 'Maroon', hex: '#8f2d3b' },
  { id: 'magenta', name: 'Magenta', hex: '#d64f8f' },
  { id: 'orange', name: 'Orange', hex: '#e0662a' },
  { id: 'gold', name: 'Gold', hex: '#f2c230' },
  { id: 'black', name: 'Black', hex: '#14171b' },
];

export function colorHex(id: string): string {
  return SURFACE_COLORS.find((c) => c.id === id)?.hex ?? '#274a6d';
}
export function colorName(id: string): string {
  return SURFACE_COLORS.find((c) => c.id === id)?.name ?? 'Competition Blue';
}

/** Zone = an independently-colorable region of a court. */
export type ZoneKey = 'border' | 'court' | 'kitchen' | 'threePoint' | 'topOfKey' | 'key';

export interface ZoneDef {
  key: ZoneKey;
  label: string;
}

/** Which zones each sport exposes (mirrors the live designer's controls). */
export const SPORT_ZONES: Record<Sport, ZoneDef[]> = {
  pickleball: [
    { key: 'border', label: 'Border' },
    { key: 'court', label: 'Court' },
    { key: 'kitchen', label: 'Kitchen' },
  ],
  basketball: [
    { key: 'border', label: 'Border' },
    { key: 'threePoint', label: 'Three Point' },
    { key: 'topOfKey', label: 'Top of Key' },
    { key: 'key', label: 'Key' },
  ],
  tennis: [
    { key: 'border', label: 'Border' },
    { key: 'court', label: 'Court' },
  ],
};

export type BasketballOverlay = 'none' | 'simple' | 'standard' | 'full';
export const BBALL_OVERLAYS: { key: BasketballOverlay; label: string }[] = [
  { key: 'none', label: 'None' },
  { key: 'simple', label: 'Simple' },
  { key: 'standard', label: 'Standard' },
  { key: 'full', label: 'Full' },
];

export type CourtSizeOpt = 'half' | 'full';

export type LogoKey = 'none' | 'jumpman' | 'byu' | 'utah' | 'custom';
export const LOGO_PRESETS: { key: LogoKey; label: string }[] = [
  { key: 'none', label: 'None' },
  { key: 'jumpman', label: 'Jumpman' },
  { key: 'byu', label: 'BYU' },
  { key: 'utah', label: 'Utah' },
  { key: 'custom', label: 'Upload Logo' },
];

/** Built-in logo art (self-contained SVG data URIs so no external assets). */
export const LOGO_SRC: Record<Exclude<LogoKey, 'none' | 'custom'>, string> = {
  jumpman: '/logos/jumpman.svg',
  byu: '/logos/byu.svg',
  utah: '/logos/utah.svg',
};

export interface DesignConfig {
  sport: Sport;
  /** Zone colors keyed by ZoneKey (only the sport's zones are used). */
  zones: Record<ZoneKey, string>;
  size: CourtSizeOpt; // basketball only
  bball: BasketballOverlay; // pickleball only
  logo: LogoKey;
  customLogoUrl?: string;
  lines: string; // line color id (usually white/black)
}

export const DEFAULT_DESIGN: DesignConfig = {
  sport: 'pickleball',
  zones: {
    border: 'competition-green',
    court: 'competition-blue',
    kitchen: 'silver-gray',
    threePoint: 'competition-blue',
    topOfKey: 'silver-gray',
    key: 'competition-green',
  },
  size: 'half',
  bball: 'none',
  logo: 'none',
  lines: 'white',
};

/** Line color: the palette has no white; expose white + black for lines. */
export const LINE_COLORS: { id: string; name: string; hex: string }[] = [
  { id: 'white', name: 'White', hex: '#f3f5f7' },
  { id: 'black', name: 'Black', hex: '#14171b' },
];
export function lineHex(id: string): string {
  return LINE_COLORS.find((c) => c.id === id)?.hex ?? '#f3f5f7';
}

const SPORT_LABEL: Record<Sport, string> = {
  pickleball: 'Pickleball',
  basketball: 'Basketball',
  tennis: 'Tennis',
};

/** Map the designer sport to the lead/DB court type. */
export function toLeadCourtType(sport: Sport): LeadCourtType {
  if (sport === 'basketball') return 'basketball';
  if (sport === 'tennis') return 'multi-sport'; // no tennis in lead enum; nearest
  return 'pickleball';
}

/** Rows summarizing the design for the estimate/lead (no price). */
export function designSummary(c: DesignConfig): { k: string; v: string }[] {
  const zones = SPORT_ZONES[c.sport];
  const rows: { k: string; v: string }[] = [{ k: 'Sport', v: SPORT_LABEL[c.sport] }];
  if (c.sport === 'basketball') rows.push({ k: 'Size', v: c.size === 'full' ? 'Full court' : 'Half court' });
  for (const z of zones) rows.push({ k: z.label, v: colorName(c.zones[z.key]) });
  if (c.sport === 'pickleball' && c.bball !== 'none') rows.push({ k: 'Basketball lines', v: c.bball });
  if (c.logo !== 'none') rows.push({ k: 'Logo', v: c.logo === 'custom' ? 'Custom upload' : SPORT_LABEL_LOGO(c.logo) });
  return rows;
}

function SPORT_LABEL_LOGO(k: LogoKey): string {
  return LOGO_PRESETS.find((l) => l.key === k)?.label ?? '';
}

/** Rich description for the AI image prompt. */
export function designDetail(c: DesignConfig): string {
  const zones = SPORT_ZONES[c.sport];
  const parts = zones.map((z) => `${z.label.toLowerCase()} in ${colorName(c.zones[z.key]).toLowerCase()}`);
  const sizeStr = c.sport === 'basketball' ? `${c.size === 'full' ? 'full-size' : 'half-'}court ` : '';
  const overlay =
    c.sport === 'pickleball' && c.bball !== 'none' ? ` with ${c.bball} basketball key lines added` : '';
  const logo = c.logo !== 'none' ? ` and a ${c.logo === 'custom' ? 'custom' : SPORT_LABEL_LOGO(c.logo)} center-court logo` : '';
  return `A ${sizeStr}${SPORT_LABEL[c.sport].toLowerCase()} court with ${parts.join(', ')}, crisp white regulation lines${overlay}${logo}.`;
}
