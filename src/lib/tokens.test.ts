import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * O Tailwind dava para usar `--qualquer-coisa` sem erro: o utilitário gerado
 * resolvia no build. Em CSS Modules nao existe essa rede de seguranca. Um
 * `var(--token-inexistente)` compila, passa no typecheck e no build, e cai
 * silenciosamente para o valor inicial da propriedade. Um gap que vira `0` e
 * um `font-weight` que vira `400` nao quebram nada visivel a olho nu.
 *
 * Este teste varre os `.module.css` e falha antes que isso chegue a producao.
 */

const SRC = join(process.cwd(), 'src');
const GLOBALS = readFileSync(join(SRC, 'app', 'globals.css'), 'utf8');

/** Custom properties declaradas em globals.css (tokens reais do projeto). */
const declared = new Set(
  [...GLOBALS.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gim)].map((m) => m[1]),
);

function findModuleCss(dir: string, found: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      findModuleCss(full, found);
    } else if (entry.endsWith('.module.css')) {
      found.push(full);
    }
  }
  return found;
}

describe('tokens CSS', () => {
  it('globals.css declara os tokens esperados', () => {
    // Sanidade do fixture: se a lista-base quebrar, o teste abaixo fica inerte.
    for (const token of ['--canvas', '--ink', '--accent', '--on-accent', '--neon']) {
      expect(declared.has(token), `globals.css deveria declarar ${token}`).toBe(true);
    }
  });

  it('todo var(--token) usado em CSS Modules existe em globals.css', () => {
    const files = findModuleCss(SRC);
    expect(files.length, 'deveria haver ao menos um .module.css').toBeGreaterThan(0);

    const missing: string[] = [];
    for (const file of files) {
      const css = readFileSync(file, 'utf8');
      for (const [, token] of css.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)) {
        if (!declared.has(token)) {
          missing.push(`${relative(SRC, file)} -> ${token}`);
        }
      }
    }

    expect(
      missing,
      `Tokens inexistentes caem para o valor inicial sem erro de build:\n  ${missing.join('\n  ')}`,
    ).toEqual([]);
  });
});
