'use client';

import { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { drawCourt, courtPixelSize } from '@/lib/court-canvas';
import { PADS } from '@/lib/court-geometry';
import { LOGO_SRC, type DesignConfig } from '@/lib/court-designer';

/**
 * Three.js court renderer. Draws the accurate 2D court (lib/court-canvas) onto an
 * offscreen canvas, maps it as a texture on a 3D slab, and lets the user orbit it
 * with real lighting + shadow. Lazy-loaded (ssr:false) from the designer/preview.
 */
export default function CourtThree({
  config,
  autoRotate = false,
  className,
}: {
  config: DesignConfig;
  autoRotate?: boolean;
  className?: string;
}) {
  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 6.4, 6.6], fov: 42 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={['#0d1d2e']} />
        <hemisphereLight args={['#dfeaf5', '#1a2735', 0.9]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[5, 9, 4]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-8}
          shadow-camera-right={8}
          shadow-camera-top={8}
          shadow-camera-bottom={-8}
        />
        <CourtSlab config={config} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.16, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <shadowMaterial opacity={0.32} />
        </mesh>
        <OrbitControls
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2.15}
          minDistance={4.5}
          maxDistance={12}
          target={[0, 0, 0]}
        />
      </Canvas>
    </div>
  );
}

function CourtSlab({ config }: { config: DesignConfig }) {
  const [logo, setLogo] = useState<HTMLImageElement | null>(null);

  // Offscreen canvas + texture, created once.
  const { w: texW, h: texH } = courtPixelSize(config.pad);
  const { canvas, texture } = useMemo(() => {
    const cv = document.createElement('canvas');
    cv.width = texW;
    cv.height = texH;
    const tx = new THREE.CanvasTexture(cv);
    tx.anisotropy = 8;
    tx.colorSpace = THREE.SRGBColorSpace;
    return { canvas: cv, texture: tx };
  }, [texW, texH]);

  // Load logo art when the preset/custom URL changes.
  useEffect(() => {
    if (config.logo === 'none') {
      setLogo(null);
      return;
    }
    const src =
      config.logo === 'custom' ? config.customLogoUrl : LOGO_SRC[config.logo as keyof typeof LOGO_SRC];
    if (!src) {
      setLogo(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setLogo(img);
    img.onerror = () => setLogo(null);
    img.src = src;
  }, [config.logo, config.customLogoUrl]);

  // Redraw whenever the design or logo changes.
  useEffect(() => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    drawCourt(ctx, config, logo);
    texture.needsUpdate = true;
  }, [canvas, texture, config, logo]);

  useEffect(() => () => texture.dispose(), [texture]);

  // Slab matches the pad's real proportions, normalised to 10 units long so the
  // camera framing holds whether it's a 35x60 residential pad or a 60x120 tennis
  // court. A squashed slab was why earlier renders never looked like real courts.
  const pad = PADS[config.pad];
  const W = 10;
  const D = (10 * pad.widthFt) / pad.lengthFt;
  const T = 0.3;
  const materials = useMemo(() => {
    const edge = new THREE.MeshStandardMaterial({ color: '#0b1620', roughness: 0.9 });
    const top = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.72, metalness: 0.02 });
    // BoxGeometry face order: +x,-x,+y,-y,+z,-z → top is +y (index 2)
    return [edge, edge, top, edge, edge, edge];
  }, [texture]);

  return (
    <mesh castShadow receiveShadow material={materials}>
      <boxGeometry args={[W, T, D]} />
    </mesh>
  );
}
