import { createPublicClient } from '@/lib/supabase/public';
import { useMockData } from '@/lib/env';

/**
 * Resolve a list for SSR pages: mock only when explicitly enabled;
 * otherwise return remote data or an empty list — never invent rows.
 */
export function resolveList<T>(mock: T[], remote: T[] | null | undefined): T[] {
  if (useMockData()) return mock;
  return remote ?? [];
}

/**
 * Resolve a single entity: mock only when opted-in; otherwise remote or null.
 */
export function resolveEntity<T>(
  mock: T | undefined,
  remote: T | null | undefined
): T | null {
  if (useMockData()) return mock ?? null;
  return remote ?? null;
}

export async function fetchIdsForStaticParams(
  table:
    | 'projects'
    | 'jobs'
    | 'companies'
    | 'events'
    | 'communities',
  mockIds: string[]
): Promise<{ id: string }[]> {
  if (useMockData()) {
    return mockIds.map((id) => ({ id }));
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from(table).select('id');
    if (error || !data) return [];
    return (data as unknown as { id: string }[]).map((row) => ({ id: row.id }));
  } catch {
    return [];
  }
}

export async function fetchById<T>(
  table:
    | 'projects'
    | 'jobs'
    | 'companies'
    | 'events'
    | 'communities',
  id: string,
  mockFind: () => T | undefined
): Promise<T | null> {
  if (useMockData()) {
    return mockFind() ?? null;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    if (error || !data) return null;
    return data as unknown as T;
  } catch {
    return null;
  }
}
