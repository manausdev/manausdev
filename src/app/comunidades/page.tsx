'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SparklesIcon, UsersIcon, ArrowRightIcon } from '@/components/icons';
import { MOCK_COMMUNITIES } from '@/lib/data/mock';
import { createClient } from '@/infrastructure/supabase/client';
import { useMockData } from '@/lib/env';
import type { Community, CommunityChannel } from '@/types/database';
import ChannelList, { mockChannelsOf } from './ChannelList';
import styles from './comunidades.module.css';

export default function ComunidadesPage() {
  const useMock = useMockData();
  const [communities, setCommunities] = useState<Community[]>(() => (useMock ? MOCK_COMMUNITIES : []));
  const [channels, setChannels] = useState<Record<string, CommunityChannel[]>>({});
  const [loading, setLoading] = useState(!useMock);

  useEffect(() => {
    if (useMock) {
      setCommunities(MOCK_COMMUNITIES);
      setChannels(
        Object.fromEntries(MOCK_COMMUNITIES.map((c) => [c.id, mockChannelsOf(c.id)])),
      );
      setLoading(false);
      return;
    }

    async function loadCommunities() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('communities').select('*');
        if (error) throw error;
        setCommunities(data ?? []);

        const { data: channelRows } = await supabase
          .from('community_channels')
          .select('*')
          .order('members_count', { ascending: false });

        // O client do browser resolve as rows como `never[]` — mesmo quirque
        // contornado com cast em devs/page.tsx e no antigo /canais.
        const rows = (channelRows ?? []) as unknown as CommunityChannel[];

        const grouped: Record<string, CommunityChannel[]> = {};
        for (const row of rows) {
          (grouped[row.community_id] ??= []).push(row);
        }
        setChannels(grouped);
      } catch {
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    }
    loadCommunities();
  }, [useMock]);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <SparklesIcon size="xs" />
          <span>Rede Colaborativa</span>
        </div>
        <h1 className={styles.heroTitle}>
          Comunidades em <span className={styles.heroAccent}>Manaus</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Grupos de estudos, meetups periódicos, comunidades técnicas e espaços de troca aberta de conhecimento.
        </p>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`${styles.card} ${styles.skeleton}`} />
          ))}
        </div>
      ) : (
        <div className={styles.grid}>
          {communities.map((comm) => (
            <div key={comm.id} className={styles.card}>
              <Link href={`/comunidades/${comm.id}`} className={styles.cardImage}>
                {comm.image_url ? (
                  <img
                    src={comm.image_url}
                    alt={comm.name}
                  />
                ) : (
                  <div className={styles.cardImagePlaceholder}>
                    <SparklesIcon size="xl" className={styles.placeholderIcon} />
                    <span className={styles.placeholderName}>
                      {comm.name}
                    </span>
                  </div>
                )}
                <div className={styles.cardMembersBadge}>
                  <UsersIcon size="xxs" className={styles.membersIcon} />
                  {comm.members_count}+ membros
                </div>
              </Link>

              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardType}>{comm.type}</span>
                  <h2 className={styles.cardTitle}>{comm.name}</h2>
                </div>

                <p className={styles.cardDescription}>
                  {comm.description}
                </p>

                <ChannelList channels={channels[comm.id] ?? []} />

                <div className={styles.cardFooter}>
                  <Link href={`/comunidades/${comm.id}`} className={styles.cardLink}>
                    <span>Página da Comunidade</span>
                    <ArrowRightIcon size="xs" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}