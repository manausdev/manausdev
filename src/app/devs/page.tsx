'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  SearchIcon,
  MapPinIcon,
  UsersIcon,
  ArrowRightIcon,
  Code2Icon,
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
} from '@/components/icons';
import { GithubIcon } from '@/components/icons';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { ListingGrid } from '@/organisms/ListingGrid/ListingGrid';
import {
  MOCK_DEVS,
  getMockDevStats,
} from '@/lib/data/mock';
import {
  AVAILABILITY_FILTERS,
  AVAILABILITY_META,
  SENIORITY_LABELS,
  SORT_OPTIONS,
} from '@/lib/devs-meta';
import { useMockData } from '@/lib/env';
import type { Profile } from '@/types/database';
import styles from './devs.module.css';

const PAGE_SIZE = 24;

interface DevWithStats extends Profile {
  projects_count: number;
  events_count: number;
}

interface RawProfileWithCounts extends Profile {
  projects?: { count: number }[];
  events?: { count: number }[];
}

function sanitizeSearchTerm(term: string): string {
  return term.replace(/[,%()\\]/g, ' ').replace(/\s+/g, ' ').trim();
}

function formatMemberSince(iso?: string): string {
  if (!iso) return 'Membro da comunidade';
  try {
    return new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' })
      .format(new Date(iso))
      .replace(/\./g, '');
  } catch {
    return 'Membro da comunidade';
  }
}

