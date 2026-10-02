import type { Profile } from '@/types/database';

/**
 * Domínio `developers`: o diretório de pessoas que constroem tecnologia
 * em Manaus (ADR-0021, Fase 2). Este módulo define tipos, regras e
 * vocabulário do domínio — sem tocar em Supabase (isso fica em
 * `src/infrastructure/`).
 */

/** Dev exibido no diretório, com prova social (contagens). */
export interface DevWithStats extends Profile {
  projects_count: number;
  events_count: number;
}

/** Filtros de listagem validados (ver `schemas.ts`). */
export interface DeveloperFilters {
  search: string;
  stacks: string[];
  city: string;
  /** Valor do param de URL (`aberto`/`ofertas`/`ocupado`), não o valor no banco. */
  availability: string;
  seniority: string;
  sort: string;
  page: number;
}

/** Facetas de busca renderizadas no diretório. */
export interface DeveloperFacets {
  skills: { skill: string; count: number }[];
  cities: string[];
}

/** Payload de escrita de perfil (ver `schemas.ts`). */
export interface ProfileUpsert {
  id: string;
  username: string;
  full_name: string;
  role: string | null;
  bio: string | null;
  location: string | null;
  city: string | null;
  seniority: string | null;
  github: string | null;
  website: string | null;
  linkedin: string | null;
  availability: string;
  skills: string[];
  updated_at: string;
}

/** Tamanho de página do diretório (mock e Supabase usam o mesmo valor). */
export const PAGE_SIZE = 24;

/**
 * Termos de busca não podem carregar os operadores de texto do Postgrest
 * (`,`, `%`, `(`, `)`, `\`) — são trocados por espaço e o termo é normalizado.
 */
export function sanitizeSearchTerm(term: string): string {
  return term.replace(/[,%()\\]/g, ' ').replace(/\s+/g, ' ').trim();
}

export const AVAILABILITY_FILTERS = [
  { param: 'aberto', db: 'open', label: 'Aberto a projetos' },
  { param: 'ofertas', db: 'offers', label: 'Aberto a ofertas' },
  { param: 'ocupado', db: 'busy', label: 'Ocupado agora' },
] as const;

export interface AvailabilityMeta {
  label: string;
}

export const AVAILABILITY_META: Record<string, AvailabilityMeta> = {
  open: {
    label: 'Aberto a projetos',
  },
  offers: {
    label: 'Aberto a ofertas',
  },
  busy: {
    label: 'Ocupado',
  },
};

export function availabilityMeta(value?: string | null): AvailabilityMeta {
  return AVAILABILITY_META[value ?? ''] ?? AVAILABILITY_META.busy;
}

/** Valor de URL (`aberto`) → valor no banco (`open`). */
export function availabilityParamToDb(param: string): string | undefined {
  return AVAILABILITY_FILTERS.find((a) => a.param === param)?.db;
}

export const SENIORITY_LABELS: Record<string, string> = {
  junior: 'Júnior',
  pleno: 'Pleno',
  senior: 'Sênior',
  lead: 'Lead',
};

export function seniorityLabel(value?: string | null): string | null {
  if (!value) return null;
  return SENIORITY_LABELS[value] ?? value;
}

export const SORT_OPTIONS = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'nome', label: 'Nome (A-Z)' },
  { value: 'antigos', label: 'Mais antigos' },
] as const;
