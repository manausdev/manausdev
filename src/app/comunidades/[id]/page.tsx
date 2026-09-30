import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  SparklesIcon, 
  UsersIcon, 
  MessageSquareIcon, 
  ExternalLinkIcon 
} from '@/components/icons';
import { MOCK_COMMUNITIES } from '@/lib/data/mock';
import { fetchById, fetchIdsForStaticParams } from '@/lib/data/source';
import type { Community } from '@/types/database';
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

export default async function CommunityDetailPage({ params }: CommunityDetailPageProps) {
  const { id } = await params;
  const community = await fetchById<Community>('communities', id, () =>
    MOCK_COMMUNITIES.find((c) => c.id === id)
  );

  if (!community) {
    notFound();
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
