'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CalendarDaysIcon, MapPinIcon, SearchIcon, ArrowRightIcon } from '@/components/icons';
import { MOCK_EVENTS } from '@/lib/data/mock';
import { createClient } from '@/infrastructure/supabase/client';
import { formatDate } from '@/lib/utils';
import { useMockData } from '@/lib/env';
import type { EventItem } from '@/types/database';
import styles from './eventos.module.css';

function EventosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const useMock = useMockData();

  const initialSearch = searchParams.get('q') || '';
  const initialType = searchParams.get('type');

  const [events, setEvents] = useState<EventItem[]>(() => (useMock ? MOCK_EVENTS : []));
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState<string | null>(initialType);
  const [loading, setLoading] = useState(!useMock);

  useEffect(() => {
    if (useMock) {
      setEvents(MOCK_EVENTS);
      setLoading(false);
      return;
    }

    async function loadEvents() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
        if (error) throw error;
        setEvents(data ?? []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [useMock]);

  const updateFilters = (newSearch: string, newType: string | null) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('q', newSearch);
    if (newType) params.set('type', newType);

    const queryString = params.toString();
    router.replace(`/eventos${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    updateFilters(val, selectedType);
  };

  const handleTypeChange = (type: string | null) => {
    const nextType = type === selectedType ? null : type;
    setSelectedType(nextType);
    updateFilters(searchTerm, nextType);
  };

  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchSearch =
        ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ev.description && ev.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ev.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = selectedType ? ev.type?.toLowerCase() === selectedType.toLowerCase() : true;
      return matchSearch && matchType;
    });
  }, [events, searchTerm, selectedType]);

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <CalendarDaysIcon size="xs" />
          <span>Agenda & Hackathons</span>
        </div>
        <h1 className={styles.heroTitle}>
          Eventos de Tecnologia em <span className={styles.heroAccent}>Manaus</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Fique por dentro de meetups, conferências, hackathons de sustentabilidade e workshops no Amazonas.
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por título, assunto ou local..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.typeFilters}>
          <span className={styles.typeFilterLabel}>Tipo:</span>
          {['Todos', 'Meetup', 'Hackathon', 'Conference'].map((type) => {
            const isSelected =
              type === 'Todos'
                ? selectedType === null
                : selectedType?.toLowerCase() === type.toLowerCase();
            return (
              <button
                key={type}
                onClick={() => handleTypeChange(type === 'Todos' ? null : type.toLowerCase())}
                className={`${styles.typeFilterBtn} ${isSelected ? styles.typeFilterBtnActive : styles.typeFilterBtnInactive}`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`${styles.skeleton} ${styles.skeletonItem}`} />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Nenhum evento encontrado para os critérios selecionados.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredEvents.map((ev) => (
            <div key={ev.id} className={styles.card}>
              <Link href={`/eventos/${ev.id}`} className={styles.cardImage}>
                {ev.image_url ? (
                  <img src={ev.image_url} alt={ev.title} />
                ) : (
                  <div className={styles.cardImagePlaceholder}>
                    <CalendarDaysIcon size="xl" />
                    <span>{ev.title}</span>
                  </div>
                )}
                <span className={styles.cardTypeBadge}>{ev.type}</span>
                <span className={styles.cardDateBadge}>📅 {formatDate(ev.date)}</span>
              </Link>

              <div className={styles.cardContent}>
                <div>
                  <Link href={`/eventos/${ev.id}`}>
                    <h2 className={styles.cardTitle}>{ev.title}</h2>
                  </Link>
                  <p className={styles.cardDescription}>{ev.description}</p>

                  <div className={styles.cardMeta}>
                    <MapPinIcon className={styles.mapPinIcon} />
                    <span>{ev.location}</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Link href={`/eventos/${ev.id}`} className={styles.btnLeaf}>
                    <span>Ver Detalhes</span>
                    <ArrowRightIcon size="xs" />
                  </Link>

                  {ev.link && (
                    <a
                      href={ev.link}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.eventLink}
                    >
                      Inscrição externa →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EventosPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.grid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`${styles.skeleton} ${styles.skeletonItem}`} />
            ))}
          </div>
        </div>
      }
    >
      <EventosContent />
    </Suspense>
  );
}
