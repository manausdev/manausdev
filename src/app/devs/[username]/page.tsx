import { MOCK_DEVS } from '@/lib/data/mock-data';
import DevProfileClient from './dev-profile-client';

export async function generateStaticParams() {
  return MOCK_DEVS.map((dev) => ({ username: dev.username }));
}

export default function DevDetailPage() {
  return <DevProfileClient />;
}