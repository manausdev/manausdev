import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/vagas',
  },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
