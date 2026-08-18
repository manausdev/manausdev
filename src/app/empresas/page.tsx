'use client';

import { useState, useEffect } from 'react';
import { Building2, Globe, MapPin, Users } from 'lucide-react';
import { MOCK_COMPANIES } from '@/lib/data/mock-data';
import { createClient } from '@/lib/supabase/client';
import type { Company } from '@/types/database';

export default function EmpresasPage() {
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('companies').select('*');
        if (data && data.length > 0 && !error) {
          setCompanies(data);
        }
      } catch {
        // mock fallback
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/25 text-xs font-mono mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>Polo Tecnológico & Inovação</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Empresas & Institutos em <span className="gradient-text-cyber">Manaus</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
          Conheça as empresas de software, P&D e startups que impulsionam a economia digital no Amazonas.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 h-48 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((comp) => (
            <div key={comp.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="font-display font-bold text-lg text-white">{comp.name}</h2>
                    <span className="text-xs text-[#00F5FF] font-medium">{comp.industry}</span>
                  </div>
                  {comp.size && (
                    <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                      <Users className="w-3 h-3 text-slate-400" />
                      {comp.size}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-6">
                  {comp.description || 'Empresa atuante no ecossistema de tecnologia de Manaus.'}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {comp.location || 'Manaus-AM'}
                </span>
                {comp.website && (
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#00F5FF] hover:underline font-medium"
                  >
                    <span>Website</span>
                    <Globe className="w-3.5 h-3.5" />
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
