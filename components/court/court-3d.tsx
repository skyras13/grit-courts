'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import type { ConfigCourtType } from '@/lib/configurator';

/**
 * Court3D — a CSS-3D rendered sport court that orbits and zooms, faithful to the
 * "GRIT Court 3D" design component. No WebGL: the court boards are layered DOM
 * built with CSS 3D transforms (perspective + preserve-3d), driven by a tiny
 * pointer/wheel orbit controller. Props mirror the design's configurator.
 */
export interface Court3DProps {
  courtType: ConfigCourtType;
  play: string;
  surround: string;
  netOn?: boolean;
  hoopOn?: boolean;
  fenceOn?: boolean;
  lightsOn?: boolean;
  reboundOn?: boolean;
  autoRotate?: boolean;
  showControls?: boolean;
}

const LINE = 'rgba(255,255,255,0.92)';
const LINE2 = 'rgba(255,214,120,0.85)';

export function Court3D({
  courtType,
  play,
  surround,
  netOn = true,
  hoopOn = true,
  fenceOn = false,
  lightsOn = false,
  reboundOn = false,
  autoRotate = true,
  showControls = true,
}: Court3DProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const st = useRef({ spin: -26, tilt: 56, zoom: 1, dragging: false, userActive: false, last: { x: 0, y: 0 } });
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function apply() {
    const el = sceneRef.current;
    if (!el) return;
    const s = st.current;
    const t = Math.max(16, Math.min(82, s.tilt));
    const z = Math.max(0.45, Math.min(2.4, s.zoom));
    el.style.transform = `rotateX(${t}deg) rotateZ(${s.spin}deg) scale(${z})`;
  }

  function bumpIdle() {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (autoRotate) idleTimer.current = setTimeout(() => { st.current.userActive = false; }, 4500);
  }

  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      const s = st.current;
      if (!s.dragging) return;
      const dx = e.clientX - s.last.x;
      const dy = e.clientY - s.last.y;
      s.spin += dx * 0.45;
      s.tilt = Math.max(16, Math.min(82, s.tilt - dy * 0.32));
      s.last = { x: e.clientX, y: e.clientY };
      apply();
    };
    const onUp = () => {
      const s = st.current;
      if (!s.dragging) return;
      s.dragging = false;
      if (viewportRef.current) viewportRef.current.style.cursor = 'grab';
      bumpIdle();
    };
    const vp = viewportRef.current;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const s = st.current;
      s.userActive = true;
      s.zoom = Math.max(0.45, Math.min(2.4, s.zoom * (1 - e.deltaY * 0.0012)));
      apply();
      bumpIdle();
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    vp?.addEventListener('wheel', onWheel, { passive: false });
    apply();
    const loop = () => {
      const s = st.current;
      if (autoRotate && !s.dragging && !s.userActive) { s.spin += 0.16; apply(); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      vp?.removeEventListener('wheel', onWheel);
      cancelAnimationFrame(raf);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRotate]);

  function onPointerDown(e: React.PointerEvent) {
    const s = st.current;
    s.dragging = true;
    s.userActive = true;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    s.last = { x: e.clientX, y: e.clientY };
    if (viewportRef.current) viewportRef.current.style.cursor = 'grabbing';
  }
  const zoomIn = () => { st.current.userActive = true; st.current.zoom = Math.min(2.4, st.current.zoom * 1.15); apply(); };
  const zoomOut = () => { st.current.userActive = true; st.current.zoom = Math.max(0.45, st.current.zoom / 1.15); apply(); };
  const resetView = () => { const s = st.current; s.userActive = false; s.spin = -26; s.tilt = 56; s.zoom = 1; apply(); };

  const sceneStyle: CSSProperties = {
    position: 'absolute', left: '50%', top: '50%', width: 0, height: 0,
    transformStyle: 'preserve-3d', willChange: 'transform',
  };
  // CSS custom properties consumed by the boards (cast: not in the CSS typing).
  const sceneVars = { '--play': play, '--surround': surround, '--line': LINE, '--line2': LINE2 } as CSSProperties;

  return (
    <div
      ref={viewportRef}
      onPointerDown={onPointerDown}
      style={{ position: 'relative', width: '100%', height: '100%', minHeight: 360, perspective: 1600, perspectiveOrigin: '50% 40%', cursor: 'grab', touchAction: 'none', overflow: 'hidden', userSelect: 'none' }}
    >
      <div style={{ position: 'absolute', left: '50%', top: '57%', width: '60%', height: '30%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.5), rgba(0,0,0,0) 70%)', filter: 'blur(8px)', pointerEvents: 'none' }} />

      <div ref={sceneRef} style={{ ...sceneStyle, ...sceneVars }}>
        {courtType === 'pickleball' && <PickleBoard netOn={netOn} fenceOn={fenceOn} lightsOn={lightsOn} reboundOn={reboundOn} />}
        {courtType === 'basketball' && <BballBoard hoopOn={hoopOn} fenceOn={fenceOn} lightsOn={lightsOn} />}
        {courtType === 'multisport' && <MultiBoard netOn={netOn} hoopOn={hoopOn} fenceOn={fenceOn} lightsOn={lightsOn} />}
      </div>

      {showControls && (
        <>
          <div style={{ position: 'absolute', right: 14, bottom: 14, display: 'flex', flexDirection: 'column', gap: 7, zIndex: 5 }}>
            <CtrlBtn onClick={zoomIn} label="Zoom in">+</CtrlBtn>
            <CtrlBtn onClick={zoomOut} label="Zoom out">−</CtrlBtn>
            <CtrlBtn onClick={resetView} label="Reset view">⟳</CtrlBtn>
          </div>
          <div style={{ position: 'absolute', left: 14, bottom: 14, zIndex: 5, display: 'flex', alignItems: 'center', gap: 7, padding: '6px 11px', borderRadius: 999, background: 'rgba(14,22,32,0.6)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'var(--font-manrope),sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.62)', textTransform: 'uppercase', pointerEvents: 'none' }}>
            <span style={{ fontSize: 13 }}>✦</span> Drag to orbit · Scroll to zoom
          </div>
        </>
      )}
    </div>
  );
}

