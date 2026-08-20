'use client';

import { useEffect } from 'react';

/** Runs once after mount. Keeps localStorage reads out of the server render. */
export function useMountedEffect(fn: () => void) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fn(); }, []);
}
