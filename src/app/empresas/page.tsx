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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00314a]/10 text-[#00314a] border border-[#00314a]/20 text-xs font-semibold mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>Polo Tecnológico & Institutos</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#003527] tracking-tight">
          Empresas & Institutos em <span className="text-[#006c49]">Manaus</span>
        </h1>
        <p className="text-[#404944] text-sm sm:text-base mt-2 max-w-2xl">
          Conheça empresas de software, institutos de P&D e startups que impulsionam a economia digital no Amazonas.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="manaus-card p-6 h-48 animate-pulse bg-[#f2f4f6]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((comp) => (
            <div key={comp.id} className="manaus-card p-6 flex flex-col justify-between border-t-4 border-t-[#00314a]">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="font-display font-bold text-lg text-[#003527]">{comp.name}</h2>
                    <span className="text-xs text-[#006c49] font-semibold">{comp.industry}</span>
                  </div>
                  {comp.size && (
                    <span className="chip-river text-[10px] font-mono">
                      <Users className="w-3 h-3 text-[#00314a]" />
                      {comp.size}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#404944] leading-relaxed mb-6">
                  {comp.description || 'Empresa atuante no ecossistema de tecnologia e inovação de Manaus.'}
                </p>
              </div>

              <div className="pt-4 border-t border-[#e0e3e5] flex items-center justify-between text-xs text-[#707974]">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#006c49]" />
                  {comp.location || 'Manaus-AM'}
                </span>
                {comp.website && (
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#00314a] hover:underline font-semibold"
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