function CtrlBtn({ children, onClick, label }: { children: React.ReactNode; onClick: () => void; label: string }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(14,22,32,0.72)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer', lineHeight: 1, fontFamily: 'var(--font-manrope),sans-serif' }}>
      {children}
    </button>
  );
}

const boardBase: CSSProperties = { position: 'absolute', left: 0, top: 0, transform: 'translate(-50%,-50%)', transformStyle: 'preserve-3d' };
const underlay: CSSProperties = { position: 'absolute', inset: 0, transform: 'translateZ(-18px)', background: '#0a1622', borderRadius: 5 };
const surroundStyle: CSSProperties = { position: 'absolute', inset: 0, background: 'var(--surround)', borderRadius: 5, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.28)' };

function Fence() {
  const wall: CSSProperties = { backgroundImage: 'linear-gradient(rgba(255,255,255,0.16) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.16) 1px,transparent 1px)', backgroundSize: '15px 15px', backgroundColor: 'rgba(120,150,170,0.04)', border: '1px solid rgba(255,255,255,0.2)' };
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: 130, transformOrigin: 'center top', transform: 'rotateX(-90deg)', ...wall }} />
      <div style={{ position: 'absolute', left: 0, top: '100%', width: '100%', height: 130, transformOrigin: 'center top', transform: 'rotateX(-90deg)', ...wall }} />
      <div style={{ position: 'absolute', left: 0, top: 0, width: 130, height: '100%', transformOrigin: 'left center', transform: 'rotateY(90deg)', ...wall }} />
      <div style={{ position: 'absolute', left: '100%', top: 0, width: 130, height: '100%', transformOrigin: 'left center', transform: 'rotateY(90deg)', ...wall }} />
    </>
  );
}

function Lights({ height }: { height: number }) {
  const pole: CSSProperties = { position: 'absolute', top: -6, width: 12, height, transformOrigin: 'center bottom', transform: 'rotateX(-90deg)', background: 'linear-gradient(#7d8794,#2a3340)', borderRadius: 3 };
  const lamp: CSSProperties = { position: 'absolute', left: -12, top: -16, width: 36, height: 22, background: 'radial-gradient(circle,#fff8e0,#ffd25a)', borderRadius: 4, boxShadow: '0 0 26px 6px rgba(255,220,120,0.7)' };
  return (
    <>
      <div style={{ ...pole, left: -6 }}><div style={lamp} /></div>
      <div style={{ ...pole, left: 'calc(100% - 6px)' }}><div style={lamp} /></div>
    </>
  );
}

function Hoop({ top }: { top: string }) {
  return (
    <div style={{ position: 'absolute', left: 'calc(50% - 40px)', top, width: 80, height: 150, transformOrigin: 'center bottom', transform: 'rotateX(-90deg)' }}>
      <div style={{ position: 'absolute', left: 'calc(50% - 5px)', bottom: 0, width: 10, height: 96, background: 'linear-gradient(#8b96a3,#39424f)', borderRadius: 3 }} />
      <div style={{ position: 'absolute', left: 14, top: 0, width: 52, height: 38, background: 'rgba(245,248,250,0.92)', border: '3px solid #1a2330', borderRadius: 3 }}>
        <div style={{ position: 'absolute', left: 14, bottom: 5, width: 24, height: 16, border: '2px solid #d2410e' }} />
      </div>
      <div style={{ position: 'absolute', left: 'calc(50% - 13px)', top: 34, width: 26, height: 8, border: '2px solid #e85a1a', borderRadius: '50%', transformOrigin: 'center top', transform: 'rotateX(78deg)', background: 'rgba(232,90,26,0.15)' }} />
    </div>
  );
}

