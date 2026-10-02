import type { MetadataRoute } from 'next';
import {
  MOCK_COMMUNITIES,
  MOCK_COMPANIES,
  MOCK_EVENTS,
  MOCK_JOBS,
  MOCK_NEWS,
  MOCK_PROJECTS,
} from '@/lib/data/mock';
import { createPublicClient } from '@/infrastructure/supabase/public';
import { createDevelopersService } from '@/domains/developers/service';
import { createMockDevelopersRepository } from '@/domains/developers/repository';
import { createSupabaseDevelopersRepository } from '@/infrastructure/supabase/repositories/developers';
import { useMockData } from '@/lib/env';
import { siteUrl } from '@/lib/site';

type Table =
  | 'projects'
  | 'jobs'
  | 'companies'
  | 'events'
  | 'communities'
  | 'news'
  | 'community_channels';

async function fetchColumn<T extends string>(table: Table, column: T): Promise<string[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase.from(table).select(column);
    return ((data ?? []) as Array<Record<string, unknown>>)
      .map((row) => String(row[column] ?? ''))
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const useMock = useMockData();
  const lastModified = new Date();

  const developersService = createDevelopersService(
    useMock
      ? createMockDevelopersRepository()
      : createSupabaseDevelopersRepository(createPublicClient())
  );

  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/devs',
    '/projetos',
    '/vagas',
    '/comunidades',
    '/noticias',
    '/eventos',
    '/empresas',
    '/sobre',
    '/contato',
    '/termos',
    '/privacidade',
  ].map((path) => ({
    url: siteUrl(path),
    lastModified,
  }));

  const [
    devUsernames,
    projectIds,
    jobIds,
    companyIds,
    communityIds,
    eventIds,
    newsIds,
  ] = await Promise.all([
    developersService.usernames().catch(() => [] as string[]),
    useMock ? Promise.resolve(MOCK_PROJECTS.map((p) => p.id)) : fetchColumn('projects', 'id'),
    useMock ? Promise.resolve(MOCK_JOBS.map((j) => j.id)) : fetchColumn('jobs', 'id'),
    useMock ? Promise.resolve(MOCK_COMPANIES.map((c) => c.id)) : fetchColumn('companies', 'id'),
    useMock ? Promise.resolve(MOCK_COMMUNITIES.map((c) => c.id)) : fetchColumn('communities', 'id'),
    useMock ? Promise.resolve(MOCK_EVENTS.map((e) => e.id)) : fetchColumn('events', 'id'),
    useMock ? Promise.resolve(MOCK_NEWS.map((n) => n.id)) : fetchColumn('news', 'id'),
  ]);

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...devUsernames.map((username) => `/devs/${username}`),
    ...projectIds.map((id) => `/projetos/${id}`),
    ...jobIds.map((id) => `/vagas/${id}`),
    ...companyIds.map((id) => `/empresas/${id}`),
    ...communityIds.map((id) => `/comunidades/${id}`),
    ...eventIds.map((id) => `/eventos/${id}`),
    ...newsIds.map((id) => `/noticias/${id}`),
  ].map((path) => ({
    url: siteUrl(path),
    lastModified,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
