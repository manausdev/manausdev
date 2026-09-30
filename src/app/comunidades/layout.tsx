import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/comunidades',
  },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
