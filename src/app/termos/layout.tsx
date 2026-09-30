import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/termos',
  },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
