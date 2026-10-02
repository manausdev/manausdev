// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { createMockDevelopersRepository } from './repository';
import { getMockDevStats, MOCK_DEVS } from './mock-data';
import { PAGE_SIZE } from './model';
import { buildProfileUpsert, parseDeveloperFilters } from './schemas';

/**
 * Prova que a lógica mock absorvida de `lib/data/mock.ts` + `devs/page.tsx`
 * continua com o mesmo comportamento depois da extração do domínio
 * `developers` (ADR-0021, Fase 2 — sem mudança de comportamento).
 */

const repo = createMockDevelopersRepository();
const noFilters = {
  search: '',
  stacks: [],
  city: '',
  availability: '',
  seniority: '',
  sort: 'recentes',
  page: 1,
};

const ids = (devs: { id: string }[]) => devs.map((d) => d.id);

describe('MockDevelopersRepository', () => {
  it('lista todos sem filtros, ordenados por created_at desc (recentes)', async () => {
    const { devs, total } = await repo.list(noFilters);
    expect(total).toBe(7);
    expect(ids(devs)).toEqual(['7', '3', '4', '1', '2', '5', '6']);
  });

  it('ordena por nome (A-Z) e por mais antigos', async () => {
    const byName = await repo.list({ ...noFilters, sort: 'nome' });
    expect(ids(byName.devs)).toEqual(['1', '2', '3', '4', '5', '6', '7']);
    const oldest = await repo.list({ ...noFilters, sort: 'antigos' });
    expect(ids(oldest.devs)).toEqual(['6', '5', '2', '1', '4', '3', '7']);
  });

  it('busca por termo sanitizado no nome/username/role/bio', async () => {
    const { devs } = await repo.list({ ...noFilters, search: 'ana silva' });
    expect(ids(devs)).toEqual(['1']);
    // operadores de texto do Postgrest são neutralizados, não descartam o termo
    const dirty = await repo.list({ ...noFilters, search: 'ana,%()' });
    expect(ids(dirty.devs)).toEqual(['1', '6']);
  });

  it('filtra por stacks com match exato case-insensitive', async () => {
    const { devs } = await repo.list({ ...noFilters, stacks: ['react'] });
    expect(ids(devs)).toEqual(['3', '1']);
  });

  it('filtra por cidade (fallback Manaus)', async () => {
    const manaus = await repo.list({ ...noFilters, city: 'Manaus' });
    expect(manaus.total).toBe(7);
    const nowhere = await repo.list({ ...noFilters, city: 'São Paulo' });
    expect(nowhere.total).toBe(0);
  });

  it('filtra por disponibilidade via param de URL', async () => {
    const abertos = await repo.list({ ...noFilters, availability: 'aberto' });
    expect(ids(abertos.devs)).toEqual(['7', '4', '1']);
    const ofertas = await repo.list({ ...noFilters, availability: 'ofertas' });
    expect(ids(ofertas.devs)).toEqual(['2', '5']);
    const ocupados = await repo.list({ ...noFilters, availability: 'ocupado' });
    expect(ids(ocupados.devs)).toEqual(['3', '6']);
  });

  it('filtra por senioridade', async () => {
    const plenos = await repo.list({ ...noFilters, seniority: 'pleno' });
    expect(ids(plenos.devs)).toEqual(['7', '3', '2']);
  });

  it('pagina em fatias de PAGE_SIZE', async () => {
    expect(PAGE_SIZE).toBe(24);
    const page2 = await repo.list({ ...noFilters, page: 2 });
    expect(page2.devs).toEqual([]);
    expect(page2.total).toBe(7);
  });

  it('carrega facetas: top 12 skills por contagem e cidades únicas', async () => {
    const facets = await repo.facets();
    expect(facets.skills).toHaveLength(12);
    expect(facets.skills[0]).toEqual({ skill: 'Next.js', count: 2 });
    expect(facets.cities).toEqual(['Manaus']);
  });

  it('busca por username case-insensitive', async () => {
    const dev = await repo.byUsername('AnaSilva'.toUpperCase());
    expect(dev?.id).toBe('1');
    expect(await repo.byUsername('nao-existe')).toBeNull();
  });

  it('busca por id', async () => {
    const dev = await repo.byId('3');
    expect(dev?.username).toBe('carloslima');
    expect(await repo.byId('999')).toBeNull();
  });

  it('destaca os primeiros devs e conta o total', async () => {
    const featured = await repo.featured(4);
    expect(ids(featured)).toEqual(['1', '2', '3', '4']);
    expect(await repo.count()).toBe(7);
  });

  it('expõe todos os usernames', async () => {
    const usernames = await repo.usernames();
    expect(usernames).toEqual(MOCK_DEVS.map((d) => d.username));
  });

  it('faz upsert in-memory atualizando o registro', async () => {
    await repo.upsert({
      id: '2',
      username: 'brunocosta',
      full_name: 'Bruno Costa',
      role: 'Staff Engineer',
      bio: null,
      location: null,
      city: null,
      seniority: null,
      github: null,
      website: null,
      linkedin: null,
      availability: 'open',
      skills: [],
      updated_at: new Date().toISOString(),
    });
    expect((await repo.byId('2'))?.role).toBe('Staff Engineer');
  });

  it('acopla contagens de prova social ao mock de projetos/eventos', async () => {
    const { devs } = await repo.list(noFilters);
    for (const dev of devs) {
      expect(dev.projects_count).toBe(getMockDevStats(dev.id).projects);
      expect(dev.events_count).toBe(getMockDevStats(dev.id).events);
    }
  });
});

describe('parseDeveloperFilters', () => {
  it('lê todos os filtros da URL', () => {
    const params = new URLSearchParams(
      'q=ana&stack=React&skill=React&skill=Next.js&cidade=Manaus&disponibilidade=aberto&senioridade=pleno&sort=nome&page=3'
    );
    expect(parseDeveloperFilters(params)).toEqual({
      search: 'ana',
      stacks: ['React', 'Next.js'],
      city: 'Manaus',
      availability: 'aberto',
      seniority: 'pleno',
      sort: 'nome',
      page: 3,
    });
  });

  it('converte o param legado available=true em aberto', () => {
    const filters = parseDeveloperFilters(new URLSearchParams('available=true'));
    expect(filters.availability).toBe('aberto');
  });

  it('aplica defaults e ignora page inválida', () => {
    const filters = parseDeveloperFilters(new URLSearchParams('page=abc'));
    expect(filters).toEqual({
      search: '',
      stacks: [],
      city: '',
      availability: '',
      seniority: '',
      sort: 'recentes',
      page: 1,
    });
    expect(parseDeveloperFilters(new URLSearchParams('page=0')).page).toBe(1);
  });
});

describe('buildProfileUpsert', () => {
  it('coage campos vazios para null e splita skills CSV', () => {
    const payload = buildProfileUpsert('u1', 'joao@example.com', {
      full_name: 'João',
      username: '',
      role: '',
      bio: '',
      location: '',
      city: '',
      seniority: '',
      github: '',
      website: '',
      linkedin: '',
      availability: '',
      skills: 'React, , Node.js,' as unknown as string[],
    });
    expect(payload.id).toBe('u1');
    expect(payload.username).toBe('joao');
    expect(payload.full_name).toBe('João');
    expect(payload.role).toBeNull();
    expect(payload.bio).toBeNull();
    expect(payload.availability).toBe('open');
    expect(payload.skills).toEqual(['React', 'Node.js']);
    expect(() => new Date(payload.updated_at)).not.toThrow();
  });
});
