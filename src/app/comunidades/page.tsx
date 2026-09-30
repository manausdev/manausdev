'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SparklesIcon, UsersIcon, ExternalLinkIcon, MessageSquareIcon, ArrowRightIcon } from '@/components/icons';
import { MOCK_COMMUNITIES } from '@/lib/data/mock';
import { createClient } from '@/lib/supabase/client';
import type { Community } from '@/types/database';
import styles from './comunidades.module.css';

export default function ComunidadesPage() {
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCommunities() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('communities').select('*');
        if (data && data.length > 0 && !error) {
          setCommunities(data);
        }
      } catch {
        // mock fallback
      } finally {
        setLoading(false);
      }
    }
    loadCommunities();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <SparklesIcon className="w-3.5 h-3.5" />
          <span>Rede Colaborativa</span>
        </div>
        <h1 className={styles.heroTitle}>
          Comunidades em <span className="text-accent-text">Manaus</span>
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
                    className={`${styles.cardImageImg}`}
                  />
                ) : (
                  <div className={styles.cardImagePlaceholder}>
                    <div className="absolute inset-0 opacity-20" />
                    <SparklesIcon className="w-10 h-10 text-neon/60 mb-2 relative z-10" />
                    <span className="font-display font-bold text-sm text-on-dark/90 relative z-10">
                      {comm.name}
                    </span>
                  </div>
                )}
                <div className={styles.cardMembersBadge}>
                  <UsersIcon className="w-3 h-3 text-neon" />
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
                    <ArrowRightIcon className="w-3.5 h-3.5" />
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
                        <MessageSquareIcon className="w-4 h-4 text-accent-text" />
                        <span>Entrar no {key}</span>
                        <ExternalLinkIcon className="w-3.5 h-3.5 opacity-60" />
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