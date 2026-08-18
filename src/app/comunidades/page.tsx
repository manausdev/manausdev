'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Users, ExternalLink, MessageSquare } from 'lucide-react';
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#818CF8]/10 text-[#818CF8] border border-[#818CF8]/25 text-xs font-mono mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rede Colaborativa</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Comunidades em <span className="text-[#818CF8]">Manaus</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
          Grupos de estudos, meetups periódicos, canais no Discord/Telegram e iniciativas técnicas locais.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-6 h-48 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((comm) => (
            <div key={comm.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#818CF8]/20 to-[#00F5FF]/20 border border-[#818CF8]/30 flex items-center justify-center text-white font-mono font-bold">
                      {comm.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-base text-white">{comm.name}</h2>
                      <span className="text-[11px] font-mono text-slate-400">{comm.type}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#00F5FF]" />
                    {comm.members_count}+ membros
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  {comm.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center gap-3 text-xs">
                {Object.entries(comm.links || {}).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 transition-colors capitalize text-xs font-medium"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#00F5FF]" />
                    {key}
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
