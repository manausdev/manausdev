'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SparklesIcon, UsersIcon, ExternalLinkIcon, MessageSquareIcon, ArrowRightIcon } from '@/components/icons';
import { MOCK_COMMUNITIES } from '@/lib/data/mock';
import { createClient } from '@/lib/supabase/client';
import { useMockData } from '@/lib/env';
import type { Community } from '@/types/database';
import styles from './comunidades.module.css';

export default function ComunidadesPage() {
  const useMock = useMockData();
  const [communities, setCommunities] = useState<Community[]>(() => (useMock ? MOCK_COMMUNITIES : []));
  const [loading, setLoading] = useState(!useMock);

  useEffect(() => {
    if (useMock) {
      setCommunities(MOCK_COMMUNITIES);
      setLoading(false);
      return;
    }

    async function loadCommunities() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('communities').select('*');
        if (error) throw error;
        setCommunities(data ?? []);
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
                    className={styles.cardImageImg}
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

                <div className={styles.cardFooter}>
                  <Link href={`/comunidades/${comm.id}`} className={styles.cardLink}>
                    <span>Página da Comunidade</span>
                    <ArrowRightIcon size="xs" />
                  </Link>

                  <div className={styles.cardLinks}>
                    {Object.entries(comm.links || {}).slice(0, 1).map(([key, url]) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.externalLink}
                      >
                        <MessageSquareIcon className={styles.externalLinkIcon} />
                        <span>Entrar no {key}</span>
                        <ExternalLinkIcon size="xs" className={styles.externalLinkArrow} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}