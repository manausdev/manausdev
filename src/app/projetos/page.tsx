'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Code2, ExternalLink, Sparkles } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { MOCK_PROJECTS } from '@/lib/data/mock-data';
import { createClient } from '@/lib/supabase/client';
import type { Project } from '@/types/database';

export default function ProjetosPage() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('projects').select('*');
        if (data && data.length > 0 && !error) {
          setProjects(data);
        }
      } catch {
        // use fallback mock
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const allTechs = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.stack?.forEach((s) => set.add(s)));
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTech = selectedTech ? p.stack?.includes(selectedTech) : true;
      return matchSearch && matchTech;
    });
  }, [projects, searchTerm, selectedTech]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/25 text-xs font-mono mb-3">
          <Code2 className="w-3.5 h-3.5" />
          <span>Ecossistema Open-Source & Startups</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
          Projetos Feitos no <span className="gradient-text-amazon">Amazonas</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl">
          Aplicativos, ferramentas open-source, iniciativas de bioeconomia e sistemas construídos por desenvolvedores locais.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-4 sm:p-6 mb-8 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar projetos por nome, descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#070A12]/80 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]"
          />
        </div>

        {allTechs.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            <span className="text-xs text-slate-400 font-mono flex-shrink-0">Filtro:</span>
            <button
              onClick={() => setSelectedTech(null)}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors flex-shrink-0 ${
                selectedTech === null
                  ? 'bg-[#10B981] text-slate-950 font-semibold'
                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              Todos
            </button>
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors flex-shrink-0 ${
                  selectedTech === tech
                    ? 'bg-[#10B981] text-slate-950 font-semibold'
                    : 'bg-white/5 text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                {tech}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-6 h-56 animate-pulse bg-white/5" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 glass-card">
          <p className="text-slate-400 text-sm">Nenhum projeto encontrado com esses critérios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div key={proj.id} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="font-display font-bold text-lg text-white">{proj.title}</h2>
                  <div className="px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono flex-shrink-0">
                    Feito em Manaus 🌿
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(proj.stack || []).map((tech, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#00F5FF]/10 text-[#00F5FF] border border-[#00F5FF]/20">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                {proj.links?.github ? (
                  <a
                    href={proj.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>Repositório</span>
                  </a>
                ) : <span />}

                {proj.links?.demo && (
                  <a
                    href={proj.links.demo}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[#00F5FF] hover:underline font-medium"
                  >
                    <span>Demo Online</span>
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
