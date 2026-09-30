import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeftIcon,
  ExternalLinkIcon,
  UsersIcon,
  MessageSquareIcon,
} from '@/components/icons';
import { MOCK_CHANNELS, MOCK_COMMUNITIES } from '@/lib/data/mock';
import { fetchById, fetchIdsForStaticParams } from '@/lib/data/source';
import { platformMeta } from '@/lib/channels-meta';
import type { CommunityChannel, Community } from '@/types/database';
import styles from './detail.module.css';

export async function generateStaticParams() {
  return fetchIdsForStaticParams(
    'community_channels',
    MOCK_CHANNELS.map((c) => c.id)
  );
}

interface ChannelDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ChannelDetailPage({ params }: ChannelDetailPageProps) {
  const { id } = await params;
  const channel = await fetchById<CommunityChannel>('community_channels', id, () =>
    MOCK_CHANNELS.find((c) => c.id === id)
  );

  if (!channel) {
    notFound();
  }

  const meta = platformMeta(channel.platform);
  const community = await fetchById<Community>('communities', channel.community_id, () =>
    MOCK_COMMUNITIES.find((c) => c.id === channel.community_id)
  );

  return (
    <div className={styles.container}>
      <Link href="/canais" className={styles.backLink}>
        <ArrowLeftIcon className={styles.iconSm} />
        Voltar para os canais
      </Link>

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.titleWrap}>
            <div className={styles.chips}>
              <span className={`${styles.platformBadge} ${styles[meta.badgeClass]}`}>
                {meta.label}
              </span>
              {community && (
                <Link href={`/comunidades/${community.id}`} className={styles.communityLink}>
                  {community.name}
                </Link>
              )}
            </div>

            <h1 className={styles.title}>{channel.name}</h1>

            {typeof channel.members_count === 'number' && (
              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  <UsersIcon className={styles.metaIcon} />
                  {channel.members_count.toLocaleString('pt-BR')} membros
                </span>
              </div>
            )}
          </div>

          {channel.url && (
            <div className={styles.btnWrap}>
              <a
                href={channel.url}
                target="_blank"
                rel="noreferrer"
                className={styles.btnPrimary}
              >
                <span>Entrar no {meta.label}</span>
                <ExternalLinkIcon className={styles.iconSm} />
              </a>
            </div>
          )}
        </div>

        <div>
          <h2 className={styles.sectionLabel}>Sobre o canal</h2>
          <p className={styles.description}>
            {channel.description ||
              'Canal oficial mantido pela comunidade. Entre para acompanhar as conversas.'}
          </p>
        </div>

        {community && (
          <div>
            <h2 className={styles.sectionLabel}>Comunidade</h2>
            <div className={styles.communityBox}>
              <h3 className={styles.communityName}>{community.name}</h3>
              <p className={styles.communityDescription}>{community.description}</p>
              {community.links && Object.keys(community.links).length > 0 && (
                <div className={styles.linkWrap}>
                  {Object.entries(community.links).map(([key, href]) => (
                    <a
                      key={key}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.linkBtn}
                    >
                      {key}
                      <ExternalLinkIcon className={styles.iconSm} />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.footerMeta}>
            <MessageSquareIcon className={styles.footerIcon} />
            Canal mantido pela comunidade no ManausDev
          </span>
          <Link href="/canais" className={styles.footerLink}>
            Outros canais →
          </Link>
        </div>
      </div>
    </div>
  );
}
