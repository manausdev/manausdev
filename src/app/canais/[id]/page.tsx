import { permanentRedirect } from 'next/navigation';
import { MOCK_CHANNELS } from '@/lib/data/mock';
import { fetchById } from '@/lib/data/source';
import type { CommunityChannel } from '@/types/database';

interface ChannelRedirectPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Canais deixaram de ser uma entidade navegavel: hoje eles vivem dentro da
 * comunidade. Esta rota existe so para nao quebrar o link antigo — ela resolve
 * a qual comunidade o canal pertence e redireciona permanentemente para ela.
 */
export default async function ChannelRedirectPage({ params }: ChannelRedirectPageProps) {
  const { id } = await params;

  const channel = await fetchById<CommunityChannel>('community_channels', id, () =>
    MOCK_CHANNELS.find((c) => c.id === id)
  );

  permanentRedirect(channel?.community_id ? `/comunidades/${channel.community_id}` : '/comunidades');
}
