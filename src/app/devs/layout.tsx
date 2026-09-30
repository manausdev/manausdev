import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/devs',
  },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
