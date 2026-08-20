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
            <div key={i} className="manaus-card h-80 animate-pulse bg-[#f2f4f6] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((comm) => (
            <div key={comm.id} className="manaus-card overflow-hidden flex flex-col justify-between border border-[#e0e3e5] group hover:border-[#006c49]/40 transition-all duration-300">
              <div>
                {/* Visual Preview Header */}
                <div className="relative h-40 w-full bg-[#00281e] overflow-hidden border-b border-[#e0e3e5]">
                  {comm.image_url ? (
                    <img
                      src={comm.image_url}
                      alt={comm.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#003527] to-[#002219] p-4 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bio-texture opacity-20" />
                      <Sparkles className="w-10 h-10 text-[#6cf8bb]/60 mb-2 relative z-10" />
                      <span className="font-display font-bold text-sm text-[#eff1f3]/90 relative z-10">
                        {comm.name}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-[#003527]/85 backdrop-blur-md text-[#6cf8bb] text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#6cf8bb]/30 font-semibold shadow-sm flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#6cf8bb]" />
                      {comm.members_count}+ membros
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#003527] text-white flex items-center justify-center font-display font-bold text-sm shadow-sm flex-shrink-0">
                        {comm.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="font-display font-bold text-base text-[#003527] group-hover:text-[#006c49] transition-colors">{comm.name}</h2>
                        <span className="text-[11px] font-mono text-[#006c49] font-medium">{comm.type}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-[#404944] leading-relaxed mb-4 line-clamp-3">
                    {comm.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-[#e0e3e5]/70 flex flex-wrap items-center gap-2 text-xs mt-auto">
                {Object.entries(comm.links || {}).map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f4f6] hover:bg-[#006c49]/10 text-[#003527] hover:text-[#006c49] border border-[#e0e3e5] hover:border-[#006c49]/30 transition-colors capitalize text-xs font-semibold"
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
