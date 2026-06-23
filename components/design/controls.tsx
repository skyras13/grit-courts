'use client';

import {
  ACCESSORIES,
  COURT_TYPES,
  PALETTES,
  SIZES,
  type AccKey,
  type ConfigCourtType,
  type ConfigSize,
} from '@/lib/configurator';
import { cn } from '@/lib/utils';

const chip = (active: boolean) =>
  cn(
    'rounded-md border-[1.5px] px-3.5 py-3 text-left text-[13.5px] font-bold leading-tight transition',
    active ? 'border-brand-600 bg-brand-50 text-brand-600' : 'border-muted-input bg-white text-[#3a4651] hover:border-brand-300',
  );

export function TypeChips({
  value,
  onChange,
  compact = false,
}: {
  value: ConfigCourtType;
  onChange: (t: ConfigCourtType) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn('grid gap-2.5', compact ? 'grid-flow-col auto-cols-fr' : 'grid-cols-3')}>
      {COURT_TYPES.map((t) => (
        <button key={t.key} onClick={() => onChange(t.key)} aria-pressed={value === t.key} className={cn(chip(value === t.key), 'flex flex-col gap-0.5')}>
          {t.label}
          {!compact && <span className={cn('text-[11px] font-semibold', value === t.key ? 'text-brand-400' : 'text-muted-faint')}>{t.hint}</span>}
        </button>
      ))}
    </div>
  );
}

export function SizeChips({
  value,
  onChange,
  compact = false,
}: {
  value: ConfigSize;
  onChange: (s: ConfigSize) => void;
  compact?: boolean;
}) {
  return (
    <div className={cn('grid gap-2.5', compact ? 'grid-cols-4' : 'grid-cols-2')}>
      {SIZES.map((z) => (
        <button key={z.key} onClick={() => onChange(z.key)} aria-pressed={value === z.key} className={cn(chip(value === z.key), 'flex flex-col gap-0.5')}>
          {z.label}
          {!compact && <span className={cn('text-[11px] font-semibold', value === z.key ? 'text-brand-400' : 'text-muted-faint')}>{z.hint}</span>}
        </button>
      ))}
    </div>
  );
}

export function PaletteRow({
  value,
  onChange,
  cols = 3,
  height = 48,
}: {
  value: number;
  onChange: (i: number) => void;
  cols?: number;
  height?: number;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols},minmax(0,1fr))` }}>
      {PALETTES.map((p, i) => {
        const sel = value === i;
        return (
          <button
            key={p.name}
            title={p.name}
            aria-label={p.name}
            onClick={() => onChange(i)}
            className="rounded-lg p-0"
            style={{
              height,
              background: `linear-gradient(135deg,${p.play} 0 56%,${p.surround} 56% 100%)`,
              border: `2px solid ${sel ? '#27704a' : '#dfe3e8'}`,
              boxShadow: sel ? '0 0 0 2px #aed8c1' : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

export function AddonToggles({
  acc,
  onToggle,
}: {
  acc: Record<AccKey, boolean>;
  onToggle: (k: AccKey) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {ACCESSORIES.map((a) => {
        const on = acc[a.key];
        return (
          <button
            key={a.key}
            onClick={() => onToggle(a.key)}
            aria-pressed={on}
            className={cn('flex w-full items-center gap-3 rounded-lg border-[1.5px] px-3.5 py-2.5 text-left transition', on ? 'border-brand-600 bg-brand-50' : 'border-muted-input bg-white hover:border-brand-300')}
          >
            <span className={cn('relative h-[22px] w-[38px] flex-none rounded-full transition', on ? 'bg-brand-600' : 'bg-[#cfd6dd]')}>
              <span className="absolute top-0.5 h-[18px] w-[18px] rounded-full bg-white shadow transition-all" style={{ left: on ? 18 : 2 }} />
            </span>
            <span className="flex-1">
              <span className="block text-[13.5px] font-bold text-ink">{a.label}</span>
              <span className="block text-[11.5px] text-muted-faint">{a.hint}</span>
            </span>
            <span className="text-[12.5px] font-bold text-brand-600">{a.price}</span>
          </button>
        );
      })}
    </div>
  );
}
