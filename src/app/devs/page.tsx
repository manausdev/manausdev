'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  Search,
  MapPin,
  Users,
  ArrowRight,
  Code2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { GithubIcon } from '@/components/icons';
import { createClient } from '@/lib/supabase/client';
import {
  MOCK_DEVS,
  MOCK_PROJECTS,
  MOCK_EVENTS,
  getMockProjectsByAuthor,
  getMockEventsByOrganizer,
  getMockDevStats,
} from '@/lib/data/mock';
import {
  AVAILABILITY_FILTERS,
  AVAILABILITY_META,
  SENIORITY_LABELS,
  SORT_OPTIONS,
} from '@/lib/devs-meta';
import { useMockData } from '@/lib/env';
import type { Profile, Project, EventItem } from '@/types/database';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink">Diretório de Devs</h1>
          <span className="chip-river !text-[11px] font-mono font-semibold flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {total} {total === 1 ? 'desenvolvedor' : 'desenvolvedores'}
          </span>
          {useMock && (
            <span className="!text-[10px] font-mono px-2 py-0.5 rounded-full bg-surface-1 text-faint">
              modo demonstração
            </span>
          )}
        </div>
        <p className="text-sm text-muted mt-2 max-w-2xl">
          Encontre talentos de Manaus e região por cidade, stack e disponibilidade — e veja o que cada dev construiu na comunidade.
        </p>
      </div>

      <div className="manaus-card border border-border p-4 sm:p-5 mb-8 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateFilters({ q: inputValue });
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Buscar por nome, @username, cargo ou bio..."
              className="manaus-input pl-10"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select
              value={cityFilter}
              onChange={(e) => updateFilters({ cidade: e.target.value })}
              className="manaus-input !py-2 text-xs"
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
              className="manaus-input !py-2 text-xs"
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
              className="manaus-input !py-2 text-xs"
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
              className="manaus-input !py-2 text-xs"
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
          <div className="flex flex-wrap items-center gap-2">
            {skillFacets.map(({ skill, count }) => {
              const active = selectedStacks.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleStack(skill)}
                  className={`!text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full transition-colors ${
                    active
                      ? 'chip-leaf'
                      : 'border border-border text-muted hover:border-accent/40 hover:text-ink'
                  }`}
                >
                  {skill}
                  <span className="ml-1 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex items-center justify-between border-t border-border pt-3">
            <p className="text-[11px] font-mono text-faint">
              Mostrando {rangeStart}-{rangeEnd} de {total}
            </p>
            <button
              type="button"
              onClick={() => router.replace('/devs', { scroll: false })}
              className="flex items-center gap-1 text-[11px] font-mono font-semibold text-accent-text hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              Limpar filtros
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="manaus-card border border-border p-5 h-64 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-surface-2" />
                <div className="space-y-2">
                  <div className="h-3.5 w-32 rounded bg-surface-2" />
                  <div className="h-2.5 w-20 rounded bg-surface-2" />
                </div>
              </div>
              <div className="h-3 w-full rounded bg-surface-2 mb-2" />
              <div className="h-3 w-2/3 rounded bg-surface-2 mb-4" />
              <div className="flex gap-1.5">
                <div className="h-5 w-14 rounded-full bg-surface-2" />
                <div className="h-5 w-16 rounded-full bg-surface-2" />
                <div className="h-5 w-12 rounded-full bg-surface-2" />
              </div>
            </div>
          ))}
        </div>
      ) : devs.length === 0 ? (
        <div className="manaus-card border border-border p-12 text-center">
          <Users className="w-10 h-10 text-faint mx-auto mb-4" />
          <h3 className="font-display font-bold text-lg text-ink mb-1">Nenhum dev encontrado</h3>
          <p className="text-sm text-muted mb-6">
            Tente remover alguns filtros ou buscar por outra tecnologia.
          </p>
          <button
            type="button"
            onClick={() => router.replace('/devs', { scroll: false })}
            className="btn-primary !py-2.5 !px-5 text-xs"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {devs.map((dev) => {
              const availability = AVAILABILITY_META[dev.availability ?? 'open'] ?? AVAILABILITY_META.open;
              const skills = dev.skills ?? [];
              const extraSkills = Math.max(0, skills.length - 3);
              return (
                <Link
                  key={dev.id}
                  href={`/devs/${dev.username}`}
                  className="manaus-card border border-border p-5 flex flex-col gap-3 group hover:border-accent/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-deep text-white flex items-center justify-center font-display font-bold text-lg border-2 border-border shrink-0 overflow-hidden">
                        {dev.avatar_url ? (
                          <img
                            src={dev.avatar_url}
                            alt={dev.full_name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          dev.full_name.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display font-bold text-ink truncate group-hover:text-accent-text transition-colors">
                          {dev.full_name}
                        </h3>
                        <p className="text-xs text-muted truncate">@{dev.username}</p>
                      </div>
                    </div>
                    <span className={`${availability.className} flex items-center gap-1.5 shrink-0`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${availability.dot}`} />
                      {availability.label}
                    </span>
                  </div>

                  <p className="text-xs text-muted font-medium">
                    {dev.role || 'Developer'}
                    {dev.seniority ? ` · ${SENIORITY_LABELS[dev.seniority] ?? dev.seniority}` : ''}
                  </p>

                  {dev.bio && <p className="text-xs text-faint line-clamp-2">{dev.bio}</p>}

                  <div className="flex flex-wrap gap-1.5">
                    {skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="chip-river !text-[10px] font-mono">
                        {skill}
                      </span>
                    ))}
                    {extraSkills > 0 && (
                      <span className="text-[10px] font-mono text-faint self-center">+{extraSkills} mais</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-faint border-t border-border pt-3 mt-auto">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-accent-text" />
                      {dev.city || 'Manaus'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Code2 className="w-3 h-3 text-accent-text" />
                      {dev.projects_count} {dev.projects_count === 1 ? 'projeto' : 'projetos'}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-3 h-3 text-accent-text" />
                      {dev.events_count} {dev.events_count === 1 ? 'evento' : 'eventos'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-faint">
                      Membro desde {formatMemberSince(dev.created_at)}
                    </span>
                    <div className="flex items-center gap-2.5">
                      {dev.github && (
                        <span
                          role="link"
                          aria-label={`GitHub de ${dev.full_name}`}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(dev.github!, '_blank', 'noreferrer');
                          }}
                          className="text-faint hover:text-ink transition-colors"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </span>
                      )}
                      <span className="text-xs font-semibold text-accent-text flex items-center gap-1">
                        Perfil
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="btn-secondary !py-2 !px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-muted">
                Página {page} de {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
                className="btn-secondary !py-2 !px-3 text-xs disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Próxima página"
              >
                <ChevronRight className="w-4 h-4" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="h-10 w-64 rounded bg-surface-2 animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="manaus-card border border-border p-5 h-64 animate-pulse" />
            ))}
          </div>
        </div>
      }
    >
      <DevsDirectory />
    </Suspense>
  );
}