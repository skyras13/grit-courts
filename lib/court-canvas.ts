/**
 * Pure 2D court renderer. Draws an accurate top-down court (per-zone colors +
 * regulation lines + optional center logo) onto a canvas context. The Three.js
 * designer maps this canvas as a texture onto a 3D slab, so the court layouts
 * stay correct while gaining real lighting/perspective. Layouts mirror
 * courtdesigner.builtwithgrit.com (pickleball / basketball / tennis).
 */
import { colorHex, lineHex, type DesignConfig } from './court-designer';

export const COURT_W = 1024;
export const COURT_H = 640;

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, w: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
function rectStroke(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, lw: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.strokeRect(x, y, w, h);
}

export function drawCourt(
  ctx: CanvasRenderingContext2D,
  config: DesignConfig,
  logo?: CanvasImageSource | null,
) {
  const L = lineHex(config.lines);
  ctx.clearRect(0, 0, COURT_W, COURT_H);
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  // Border fills the whole surface.
  ctx.fillStyle = colorHex(config.zones.border);
  ctx.fillRect(0, 0, COURT_W, COURT_H);

  if (config.sport === 'pickleball') drawPickleball(ctx, config, L);
  else if (config.sport === 'basketball') drawBasketball(ctx, config, L);
  else drawTennis(ctx, config, L);

  if (config.logo !== 'none' && logo) {
    const s = 150;
    try {
      ctx.globalAlpha = 0.96;
      ctx.drawImage(logo, COURT_W / 2 - s / 2, COURT_H / 2 - s / 2, s, s);
      ctx.globalAlpha = 1;
    } catch {
      /* logo not ready */
    }
  }

  // Faint GRIT watermark, bottom-right (mirrors the live designer).
  ctx.globalAlpha = 0.5;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  ctx.font = '700 20px Archivo, system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillText('GRIT COURTS', COURT_W - 22, COURT_H - 18);
  ctx.globalAlpha = 1;
}

