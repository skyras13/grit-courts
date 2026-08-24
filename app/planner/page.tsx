import type { Metadata } from 'next';
import { Container } from '@/components/ui/layout';
import { PlannerClient } from '@/components/planner/planner-client';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Will a court fit in my yard? | Free Yard Planner',
  description:
    'Drop a real, to-scale pickleball or basketball court onto an aerial photo of your own backyard. Set the scale, drag it where you want it, and see if it fits — free, no signup.',
  path: '/planner',
});

export default function PlannerPage() {
  return (
    <Container className="py-10">
      <div className="mb-6 max-w-[720px]">
        <p className="text-[12.5px] font-bold uppercase tracking-[0.14em] text-brand-600">Yard planner</p>
        <h1 className="mt-2 font-display text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.05]">
          Will a court actually fit in your yard?
        </h1>
        <p className="mt-3 text-[15.5px] leading-relaxed text-muted">
          Upload an aerial photo, tell us the length of one thing you know — a fence, the back of the
          house — and we&rsquo;ll drop a true-to-scale court onto your yard. Every measurement is real.
        </p>
      </div>
      <PlannerClient />
    </Container>
  );
}
