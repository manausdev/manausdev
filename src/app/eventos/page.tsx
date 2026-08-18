'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';
import { MOCK_EVENTS } from '@/lib/data/mock-data';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import type { EventItem } from '@/types/database';

export default function EventosPage() {
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006c49]/10 text-[#006c49] border border-[#006c49]/20 text-xs font-semibold mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>Agenda & Hackathons</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#003527] tracking-tight">
          Eventos de Tecnologia em <span className="text-[#006c49]">Manaus</span>
        </h1>
        <p className="text-[#404944] text-sm sm:text-base mt-2 max-w-2xl">
          Fique por dentro de meetups, conferências, hackathons de sustentabilidade e workshops no Amazonas.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="manaus-card p-6 h-32 animate-pulse bg-[#f2f4f6]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div key={ev.id} className="manaus-card p-6 flex flex-col justify-between border-t-4 border-t-[#006c49]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="chip-leaf text-xs font-mono font-semibold uppercase tracking-wider">
                    {ev.type}
                  </span>
                  <span className="text-xs font-mono text-[#707974] font-medium">
                    {formatDate(ev.date)}
                  </span>
                </div>

                <h2 className="font-display font-bold text-lg text-[#003527] mb-2">{ev.title}</h2>
                <p className="text-xs text-[#404944] leading-relaxed mb-4">{ev.description}</p>

                <div className="flex items-center gap-1.5 text-xs text-[#707974]">
                  <MapPin className="w-3.5 h-3.5 text-[#006c49]" />
                  <span>{ev.location}</span>
                </div>
              </div>

              {ev.link && (
                <div className="pt-6 border-t border-[#e0e3e5] mt-4">
                  <a
                    href={ev.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-secondary w-full justify-center text-xs !py-2.5"
                  >
                    <span>Página do Evento / Inscrição</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#00314a]" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
