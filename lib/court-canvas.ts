/**
 * Top-down court renderer. Every shape is computed from real dimensions in feet
 * (see lib/court-geometry.ts) and scaled by a single px-per-foot factor, so the
 * output is dimensionally correct at any texture size and the aspect ratio is
 * always true to the slab being poured.
 *
 * The Three.js designer maps this canvas onto a 3D slab, and the thumbnail /
 * lead email reuse it, so there is exactly one definition of what a GRIT court
 * looks like.
 */
import {
  BASKETBALL,
  PADS,
  PICKLEBALL,
  TENNIS,
  padPixels,
  type PadId,
} from './court-geometry';
import { colorHex, lineHex, type DesignConfig } from './court-designer';

/** Playing lines are painted 2in wide. */
const LINE_IN = 2;

/** Gap burned into a secondary line where it crosses a primary line, in inches. */
const BREAK_IN = 5;

/** A feet -> pixels transform for one pad. */
interface Xf {
  /** feet along the long axis -> px */
  x: (ft: number) => number;
  /** feet across the short axis -> px */
  y: (ft: number) => number;
  /** a length in feet -> px */
  s: (ft: number) => number;
  w: number;
  h: number;
  lw: number;
}

function transform(padId: PadId): Xf {
  const { w, h, scale } = padPixels(padId);
  return {
    x: (ft) => ft * scale,
    y: (ft) => ft * scale,
    s: (ft) => ft * scale,
    w,
    h,
    lw: Math.max(1.5, (LINE_IN / 12) * scale),
  };
}

export function courtPixelSize(padId: PadId) {
  const { w, h } = padPixels(padId);
  return { w, h };
}

