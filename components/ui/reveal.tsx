'use client';

import { createElement, useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Scroll-triggered reveal.
 *
 * Motion here has one job: give a long page rhythm so it reads as built rather
 * than printed. It is deliberately restrained — a 16px rise over 500ms, once,
 * never replayed. No parallax, no counters, no scroll-jacking; those are the
 * effects that make a site look generated rather than designed.
 *
 * Respects prefers-reduced-motion by rendering fully visible immediately, and
 * degrades to visible if IntersectionObserver is unavailable, so content is
 * never trapped behind an effect.
 */
export function Reveal({
  children,
  delay = 0,
  as: As = 'div',
  className,
}: {
  children: ReactNode;
  /** Stagger, in ms. Keep siblings 60–90ms apart. */
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      // Fire slightly before the element reaches the viewport so the motion has
      // finished by the time the reader's eye arrives.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return createElement(
    As,
    {
      ref,
      className: cn('motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-out', className),
      style: shown
        ? { opacity: 1, transform: 'none', transitionDelay: `${delay}ms` }
        : { opacity: 0, transform: 'translateY(16px)' },
    },
    children,
  );
}
