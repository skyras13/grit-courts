'use client';

import { useState } from 'react';
import { YardPlanner } from '@/components/planner/yard-planner';
import { useEstimate } from '@/components/estimate/estimate-provider';
import { DEFAULT_DESIGN, type DesignConfig } from '@/lib/court-designer';
import { loadDesign, saveDesign } from '@/lib/config-store';
import { useMountedEffect } from '@/lib/use-mounted-effect';

/**
 * Wires the planner to the visitor's saved court design and the quote modal, so
 * a plan drawn here carries the exact colours they picked in the 3D designer.
 */
export function PlannerClient() {
  const { open } = useEstimate();
  const [design, setDesign] = useState<DesignConfig>(DEFAULT_DESIGN);

  useMountedEffect(() => setDesign(loadDesign()));

  function handleChange(d: DesignConfig) {
    setDesign(d);
    saveDesign(d);
  }

  return (
    <YardPlanner
      design={design}
      onDesignChange={handleChange}
      onExport={() => open({ design, source: 'yard-planner' })}
    />
  );
}
