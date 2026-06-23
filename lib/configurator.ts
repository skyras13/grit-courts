/**
 * Court configurator data + pricing — mirrors the "GRIT Courts Site" design logic.
 * Used by the 3D configurator (/design), the previewer (/preview), and the
 * estimate modal. Pure and unit-tested (tests/unit/configurator.test.ts).
 */
import type { CourtType as LeadCourtType } from './types';

export type ConfigCourtType = 'pickleball' | 'basketball' | 'multisport';
export type ConfigSize = 'standard' | 'tournament' | 'half' | 'full';
export type AccKey = 'fence' | 'lights' | 'hoop' | 'rebound' | 'net' | 'windscreen';

export interface Palette {
  name: string;
  play: string;
  surround: string;
}

export const PALETTES: Palette[] = [
  { name: 'Tournament Blue', play: '#2a8fd0', surround: '#123a5b' },
  { name: 'Center Court Green', play: '#33a567', surround: '#163f2b' },
  { name: 'Coastal Teal', play: '#2fb3cf', surround: '#11606f' },
  { name: 'Graphite Slate', play: '#67809a', surround: '#222b34' },
  { name: 'Desert Clay', play: '#d49b58', surround: '#7e4329' },
  { name: 'Night Violet', play: '#7160b0', surround: '#2a2742' },
];

/** Indices of palettes offered as quick hero swatches. */
export const HERO_PALETTES = [0, 1, 2, 4];

export const COURT_TYPES: { key: ConfigCourtType; label: string; hint: string }[] = [
  { key: 'pickleball', label: 'Pickleball', hint: 'Backyard favorite' },
  { key: 'basketball', label: 'Basketball', hint: 'Half or full' },
  { key: 'multisport', label: 'Multi-sport', hint: 'Hoops + lines' },
];

export const SIZES: { key: ConfigSize; label: string; hint: string }[] = [
  { key: 'standard', label: 'Standard', hint: '30 × 60 ft' },
  { key: 'tournament', label: 'Tournament', hint: '44 × 88 ft' },
  { key: 'half', label: 'Half court', hint: 'Compact' },
  { key: 'full', label: 'Full court', hint: 'Full size' },
];

export const ACCESSORIES: { key: AccKey; label: string; hint: string; price: string }[] = [
  { key: 'fence', label: 'Fence & windscreen', hint: 'Chain-link + mesh', price: '+$4,800' },
  { key: 'lights', label: 'LED light poles', hint: 'Play after dark', price: '+$3,900' },
  { key: 'hoop', label: 'Adjustable hoop', hint: 'Pro breakaway rim', price: '+$1,400' },
  { key: 'rebound', label: 'Rebound wall', hint: 'Solo practice', price: '+$1,600' },
  { key: 'net', label: 'Pro net system', hint: 'Tournament tension', price: 'incl.' },
  { key: 'windscreen', label: 'Privacy screen', hint: 'Wind + privacy', price: '+$950' },
];

export type AccState = Record<AccKey, boolean>;

export interface CourtConfig {
  courtType: ConfigCourtType;
  size: ConfigSize;
  paletteIdx: number;
  acc: AccState;
}

export const DEFAULT_CONFIG: CourtConfig = {
  courtType: 'pickleball',
  size: 'standard',
  paletteIdx: 0,
  acc: { net: true, hoop: false, fence: false, lights: false, rebound: false, windscreen: false },
};

/** Accessories that should turn on by default when a court type is chosen. */
export function accForType(courtType: ConfigCourtType, prev: AccState): AccState {
  const acc = { ...prev };
  if (courtType === 'basketball') { acc.hoop = true; acc.net = false; }
  else if (courtType === 'pickleball') { acc.net = true; acc.hoop = false; }
  else { acc.net = true; acc.hoop = true; }
  return acc;
}

const BASE: Record<ConfigCourtType, number> = { pickleball: 24000, basketball: 28000, multisport: 34000 };
const SIZE_MULT: Record<ConfigSize, number> = { standard: 1, tournament: 1.5, half: 0.8, full: 1.9 };

export interface ConfigPrice {
  min: number;
  max: number;
  total: number;
}

export function configPrice(c: CourtConfig): ConfigPrice {
  let total = BASE[c.courtType] * SIZE_MULT[c.size];
  if (c.acc.fence) total += 4800;
  if (c.acc.lights) total += 3900;
  if (c.acc.rebound) total += 1600;
  if (c.acc.hoop && c.courtType === 'pickleball') total += 1400;
  if (c.acc.windscreen) total += 950;
  const round = (x: number) => Math.round(x / 500) * 500;
  return { min: round(total * 0.92), max: round(total * 1.1), total };
}

export function fmtUsd(n: number): string {
  return '$' + Math.round(n).toLocaleString('en-US');
}

/** Map the configurator court type to the lead/DB court type. */
export function toLeadCourtType(t: ConfigCourtType): LeadCourtType {
  return t === 'multisport' ? 'multi-sport' : t;
}

/** Human description of the configured surface + add-ons, for the AI render prompt. */
export function designDetail(c: CourtConfig): string {
  const pal = PALETTES[c.paletteIdx]!;
  const size = SIZES.find((z) => z.key === c.size)?.hint ?? '';
  const addons: string[] = [];
  if (c.acc.fence) addons.push('perimeter fencing');
  if (c.acc.lights) addons.push('LED light poles');
  if (c.acc.hoop) addons.push('an adjustable basketball hoop');
  if (c.acc.rebound) addons.push('a rebound wall');
  const addonStr = addons.length ? ` with ${addons.join(', ')}` : '';
  return `${pal.name} surfacing — a vibrant ${pal.play} playing surface with a darker ${pal.surround} surround and crisp white regulation lines${addonStr}${size ? `, ${size}` : ''}.`;
}

export function configSummary(c: CourtConfig): { k: string; v: string }[] {
  const type = COURT_TYPES.find((t) => t.key === c.courtType)!;
  const size = SIZES.find((z) => z.key === c.size)!;
  const addons = ACCESSORIES.filter((a) => c.acc[a.key] && a.key !== 'net').map((a) => a.label).join(', ') || 'None';
  return [
    { k: 'Court type', v: type.label },
    { k: 'Size', v: size.label },
    { k: 'Surface combo', v: PALETTES[c.paletteIdx]!.name },
    { k: 'Add-ons', v: addons },
  ];
}
