import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Profile } from '@/types/database';
import {
  type DevWithStats,
  type DeveloperFacets,
  type DeveloperFilters,
  type ProfileUpsert,
  PAGE_SIZE,
  availabilityParamToDb,
  sanitizeSearchTerm,
} from '@/domains/developers/model';
import type { DevelopersRepository } from '@/domains/developers/repository';

/**
 * Implementação Supabase da porta `DevelopersRepository` (ADR-0021).
 * Todo acesso a `profiles` do app passa por aqui; o domínio não conhece
 * este arquivo. O cliente é injetado — quem decide server/browser/public
 * é a rota que monta o serviço.
 */

interface RawProfileWithCounts extends Profile {
  projects?: { count: number }[];
  events?: { count: number }[];
}

export function createSupabaseDevelopersRepository(
  supabase: SupabaseClient<Database>
): DevelopersRepository {
  return {
    async list(filters: DeveloperFilters) {
      const clean = sanitizeSearchTerm(filters.search);
      const availabilityDb = availabilityParamToDb(filters.availability);

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
      if (filters.stacks.length > 0) query = query.contains('skills', filters.stacks);
      if (filters.city) query = query.eq('city', filters.city);
      if (availabilityDb) query = query.eq('availability', availabilityDb);
      if (filters.seniority) query = query.eq('seniority', filters.seniority);

      if (filters.sort === 'nome') {
        query = query.order('full_name', { ascending: true });
      } else if (filters.sort === 'antigos') {
        query = query.order('created_at', { ascending: true, nullsFirst: false });
      } else {
        query = query.order('created_at', { ascending: false, nullsFirst: false });
      }

      query = query.range((filters.page - 1) * PAGE_SIZE, filters.page * PAGE_SIZE - 1);

      const { data, count, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        const rows = data as unknown as RawProfileWithCounts[];
        const devs: DevWithStats[] = rows.map((row) => ({
          ...row,
          projects_count: row.projects?.[0]?.count ?? 0,
          events_count: row.events?.[0]?.count ?? 0,
        }));
        return { devs, total: count ?? data.length };
      }
      return { devs: [], total: 0 };
    },

    async facets(): Promise<DeveloperFacets> {
      try {
        const [{ data: skillsData }, { data: citiesData }] = await Promise.all([
          supabase.from('profiles').select('skills').limit(1000),
          supabase.from('profiles').select('city').limit(1000),
        ]);

        let skills: { skill: string; count: number }[] = [];
        if (skillsData && skillsData.length > 0) {
          const counts = new Map<string, number>();
          for (const row of skillsData as Pick<Profile, 'skills'>[]) {
            for (const skill of row.skills ?? []) {
              counts.set(skill, (counts.get(skill) ?? 0) + 1);
            }
          }
          skills = Array.from(counts.entries())
            .map(([skill, count]) => ({ skill, count }))
            .sort((a, b) => b.count - a.count || a.skill.localeCompare(b.skill))
            .slice(0, 12);
        }

        let cities = ['Manaus'];
        if (citiesData && citiesData.length > 0) {
          const unique = Array.from(
            new Set(
              (citiesData as Pick<Profile, 'city'>[])
                .map((c) => c.city)
                .filter((c): c is string => Boolean(c))
            )
          ).sort((a, b) => a.localeCompare(b));
          cities = unique.length > 0 ? unique : ['Manaus'];
        }

        return { skills, cities };
      } catch {
        return { skills: [], cities: ['Manaus'] };
      }
    },

    async byUsername(username: string): Promise<Profile | null> {
      const { data: profileData } = await supabase
        .from('profiles')
        .select(
          'id, username, full_name, avatar_url, role, bio, city, location, seniority, availability, skills, github, website, linkedin, is_admin, created_at, updated_at'
        )
        .eq('username', username)
        .single();
      return (profileData as unknown as Profile) || null;
    },

    async byId(id: string): Promise<Profile | null> {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      return (profileData as unknown as Profile) || null;
    },

    async featured(limit: number): Promise<Profile[]> {
      const { data } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, role, skills')
        .limit(limit);
      return (data as unknown as Profile[]) ?? [];
    },

    async count(): Promise<number> {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count ?? 0;
    },

    async usernames(): Promise<string[]> {
      const { data } = await supabase.from('profiles').select('username');
      return ((data ?? []) as { username: string | null }[]).map((row) =>
        String(row.username ?? '')
      ).filter(Boolean);
    },

    async upsert(profile: ProfileUpsert): Promise<void> {
      const { error } = await supabase
        .from('profiles')
        // @ts-expect-error Supabase postgrest query builder overload
        .upsert(profile);
      if (error) throw error;
    },
  };
}
