// @vitest-environment node
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guarda permanente da regra de dependência do ADR-0021:
 *
 *   src/domains/** NÃO importa nada de Supabase nem de src/infrastructure/**.
 *
 * O domínio só conhece a porta (`repository.ts`); quem fala com Supabase é
 * `src/infrastructure/supabase/repositories/*`. No espírito do
 * `css-modules.test.ts`, falha rápido em qualquer regressão.
 */

const DOMAINS = join(process.cwd(), 'src', 'domains');

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, out);
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(path);
  }
  return out;
}

const rel = (file: string) => relative(process.cwd(), file).split(sep).join('/');

const importRe = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]/g;

function specifiers(source: string): string[] {
  return [...source.matchAll(importRe)].map((m) => m[1] ?? m[2]);
}

describe('Regra de dependência dos domínios (ADR-0021)', () => {
  const domainFiles = walk(DOMAINS);

  it('encontra os arquivos do domínio developers', () => {
    expect(domainFiles.length).toBeGreaterThan(0);
    for (const file of ['model.ts', 'repository.ts', 'service.ts', 'queries.ts', 'mutations.ts', 'schemas.ts']) {
      expect(domainFiles.map(rel)).toContain(`src/domains/developers/${file}`);
    }
  });

  it('nenhum arquivo em src/domains importa Supabase', () => {
    const offenders: string[] = [];
    for (const file of domainFiles) {
      const source = readFileSync(file, 'utf8');
      for (const spec of specifiers(source)) {
        if (/supabase/i.test(spec)) offenders.push(`${rel(file)}: ${spec}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('nenhum arquivo em src/domains importa src/infrastructure', () => {
    const offenders: string[] = [];
    for (const file of domainFiles) {
      const source = readFileSync(file, 'utf8');
      for (const spec of specifiers(source)) {
        if (/infrastructure/i.test(spec)) offenders.push(`${rel(file)}: ${spec}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it('a implementação Supabase vive em src/infrastructure e usa a porta do domínio', () => {
    const repoPath = join(process.cwd(), 'src', 'infrastructure', 'supabase', 'repositories', 'developers.ts');
    expect(existsSync(repoPath)).toBe(true);
    const source = readFileSync(repoPath, 'utf8');
    expect(source).toContain(`from '@/domains/developers/repository'`);
  });
});
