/**
 * Court Designer model — parity with courtdesigner.builtwithgrit.com.
 *
 * Three sports (pickleball, basketball, tennis), per-zone surface colors from a
 * shared 15-color palette, court-size + basketball-overlay options, and a
 * center-court logo. NO pricing here (the live designer has none). The design is
 * handed to the AI previewer, which composites it into a photo of the yard.
 */
import type { CourtType as LeadCourtType } from './types';
import { PADS, type PadId } from './court-geometry';

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
export type ZoneKey =
  | 'border'
  | 'court'
  | 'kitchen'
  | 'threePoint'
  | 'topOfKey'
  | 'key'
  | 'centreCircle';

export interface ZoneDef {
  key: ZoneKey;
  label: string;
}

/** Which zones each sport exposes (mirrors the live designer's controls). */
export const SPORT_ZONES: Record<Sport | 'basketballFull', ZoneDef[]> = {
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
  // Full-court adds the court field + centre circle, exactly as GRIT's designer does.
  basketballFull: [
    { key: 'border', label: 'Border' },
    { key: 'court', label: 'Court' },
    { key: 'threePoint', label: 'Three Point' },
    { key: 'topOfKey', label: 'Top of Key' },
    { key: 'key', label: 'Key' },
    { key: 'centreCircle', label: 'Centre Circle' },
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

/** The zones a given design actually exposes. */
export function zonesFor(c: Pick<DesignConfig, 'sport' | 'size'>): ZoneDef[] {
  if (c.sport === 'basketball' && c.size === 'full') return SPORT_ZONES.basketballFull;
  return SPORT_ZONES[c.sport];
}

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
  /** Which concrete pad the court sits on (drives true aspect ratio). */
  pad: PadId;
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
  pad: 'standard',
  zones: {
    border: 'competition-green',
    court: 'competition-blue',
    kitchen: 'gray',
    threePoint: 'competition-blue',
    topOfKey: 'gray',
    key: 'competition-green',
    centreCircle: 'competition-blue',
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
  const pad = PADS[c.pad];
  const rows: { k: string; v: string }[] = [
    { k: 'Sport', v: SPORT_LABEL[c.sport] },
    { k: 'Pad size', v: `${pad.widthFt}\u2032 \u00d7 ${pad.lengthFt}\u2032` },
  ];
  if (c.sport === 'basketball') rows.push({ k: 'Size', v: c.size === 'full' ? 'Full court' : 'Half court' });
  for (const z of zonesFor(c)) rows.push({ k: z.label, v: colorName(c.zones[z.key]) });
  if (c.sport === 'pickleball' && c.bball !== 'none') {
    rows.push({ k: 'Basketball lines', v: c.bball.charAt(0).toUpperCase() + c.bball.slice(1) });
  }
  if (c.logo !== 'none') {
    rows.push({ k: 'Logo', v: c.logo === 'custom' ? 'Custom upload' : logoLabel(c.logo) });
    rows.push({ k: 'Logo position', v: c.logoPos.charAt(0).toUpperCase() + c.logoPos.slice(1) });
  }
  return rows;
}

function logoLabel(k: LogoKey): string {
  return LOGO_PRESETS.find((l) => l.key === k)?.label ?? '';
}

/**
 * Rich description for the AI image prompt. Real dimensions matter here: telling
 * the model "a 20ft by 44ft court on a 35ft by 60ft slab" produces far better
 * scale and perspective than "a pickleball court".
 */
export function designDetail(c: DesignConfig): string {
  const pad = PADS[c.pad];
  const parts = zonesFor(c).map((z) => `${z.label.toLowerCase()} in ${colorName(c.zones[z.key]).toLowerCase()}`);
  const size =
    c.sport === 'pickleball'
      ? 'a regulation 20ft by 44ft pickleball court'
      : c.sport === 'tennis'
        ? 'a regulation 36ft by 78ft tennis court'
        : c.size === 'full'
          ? 'a full-size 50ft by 84ft basketball court'
          : 'a regulation half-court basketball setup with a 12ft key and a 19ft 9in three-point arc';
  const overlay =
    c.sport === 'pickleball' && c.bball !== 'none'
      ? `, plus ${c.bball} basketball key and three-point lines painted on the same slab with a wall-mounted hoop`
      : '';
  const logo =
    c.logo !== 'none'
      ? ` A ${c.logo === 'custom' ? 'custom' : logoLabel(c.logo)} logo is painted at ${c.logoPos === 'center' ? 'centre court' : `the ${c.logoPos} of the court`}.`
      : '';
  return (
    `${size} on a ${pad.widthFt}ft by ${pad.lengthFt}ft concrete slab, ` +
    `finished in acrylic sport coating: ${parts.join(', ')}, with crisp white 2-inch regulation lines${overlay}.${logo}`
  );
}
