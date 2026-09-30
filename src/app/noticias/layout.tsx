import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: {
    canonical: '/noticias',
  },
};

export default function SectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
