import type { ProfileType } from '@/types/database';

export type ProfileResource =
  | 'profiles'
  | 'projects'
  | 'events'
  | 'news'
  | 'community_channels'
  | 'jobs'
  | 'companies'
  | 'contacts';

export const PROFILE_RESOURCES: readonly ProfileResource[] = [
  'profiles',
  'projects',
  'events',
  'news',
  'community_channels',
  'jobs',
  'companies',
  'contacts',
];

export interface ProfileTypeMeta {
  label: string;
  description: string;
  resources: readonly ProfileResource[];
}

export const PROFILE_TYPE_META: Record<ProfileType, ProfileTypeMeta> = {
  dev: {
    label: 'Dev',
    description: 'Cria e gerencia projetos, eventos, notícias e canais de comunidade.',
    resources: ['projects', 'events', 'news', 'community_channels'],
  },
  empresa: {
    label: 'Empresa',
    description: 'Gerencia a própria empresa, vagas, eventos, notícias e canais de comunidade.',
    resources: ['companies', 'jobs', 'events', 'news', 'community_channels'],
  },
  admin: {
    label: 'Admin',
    description: 'Acesso total para curadoria e manutenção da plataforma.',
    resources: PROFILE_RESOURCES,
  },
};

export const PROFILE_TYPE_FALLBACK: ProfileType = 'dev';

export function profileType(value?: string | null): ProfileType {
  return value === 'empresa' || value === 'admin' ? value : 'dev';
}

export function profileTypeMeta(value?: string | null): ProfileTypeMeta {
  return PROFILE_TYPE_META[profileType(value)];
}

export function isAdminProfile(value?: string | null): boolean {
  return profileType(value) === 'admin';
}

export function canAccess(value: string | null | undefined, resource: ProfileResource): boolean {
  return profileTypeMeta(value).resources.includes(resource);
}

export const PROFILE_TYPE_OPTIONS = (Object.keys(PROFILE_TYPE_META) as ProfileType[]).map((value) => ({
  value,
  label: PROFILE_TYPE_META[value].label,
}));