// ─── small drawing helpers ───────────────────────────────────────────────────
function seg(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, lw: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function box(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, lw: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.strokeRect(x, y, w, h);
}

/** Makes an offscreen canvas the same size as the target, for layer compositing. */
function layer(w: number, h: number): { c: HTMLCanvasElement; x: CanvasRenderingContext2D } | null {
  if (typeof document === 'undefined') return null;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const x = c.getContext('2d');
  return x ? { c, x } : null;
}

// ─── entry point ─────────────────────────────────────────────────────────────
export function drawCourt(
  ctx: CanvasRenderingContext2D,
  config: DesignConfig,
  logo?: CanvasImageSource | null,
) {
  const t = transform(config.pad);
  const L = lineHex(config.lines);

  ctx.clearRect(0, 0, t.w, t.h);
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  // The whole slab takes the border colour; each sport paints its court on top.
  ctx.fillStyle = colorHex(config.zones.border);
  ctx.fillRect(0, 0, t.w, t.h);

  if (config.sport === 'pickleball') drawPickleball(ctx, config, t, L);
  else if (config.sport === 'basketball') drawBasketball(ctx, config, t, L);
  else drawTennis(ctx, config, t, L);

  if (config.logo !== 'none' && logo) drawLogo(ctx, config, t, logo);
}

function drawLogo(ctx: CanvasRenderingContext2D, c: DesignConfig, t: Xf, logo: CanvasImageSource) {
  const pad = PADS[c.pad];
  // Logos are painted about 10ft across — the size GRIT actually applies.
  const size = t.s(10);
  const pos = c.logoPos ?? 'center';
  const cx =
    pos === 'left' ? t.x(pad.lengthFt * 0.25) : pos === 'right' ? t.x(pad.lengthFt * 0.75) : t.x(pad.lengthFt / 2);
  const cy =
    pos === 'top' ? t.y(pad.widthFt * 0.25) : pos === 'bottom' ? t.y(pad.widthFt * 0.75) : t.y(pad.widthFt / 2);
  try {
    ctx.globalAlpha = 0.96;
    ctx.drawImage(logo, cx - size / 2, cy - size / 2, size, size);
    ctx.globalAlpha = 1;
  } catch {
    /* image not decoded yet */
  }
}

// ─── Pickleball — USA Pickleball 20 x 44 ─────────────────────────────────────
function drawPickleball(ctx: CanvasRenderingContext2D, c: DesignConfig, t: Xf, L: string) {
  const pad = PADS[c.pad];
  const { courtW, courtL, kitchenFromNet, netPostOverhang } = PICKLEBALL;

  // Court centred on the slab.
  const ox = (pad.lengthFt - courtL) / 2;
  const oy = (pad.widthFt - courtW) / 2;
  const netFt = ox + courtL / 2;
  const midFt = oy + courtW / 2;

  // Court + kitchen fills
  ctx.fillStyle = colorHex(c.zones.court);
  ctx.fillRect(t.x(ox), t.y(oy), t.s(courtL), t.s(courtW));
  ctx.fillStyle = colorHex(c.zones.kitchen);
  ctx.fillRect(t.x(netFt - kitchenFromNet), t.y(oy), t.s(kitchenFromNet * 2), t.s(courtW));

  // Basketball overlay sits under the pickleball lines and gets broken where
  // the two cross — the convention GRIT paints on real combo courts.
  if (c.bball !== 'none') drawBasketballOverlay(ctx, c, t, L, ox, oy);

  // Primary pickleball lines
  box(ctx, t.x(ox), t.y(oy), t.s(courtL), t.s(courtW), t.lw, L);
  for (const d of [-1, 1]) {
    const kx = t.x(netFt + d * kitchenFromNet);
    seg(ctx, kx, t.y(oy), kx, t.y(oy + courtW), t.lw, L);
  }
  // Centre service line runs baseline -> kitchen line on each half.
  seg(ctx, t.x(ox), t.y(midFt), t.x(netFt - kitchenFromNet), t.y(midFt), t.lw, L);
  seg(ctx, t.x(netFt + kitchenFromNet), t.y(midFt), t.x(ox + courtL), t.y(midFt), t.lw, L);

  // Net — posts stand 1ft outside each sideline.
  seg(
    ctx,
    t.x(netFt),
    t.y(oy - netPostOverhang),
    t.x(netFt),
    t.y(oy + courtW + netPostOverhang),
    Math.max(2, t.lw * 1.4),
    '#11202f',
  );
}

/**
 * Basketball lines added to a combo court. The hoop is mounted on the *long*
 * side because a 19'9" arc spans 39.5ft and cannot fit across a 35ft slab —
 * which is exactly how GRIT's own line art is drawn.
 */
function drawBasketballOverlay(
  ctx: CanvasRenderingContext2D,
  c: DesignConfig,
  t: Xf,
  L: string,
  courtOx: number,
  courtOy: number,
) {
  const pad = PADS[c.pad];
  const { courtW, courtL, kitchenFromNet } = PICKLEBALL;
  const hoopX = pad.lengthFt / 2;

  // Painted lane, drawn straight onto the surface (under every line).
  if (c.bball !== 'simple') {
    ctx.fillStyle = colorHex(c.zones.kitchen);
    ctx.fillRect(t.x(hoopX - BASKETBALL.laneW / 2), t.y(0), t.s(BASKETBALL.laneW), t.s(BASKETBALL.baselineToFt));
  }

  const lay = layer(t.w, t.h);
  const target = lay ? lay.x : ctx;
  target.lineCap = 'butt';

  paintBasketballLines(target, c, t, L, hoopX);

  if (lay) {
    // Burn a gap wherever a secondary line crosses a primary pickleball line.
    lay.x.globalCompositeOperation = 'destination-out';
    lay.x.strokeStyle = '#000';
    lay.x.lineWidth = t.lw + 2 * t.s(BREAK_IN / 12);
    const netFt = courtOx + courtL / 2;
    const midFt = courtOy + courtW / 2;
    lay.x.strokeRect(t.x(courtOx), t.y(courtOy), t.s(courtL), t.s(courtW));
    for (const d of [-1, 1]) {
      lay.x.beginPath();
      lay.x.moveTo(t.x(netFt + d * kitchenFromNet), t.y(courtOy));
      lay.x.lineTo(t.x(netFt + d * kitchenFromNet), t.y(courtOy + courtW));
      lay.x.stroke();
    }
    lay.x.beginPath();
    lay.x.moveTo(t.x(courtOx), t.y(midFt));
    lay.x.lineTo(t.x(courtOx + courtL), t.y(midFt));
    lay.x.stroke();
    lay.x.globalCompositeOperation = 'source-over';
    ctx.drawImage(lay.c, 0, 0);
  }
}

/** Key, free-throw circle and three-point arc for a hoop on the top edge. */
function paintBasketballLines(
  ctx: CanvasRenderingContext2D,
  c: DesignConfig,
  t: Xf,
  L: string,
  hoopX: number,
) {
  const { laneW, baselineToFt, ftCircleR, threePtR, hoopFromBaseline, ringR, laneMarks } = BASKETBALL;

  // Three-point arc, struck from the centre of the ring.
  const dx = Math.sqrt(threePtR * threePtR - hoopFromBaseline * hoopFromBaseline);
  const cx = t.x(hoopX);
  const cy = t.y(hoopFromBaseline);
  const start = Math.atan2(-hoopFromBaseline, dx);
  const end = Math.atan2(-hoopFromBaseline, -dx) + Math.PI * 2;
  ctx.strokeStyle = L;
  ctx.lineWidth = t.lw;
  ctx.beginPath();
  ctx.arc(cx, cy, t.s(threePtR), start, end);
  ctx.stroke();

  if (c.bball === 'simple') {
    // Simple = arc plus a short free-throw mark, matching GRIT's "Simple" art.
    seg(ctx, t.x(hoopX - 1), t.y(baselineToFt), t.x(hoopX + 1), t.y(baselineToFt), t.lw, L);
    return;
  }

  // Lane
  box(ctx, t.x(hoopX - laneW / 2), t.y(0), t.s(laneW), t.s(baselineToFt), t.lw, L);

  // Free-throw circle: solid on the court side, and on "full" the dashed half
  // inside the lane as well.
  ctx.strokeStyle = L;
  ctx.lineWidth = t.lw;
  ctx.beginPath();
  ctx.arc(t.x(hoopX), t.y(baselineToFt), t.s(ftCircleR), 0, Math.PI);
  ctx.stroke();

  if (c.bball === 'full') {
    ctx.setLineDash([t.s(1.2), t.s(0.8)]);
    ctx.beginPath();
    ctx.arc(t.x(hoopX), t.y(baselineToFt), t.s(ftCircleR), Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Lane-space marks along both lane lines.
    for (const m of laneMarks) {
      for (const d of [-1, 1]) {
        const lx = t.x(hoopX + (d * laneW) / 2);
        seg(ctx, lx, t.y(m), lx + d * t.s(0.66), t.y(m), t.lw, L);
      }
    }
    // Ring + backboard.
    ctx.strokeStyle = '#e0662a';
    ctx.lineWidth = Math.max(1.5, t.lw * 0.9);
    ctx.beginPath();
    ctx.arc(t.x(hoopX), t.y(hoopFromBaseline), t.s(ringR), 0, Math.PI * 2);
    ctx.stroke();
    seg(ctx, t.x(hoopX - 3), t.y(BASKETBALL.backboardFromBaseline), t.x(hoopX + 3), t.y(BASKETBALL.backboardFromBaseline), Math.max(2, t.lw), '#11202f');
  }
}

// ─── Basketball — NFHS half court (35x60) or full court (60x103) ─────────────
function drawBasketball(ctx: CanvasRenderingContext2D, c: DesignConfig, t: Xf, L: string) {
  const pad = PADS[c.pad];
  if (c.size === 'full') return drawFullCourt(ctx, c, t, L);

  // Half court: hoop centred on the long edge, arc opening across the slab.
  const hoopX = pad.lengthFt / 2;
  const { threePtR, hoopFromBaseline, laneW, baselineToFt, ftCircleR } = BASKETBALL;

  // Everything inside the arc takes the three-point colour.
  const dx = Math.sqrt(threePtR * threePtR - hoopFromBaseline * hoopFromBaseline);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(t.x(hoopX - dx), t.y(0));
  ctx.arc(t.x(hoopX), t.y(hoopFromBaseline), t.s(threePtR), Math.atan2(-hoopFromBaseline, -dx), Math.atan2(-hoopFromBaseline, dx), true);
  ctx.closePath();
  ctx.clip();
  ctx.fillStyle = colorHex(c.zones.threePoint);
  ctx.fillRect(0, 0, t.w, t.h);
  ctx.restore();

  // Lane, then the top-of-key circle over it.
  ctx.fillStyle = colorHex(c.zones.key);
  ctx.fillRect(t.x(hoopX - laneW / 2), t.y(0), t.s(laneW), t.s(baselineToFt));
  ctx.fillStyle = colorHex(c.zones.topOfKey);
  ctx.beginPath();
  ctx.arc(t.x(hoopX), t.y(baselineToFt), t.s(ftCircleR), 0, Math.PI);
  ctx.fill();

  paintBasketballLines(ctx, { ...c, bball: 'full' }, t, L, hoopX);
  // Baseline along the slab edge.
  seg(ctx, 0, t.y(0) + t.lw / 2, t.w, t.y(0) + t.lw / 2, t.lw, L);
}

function drawFullCourt(ctx: CanvasRenderingContext2D, c: DesignConfig, t: Xf, L: string) {
  const pad = PADS[c.pad];
  const { fullCourtW, fullCourtL, laneW, baselineToFt, ftCircleR, threePtR, hoopFromBaseline, centreCircleR } = BASKETBALL;
  const ox = (pad.lengthFt - fullCourtL) / 2;
  const oy = (pad.widthFt - fullCourtW) / 2;
  const midY = oy + fullCourtW / 2;
  const midX = ox + fullCourtL / 2;

  ctx.fillStyle = colorHex(c.zones.court);
  ctx.fillRect(t.x(ox), t.y(oy), t.s(fullCourtL), t.s(fullCourtW));

  const end = (baseFt: number, dir: 1 | -1) => {
    const ringX = baseFt + dir * hoopFromBaseline;
    const dy = Math.sqrt(threePtR * threePtR - hoopFromBaseline * hoopFromBaseline);

    // Three-point region
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(t.x(baseFt), t.y(midY - dy));
    ctx.arc(
      t.x(ringX),
      t.y(midY),
      t.s(threePtR),
      Math.atan2(-dy, -dir * hoopFromBaseline),
      Math.atan2(dy, -dir * hoopFromBaseline),
      dir === -1,
    );
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = colorHex(c.zones.threePoint);
    ctx.fillRect(0, 0, t.w, t.h);
    ctx.restore();

    // Lane + top of key
    const lx = dir === 1 ? baseFt : baseFt - baselineToFt;
    ctx.fillStyle = colorHex(c.zones.key);
    ctx.fillRect(t.x(lx), t.y(midY - laneW / 2), t.s(baselineToFt), t.s(laneW));
    ctx.fillStyle = colorHex(c.zones.topOfKey);
    ctx.beginPath();
    ctx.arc(t.x(baseFt + dir * baselineToFt), t.y(midY), t.s(ftCircleR), Math.PI / 2, (Math.PI * 3) / 2, dir === 1);
    ctx.fill();

    // Lines
    ctx.strokeStyle = L;
    ctx.lineWidth = t.lw;
    ctx.beginPath();
    ctx.arc(
      t.x(ringX),
      t.y(midY),
      t.s(threePtR),
      Math.atan2(-dy, -dir * hoopFromBaseline),
      Math.atan2(dy, -dir * hoopFromBaseline),
      dir === -1,
    );
    ctx.stroke();
    box(ctx, t.x(lx), t.y(midY - laneW / 2), t.s(baselineToFt), t.s(laneW), t.lw, L);
    ctx.beginPath();
    ctx.arc(t.x(baseFt + dir * baselineToFt), t.y(midY), t.s(ftCircleR), 0, Math.PI * 2);
    ctx.stroke();
  };

  end(ox, 1);
  end(ox + fullCourtL, -1);

  // Division line + centre circle
  box(ctx, t.x(ox), t.y(oy), t.s(fullCourtL), t.s(fullCourtW), t.lw, L);
  seg(ctx, t.x(midX), t.y(oy), t.x(midX), t.y(oy + fullCourtW), t.lw, L);
  ctx.fillStyle = colorHex(c.zones.centreCircle ?? c.zones.topOfKey);
  ctx.beginPath();
  ctx.arc(t.x(midX), t.y(midY), t.s(centreCircleR), 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = L;
  ctx.lineWidth = t.lw;
  ctx.stroke();
}

// ─── Tennis — ITF 36 x 78 ────────────────────────────────────────────────────
function drawTennis(ctx: CanvasRenderingContext2D, c: DesignConfig, t: Xf, L: string) {
  const pad = PADS[c.pad];
  const { doublesW, courtL, alley, serviceFromNet, centreMark } = TENNIS;
  const ox = (pad.lengthFt - courtL) / 2;
  const oy = (pad.widthFt - doublesW) / 2;
  const netFt = ox + courtL / 2;
  const midFt = oy + doublesW / 2;

  ctx.fillStyle = colorHex(c.zones.court);
  ctx.fillRect(t.x(ox), t.y(oy), t.s(courtL), t.s(doublesW));

  // Doubles boundary + singles sidelines
  box(ctx, t.x(ox), t.y(oy), t.s(courtL), t.s(doublesW), t.lw, L);
  for (const d of [0, 1]) {
    const yy = t.y(oy + (d ? doublesW - alley : alley));
    seg(ctx, t.x(ox), yy, t.x(ox + courtL), yy, t.lw, L);
  }
  // Service lines + centre service line
  for (const d of [-1, 1]) {
    const sx = t.x(netFt + d * serviceFromNet);
    seg(ctx, sx, t.y(oy + alley), sx, t.y(oy + doublesW - alley), t.lw, L);
  }
  seg(ctx, t.x(netFt - serviceFromNet), t.y(midFt), t.x(netFt + serviceFromNet), t.y(midFt), t.lw, L);
  // Centre marks on each baseline
  for (const d of [-1, 1]) {
    const bx = t.x(netFt + d * (courtL / 2));
    seg(ctx, bx, t.y(midFt), bx - d * t.s(centreMark), t.y(midFt), t.lw, L);
  }
  // Net, posts 3ft outside the doubles sidelines
  seg(ctx, t.x(netFt), t.y(oy - 3), t.x(netFt), t.y(oy + doublesW + 3), Math.max(2, t.lw * 1.4), '#11202f');
}
