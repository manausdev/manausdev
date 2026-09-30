import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  SparklesIcon, 
  UsersIcon, 
  MessageSquareIcon, 
  ExternalLinkIcon 
} from '@/components/icons';
import { MOCK_COMMUNITIES, getMockChannelsByCommunity } from '@/lib/data/mock';
import { fetchById, fetchIdsForStaticParams } from '@/lib/data/source';
import { useMockData } from '@/lib/env';
import { createPublicClient } from '@/lib/supabase/public';
import type { Community, CommunityChannel } from '@/types/database';
import ChannelList from '../ChannelList';
import styles from './detail.module.css';

export async function generateStaticParams() {
  return fetchIdsForStaticParams(
    'communities',
    MOCK_COMMUNITIES.map((c) => c.id)
  );
}

interface CommunityDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: CommunityDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    alternates: {
      canonical: `/comunidades/${id}`,
    },
  };
}

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { id } = await params;
  const useMock = useMockData();

  const community = await fetchById<Community>('communities', id, () =>
    MOCK_COMMUNITIES.find((c) => c.id === id)
  );

  if (!community) {
    notFound();
  }

  let channels: CommunityChannel[] = [];
  if (useMock) {
    channels = getMockChannelsByCommunity(id);
  } else {
    try {
      const supabase = createPublicClient();
      const { data } = await supabase
        .from('community_channels')
        .select('*')
        .eq('community_id', id)
        .order('members_count', { ascending: false });
      channels = data ?? [];
    } catch {
      channels = [];
    }
  }

  return (
    <div className={styles.container}>
      <Link href="/comunidades" className={styles.backLink}>
        <ArrowLeftIcon />
        Voltar para a lista de comunidades
      </Link>

      <div className={styles.card}>
        <div className={styles.cover}>
          {community.image_url ? (
            <img src={community.image_url} alt={community.name} className={styles.coverImg} />
          ) : (
            <div className={styles.coverFallback}>
              <SparklesIcon size="xxl" className={styles.coverFallbackIcon} />
            </div>
          )}
          <div className={styles.membersBadgeWrap}>
            <span className={styles.membersBadge}>
              <UsersIcon size="xs" />
              {community.members_count}+ membros
            </span>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.header}>
            <span className={styles.type}>{community.type}</span>
            <h1 className={styles.title}>{community.name}</h1>
          </div>

          <div>
            <h2 className={styles.sectionTitle}>Missão e Propósito do Grupo</h2>
            <p className={styles.description}>{community.description}</p>
          </div>

          {channels.length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>Canais da Comunidade</h2>
              <ChannelList channels={channels} />
            </div>
          )}

          {community.links && Object.keys(community.links).length > 0 && (
            <div>
              <h2 className={styles.sectionTitle}>Canais de Comunicação & Participação</h2>
              <div className={styles.links}>
                {Object.entries(community.links).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                  >
                    <MessageSquareIcon className={styles.linkIcon} />
                    <span>Entrar no {key}</span>
                    <ExternalLinkIcon size="xs" className={styles.linkExternal} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
