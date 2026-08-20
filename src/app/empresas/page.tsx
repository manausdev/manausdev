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
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="manaus-card h-80 animate-pulse bg-[#f2f4f6] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((comp) => (
            <div key={comp.id} className="manaus-card overflow-hidden flex flex-col justify-between border border-[#e0e3e5] group hover:border-[#006c49]/40 transition-all duration-300">
              <div>
                {/* Company Preview Image Header */}
                <div className="relative h-36 w-full bg-[#00281e] overflow-hidden border-b border-[#e0e3e5]">
                  {comp.image_url ? (
                    <img
                      src={comp.image_url}
                      alt={comp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#00314a] to-[#002219] p-4 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bio-texture opacity-20" />
                      <Building2 className="w-10 h-10 text-[#6cf8bb]/60 mb-2 relative z-10" />
                      <span className="font-display font-bold text-sm text-[#eff1f3]/90 relative z-10">
                        {comp.name}
                      </span>
                    </div>
                  )}
                  {comp.size && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-[#003527]/90 backdrop-blur-md text-[#6cf8bb] text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#6cf8bb]/30 font-semibold shadow-sm flex items-center gap-1">
                        <Users className="w-3 h-3 text-[#6cf8bb]" />
                        {comp.size}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Company Icon / Logo */}
                    {comp.logo_url ? (
                      <img
                        src={comp.logo_url}
                        alt={`Logo ${comp.name}`}
                        className="w-11 h-11 rounded-lg object-cover border border-[#e0e3e5] shadow-sm flex-shrink-0 bg-white"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-[#003527] text-white flex items-center justify-center font-display font-bold text-base shadow-sm flex-shrink-0">
                        {comp.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h2 className="font-display font-bold text-base text-[#003527] group-hover:text-[#006c49] transition-colors leading-tight">
                        {comp.name}
                      </h2>
                      <span className="text-xs text-[#006c49] font-semibold block mt-0.5">
                        {comp.industry || 'Tecnologia'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#404944] leading-relaxed mb-4 line-clamp-3">
                    {comp.description || 'Empresa atuante no ecossistema de tecnologia e inovação de Manaus.'}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-[#e0e3e5]/70 flex items-center justify-between text-xs text-[#707974] mt-auto">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-[#006c49]" />
                  {comp.location || 'Manaus-AM'}
                </span>
                {comp.website && (
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f4f6] hover:bg-[#006c49]/10 text-[#003527] hover:text-[#006c49] border border-[#e0e3e5] hover:border-[#006c49]/30 transition-colors font-semibold text-xs"
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