// ── Pickleball: net down the center, gray kitchen band, 4 service boxes ───────
function drawPickleball(ctx: CanvasRenderingContext2D, c: DesignConfig, L: string) {
  const mx = 150, my = 90;
  const x = mx, y = my, w = COURT_W - mx * 2, h = COURT_H - my * 2;

  // Court surface
  ctx.fillStyle = colorHex(c.zones.court);
  ctx.fillRect(x, y, w, h);

  // Kitchen (non-volley zone): center vertical band around the net
  const kw = w * 0.22;
  const kx = x + w / 2 - kw / 2;
  ctx.fillStyle = colorHex(c.zones.kitchen);
  ctx.fillRect(kx, y, kw, h);

  const lw = 5;
  // Outer boundary
  rectStroke(ctx, x, y, w, h, lw, L);
  // Kitchen lines (band edges)
  line(ctx, kx, y, kx, y + h, lw, L);
  line(ctx, kx + kw, y, kx + kw, y + h, lw, L);
  // Center service lines (each half split top/bottom), skipping the kitchen
  line(ctx, x, y + h / 2, kx, y + h / 2, lw, L);
  line(ctx, kx + kw, y + h / 2, x + w, y + h / 2, lw, L);
  // Net (center, darker)
  line(ctx, x + w / 2, y - 6, x + w / 2, y + h + 6, 7, '#0d1722');

  // Optional basketball overlay (key + arc) at the top, per level
  if (c.bball !== 'none') {
    const cx = x + w / 2;
    const keyW = w * 0.16, keyH = h * 0.34;
    if (c.bball !== 'simple') {
      // three-point arc
      ctx.strokeStyle = L; ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.arc(cx, y + keyH * 0.9, w * 0.28, Math.PI * 0.08, Math.PI - Math.PI * 0.08);
      ctx.stroke();
    }
    rectStroke(ctx, cx - keyW / 2, y, keyW, keyH, lw, L); // key
    if (c.bball === 'full') {
      ctx.beginPath();
      ctx.arc(cx, y + keyH, keyW * 0.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}

// ── Basketball: half or full, key + top-of-key + three-point ─────────────────
function drawBasketball(ctx: CanvasRenderingContext2D, c: DesignConfig, L: string) {
  const mx = 120, my = 70;
  const x = mx, y = my, w = COURT_W - mx * 2, h = COURT_H - my * 2;
  const lw = 5;

  // Main playing surface = Three Point color
  ctx.fillStyle = colorHex(c.zones.threePoint);
  ctx.fillRect(x, y, w, h);
  rectStroke(ctx, x, y, w, h, lw, L);

  const drawHalf = (baseX: number, dir: 1 | -1) => {
    // dir 1 = key extends rightward from left baseline; -1 = leftward from right
    const keyLen = w * 0.28;
    const keyH = h * 0.36;
    const cy = y + h / 2;
    const keyX = dir === 1 ? baseX : baseX - keyLen;
    // Key (paint)
    ctx.fillStyle = colorHex(c.zones.key);
    ctx.fillRect(keyX, cy - keyH / 2, keyLen, keyH);
    rectStroke(ctx, keyX, cy - keyH / 2, keyLen, keyH, lw, L);
    // Top-of-key semicircle (free-throw circle) in its own color
    const ftx = dir === 1 ? baseX + keyLen : baseX - keyLen;
    ctx.fillStyle = colorHex(c.zones.topOfKey);
    ctx.beginPath();
    ctx.arc(ftx, cy, keyH * 0.5, -Math.PI / 2, Math.PI / 2, dir === -1);
    ctx.fill();
    ctx.strokeStyle = L; ctx.lineWidth = lw; ctx.stroke();
    // Three-point arc
    ctx.beginPath();
    ctx.arc(baseX, cy, h * 0.46, dir === 1 ? -Math.PI / 2 : Math.PI / 2, dir === 1 ? Math.PI / 2 : (Math.PI * 3) / 2, dir === -1);
    ctx.stroke();
    // Hoop
    ctx.fillStyle = '#e0662a';
    ctx.beginPath();
    ctx.arc(baseX + dir * 14, cy, 7, 0, Math.PI * 2);
    ctx.fill();
  };

  if (c.size === 'full') {
    drawHalf(x, 1);
    drawHalf(x + w, -1);
    line(ctx, x + w / 2, y, x + w / 2, y + h, lw, L); // half-court line
    ctx.strokeStyle = L; ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, h * 0.14, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    drawHalf(x, 1);
    // half-court arc at the far end
    ctx.strokeStyle = L; ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.arc(x + w, y + h / 2, h * 0.14, Math.PI / 2, (Math.PI * 3) / 2);
    ctx.stroke();
  }
}

// ── Tennis: full lines with doubles alleys + service boxes ───────────────────
function drawTennis(ctx: CanvasRenderingContext2D, c: DesignConfig, L: string) {
  const mx = 120, my = 80;
  const x = mx, y = my, w = COURT_W - mx * 2, h = COURT_H - my * 2;
  const lw = 5;

  ctx.fillStyle = colorHex(c.zones.court);
  ctx.fillRect(x, y, w, h);
  rectStroke(ctx, x, y, w, h, lw, L); // doubles boundary

  const alley = h * 0.12;
  // Singles sidelines
  line(ctx, x, y + alley, x + w, y + alley, lw, L);
  line(ctx, x, y + h - alley, x + w, y + h - alley, lw, L);
  // Service lines (a bit in from each baseline)
  const svc = w * 0.22;
  line(ctx, x + svc, y + alley, x + svc, y + h - alley, lw, L);
  line(ctx, x + w - svc, y + alley, x + w - svc, y + h - alley, lw, L);
  // Center service line
  line(ctx, x + svc, y + h / 2, x + w - svc, y + h / 2, lw, L);
  // Center marks on baselines
  line(ctx, x, y + h / 2, x + 18, y + h / 2, lw, L);
  line(ctx, x + w - 18, y + h / 2, x + w, y + h / 2, lw, L);
  // Net (center, darker)
  line(ctx, x + w / 2, y - 6, x + w / 2, y + h + 6, 7, '#0d1722');
}
