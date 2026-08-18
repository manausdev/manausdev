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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006c49]/10 text-[#006c49] border border-[#006c49]/20 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Rede Colaborativa</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#003527] tracking-tight">
          Comunidades em <span className="text-[#006c49]">Manaus</span>
        </h1>
        <p className="text-[#404944] text-sm sm:text-base mt-2 max-w-2xl">
          Grupos de estudos, meetups periódicos, comunidades técnicas e espaços de troca aberta de conhecimento.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="manaus-card p-6 h-48 animate-pulse bg-[#f2f4f6]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((comm) => (
            <div key={comm.id} className="manaus-card p-6 flex flex-col justify-between border-t-4 border-t-[#006c49]">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#003527] text-white flex items-center justify-center font-display font-bold text-sm shadow-sm">
                      {comm.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="font-display font-bold text-base text-[#003527]">{comm.name}</h2>
                      <span className="text-[11px] font-mono text-[#707974]">{comm.type}</span>
                    </div>
                  </div>
                  <span className="chip-leaf text-[10px] font-mono">
                    <Users className="w-3 h-3 text-[#006c49]" />
                    {comm.members_count}+ membros
                  </span>
                </div>

                <p className="text-xs text-[#404944] leading-relaxed mb-6">
                  {comm.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#e0e3e5] flex items-center gap-3 text-xs">
                {Object.entries(comm.links || {}).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f4f6] hover:bg-[#e6e8ea] text-[#003527] border border-[#e0e3e5] transition-colors capitalize text-xs font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#006c49]" />
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
