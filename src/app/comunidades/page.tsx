'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Users, ExternalLink, MessageSquare, ArrowRight } from 'lucide-react';
import { MOCK_COMMUNITIES } from '@/lib/data/mock-data';
import { createClient } from '@/lib/supabase/client';
import type { Community } from '@/types/database';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent-text border border-accent/20 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rede Colaborativa</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink tracking-tight">
          Comunidades em <span className="text-accent-text">Manaus</span>
        </h1>
        <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl">
          Grupos de estudos, meetups periódicos, comunidades técnicas e espaços de troca aberta de conhecimento.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="manaus-card h-80 animate-pulse bg-surface-1 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((comm) => (
            <div key={comm.id} className="manaus-card overflow-hidden flex flex-col justify-between border border-border group hover:border-accent/40 transition-all duration-300">
              <div>
                {/* Visual Preview Header */}
                <Link href={`/comunidades/${comm.id}`} className="block relative h-40 w-full bg-deep overflow-hidden border-b border-border">
                  {comm.image_url ? (
                    <img
                      src={comm.image_url}
                      alt={comm.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-brand p-4 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bio-texture opacity-20" />
                      <Sparkles className="w-10 h-10 text-neon/60 mb-2 relative z-10" />
                      <span className="font-display font-bold text-sm text-on-dark/90 relative z-10">
                        {comm.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-deep/85 backdrop-blur-md text-neon text-[10px] font-mono px-2.5 py-1 rounded-full border border-neon/30 font-semibold shadow-sm flex items-center gap-1">
                      <Users className="w-3 h-3 text-neon" />
                      {comm.members_count}+ membros
                    </span>
                  </div>
                </Link>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-deep text-white flex items-center justify-center font-display font-bold text-sm shadow-sm flex-shrink-0">
                        {comm.name.charAt(0)}
                      </div>
                      <div>
                        <Link href={`/comunidades/${comm.id}`}>
                          <h2 className="font-display font-bold text-base text-ink group-hover:text-accent-text transition-colors">{comm.name}</h2>
                        </Link>
                        <span className="text-[11px] font-mono text-accent-text font-medium">{comm.type}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-3">
                    {comm.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-border/70 flex items-center justify-between text-xs mt-auto">
                <Link
                  href={`/comunidades/${comm.id}`}
                  className="text-xs font-semibold text-accent-text hover:underline flex items-center gap-1"
                >
                  <span>Página da Comunidade</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex flex-wrap items-center gap-1.5">
                  {Object.entries(comm.links || {}).slice(0, 1).map(([key, url]) => (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-surface-1 hover:bg-accent/10 text-ink hover:text-accent-text border border-border transition-colors capitalize text-[11px] font-semibold"
                    >
                      <MessageSquare className="w-3 h-3 text-accent-text" />
                      {key}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
