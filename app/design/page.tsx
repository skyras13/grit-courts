import type { Metadata } from 'next';
import { Configurator } from '@/components/design/configurator';

export const metadata: Metadata = {
  title: 'Design Your Court in 3D — Live Estimate',
  description:
    'Spin a real 3D sport court, choose your surface colors, size, and add-ons like fencing and lights, and get a live installed-price estimate. Pickleball, basketball, and multi-sport.',
  alternates: { canonical: '/design' },
};

export default function DesignPage() {
  return (
    <div className="bg-cream pb-9">
      <Configurator />
    </div>
  );
}
