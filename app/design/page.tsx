import type { Metadata } from 'next';
import { CourtDesignerUI } from '@/components/design/court-designer-ui';

export const metadata: Metadata = {
  title: 'Court Designer — Design Your Court in 3D',
  description:
    'Design your pickleball, basketball, or tennis court in real 3D. Pick every zone color, add game lines and a center logo, then see it dropped into a photo of your own backyard.',
  alternates: { canonical: '/design' },
};

export default function DesignPage() {
  return (
    <div className="bg-cream pb-10">
      <CourtDesignerUI />
    </div>
  );
}
