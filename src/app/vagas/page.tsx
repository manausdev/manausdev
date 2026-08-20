'use client';

import { useState, useEffect, useMemo } from 'react';
import { Briefcase, MapPin, Search, DollarSign, ExternalLink, Building } from 'lucide-react';
import { MOCK_JOBS } from '@/lib/data/mock-data';
import { createClient } from '@/lib/supabase/client';
import type { Job } from '@/types/database';

export default function VagasPage() {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [onlyRemote, setOnlyRemote] = useState(false);
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00314a]/10 text-[#00314a] border border-[#00314a]/20 text-xs font-semibold mb-3">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Mural de Carreiras</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#003527] tracking-tight">
          Vagas de Tecnologia em <span className="text-[#006c49]">Manaus</span>
        </h1>
        <p className="text-[#404944] text-sm sm:text-base mt-2 max-w-2xl">
          Encontre posições presenciais no Polo Industrial e oportunidades remotas com contratação para talentos da região.
        </p>
      </div>

      {/* Filters */}
      <div className="manaus-card p-5 sm:p-6 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-[#707974] pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Buscar por cargo, especialidade ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="manaus-input w-full !pl-10"
            />
          </div>

          <button
            onClick={() => setOnlyRemote(!onlyRemote)}
            className={`px-4 py-2.5 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
              onlyRemote
                ? 'bg-[#006c49]/10 text-[#006c49] border-[#006c49]'
                : 'bg-white text-[#404944] border-[#e0e3e5] hover:bg-[#f2f4f6]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyRemote ? 'bg-[#006c49]' : 'bg-[#707974]'}`} />
            Apenas Remoto
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-[#707974] font-medium flex-shrink-0">Contrato:</span>
          {['Todos', 'CLT', 'PJ', 'Estágio'].map((type) => {
            const isSelected = type === 'Todos' ? selectedType === null : selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type === 'Todos' ? null : type)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-[#003527] text-white font-semibold'
                    : 'bg-[#f2f4f6] text-[#404944] hover:bg-[#e6e8ea]'
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
            <div key={i} className="manaus-card p-6 h-32 animate-pulse bg-[#f2f4f6]" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 manaus-card">
          <p className="text-[#707974] text-sm">Nenhuma vaga encontrada para os filtros selecionados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="manaus-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:border-l-4 hover:border-l-[#006c49]">
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

                <h2 className="font-display font-bold text-lg text-[#003527]">{job.title}</h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#707974]">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Building className="w-3.5 h-3.5 text-[#006c49]" />
                    {job.company_name || 'Empresa Parceira'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#00314a]" />
                    {job.location || 'Manaus-AM'}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1.5 font-semibold text-[#006c49]">
                      <DollarSign className="w-3.5 h-3.5" />
                      {job.salary}
                    </span>
                  )}
                </div>

                {job.description && (
                  <p className="text-xs text-[#404944] max-w-2xl leading-relaxed pt-1">
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

              {job.link && (
                <div className="flex-shrink-0">
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary text-xs !py-2.5 !px-5"
                  >
                    <span>Candidatar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
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