function DevsDirectory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const useMock = useMockData();

  const searchTerm = searchParams.get('q') ?? '';
  const selectedStacks = useMemo(() => {
    const stacks = [...searchParams.getAll('stack'), ...searchParams.getAll('skill')];
    return Array.from(new Set(stacks));
  }, [searchParams]);
  const cityFilter = searchParams.get('cidade') ?? '';
  const availabilityParam =
    searchParams.get('disponibilidade') ??
    (searchParams.get('available') === 'true' ? 'aberto' : '');
  const seniorityFilter = searchParams.get('senioridade') ?? '';
  const sortOption = searchParams.get('sort') ?? 'recentes';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);

  const [inputValue, setInputValue] = useState(searchTerm);
  const [devs, setDevs] = useState<DevWithStats[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [skillFacets, setSkillFacets] = useState<{ skill: string; count: number }[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const loadFacets = useCallback(async () => {
    if (useMock) {
      const mockSkillCounts = new Map<string, number>();
      for (const dev of MOCK_DEVS) {
        for (const skill of dev.skills ?? []) {
          mockSkillCounts.set(skill, (mockSkillCounts.get(skill) ?? 0) + 1);
        }
      }
      const mockFacets = Array.from(mockSkillCounts.entries())
        .map(([skill, count]) => ({ skill, count }))
        .sort((a, b) => b.count - a.count || a.skill.localeCompare(b.skill))
        .slice(0, 12);
      setSkillFacets(mockFacets);

      const unique = Array.from(
        new Set(MOCK_DEVS.map((d) => d.city).filter((c): c is string => Boolean(c)))
      ).sort((a, b) => a.localeCompare(b));
      setCities(unique.length > 0 ? unique : ['Manaus']);
      return;
    }

    try {
      const supabase = createClient();
      const [{ data: skillsData }, { data: citiesData }] = await Promise.all([
        supabase.from('profiles').select('skills').limit(1000),
        supabase.from('profiles').select('city').limit(1000),
      ]);

      if (skillsData && skillsData.length > 0) {
        const counts = new Map<string, number>();
        for (const row of skillsData as Pick<Profile, 'skills'>[]) {
          for (const skill of row.skills ?? []) {
            counts.set(skill, (counts.get(skill) ?? 0) + 1);
          }
        }
        setSkillFacets(
          Array.from(counts.entries())
            .map(([skill, count]) => ({ skill, count }))
            .sort((a, b) => b.count - a.count || a.skill.localeCompare(b.skill))
            .slice(0, 12)
        );
      } else {
        setSkillFacets([]);
      }

      if (citiesData && citiesData.length > 0) {
        const unique = Array.from(
          new Set(
            (citiesData as Pick<Profile, 'city'>[])
              .map((c) => c.city)
              .filter((c): c is string => Boolean(c))
          )
        ).sort((a, b) => a.localeCompare(b));
        setCities(unique.length > 0 ? unique : ['Manaus']);
      } else {
        setCities(['Manaus']);
      }
    } catch {
      setSkillFacets([]);
      setCities(['Manaus']);
    }
  }, []);

  useEffect(() => {
    loadFacets();
  }, [loadFacets]);

  const loadDevs = useCallback(async () => {
    setLoading(true);
    const clean = sanitizeSearchTerm(searchTerm);
    const availabilityDb = AVAILABILITY_FILTERS.find((a) => a.param === availabilityParam)?.db;

    if (useMock) {
      const filtered = MOCK_DEVS.filter((dev) => {
        if (clean) {
          const haystack = `${dev.full_name} ${dev.username} ${dev.role ?? ''} ${dev.bio ?? ''}`.toLowerCase();
          if (!haystack.includes(clean.toLowerCase())) return false;
        }
        if (
          selectedStacks.length > 0 &&
          !selectedStacks.every((s) =>
            (dev.skills ?? []).some((sk) => sk.toLowerCase() === s.toLowerCase())
          )
        ) {
          return false;
        }
        if (cityFilter && (dev.city ?? 'Manaus') !== cityFilter) return false;
        if (availabilityDb && dev.availability !== availabilityDb) return false;
        if (seniorityFilter && dev.seniority !== seniorityFilter) return false;
        return true;
      });

      filtered.sort((a, b) => {
        if (sortOption === 'nome') return (a.full_name ?? '').localeCompare(b.full_name ?? '');
        if (sortOption === 'antigos') return (a.created_at ?? '').localeCompare(b.created_at ?? '');
        return (b.created_at ?? '').localeCompare(a.created_at ?? '');
      });

      const start = (page - 1) * PAGE_SIZE;
      const pageRows = filtered.slice(start, start + PAGE_SIZE);
      setDevs(
        pageRows.map((dev) => ({
          ...dev,
          projects_count: getMockDevStats(dev.id).projects,
          events_count: getMockDevStats(dev.id).events,
        }))
      );
      setTotal(filtered.length);
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      let query = supabase
        .from('profiles')
        .select(
          'id, username, full_name, avatar_url, role, bio, city, location, seniority, availability, skills, github, website, created_at, projects(count), events(count)',
          { count: 'exact' }
        );

      if (clean) {
        query = query.or(
          `full_name.ilike.%${clean}%,username.ilike.%${clean}%,role.ilike.%${clean}%,bio.ilike.%${clean}%`
        );
      }
      if (selectedStacks.length > 0) query = query.contains('skills', selectedStacks);
      if (cityFilter) query = query.eq('city', cityFilter);
      if (availabilityDb) query = query.eq('availability', availabilityDb);
      if (seniorityFilter) query = query.eq('seniority', seniorityFilter);

      if (sortOption === 'nome') {
        query = query.order('full_name', { ascending: true });
      } else if (sortOption === 'antigos') {
        query = query.order('created_at', { ascending: true, nullsFirst: false });
      } else {
        query = query.order('created_at', { ascending: false, nullsFirst: false });
      }

      query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

      const { data, count, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        const rows = data as unknown as RawProfileWithCounts[];
        setDevs(
          rows.map((row) => ({
            ...row,
            projects_count: row.projects?.[0]?.count ?? 0,
            events_count: row.events?.[0]?.count ?? 0,
          }))
        );
        setTotal(count ?? data.length);
      } else {
        setDevs([]);
        setTotal(0);
      }
    } catch {
      setDevs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedStacks, cityFilter, availabilityParam, seniorityFilter, sortOption, page, useMock]);

  useEffect(() => {
    loadDevs();
  }, [loadDevs]);

  const updateFilters = (updates: Record<string, string | string[] | null>) => {
    const merged: Record<string, string | string[] | null> = {
      q: searchTerm,
      stack: selectedStacks,
      cidade: cityFilter,
      disponibilidade: availabilityParam,
      senioridade: seniorityFilter,
      sort: sortOption !== 'recentes' ? sortOption : null,
      ...updates,
    };
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(merged)) {
      if (value === null || value === '') continue;
      if (Array.isArray(value)) {
        if (value.length === 0) continue;
        value.forEach((v) => params.append(key, v));
      } else {
        params.append(key, value);
      }
    }
    router.replace(`/devs${params.size > 0 ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  const goToPage = (targetPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (targetPage > 1) params.set('page', String(targetPage));
    else params.delete('page');
    router.replace(`/devs${params.size > 0 ? `?${params.toString()}` : ''}`, { scroll: false });
  };

  const toggleStack = (skill: string) => {
    const next = selectedStacks.includes(skill)
      ? selectedStacks.filter((s) => s !== skill)
      : [...selectedStacks, skill];
    updateFilters({ stack: next });
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedStacks.length > 0 ||
    Boolean(cityFilter) ||
    Boolean(availabilityParam) ||
    Boolean(seniorityFilter) ||
    sortOption !== 'recentes';

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Diretório de Devs</h1>
          <span className={cn('chip-river', styles.countChip)}>
            <UsersIcon />
            {total} {total === 1 ? 'desenvolvedor' : 'desenvolvedores'}
          </span>
          {useMock && <span className={styles.mockBadge}>modo demonstração</span>}
        </div>
        <p className={styles.subtitle}>
          Encontre talentos de Manaus e região por cidade, stack e disponibilidade — e veja o que cada dev construiu na comunidade.
        </p>
      </div>

      <div className={cn('manaus-card', styles.filters)}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateFilters({ q: inputValue });
          }}
          className={styles.searchForm}
        >
          <div className={styles.searchWrap}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Buscar por nome, @username, cargo ou bio..."
              className={cn('manaus-input', styles.searchInput)}
            />
          </div>
          <div className={styles.selectsGrid}>
            <select
              value={cityFilter}
              onChange={(e) => updateFilters({ cidade: e.target.value })}
              className={cn('manaus-input', styles.select)}
              aria-label="Filtrar por cidade"
            >
              <option value="">Todas as cidades</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <select
              value={availabilityParam}
              onChange={(e) => updateFilters({ disponibilidade: e.target.value })}
              className={cn('manaus-input', styles.select)}
              aria-label="Filtrar por disponibilidade"
            >
              <option value="">Disponibilidade</option>
              {AVAILABILITY_FILTERS.map((a) => (
                <option key={a.param} value={a.param}>
                  {a.label}
                </option>
              ))}
            </select>
            <select
              value={seniorityFilter}
              onChange={(e) => updateFilters({ senioridade: e.target.value })}
              className={cn('manaus-input', styles.select)}
              aria-label="Filtrar por senioridade"
            >
              <option value="">Senioridade</option>
              {Object.entries(SENIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={sortOption}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className={cn('manaus-input', styles.select)}
              aria-label="Ordenar resultados"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </form>

        {skillFacets.length > 0 && (
          <div className={styles.facets}>
            {skillFacets.map(({ skill, count }) => {
              const active = selectedStacks.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleStack(skill)}
                  className={cn(styles.facetBtn, active && styles.facetBtnActive)}
                >
                  {skill}
                  <span className={styles.facetCount}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {hasActiveFilters && (
          <div className={styles.activeBar}>
            <p className={styles.rangeText}>
              Mostrando {rangeStart}-{rangeEnd} de {total}
            </p>
            <button
              type="button"
              onClick={() => router.replace('/devs', { scroll: false })}
              className={styles.clearBtn}
            >
              <XIcon />
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <ListingGrid variant="cardsWide">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={cn('manaus-card', styles.skeletonCard)}>
              <div className={styles.skelRow}>
                <div className={styles.skelAvatar} />
                <div className={styles.skelLines}>
                  <div className={cn(styles.skelLine, styles.skelLineA)} />
                  <div className={cn(styles.skelLine, styles.skelLineB)} />
                </div>
              </div>
              <div className={cn(styles.skelLine, styles.skelLineC)} />
              <div className={cn(styles.skelLine, styles.skelLineD)} />
              <div className={styles.skelChips}>
                <div className={cn(styles.skelChip, styles.skelChipA)} />
                <div className={cn(styles.skelChip, styles.skelChipB)} />
                <div className={cn(styles.skelChip, styles.skelChipC)} />
              </div>
            </div>
          ))}
        </ListingGrid>
      ) : devs.length === 0 ? (
        <div className={cn('manaus-card', styles.emptyCard)}>
          <UsersIcon className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>Nenhum dev encontrado</h3>
          <p className={styles.emptyText}>
            Tente remover alguns filtros ou buscar por outra tecnologia.
          </p>
          <button
            type="button"
            onClick={() => router.replace('/devs', { scroll: false })}
            className={cn('btn-primary', styles.emptyBtn)}
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <>
          <ListingGrid variant="cardsWide">
            {devs.map((dev) => {
              const availability = AVAILABILITY_META[dev.availability ?? 'open'] ?? AVAILABILITY_META.open;
              const skills = dev.skills ?? [];
              const extraSkills = Math.max(0, skills.length - 3);
              return (
                <Link
                  key={dev.id}
                  href={`/devs/${dev.username}`}
                  className={cn('manaus-card', styles.card)}
                >
                  <div className={styles.cardTop}>
                    <div className={styles.cardIdRow}>
                      <div className={styles.avatar}>
                        {dev.avatar_url ? (
                          <img
                            src={dev.avatar_url}
                            alt={dev.full_name}
                            className={styles.avatarImg}
                          />
                        ) : (
                          dev.full_name.charAt(0)
                        )}
                      </div>
                      <div className={styles.idBlock}>
                        <h3 className={styles.devName}>{dev.full_name}</h3>
                        <p className={styles.devUsername}>@{dev.username}</p>
                      </div>
                    </div>
                    <span className={cn(availability.className, styles.availability)}>
                      <span className={cn(availability.dot, styles.dot)} />
                      {availability.label}
                    </span>
                  </div>

                  <p className={styles.devRole}>
                    {dev.role || 'Developer'}
                    {dev.seniority ? ` · ${SENIORITY_LABELS[dev.seniority] ?? dev.seniority}` : ''}
                  </p>

                  {dev.bio && <p className={styles.devBio}>{dev.bio}</p>}

                  <div className={styles.skills}>
                    {skills.slice(0, 3).map((skill) => (
                      <span key={skill} className={cn('chip-river', styles.skillChip)}>
                        {skill}
                      </span>
                    ))}
                    {extraSkills > 0 && (
                      <span className={styles.extraSkills}>+{extraSkills} mais</span>
                    )}
                  </div>

                  <div className={styles.cardMeta}>
                    <span className={styles.metaItem}>
                      <MapPinIcon />
                      {dev.city || 'Manaus'}
                    </span>
                    <span className={styles.metaItem}>
                      <Code2Icon />
                      {dev.projects_count} {dev.projects_count === 1 ? 'projeto' : 'projetos'}
                    </span>
                    <span className={styles.metaItem}>
                      <CalendarDaysIcon />
                      {dev.events_count} {dev.events_count === 1 ? 'evento' : 'eventos'}
                    </span>
                  </div>

                  <div className={styles.cardFooter}>
                    <span className={styles.memberSince}>
                      Membro desde {formatMemberSince(dev.created_at)}
                    </span>
                    <div className={styles.footerActions}>
                      {dev.github && (
                        <span
                          role="link"
                          aria-label={`GitHub de ${dev.full_name}`}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(dev.github!, '_blank', 'noreferrer');
                          }}
                          className={styles.githubLink}
                        >
                          <GithubIcon />
                        </span>
                      )}
                      <span className={styles.profileLink}>
                        Perfil
                        <ArrowRightIcon />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </ListingGrid>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className={cn('btn-secondary', styles.pageBtn)}
                aria-label="Página anterior"
              >
                <ChevronLeftIcon />
              </button>
              <span className={styles.pageInfo}>
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                className={cn('btn-secondary', styles.pageBtn)}
                aria-label="Próxima página"
              >
                <ChevronRightIcon />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function DevsPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className={styles.fallbackTitle} />
          <ListingGrid variant="cardsWide">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={cn('manaus-card', styles.skeletonCard)} />
            ))}
          </ListingGrid>
        </div>
      }
    >
      <DevsDirectory />
    </Suspense>
  );
}
