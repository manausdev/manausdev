'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchIcon, Code2Icon, ExternalLinkIcon, ArrowRightIcon } from '@/components/icons';
import { GithubIcon } from '@/components/icons';
import { MOCK_PROJECTS } from '@/lib/data/mock';
import { createClient } from '@/lib/supabase/client';
import { useMockData } from '@/lib/env';
import type { Project } from '@/types/database';
import styles from './projetos.module.css';

function ProjetosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const useMock = useMockData();

  const initialSearch = searchParams.get('q') || '';
  const initialStack = searchParams.get('stack');

  const [projects, setProjects] = useState<Project[]>(() => (useMock ? MOCK_PROJECTS : []));
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedTech, setSelectedTech] = useState<string | null>(initialStack);
  const [loading, setLoading] = useState(!useMock);

  useEffect(() => {
    if (useMock) {
      setProjects(MOCK_PROJECTS);
      setLoading(false);
      return;
    }

    async function loadProjects() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('projects').select('*');
        if (error) throw error;
        setProjects(data ?? []);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [useMock]);

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
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <Code2Icon className="w-3.5 h-3.5" />
          <span>Inovação & Bioeconomia</span>
        </div>
        <h1 className={styles.heroTitle}>
          Projetos Feitos no <span className="text-accent-text">Amazonas</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Aplicações web, bibliotecas open-source, inteligência de dados e plataformas construídas para impulsionar a região.
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar projetos por título ou descrição..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={`manaus-input ${styles.searchInput}`}
          />
        </div>

        {allTechs.length > 0 && (
          <div className={styles.techPills}>
            <span className={styles.techPillLabel}>Stack:</span>
            <button
              onClick={() => handleTechChange(null)}
              className={`${styles.techPill} ${selectedTech === null ? styles.techPillActive : ''}`}
            >
              Todas
            </button>
            {allTechs.map((tech) => (
              <button
                key={tech}
                onClick={() => handleTechChange(tech)}
                className={`${styles.techPill} ${selectedTech === tech ? styles.techPillActive : ''}`}
              >
                {tech}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className={styles.loadingGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.loadingCard} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Nenhum projeto encontrado com esses critérios.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredProjects.map((proj) => (
            <div key={proj.id} className={styles.card}>
              <Link href={`/projetos/${proj.id}`} className={styles.cardImage}>
                {proj.image_url ? (
                  <img src={proj.image_url} alt={proj.title} />
                ) : (
                  <div className={styles.cardImagePlaceholder}>
                    <Code2Icon className="w-10 h-10" />
                    <span>{proj.title}</span>
                  </div>
                )}
                <div className={styles.cardTypeBadge}>🌿 Manaus Tech</div>
              </Link>

              <div className={styles.cardContent}>
                <div>
                  <div className={styles.cardHeader}>
                    <Link href={`/projetos/${proj.id}`}>
                      <h2 className={styles.cardTitle}>{proj.title}</h2>
                    </Link>
                  </div>

                  <p className={styles.cardDescription}>{proj.description}</p>

                  <div className={styles.techTags}>
                    {(proj.stack || []).map((tech, i) => (
                      <button
                        key={i}
                        onClick={() => handleTechChange(tech)}
                        className={styles.techTag}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Link href={`/projetos/${proj.id}`} className={styles.cardFooterLink}>
                    <span>Detalhes</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>

                  <div className={styles.cardFooterIcons}>
                    {proj.links?.github && (
                      <a
                        href={proj.links.github}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.cardFooterIcon}
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
                        className={styles.cardFooterIcon}
                        title="Demo"
                      >
                        <ExternalLinkIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
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
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.loadingGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.loadingCard} />
            ))}
          </div>
        </div>
      }
    >
      <ProjetosContent />
    </Suspense>
  );
}
