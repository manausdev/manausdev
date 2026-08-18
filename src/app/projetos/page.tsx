'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Code2, ExternalLink } from 'lucide-react';
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
        // mock fallback
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00314a]/10 text-[#00314a] border border-[#00314a]/20 text-xs font-semibold mb-3">
          <Code2 className="w-3.5 h-3.5" />
          <span>Inovação & Bioeconomia</span>
        </div>
        <h1 className="font-display font-bold text-3xl sm:text-5xl text-[#003527] tracking-tight">
          Projetos Feitos no <span className="text-[#006c49]">Amazonas</span>
        </h1>
        <p className="text-[#404944] text-sm sm:text-base mt-2 max-w-2xl">
          Aplicações web, bibliotecas open-source, inteligência de dados e plataformas construídas para impulsionar a região.
        </p>
      </div>

      {/* Filters */}
      <div className="manaus-card p-5 sm:p-6 mb-8 space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707974]" />
          <input
            type="text"
            placeholder="Buscar projetos por título ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="manaus-input w-full pl-10"
          />
        </div>

        {allTechs.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            <span className="text-xs text-[#707974] font-medium flex-shrink-0">Stack:</span>
            <button
              onClick={() => setSelectedTech(null)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                selectedTech === null
                  ? 'bg-[#003527] text-white font-semibold'
                  : 'bg-[#f2f4f6] text-[#404944] hover:bg-[#e6e8ea]'
              }`}
            >
              Todas
            </button>
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech === selectedTech ? null : tech)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors flex-shrink-0 ${
                  selectedTech === tech
                    ? 'bg-[#003527] text-white font-semibold'
                    : 'bg-[#f2f4f6] text-[#404944] hover:bg-[#e6e8ea]'
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
            <div key={i} className="manaus-card p-6 h-56 animate-pulse bg-[#f2f4f6]" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 manaus-card">
          <p className="text-[#707974] text-sm">Nenhum projeto encontrado com esses critérios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div key={proj.id} className="manaus-card p-6 flex flex-col justify-between border-t-4 border-t-[#00314a]">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="font-display font-bold text-lg text-[#003527]">{proj.title}</h2>
                  <span className="chip-leaf text-[10px] font-mono flex-shrink-0">
                    Feito em Manaus 🌿
                  </span>
                </div>

                <p className="text-xs text-[#404944] line-clamp-3 mb-5 leading-relaxed">
                  {proj.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {(proj.stack || []).map((tech, i) => (
                    <span key={i} className="chip-river text-[11px] font-mono">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#e0e3e5] flex items-center justify-between text-xs">
                {proj.links?.github ? (
                  <a
                    href={proj.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-[#404944] hover:text-[#003527] font-medium"
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
                    className="flex items-center gap-1.5 text-[#00314a] hover:underline font-semibold"
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
