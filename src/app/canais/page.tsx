'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageSquareIcon, UsersIcon, ExternalLinkIcon, ArrowRightIcon, SearchIcon } from '@/components/icons';
import { MOCK_CHANNELS, MOCK_COMMUNITIES } from '@/lib/data/mock';
import { createClient } from '@/lib/supabase/client';
import { useMockData } from '@/lib/env';
import { PLATFORM_META, platformMeta, type PlatformMeta } from '@/lib/channels-meta';
import type { CommunityChannel, Community } from '@/types/database';
import styles from './canais.module.css';

interface ChannelWithCommunity extends CommunityChannel {
  community_name?: string | null;
}

function CanaisContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const useMock = useMockData();

  const initialSearch = searchParams.get('q') || '';
  const initialPlatform = searchParams.get('plataforma');

  const [channels, setChannels] = useState<ChannelWithCommunity[]>(() =>
    useMock ? MOCK_CHANNELS : []
  );
  const [communities, setCommunities] = useState<Community[]>(() => (useMock ? MOCK_COMMUNITIES : []));
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(initialPlatform);
  const [loading, setLoading] = useState(!useMock);

  useEffect(() => {
    if (useMock) {
      setChannels(MOCK_CHANNELS);
      setCommunities(MOCK_COMMUNITIES);
      setLoading(false);
      return;
    }

    async function loadChannels() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('community_channels')
          .select('*, community:communities(name)');
        if (error) throw error;

        const rows = (data ?? []) as unknown as (CommunityChannel & {
          community?: { name?: string } | { name?: string }[] | null;
        })[];

        setChannels(
          rows.map((row) => {
            const embedded = Array.isArray(row.community) ? row.community[0] : row.community;
            return { ...row, community_name: embedded?.name ?? null };
          })
        );
      } catch {
        setChannels([]);
      } finally {
        setLoading(false);
      }
    }
    loadChannels();
  }, [useMock]);

  const communityNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const c of communities) map.set(c.id, c.name);
    return map;
  }, [communities]);

  const updateFilters = (newSearch: string, newPlatform: string | null) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('q', newSearch);
    if (newPlatform) params.set('plataforma', newPlatform);

    const queryString = params.toString();
    router.replace(`/canais${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const handlePlatformChange = (platform: string | null) => {
    const next = platform === selectedPlatform ? null : platform;
    setSelectedPlatform(next);
    updateFilters(searchTerm, next);
  };

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return channels.filter((channel) => {
      const name = channel.community_name ?? communityNames.get(channel.community_id) ?? '';
      const matchSearch =
        channel.name.toLowerCase().includes(term) ||
        (channel.description?.toLowerCase().includes(term) ?? false) ||
        name.toLowerCase().includes(term);
      const matchPlatform = selectedPlatform ? channel.platform === selectedPlatform : true;
      return matchSearch && matchPlatform;
    });
  }, [channels, communityNames, searchTerm, selectedPlatform]);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <MessageSquareIcon className={styles.badgeIcon} />
          <span>Canais da Comunidade</span>
        </div>
        <h1 className={styles.heroTitle}>
          Onde a conversa <span className={styles.heroTitleAccent}>acontece de verdade</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Canais oficiais das comunidades de tecnologia de Manaus. Entre pelo canal da comunidade
          que você segue.
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por canal ou comunidade..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              updateFilters(e.target.value, selectedPlatform);
            }}
            className={`manaus-input ${styles.searchInput}`}
          />
        </div>

        <div className={styles.platformFilters}>
          <span className={styles.platformLabel}>Plataforma:</span>
          {PLATFORM_META.map((meta: PlatformMeta) => {
            const isSelected = meta.value === selectedPlatform;
            return (
              <button
                key={meta.value}
                onClick={() => handlePlatformChange(meta.value)}
                className={`${styles.platformBtn} ${isSelected ? styles.platformBtnActive : styles.platformBtnInactive}`}
              >
                {meta.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.loadingItem} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Nenhum canal encontrado para os filtros selecionados.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((channel) => {
            const meta = platformMeta(channel.platform);
            const communityName =
              channel.community_name ?? communityNames.get(channel.community_id) ?? 'Comunidade';
            return (
              <div key={channel.id} className={styles.card}>
                <div className={styles.cardMain}>
                  <div className={styles.cardBadges}>
                    <span className={`${styles.platformBadge} ${styles[meta.badgeClass]}`}>
                      {meta.label}
                    </span>
                    <Link href={`/comunidades/${channel.community_id}`} className={styles.communityLink}>
                      {communityName}
                    </Link>
                  </div>

                  <Link href={`/canais/${channel.id}`}>
                    <h2 className={styles.cardTitle}>{channel.name}</h2>
                  </Link>

                  {channel.description && (
                    <p className={styles.cardDescription}>{channel.description}</p>
                  )}

                  {typeof channel.members_count === 'number' && (
                    <span className={styles.members}>
                      <UsersIcon className={styles.membersIcon} />
                      {channel.members_count.toLocaleString('pt-BR')} membros
                    </span>
                  )}
                </div>

                <div className={styles.cardActions}>
                  <Link href={`/canais/${channel.id}`} className={styles.btnGhost}>
                    <span>Detalhes</span>
                    <ArrowRightIcon className={styles.iconSm} />
                  </Link>
                  {channel.url && (
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.btnPrimary}
                    >
                      <span>Entrar no canal</span>
                      <ExternalLinkIcon className={styles.iconSm} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CanaisPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.loading}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.loadingItem} />
            ))}
          </div>
        </div>
      }
    >
      <CanaisContent />
    </Suspense>
  );
}
