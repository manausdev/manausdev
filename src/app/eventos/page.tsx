'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink, Sparkles } from 'lucide-react';
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/25 text-xs font-mono mb-3">
          <Calendar className="w-3.5 h-3.5" />
          <span>Agenda & Hackathons</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Eventos de Tecnologia em <span className="gradient-text-solimoes">Manaus</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
          Fique por dentro de meetups, conferências, hackathons e workshops no estado do Amazonas.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 h-32 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((ev) => (
            <div key={ev.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold uppercase tracking-wider bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30">
                    {ev.type}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {formatDate(ev.date)}
                  </span>
                </div>

                <h2 className="font-display font-bold text-lg text-white mb-2">{ev.title}</h2>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{ev.description}</p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{ev.location}</span>
                </div>
              </div>

              {ev.link && (
                <div className="pt-6 border-t border-white/5 mt-4">
                  <a
                    href={ev.link}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                  >
                    <span>Página do Evento / Inscrição</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
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
