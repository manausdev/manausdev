'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Code2, ExternalLink, ArrowRight } from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { MOCK_PROJECTS } from '@/lib/data/mock-data';
import { createClient } from '@/lib/supabase/client';
import type { Project } from '@/types/database';

function ProjetosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get('q') || '';
  const initialStack = searchParams.get('stack');

  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedTech, setSelectedTech] = useState<string | null>(initialStack);
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

  const updateFilters = (newSearch: string, newStack: string | null) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('q', newSearch);
    if (newStack) params.set('stack', newStack);

    const queryString = params.toString();
    router.replace(`/projetos${queryString ? `?${queryString}` : ''}`, { scroll: false });
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    updateFilters(val, selectedTech);
  };

  const handleTechChange = (tech: string | null) => {
    const nextTech = tech === selectedTech ? null : tech;
    setSelectedTech(nextTech);
    updateFilters(searchTerm, nextTech);
  };

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
        <div className="relative flex items-center">
          <Search className="w-4 h-4 absolute left-3.5 text-[#707974] pointer-events-none z-10" />
          <input
            type="text"
            placeholder="Buscar projetos por título ou descrição..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="manaus-input w-full !pl-10"
          />
        </div>

        {allTechs.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            <span className="text-xs text-[#707974] font-medium flex-shrink-0">Stack:</span>
            <button
              onClick={() => handleTechChange(null)}
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
                onClick={() => handleTechChange(tech)}
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
            <div key={i} className="manaus-card h-80 animate-pulse bg-[#f2f4f6] rounded-xl" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-16 manaus-card">
          <p className="text-[#707974] text-sm">Nenhum projeto encontrado com esses critérios.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div key={proj.id} className="manaus-card overflow-hidden flex flex-col justify-between border border-[#e0e3e5] group hover:border-[#006c49]/40 transition-all duration-300">
              <div>
                {/* Project Visual Preview */}
                <Link href={`/projetos/${proj.id}`} className="block relative h-44 w-full bg-[#00281e] overflow-hidden border-b border-[#e0e3e5]">
                  {proj.image_url ? (
                    <img
                      src={proj.image_url}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#003527] to-[#002219] p-4 text-center relative overflow-hidden">
                      <div className="absolute inset-0 bio-texture opacity-20" />
                      <Code2 className="w-10 h-10 text-[#6cf8bb]/60 mb-2 relative z-10" />
                      <span className="font-display font-bold text-sm text-[#eff1f3]/90 relative z-10">
                        {proj.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="bg-[#003527]/85 backdrop-blur-md text-[#6cf8bb] text-[10px] font-mono px-2.5 py-1 rounded-full border border-[#6cf8bb]/30 font-semibold shadow-sm">
                      🌿 Manaus Tech
                    </span>
                  </div>
                </Link>

                <div className="p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <Link href={`/projetos/${proj.id}`}>
                      <h2 className="font-display font-bold text-lg text-[#003527] group-hover:text-[#006c49] transition-colors">
                        {proj.title}
                      </h2>
                    </Link>
                  </div>

                  <p className="text-xs text-[#404944] line-clamp-3 mb-4 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(proj.stack || []).map((tech, i) => (
                      <button
                        key={i}
                        onClick={() => handleTechChange(tech)}
                        className="chip-river text-[11px] font-mono hover:bg-[#00314a]/20 transition-colors"
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-3 border-t border-[#e0e3e5]/70 flex items-center justify-between text-xs mt-auto">
                <Link
                  href={`/projetos/${proj.id}`}
                  className="text-xs font-semibold text-[#006c49] hover:underline flex items-center gap-1"
                >
                  <span>Detalhes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-3">
                  {proj.links?.github && (
                    <a
                      href={proj.links.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#404944] hover:text-[#003527] transition-colors"
                      title="Repositório"
                    >
                      <GithubIcon className="w-4 h-4" />
                    </a>
                  )}
                  {proj.links?.demo && (
                    <a
                      href={proj.links.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#006c49] hover:text-[#003527] transition-colors"
                      title="Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjetosPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-10 bg-[#e0e3e5] w-64 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="manaus-card h-80 animate-pulse bg-[#f2f4f6] rounded-xl" />
          ))}
        </div>
      </div>
    }>
      <ProjetosContent />
    </Suspense>
  );
}
