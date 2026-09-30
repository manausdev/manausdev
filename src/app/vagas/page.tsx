'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BriefcaseIcon, MapPinIcon, SearchIcon, DollarSignIcon, ExternalLinkIcon, BuildingIcon, ArrowRightIcon } from '@/components/icons';
import { MOCK_JOBS } from '@/lib/data/mock';
import { createClient } from '@/lib/supabase/client';
import { useMockData } from '@/lib/env';
import type { Job } from '@/types/database';
import styles from './vagas.module.css';

function VagasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const useMock = useMockData();

  const initialSearch = searchParams.get('q') || '';
  const initialType = searchParams.get('type');
  const initialRemote = searchParams.get('remote') === 'true';

  const [jobs, setJobs] = useState<Job[]>(() => (useMock ? MOCK_JOBS : []));
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedType, setSelectedType] = useState<string | null>(initialType);
  const [onlyRemote, setOnlyRemote] = useState(initialRemote);
  const [loading, setLoading] = useState(!useMock);

  useEffect(() => {
    if (useMock) {
      setJobs(MOCK_JOBS);
      setLoading(false);
      return;
    }

    async function loadJobs() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.from('jobs').select('*');
        if (error) throw error;
        setJobs(data ?? []);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    loadJobs();
  }, [useMock]);

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
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <BriefcaseIcon className="w-3.5 h-3.5" />
          <span>Mural de Carreiras</span>
        </div>
        <h1 className={styles.heroTitle}>
          Vagas de Tecnologia em <span className="text-accent-text">Manaus</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Encontre posições presenciais no Polo Industrial e oportunidades remotas com contratação para talentos da região.
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.filterRow}>
          <div className={styles.searchWrap}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por cargo, especialidade ou empresa..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`manaus-input ${styles.searchInput}`}
            />
          </div>

          <button
            onClick={handleRemoteToggle}
            className={`${styles.remoteToggle} ${onlyRemote ? styles.remoteToggleActive : styles.remoteToggleInactive}`}
          >
            <span className={`${styles.remoteDot} ${onlyRemote ? styles.remoteDotActive : styles.remoteDotInactive}`} />
            Apenas Remoto
          </button>
        </div>

        <div className={styles.typeFilters}>
          <span className={styles.typeFilterLabel}>Contrato:</span>
          {['Todos', 'CLT', 'PJ', 'Estágio'].map((type) => {
            const isSelected = type === 'Todos' ? selectedType === null : selectedType === type;
            return (
              <button
                key={type}
                onClick={() => handleTypeChange(type === 'Todos' ? null : type)}
                className={`${styles.typeFilterBtn} ${isSelected ? styles.typeFilterBtnActive : styles.typeFilterBtnInactive}`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.loadingItem} />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Nenhuma vaga encontrada para os filtros selecionados.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filteredJobs.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobMain}>
                <div className={styles.jobBadges}>
                  <span className={styles.jobTypeBadge}>{job.type}</span>
                  {job.remote && <span className={styles.remoteBadge}>100% Remoto</span>}
                </div>

                <Link href={`/vagas/${job.id}`}>
                  <h2 className={styles.jobTitle}>{job.title}</h2>
                </Link>

                <div className={styles.jobMeta}>
                  <span className={styles.metaItem}>
                    <BuildingIcon className={styles.metaIcon} />
                    <strong>{job.company_name || 'Empresa não informada'}</strong>
                  </span>
                  <span className={styles.metaItem}>
                    <MapPinIcon className={styles.metaIcon} />
                    {job.location || 'Local não informado'}
                  </span>
                  {job.salary && (
                    <span className={styles.salaryBadge}>
                      <DollarSignIcon className={styles.metaIcon} />
                      {job.salary}
                    </span>
                  )}
                </div>

                {job.description && (
                  <p className={styles.jobDescription}>{job.description}</p>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div className={styles.jobSkills}>
                    {job.skills.map((s, i) => (
                      <span key={i} className={styles.skillTag}>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.jobActions}>
                <Link href={`/vagas/${job.id}`} className={styles.btnLeaf}>
                  <span>Ver Detalhes</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.btnPrimary}
                  >
                    <span>Candidatar</span>
                    <ExternalLinkIcon className="w-3.5 h-3.5" />
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
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.loading}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.loadingItem} />
            ))}
          </div>
        </div>
      }
    >
      <VagasContent />
    </Suspense>
  );
}
