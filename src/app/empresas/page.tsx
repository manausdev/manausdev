'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2Icon, MapPinIcon, UsersIcon, SearchIcon, ArrowRightIcon } from '@/components/icons';
import { MOCK_COMPANIES } from '@/lib/data/mock';
import { createClient } from '@/lib/supabase/client';
import type { Company } from '@/types/database';
import styles from './empresas.module.css';

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
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.heroBadge}>
          <Building2Icon className="w-3.5 h-3.5" />
          <span>Polo Tecnológico & Institutos</span>
        </div>
        <h1 className={styles.heroTitle}>
          Empresas & Institutos em <span className="text-accent-text">Manaus</span>
        </h1>
        <p className={styles.heroSubtitle}>
          Conheça empresas de software, institutos de P&D e startups que impulsionam a economia digital no Amazonas.
        </p>
      </div>

      <div className={styles.filters}>
        <div className={styles.searchWrap}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar por nome, setor ou descrição..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={`manaus-input ${styles.searchInput}`}
          />
        </div>

        <div className={styles.sizeFilters}>
          <span className={styles.sizeFilterLabel}>Porte:</span>
          {['Todos', '10-50', '50-200', '500+'].map((size) => {
            const isSelected = size === 'Todos' ? selectedSize === null : selectedSize === size;
            return (
              <button
                key={size}
                onClick={() => handleSizeChange(size === 'Todos' ? null : size)}
                className={`${styles.sizeFilterBtn} ${isSelected ? styles.sizeFilterBtnActive : styles.sizeFilterBtnInactive}`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`${styles.skeleton} ${styles.skeletonItem}`} />
          ))}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>Nenhuma organização encontrada com esses critérios.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredCompanies.map((comp) => (
            <div key={comp.id} className={styles.card}>
              <Link href={`/empresas/${comp.id}`} className={styles.cardImage}>
                {comp.image_url ? (
                  <img src={comp.image_url} alt={comp.name} />
                ) : (
                  <div className={styles.cardImagePlaceholder}>
                    <Building2Icon className="w-10 h-10" />
                    <span>{comp.name}</span>
                  </div>
                )}
                {comp.size && (
                  <div className={styles.cardSizeBadge}>
                    <UsersIcon className="w-3 h-3" />
                    {comp.size}
                  </div>
                )}
              </Link>

              <div className={styles.cardContent}>
                <div>
                  <div className={styles.cardHeader}>
                    {comp.logo_url ? (
                      <img
                        src={comp.logo_url}
                        alt={`Logo ${comp.name}`}
                        className={styles.cardLogo}
                      />
                    ) : (
                      <div className={styles.cardLogoPlaceholder}>
                        {comp.name.charAt(0)}
                      </div>
                    )}
                    <div className={styles.cardInfo}>
                      <Link href={`/empresas/${comp.id}`}>
                        <h2 className={styles.cardTitle}>{comp.name}</h2>
                      </Link>
                      <span className={styles.cardIndustry}>
                        {comp.industry || 'Tecnologia'}
                      </span>
                    </div>
                  </div>

                  <p className={styles.cardDescription}>
                    {comp.description || 'Empresa atuante no ecossistema de tecnologia e inovação de Manaus.'}
                  </p>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.cardLocation}>
                    <MapPinIcon className={styles.cardLocationIcon} />
                    {comp.location || 'Manaus-AM'}
                  </span>
                  <div className={styles.cardActions}>
                    <Link href={`/empresas/${comp.id}`} className={styles.btnLeaf}>
                      <span>Ver Perfil</span>
                      <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
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

export default function EmpresasPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.grid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`${styles.skeleton} ${styles.skeletonItem}`} />
            ))}
          </div>
        </div>
      }
    >
      <EmpresasContent />
    </Suspense>
  );
}
