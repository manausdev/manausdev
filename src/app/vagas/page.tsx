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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/25 text-xs font-mono mb-3">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Mural de Carreiras</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Vagas de Tech em <span className="gradient-text-cyber">Manaus</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
          Encontre posições presenciais no Polo Industrial e oportunidades remotas para talentos do Norte.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 sm:p-6 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por cargo ou empresa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#070A12]/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#00F5FF] focus:ring-1 focus:ring-[#00F5FF]"
            />
          </div>

          <button
            onClick={() => setOnlyRemote(!onlyRemote)}
            className={`px-4 py-2.5 rounded-xl text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
              onlyRemote
                ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]/50 shadow-sm'
                : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyRemote ? 'bg-[#10B981]' : 'bg-slate-500'}`} />
            Apenas Remoto
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-slate-400 font-mono flex-shrink-0">Contrato:</span>
          {['Todos', 'CLT', 'PJ', 'Estágio'].map((type) => {
            const isSelected = type === 'Todos' ? selectedType === null : selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type === 'Todos' ? null : type)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  isSelected
                    ? 'bg-[#00F5FF] text-[#00282B] font-semibold'
                    : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
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
            <div key={i} className="glass-card p-6 h-32 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <p className="text-slate-400 text-sm">Nenhuma vaga encontrada para os filtros selecionados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="glass-card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/30">
                    {job.type}
                  </span>
                  {job.remote && (
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      100% Remoto
                    </span>
                  )}
                </div>

                <h2 className="font-display font-bold text-lg text-white">{job.title}</h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-500" />
                    {job.company_name || 'Empresa Parceira'}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {job.location || 'Manaus-AM'}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1 text-amber-400">
                      <DollarSign className="w-3.5 h-3.5" />
                      {job.salary}
                    </span>
                  )}
                </div>

                {job.description && (
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed pt-1">
                    {job.description}
                  </p>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.skills.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-slate-300 border border-white/10">
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
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#00F5FF] text-[#00282B] hover:bg-[#5df7ff] shadow-glow-primary transition-all duration-200"
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
