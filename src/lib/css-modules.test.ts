// @vitest-environment node
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guarda contra regressões da migração Tailwind -> CSS Modules.
 *
 * Nada disso falha no build nem no typecheck: uma classe sem definição vira
 * `undefined` no className, e uma regra com corpo inválido é ignorada pelo
 * navegador. Foi assim que `empresas.module.css` ficou 270 linhas sem estilo e
 * que `sobre`, `contato` e `register` ficaram com 32 classes sem regra.
 */

const SRC = join(process.cwd(), 'src');

function walk(dir: string, accept: (file: string) => boolean, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path, accept, out);
    else if (accept(path)) out.push(path);
  }
  return out;
}

const cssFiles = walk(SRC, (f) => f.endsWith('.module.css'));
const sourceFiles = walk(
  SRC,
  (f) => /\.tsx?$/.test(f) && !/\.(test|stories)\.tsx?$/.test(f),
);

const rel = (file: string) => relative(process.cwd(), file).split(sep).join('/');
const read = (file: string) => readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

describe('CSS Modules', () => {
  it('encontra os módulos', () => {
    expect(cssFiles.length).toBeGreaterThan(10);
  });

  it('não tem linhas `;` soltas (declarações apagadas)', () => {
    const offenders = cssFiles.filter((f) => /^\s*;\s*$/m.test(read(f))).map(rel);
    expect(offenders).toEqual([]);
  });

  it('não tem declaração terminada em ponto no lugar de `;`', () => {
    const offenders = cssFiles
      .filter((f) => /^\s+[-a-z]+\s*:[^;{}]*[0-9a-z%)]\.\s*$/m.test(read(f)))
      .map(rel);
    expect(offenders).toEqual([]);
  });

  it('não usa valores da escala do Tailwind (ex.: max-width: 4xl)', () => {
    const offenders = cssFiles
      .filter((f) => /^\s+(?:max-|min-)?(?:width|height)\s*:\s*(?:[2-7]?xl|xs|sm|md|lg)\s*;/m.test(read(f)))
      .map(rel);
    expect(offenders).toEqual([]);
  });

  it('não usa utilitários do Tailwind como propriedade (ex.: space-y)', () => {
    const offenders = cssFiles
      .filter((f) => /^\s+(?:space-[xy]|divide-[xy])\s*:/m.test(read(f)))
      .map(rel);
    expect(offenders).toEqual([]);
  });

  it('todo `styles.x` usado no código existe no módulo importado', () => {
    const importRe = /import\s+(\w+)\s+from\s+'(\.[^']*\.module\.css)'/g;
    const classRe = /\.([A-Za-z_][\w-]*)/g;
    const problems: string[] = [];

    for (const file of sourceFiles) {
      const source = read(file);
      for (const [, ident, spec] of source.matchAll(importRe)) {
        const cssPath = join(dirname(file), spec);
        if (!existsSync(cssPath)) {
          problems.push(`${rel(file)}: módulo ausente ${spec}`);
          continue;
        }
        const defined = new Set([...read(cssPath).matchAll(classRe)].map((m) => m[1]));
        const used = new Set(
          [...source.matchAll(new RegExp(ident + '\\.([A-Za-z_]\\w*)', 'g'))].map((m) => m[1]),
        );
        const missing = [...used].filter((name) => !defined.has(name));
        if (missing.length) problems.push(`${rel(file)}: ${missing.join(', ')}`);
      }
    }

    expect(problems).toEqual([]);
  });
});
