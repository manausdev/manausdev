'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Briefcase, MapPin, Search, DollarSign, ExternalLink, Building, ArrowRight } from 'lucide-react';
import { MOCK_JOBS } from '@/lib/data/mock-data';
import { createClient } from '@/lib/supabase/client';
import type { Job } from '@/types/database';

function VagasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get('q') || '';
  const initialType = searchParams.get('type');
  const initialRemote = searchParams.get('remote') === 'true';

  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState<string | null>(initialType);
  const [onlyRemote, setOnlyRemote] = useState(initialRemote);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJobs() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('jobs').select('*');
        if (data && data.length > 0 && !error) {
          setJobs(data);
        }
      } catch {
        // mock fallback
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, []);

  const updateFilters = (newSearch: string, newType: string | null, newRemote: boolean) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('q', newSearch);
    if (newType) params.set('type', newType);
    if (newRemote) params.set('remote', 'true');

    const queryString = params.toString();
    router.replace(`/vagas${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    updateFilters(val, selectedType, onlyRemote);
  };

  const handleTypeChange = (type: string | null) => {
    const nextType = type === selectedType ? null : type;
    setSelectedType(nextType);
    updateFilters(searchTerm, nextType, onlyRemote);
  };

  const handleRemoteToggle = () => {
    const nextRemote = !onlyRemote;
    setOnlyRemote(nextRemote);
    updateFilters(searchTerm, selectedType, nextRemote);
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.company_name && job.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.description && job.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchType = selectedType ? job.type === selectedType : true;
      const matchRemote = onlyRemote ? job.remote : true;
      return matchSearch && matchType && matchRemote;
    });
  }, [jobs, searchTerm, selectedType, onlyRemote]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-deep/10 text-accent-text border border-deep/20 text-xs font-semibold mb-3">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Mural de Carreiras</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-ink tracking-tight">
          Vagas de Tecnologia em <span className="text-accent-text">Manaus</span>
        </h1>
        <p className="text-muted text-sm sm:text-base mt-2 max-w-2xl">
          Encontre posições presenciais no Polo Industrial e oportunidades remotas com contratação para talentos da região.
        </p>
      </div>

      {/* Filters */}
      <div className="manaus-card p-5 sm:p-6 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-faint pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Buscar por cargo, especialidade ou empresa..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="manaus-input w-full !pl-10"
            />
          </div>

          <button
            onClick={handleRemoteToggle}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
              onlyRemote
                ? 'bg-accent/10 text-accent-text border-accent'
                : 'bg-surface text-muted border-border hover:bg-surface-1'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyRemote ? 'bg-accent' : 'bg-faint'}`} />
            Apenas Remoto
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-faint font-medium flex-shrink-0">Contrato:</span>
          {['Todos', 'CLT', 'PJ', 'Estágio'].map((type) => {
            const isSelected = type === 'Todos' ? selectedType === null : selectedType === type;
            return (
              <button
                key={type}
                onClick={() => handleTypeChange(type === 'Todos' ? null : type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-deep text-white font-semibold'
                    : 'bg-surface-1 text-muted hover:bg-surface-2'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="manaus-card p-6 h-32 animate-pulse bg-surface-1" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 manaus-card">
          <p className="text-faint text-sm">Nenhuma vaga encontrada para os filtros selecionados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="manaus-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-l-4 hover:border-l-accent transition-all">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="chip-leaf text-xs font-mono font-semibold">
                    {job.type}
                  </span>
                  {job.remote && (
                    <span className="chip-river text-xs font-mono font-semibold">
                      100% Remoto
                    </span>
                  )}
                </div>

                <Link href={`/vagas/${job.id}`}>
                  <h2 className="font-display font-bold text-lg text-ink hover:text-accent-text transition-colors">
                    {job.title}
                  </h2>
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-xs text-faint">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-accent-text" />
                    {job.company_name || 'Empresa Parceira'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-accent-text" />
                    {job.location || 'Manaus-AM'}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1.5 font-semibold text-accent-text">
                      <DollarSign className="w-3.5 h-3.5" />
                      {job.salary}
                    </span>
                  )}
                </div>

                {job.description && (
                  <p className="text-xs text-muted max-w-2xl leading-relaxed pt-1 line-clamp-2">
                    {job.description}
                  </p>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.skills.map((s, i) => (
                      <span key={i} className="chip-river text-[10px] font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex sm:flex-col items-center sm:items-end gap-2 flex-shrink-0">
                <Link
                  href={`/vagas/${job.id}`}
                  className="btn-leaf text-xs !py-2 !px-4 flex items-center gap-1"
                >
                  <span>Ver Detalhes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs !py-2 !px-4 flex items-center gap-1"
                  >
                    <span>Candidatar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
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

export default function VagasPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-10 bg-surface-2 w-64 rounded-lg animate-pulse mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="manaus-card p-6 h-32 animate-pulse bg-surface-1" />
          ))}
        </div>
      </div>
    }>
      <VagasContent />
    </Suspense>
  );
}
