'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, Globe, MapPin, Users, Search, ArrowRight } from 'lucide-react';
import { MOCK_COMPANIES } from '@/lib/data/mock-data';
import { createClient } from '@/lib/supabase/client';
import type { Company } from '@/types/database';

function EmpresasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get('q') || '';
  const initialSize = searchParams.get('size');

  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedSize, setSelectedSize] = useState<string | null>(initialSize);
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

  const updateFilters = (newSearch: string, newSize: string | null) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('q', newSearch);
    if (newSize) params.set('size', newSize);

    const queryString = params.toString();
    router.replace(`/empresas${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    updateFilters(val, selectedSize);
  };

  const handleSizeChange = (size: string | null) => {
    const nextSize = size === selectedSize ? null : size;
    setSelectedSize(nextSize);
    updateFilters(searchTerm, nextSize);
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((comp) => {
      const matchSearch =
        comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (comp.industry && comp.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (comp.description && comp.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchSize = selectedSize ? comp.size === selectedSize : true;
      return matchSearch && matchSize;
    });
  }, [companies, searchTerm, selectedSize]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-deep/10 text-accent-text border border-deep/20 text-xs font-semibold mb-3">
          <Building2 className="w-3.5 h-3.5" />
          <span>Polo Tecnológico & Institutos</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink tracking-tight">
          Empresas & Institutos em <span className="text-accent-text">Manaus</span>
        </h1>
        <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl">
          Conheça empresas de software, institutos de P&D e startups que impulsionam a economia digital no Amazonas.
        </p>
      </div>

      {/* Filters */}
      <div className="manaus-card p-5 sm:p-6 mb-8 space-y-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-faint pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Buscar por nome, setor ou descrição..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="manaus-input w-full !pl-10"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-faint font-medium flex-shrink-0">Porte:</span>
          {['Todos', '10-50', '50-200', '500+'].map((size) => {
            const isSelected = size === 'Todos' ? selectedSize === null : selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => handleSizeChange(size === 'Todos' ? null : size)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-deep text-white font-semibold'
                    : 'bg-surface-1 text-muted hover:bg-surface-2'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="manaus-card h-80 animate-pulse bg-surface-1 rounded-xl" />
          ))}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="text-center py-16 manaus-card">
          <p className="text-faint text-sm">Nenhuma organização encontrada com esses critérios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((comp) => (
            <div key={comp.id} className="manaus-card overflow-hidden flex flex-col justify-between border border-border group hover:border-accent/40 transition-all duration-300">
              <div>
                {/* Company Preview Image Header */}
                <Link href={`/empresas/${comp.id}`} className="block relative h-36 w-full bg-deep overflow-hidden border-b border-border">
                  {comp.image_url ? (
                    <img
                      src={comp.image_url}
                      alt={comp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-brand p-4 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bio-texture opacity-20" />
                      <Building2 className="w-10 h-10 text-neon/60 mb-2 relative z-10" />
                      <span className="font-display font-bold text-sm text-on-dark/90 relative z-10">
                        {comp.name}
                      </span>
                    </div>
                  )}
                  {comp.size && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-deep/90 backdrop-blur-md text-neon text-[10px] font-mono px-2.5 py-1 rounded-full border border-neon/30 font-semibold shadow-sm flex items-center gap-1">
                        <Users className="w-3 h-3 text-neon" />
                        {comp.size}
                      </span>
                    </div>
                  )}
                </Link>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Company Icon / Logo */}
                    {comp.logo_url ? (
                      <img
                        src={comp.logo_url}
                        alt={`Logo ${comp.name}`}
                        className="w-11 h-11 rounded-lg object-cover border border-border shadow-sm flex-shrink-0 bg-surface"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-deep text-white flex items-center justify-center font-display font-bold text-base shadow-sm flex-shrink-0">
                        {comp.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <Link href={`/empresas/${comp.id}`}>
                        <h2 className="font-display font-bold text-base text-ink group-hover:text-accent-text transition-colors leading-tight">
                          {comp.name}
                        </h2>
                      </Link>
                      <span className="text-xs text-accent-text font-semibold block mt-0.5">
                        {comp.industry || 'Tecnologia'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-muted leading-relaxed mb-4 line-clamp-3">
                    {comp.description || 'Empresa atuante no ecossistema de tecnologia e inovação de Manaus.'}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-border/70 flex items-center justify-between text-xs text-faint mt-auto">
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-accent-text" />
                  {comp.location || 'Manaus-AM'}
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/empresas/${comp.id}`}
                    className="text-xs font-semibold text-accent-text hover:underline flex items-center gap-1"
                  >
                    <span>Ver Perfil</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EmpresasPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-10 bg-surface-2 w-64 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="manaus-card h-80 animate-pulse bg-surface-1 rounded-xl" />
          ))}
        </div>
      </div>
    }>
      <EmpresasContent />
    </Suspense>
  );
}
