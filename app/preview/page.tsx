import type { Metadata } from 'next';
import { YardPreviewer } from '@/components/previewer/yard-previewer';

export const metadata: Metadata = {
  title: 'See It in Your Backyard — AI Court Previewer',
  description:
    'Upload a photo of your space and drop a finished sport court right into it. Spin it, recolor it, resize it — then send the exact look to GRIT with your estimate.',
  alternates: { canonical: '/preview' },
};

export default function PreviewPage() {
  return (
    <div className="bg-cream">
      <div className="mx-auto max-w-content px-5 pb-[clamp(48px,6vw,80px)] pt-[clamp(28px,4vw,52px)] sm:px-7">
        <div className="mb-7 max-w-[680px]">
          <div className="eyebrow mb-4">Backyard previewer</div>
          <h1 className="font-display text-[clamp(30px,4.4vw,52px)] font-extrabold leading-none tracking-[-0.03em]">
            See it in your <span className="text-brand-600">actual</span> backyard.
          </h1>
          <p className="mt-4 text-[16.5px] leading-relaxed text-[#4a5560]">
            Upload a photo of your space and drop a finished court right into it. Spin it,
            recolor it, resize it — then send the exact look to our team with your estimate.
          </p>
        </div>
        <YardPreviewer />
      </div>
    </div>
  );
}