function Net({ inset }: { inset: string }) {
  return (
    <div style={{ position: 'absolute', left: inset, right: inset, top: 'calc(50% - 30px)', height: 30, transformOrigin: 'center bottom', transform: 'rotateX(-90deg)', background: 'repeating-linear-gradient(0deg,rgba(255,255,255,0.32) 0 1px,transparent 1px 6px),repeating-linear-gradient(90deg,rgba(255,255,255,0.32) 0 1px,transparent 1px 6px)', backgroundColor: 'rgba(10,20,30,0.18)', borderTop: '3px solid #f4f6f8' }} />
  );
}

function PickleBoard({ netOn, fenceOn, lightsOn, reboundOn }: { netOn: boolean; fenceOn: boolean; lightsOn: boolean; reboundOn: boolean }) {
  return (
    <div style={{ ...boardBase, width: 300, height: 560 }}>
      <div style={underlay} />
      <div style={surroundStyle} />
      <div style={{ position: 'absolute', left: '16.5%', top: '13%', right: '16.5%', bottom: '13%', background: 'var(--play)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.22)' }}>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid var(--line)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 'calc(50% - 1.5px)', height: 3, background: 'var(--line)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 'calc(34% - 1.5px)', height: 3, background: 'var(--line)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 'calc(66% - 1.5px)', height: 3, background: 'var(--line)' }} />
        <div style={{ position: 'absolute', top: 0, height: '34%', left: 'calc(50% - 1.5px)', width: 3, background: 'var(--line)' }} />
        <div style={{ position: 'absolute', bottom: 0, height: '34%', left: 'calc(50% - 1.5px)', width: 3, background: 'var(--line)' }} />
      </div>
      {netOn && <Net inset="16.5%" />}
      {fenceOn && <Fence />}
      {lightsOn && <Lights height={165} />}
      {reboundOn && (
        <div style={{ position: 'absolute', left: '20%', top: 0, width: '60%', height: 96, transformOrigin: 'center top', transform: 'rotateX(-90deg)', background: 'linear-gradient(#13405f,#0c2c44)', border: '2px solid rgba(255,255,255,0.28)', boxShadow: '0 0 24px rgba(0,0,0,0.4)' }} />
      )}
    </div>
  );
}

function BballBoard({ hoopOn, fenceOn, lightsOn }: { hoopOn: boolean; fenceOn: boolean; lightsOn: boolean }) {
  return (
    <div style={{ ...boardBase, width: 420, height: 440 }}>
      <div style={underlay} />
      <div style={surroundStyle} />
      <div style={{ position: 'absolute', left: '10%', top: '8%', right: '10%', bottom: '8%', background: 'var(--play)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.22)' }}>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid var(--line)' }} />
        <div style={{ position: 'absolute', left: '34%', top: 0, width: '32%', height: '52%', border: '3px solid var(--line)', borderTop: 'none' }} />
        <div style={{ position: 'absolute', left: '34%', top: 'calc(52% - 32px)', width: '32%', height: 64, border: '3px solid var(--line)', borderRadius: '50%', background: 'transparent' }} />
        <div style={{ position: 'absolute', left: '8%', top: 0, width: '84%', height: '74%', border: '3px solid var(--line)', borderTop: 'none', borderRadius: '0 0 200px 200px' }} />
        <div style={{ position: 'absolute', left: 'calc(50% - 38px)', bottom: -38, width: 76, height: 76, border: '3px solid var(--line)', borderRadius: '50%' }} />
      </div>
      {hoopOn && <Hoop top="6%" />}
      {fenceOn && <Fence />}
      {lightsOn && <Lights height={175} />}
    </div>
  );
}

function MultiBoard({ netOn, hoopOn, fenceOn, lightsOn }: { netOn: boolean; hoopOn: boolean; fenceOn: boolean; lightsOn: boolean }) {
  return (
    <div style={{ ...boardBase, width: 340, height: 600 }}>
      <div style={underlay} />
      <div style={surroundStyle} />
      <div style={{ position: 'absolute', left: '13%', top: '11%', right: '13%', bottom: '11%', background: 'var(--play)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.22)' }}>
        <div style={{ position: 'absolute', inset: 0, border: '3px solid var(--line)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 'calc(50% - 1.5px)', height: 3, background: 'var(--line)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 'calc(36% - 1.5px)', height: 3, background: 'var(--line)' }} />
        <div style={{ position: 'absolute', left: 0, right: 0, top: 'calc(64% - 1.5px)', height: 3, background: 'var(--line)' }} />
        <div style={{ position: 'absolute', left: 'calc(34% - 1px)', top: 0, width: '32%', height: '24%', border: '3px solid var(--line2)', borderTop: 'none' }} />
        <div style={{ position: 'absolute', left: '8%', top: 0, width: '84%', height: '34%', border: '3px solid var(--line2)', borderTop: 'none', borderRadius: '0 0 160px 160px' }} />
      </div>
      {netOn && <Net inset="13%" />}
      {hoopOn && <Hoop top="8%" />}
      {fenceOn && <Fence />}
      {lightsOn && <Lights height={170} />}
    </div>
  );
}
