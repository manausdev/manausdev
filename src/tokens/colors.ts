/**
 * Tokens de cor do ManausDev.
 *
 * A fonte de verdade continua sendo `src/app/globals.css` (custom properties).
 * Aqui ficam os nomes semanticos e os valores resolvidos por tema, para que
 * Storybook, testes e documentacao possam referenciar as cores sem duplicar a
 * definicao — e para que uma mudanca no CSS sejaavel nos tokens.
 *
 * Nao altere os valores hex sem alterar `:root` e `.dark` em globals.css.
 */

export type ThemeName = 'light' | 'dark';

export const colorVar = {
  canvas: 'var(--canvas)',
  surface: 'var(--surface)',
  surface1: 'var(--surface-1)',
  surface2: 'var(--surface-2)',
  surface3: 'var(--surface-3)',
  border: 'var(--border)',
  borderStrong: 'var(--border-strong)',

  ink: 'var(--ink)',
  body: 'var(--body)',
  muted: 'var(--muted)',
  faint: 'var(--faint)',

  accent: 'var(--accent)',
  accentHover: 'var(--accent-hover)',
  accentText: 'var(--accent-text)',
  accentSoft: 'var(--accent-soft)',
  onAccent: 'var(--on-accent)',

  brandBlue: 'var(--brand-blue)',
  cyan: 'var(--cyan)',
  neon: 'var(--neon)',
  neonText: 'var(--neon-text)',
  onNeon: 'var(--on-neon)',

  deep: 'var(--deep)',
  deep2: 'var(--deep-2)',

  success: 'var(--success)',
  successText: 'var(--success-text)',
  successSoft: 'var(--success-soft)',
  danger: 'var(--danger)',
  dangerText: 'var(--danger-text)',
  dangerSoft: 'var(--danger-soft)',
  onDark: 'var(--on-dark)',
} as const;

export type ColorToken = keyof typeof colorVar;

export const palette: Record<ThemeName, Record<ColorToken, string>> = {
  light: {
    canvas: '#ffffff',
    surface: '#ffffff',
    surface1: '#f5f8fc',
    surface2: '#ebf1f9',
    surface3: '#dde5ef',
    border: '#e3e9f1',
    borderStrong: '#c6d2e0',

    ink: '#191918',
    body: '#3c4249',
    muted: '#556070',
    faint: '#5f6d7d',

    accent: '#0068e8',
    accentHover: '#0057c7',
    accentText: '#0057c7',
    accentSoft: '#e6f0ff',
    onAccent: '#ffffff',

    brandBlue: '#009bfd',
    cyan: '#02b8b5',
    neon: '#4bd76d',
    neonText: '#1a7a3c',
    onNeon: '#06280f',

    deep: '#0c2233',
    deep2: '#071624',

    success: '#16794a',
    successText: '#0f5c37',
    successSoft: '#e9f9ee',
    danger: '#d92d20',
    dangerText: '#b42318',
    dangerSoft: '#fef1f0',
    onDark: '#ffffff',
  },
  dark: {
    canvas: '#0a0d12',
    surface: '#12161a',
    surface1: '#191e24',
    surface2: '#212831',
    surface3: '#2b333d',
    border: '#262e37',
    borderStrong: '#39434e',

    ink: '#f2f5f8',
    body: '#c2cad3',
    muted: '#939da8',
    faint: '#95a0ad',

    accent: '#0a6bde',
    accentHover: '#0c82f5',
    accentText: '#74b7ff',
    accentSoft: 'rgba(0, 115, 253, 0.16)',
    onAccent: '#ffffff',

    brandBlue: '#009bfd',
    cyan: '#2ed6d2',
    neon: '#4bd76d',
    neonText: '#6ee79a',
    onNeon: '#06280f',

    deep: '#0e2839',
    deep2: '#081a27',

    success: '#4bd76d',
    successText: '#6ee79a',
    successSoft: 'rgba(75, 215, 109, 0.14)',
    danger: '#ff7a70',
    dangerText: '#ff9b93',
    dangerSoft: 'rgba(255, 122, 112, 0.14)',
    onDark: '#ffffff',
  },
};

/**
 * Ramos que o auditor de contraste do browser-mcp-lite nao deve considerar.
 * `neon` e `cyan` sao destaques vivos para surfaces escuras; como texto sobre
 * claro existe `--neon-text`.
 */
export const nonTextAccents: ColorToken[] = ['neon', 'cyan', 'brandBlue', 'accent'];
