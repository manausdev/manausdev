// @vitest-environment node
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guarda contra a regressão do ADR-0018: rotas com `generateStaticParams` são
 * prerenderizadas como estáticas. Se elas (ou qualquer módulo que importam)
 * usarem o cliente server — que chama `cookies()` de `next/headers` — o Next
 * lança em runtime o erro 500 "Page changed from static to dynamic at
 * runtime". Essas rotas devem buscar dados com `createPublicClient`
 * (cliente público anônimo, sem cookies).
 *
 * O erro não aparece no typecheck nem no build: só em produção, na primeira
 * requisição à rota. Este teste percorre o grafo de imports de cada rota
 * estática e falha no CI antes do deploy.
 */

const SRC = join(process.cwd(), 'src');
const APP = join(SRC, 'app');

const read = (file: string) => readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const rel = (file: string) => relative(process.cwd(), file).split(sep).join('/');

function walk(dir: string, accept: (file: string) => boolean, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, accept, out);
    else if (accept(path)) out.push(path);
  }
  return out;
}

/** Padrões proibidos no grafo de uma rota estática. */
const FORBIDDEN_IMPORT = /(?:from\s+|import\s*\(\s*)['"]([^'"]*(?:supabase\/server|next\/headers)['"])/;

/** Resolve um spec de import (`@/x`, `./x`, `../x`) para um arquivo em disco. */
function resolveImport(fromFile: string, spec: string): string | null {
  let base: string;
  if (spec.startsWith('@/')) base = join(SRC, spec.slice(2));
  else if (spec.startsWith('.')) base = join(dirname(fromFile), spec);
  else return null; // pacote externo (next, react, @supabase/ssr já embutido nos clients)

  const candidates = [
    `${base}.ts`,
    `${base}.tsx`,
    join(base, 'index.ts'),
    join(base, 'index.tsx'),
    base,
  ];
  for (const candidate of candidates) {
    try {
      readFileSync(candidate); // lança se não existir ou for diretório
      return candidate;
    } catch {
      // tenta o próximo candidato
    }
  }
  return null;
}

/** Todos os módulos alcançáveis a partir de um arquivo (imports estáticos e dinâmicos). */
function importGraph(entry: string): string[] {
  const seen = new Set<string>();
  const queue = [entry];
  while (queue.length) {
    const file = queue.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    const source = read(file);
    const specs = [
      ...source.matchAll(/(?:from\s+|import\s*\(\s*)['"]([^'"]+)['"]/g),
    ].map((m) => m[1]);
    for (const spec of specs) {
      const resolved = resolveImport(file, spec);
      if (resolved && !seen.has(resolved)) queue.push(resolved);
    }
  }
  return [...seen];
}

const staticRouteFiles = walk(APP, (f) => f.endsWith('page.tsx')).filter((f) =>
  /export\s+async\s+function\s+generateStaticParams/.test(read(f)),
);

describe('Rotas estáticas (generateStaticParams)', () => {
  it('encontra as rotas de detalhe', () => {
    // 6 rotas hoje: comunidades, empresas, eventos, noticias, projetos, vagas.
    // Se este número cair, uma rota perdeu o prerender sem intenção.
    expect(staticRouteFiles.length).toBeGreaterThanOrEqual(6);
  });

  it('não importa o cliente server nem next/headers (usar createPublicClient)', () => {
    const offenders: string[] = [];
    for (const route of staticRouteFiles) {
      for (const file of importGraph(route)) {
        const match = read(file).match(FORBIDDEN_IMPORT);
        if (match) {
          offenders.push(
            `${rel(route)} -> ${rel(file)} importa ${match[1]} (cookies() em rota estática)`,
          );
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
