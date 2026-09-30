import type { Metadata } from 'next';
import DevProfileClient from './dev-profile-client';

export const dynamic = 'force-dynamic';

interface DevDetailPageProps {
  params: Promise<{
    username: string;
  }>;
}

export async function generateMetadata({ params }: DevDetailPageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    alternates: {
      canonical: `/devs/${username}`,
    },
  };
}

export default function DevDetailPage() {
  return <DevProfileClient />;
}
