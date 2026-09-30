import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PLATFORM_META } from './channels-meta';

const SRC = join(process.cwd(), 'src');

/**
 * `channels-meta` carrega `badgeClass` como string e o componente resolve em
 * `styles[meta.badgeClass]`. O CSS Module hasheia os nomes no build, entao uma
 * classe que exista no meta mas nao no CSS nao gera erro nenhum: o browser
 * descarta a regra e o badge fica sem a cor da plataforma. Foi o que aconteceu
 * com 'badgeDiscord' quando a pagina usava a string crua em vez de `styles[]`.
 *
 * Este teste amarra os dois lados: todo badgeClass precisa existir de fato no
 * CSS Module que consome a lista.
 */

const MODULES_CONSUNTORES = [
  join(SRC, 'app', 'comunidades', 'ChannelList.module.css'),
];

function classNames(css: string): Set<string> {
  const found = new Set<string>();
  for (const [, name] of css.matchAll(/\.([A-Za-z][A-Za-z0-9_-]*)/g)) {
    found.add(name);
  }
  return found;
}

describe('badgeClass existe nos CSS Modules consumidores', () => {
  for (const modulePath of MODULES_CONSUNTORES) {
    const file = modulePath.slice(SRC.length + 1);

    it(`${file} declara todas as classes de badge`, () => {
      const css = readFileSync(modulePath, 'utf8');
      const declared = classNames(css);

      const missing = PLATFORM_META.filter((meta) => !declared.has(meta.badgeClass)).map(
        (meta) => meta.badgeClass
      );

      expect(
        missing,
        `class(es) de badge ausente(s) em ${file} — a pagina resolve ` +
          `styles[meta.badgeClass], e a regra seria descartada em silencio:\n  ` +
          `${missing.join('\n  ')}`
      ).toEqual([]);
    });
  }

  it('as paginas que consomem channels-meta referenciam styles[badgeClass]', () => {
    const offenders: string[] = [];

    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        if (entry === 'node_modules' || entry === '.next') continue;
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) {
          walk(full);
        } else if (entry.endsWith('.tsx')) {
          const source = readFileSync(full, 'utf8');
          if (!source.includes('channels-meta')) continue;

          // Importar a lista sem resolver por styles[] foi exatamente o bug:
          // a string crua vira uma classe global que nao casa com nada.
          if (!/styles\[\s*meta\.badgeClass\s*\]/.test(source)) {
            offenders.push(full.slice(SRC.length + 1));
          }
        }
      }
    };

    walk(SRC);

    expect(
      offenders,
      `pagina(s) usando channels-meta sem styles[meta.badgeClass] — a classe ` +
        `raw seria descartada em silencio:\n  ${offenders.join('\n  ')}`
    ).toEqual([]);
  });
});
