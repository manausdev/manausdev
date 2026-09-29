'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CalendarDaysIcon, MapPinIcon, SearchIcon, ArrowRightIcon } from '@/components/icons';
import { MOCK_EVENTS } from '@/lib/data/mock';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import type { EventItem } from '@/types/database';

function EventosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get('q') || '';
  const initialType = searchParams.get('type');

  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState<string | null>(initialType);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true });
        if (data && data.length > 0 && !error) {
          setEvents(data);
        }
      } catch {
        // mock fallback
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent-text border border-accent/20 text-xs font-semibold mb-3">
          <CalendarDaysIcon className="w-3.5 h-3.5" />
          <span>Agenda & Hackathons</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink tracking-tight">
          Eventos de Tecnologia em <span className="text-accent-text">Manaus</span>
        </h1>
        <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl">
          Fique por dentro de meetups, conferências, hackathons de sustentabilidade e workshops no Amazonas.
        </p>
      </div>

      {/* Filters */}
      <div className="manaus-card p-5 sm:p-6 mb-8 space-y-4">
        <div className="relative flex items-center">
          <SearchIcon className="w-4 h-4 absolute left-3.5 text-faint pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Buscar por título, assunto ou local..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="manaus-input w-full !pl-10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-faint font-medium flex-shrink-0">Tipo:</span>
          {['Todos', 'Meetup', 'Hackathon', 'Conference'].map((type) => {
            const isSelected = type === 'Todos' ? selectedType === null : selectedType?.toLowerCase() === type.toLowerCase();
            return (
              <button
                key={type}
                onClick={() => handleTypeChange(type === 'Todos' ? null : type.toLowerCase())}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-deep text-white font-semibold'
                    : 'bg-surface-1 text-muted hover:bg-surface-2'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="manaus-card h-80 animate-pulse bg-surface-1 rounded-xl" />
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 manaus-card">
          <p className="text-faint text-sm">Nenhum evento encontrado para os critérios selecionados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((ev) => (
            <div key={ev.id} className="manaus-card overflow-hidden flex flex-col justify-between border border-border group hover:border-accent/40 transition-all duration-300">
              <div>
                {/* Event Preview Image */}
                <Link href={`/eventos/${ev.id}`} className="block relative h-44 w-full bg-deep overflow-hidden border-b border-border">
                  {ev.image_url ? (
                    <img
                      src={ev.image_url}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-brand p-4 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bio-texture opacity-20" />
                      <CalendarDaysIcon className="w-10 h-10 text-neon/60 mb-2 relative z-10" />
                      <span className="font-display font-bold text-sm text-on-dark/90 relative z-10">
                        {ev.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-deep/90 backdrop-blur-md text-neon text-[10px] font-mono px-2.5 py-1 rounded-full border border-neon/30 font-bold uppercase tracking-wider shadow-sm">
                      {ev.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded border border-white/20 font-medium">
                      📅 {formatDate(ev.date)}
                    </span>
                  </div>
                </Link>

                <div className="p-5 sm:p-6">
                  <Link href={`/eventos/${ev.id}`}>
                    <h2 className="font-display font-bold text-lg text-ink group-hover:text-accent-text transition-colors mb-2">
                      {ev.title}
                    </h2>
                  </Link>
                  <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-3">
                    {ev.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-faint">
                    <MapPinIcon className="w-3.5 h-3.5 text-accent-text flex-shrink-0" />
                    <span className="font-medium text-muted">{ev.location}</span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-border/70 flex items-center justify-between text-xs mt-auto">
                <Link
                  href={`/eventos/${ev.id}`}
                  className="btn-leaf text-xs !py-2 !px-4 flex items-center gap-1"
                >
                  <span>Ver Detalhes</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>

                {ev.link && (
                  <a
                    href={ev.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-accent-text hover:underline"
                  >
                    Inscrição externa →
                  </a>
                )}
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
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-10 bg-surface-2 w-64 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="manaus-card h-80 animate-pulse bg-surface-1 rounded-xl" />
          ))}
        </div>
      </div>
    }>
      <EventosContent />
    </Suspense>
  );
}

