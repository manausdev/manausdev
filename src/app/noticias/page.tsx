'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageSquareIcon, SearchIcon, ArrowRightIcon, ClockIcon } from '@/components/icons';
import { MOCK_NEWS } from '@/lib/data/mock';
import { createClient } from '@/lib/supabase/client';
import { useMockData } from '@/lib/env';
import { NEWS_CATEGORIES, categoryLabel, formatDate } from '@/lib/news-meta';
import type { NewsItem } from '@/types/database';
import styles from './noticias.module.css';

function NoticiasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const useMock = useMockData();

  const initialSearch = searchParams.get('q') || '';
  const initialCategory = searchParams.get('categoria');

  const [items, setItems] = useState<NewsItem[]>(() => (useMock ? MOCK_NEWS : []));
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory);
  const [loading, setLoading] = useState(!useMock);

  useEffect(() => {
    if (useMock) {
      setItems(MOCK_NEWS);
      setLoading(false);
      return;
    }

    async function loadNews() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('published', true)
          .order('published_at', { ascending: false });
        if (error) throw error;
        setItems(data ?? []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, [useMock]);

  const updateFilters = (newSearch: string, newCategory: string | null) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('q', newSearch);
    if (newCategory) params.set('categoria', newCategory);

    const queryString = params.toString();
    router.replace(`/noticias${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const handleCategoryChange = (category: string | null) => {
    const next = category === selectedCategory ? null : category;
    setSelectedCategory(next);
    updateFilters(searchTerm, next);
  };

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return items.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(term) ||
        (item.excerpt?.toLowerCase().includes(term) ?? false);
      const matchCategory = selectedCategory ? item.category === selectedCategory : true;
      return matchSearch && matchCategory;
    });
  }, [items, searchTerm, selectedCategory]);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <MessageSquareIcon className={styles.badgeIcon} />
          <span>Editorial da Comunidade</span>
        </div>
        <h1 className={styles.heroTitle}>
          Notícias do <span className={styles.heroTitleAccent}>ecossistema tech amazonense</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Eventos, vagas, lançamentos e análises escritas por quem constrói tecnologia na
          região.
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar notícias..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              updateFilters(e.target.value, selectedCategory);
            }}
            className={`manaus-input ${styles.searchInput}`}
          />
        </div>

        <div className={styles.categoryFilters}>
          <span className={styles.categoryLabel}>Categoria:</span>
          {NEWS_CATEGORIES.map((cat) => {
            const isSelected = cat.value === selectedCategory;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`${styles.categoryBtn} ${isSelected ? styles.categoryBtnActive : styles.categoryBtnInactive}`}
              >
                {cat.label}
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
          <p className={styles.emptyText}>Nenhuma notícia encontrada para os filtros selecionados.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((item) => (
            <article key={item.id} className={styles.card}>
              {item.image_url && (
                <div className={styles.cardMedia}>
                  <img src={item.image_url} alt="" className={styles.cardImage} loading="lazy" />
                </div>
              )}

              <div className={styles.cardBody}>
                <div className={styles.cardBadges}>
                  <span className={styles.categoryBadge}>{categoryLabel(item.category)}</span>
                  {item.published_at && (
                    <span className={styles.dateBadge}>
                      <ClockIcon className={styles.dateIcon} />
                      {formatDate(item.published_at)}
                    </span>
                  )}
                </div>

                <Link href={`/noticias/${item.id}`}>
                  <h2 className={styles.cardTitle}>{item.title}</h2>
                </Link>

                {item.excerpt && <p className={styles.cardExcerpt}>{item.excerpt}</p>}

                <Link href={`/noticias/${item.id}`} className={styles.cardLink}>
                  Ler notícia
                  <ArrowRightIcon className={styles.linkIcon} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NoticiasPage() {
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
      <NoticiasContent />
    </Suspense>
  );
}
