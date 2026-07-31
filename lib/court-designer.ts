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

// Exact acrylic color set + names from courtdesigner.builtwithgrit.com (colors.js).
export const SURFACE_COLORS: SurfaceColor[] = [
  { id: 'competition-green', name: 'Competition Green', hex: '#38603e' },
  { id: 'medium-green', name: 'Medium Green', hex: '#384930' },
  { id: 'slate', name: 'Slate', hex: '#505457' },
  { id: 'gray', name: 'Gray', hex: '#696c6f' },
  { id: 'competition-blue', name: 'Competition Blue', hex: '#153056' },
  { id: 'light-blue', name: 'Light Blue', hex: '#005490' },
  { id: 'sky-blue', name: 'Sky Blue', hex: '#7ba3d6' },
  { id: 'sandstone', name: 'Sandstone', hex: '#8e7d6b' },
  { id: 'beige', name: 'Beige', hex: '#936f4b' },
  { id: 'pro-purple', name: 'Pro Purple', hex: '#403a5d' },
  { id: 'bright-red', name: 'Bright Red', hex: '#ab1f2f' },
  { id: 'passion-pink', name: 'Passion Pink', hex: '#ef5296' },
  { id: 'bright-orange', name: 'Bright Orange', hex: '#f36e26' },
  { id: 'bright-yellow', name: 'Bright Yellow', hex: '#fdb714' },
  { id: 'black', name: 'Black', hex: '#000000' },
];

export function colorHex(id: string): string {
  return SURFACE_COLORS.find((c) => c.id === id)?.hex ?? '#153056';
}
export function colorName(id: string): string {
  return SURFACE_COLORS.find((c) => c.id === id)?.name ?? 'Competition Blue';
}

/** RGB string form (as the live designer stores it), for reference/exports. */
export function colorRgb(id: string): string {
  const hex = colorHex(id).replace('#', '');
  const n = parseInt(hex, 16);
  return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
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

/** Where the logo is placed on the court. */
export type LogoPos = 'center' | 'left' | 'right' | 'top' | 'bottom';
export const LOGO_POSITIONS: { key: LogoPos; label: string }[] = [
  { key: 'center', label: 'Center' },
  { key: 'left', label: 'Left' },
  { key: 'right', label: 'Right' },
  { key: 'top', label: 'Top' },
  { key: 'bottom', label: 'Bottom' },
];
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
  logoPos: LogoPos;
  customLogoUrl?: string;
  lines: string; // line color id (usually white/black)
}

export const DEFAULT_DESIGN: DesignConfig = {
  sport: 'pickleball',
  zones: {
    border: 'competition-green',
    court: 'competition-blue',
    kitchen: 'gray',
    threePoint: 'competition-blue',
    topOfKey: 'gray',
    key: 'competition-green',
  },
  size: 'half',
  bball: 'none',
  logo: 'none',
  logoPos: 'center',
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
  if (c.logo !== 'none') {
    rows.push({ k: 'Logo', v: c.logo === 'custom' ? 'Custom upload' : SPORT_LABEL_LOGO(c.logo) });
    rows.push({ k: 'Logo position', v: c.logoPos.charAt(0).toUpperCase() + c.logoPos.slice(1) });
  }
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
