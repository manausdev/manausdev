import type { Profile } from '@/types/database';
import { type DeveloperFilters, type ProfileUpsert } from './model';

/**
 * Schemas do domínio `developers` — validação/normalização de entrada,
 * escrita à mão conforme a lei de zero dependências do projeto.
 */

/** Lê os filtros do diretório a partir dos search params da URL. */
export function parseDeveloperFilters(params: URLSearchParams): DeveloperFilters {
  const stacks = [...params.getAll('stack'), ...params.getAll('skill')];
  return {
    search: params.get('q') ?? '',
    stacks: Array.from(new Set(stacks)),
    city: params.get('cidade') ?? '',
    availability:
      params.get('disponibilidade') ??
      (params.get('available') === 'true' ? 'aberto' : ''),
    seniority: params.get('senioridade') ?? '',
    sort: params.get('sort') ?? 'recentes',
    page: Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1),
  };
}

/**
 * Monta o payload de upsert a partir do estado do formulário do dashboard.
 * Campos vazios viram `null`; skills podem chegar como string (CSV) ou array.
 */
export function buildProfileUpsert(
  userId: string,
  email: string | undefined,
  profile: Partial<Profile>
): ProfileUpsert {
  const skillsArray =
    typeof profile.skills === 'string'
      ? (profile.skills as string)
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : profile.skills || [];

  return {
    id: userId,
    username: profile.username || email?.split('@')[0] || 'user',
    full_name: profile.full_name || '',
    role: profile.role || null,
    bio: profile.bio || null,
    location: profile.location || null,
    city: profile.city || null,
    seniority: profile.seniority || null,
    github: profile.github || null,
    website: profile.website || null,
    linkedin: profile.linkedin || null,
    availability: profile.availability || 'open',
    skills: skillsArray,
    updated_at: new Date().toISOString(),
  };
}
