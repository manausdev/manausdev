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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="manaus-card h-80 animate-pulse bg-[#f2f4f6] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div key={ev.id} className="manaus-card overflow-hidden flex flex-col justify-between border border-[#e0e3e5] group hover:border-[#006c49]/40 transition-all duration-300">
              <div>
                {/* Event Preview Image */}
                <div className="relative h-44 w-full bg-[#00281e] overflow-hidden border-b border-[#e0e3e5]">
                  {ev.image_url ? (
                    <img
                      src={ev.image_url}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#003527] to-[#002219] p-4 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bio-texture opacity-20" />
                      <Calendar className="w-10 h-10 text-[#6cf8bb]/60 mb-2 relative z-10" />
                      <span className="font-display font-bold text-sm text-[#eff1f3]/90 relative z-10">
                        {ev.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-[#003527]/90 backdrop-blur-md text-[#6cf8bb] text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#6cf8bb]/30 font-bold uppercase tracking-wider shadow-sm">
                      {ev.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded border border-white/20 font-medium">
                      📅 {formatDate(ev.date)}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h2 className="font-display font-bold text-lg text-[#003527] group-hover:text-[#006c49] transition-colors mb-2">
                    {ev.title}
                  </h2>
                  <p className="text-xs text-[#404944] leading-relaxed mb-4 line-clamp-3">
                    {ev.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-[#707974]">
                    <MapPin className="w-3.5 h-3.5 text-[#006c49] flex-shrink-0" />
                    <span className="font-medium text-[#404944]">{ev.location}</span>
                  </div>
                </div>
              </div>

              {ev.link && (
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-[#e0e3e5]/70 mt-auto">
                  <a
                    href={ev.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-leaf w-full justify-center text-xs !py-2.5 shadow-sm"
                  >
                    <span>Página do Evento / Inscrição</span>
                    <ExternalLink className="w-3.5 h-3.5" />
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
