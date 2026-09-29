/**
 * Tipografia. As familias sao carregadas via `next/font/google` em
 * `src/app/layout.tsx` e expostas como `--font-sora`, `--font-inter` e
 * `--font-jetbrains-mono`. Aqui ficam os papéis e a escala de tamanho.
 */

export const fontFamily = {
  display: 'var(--font-display)',
  body: 'var(--font-body)',
  mono: 'var(--font-mono-theme)',
} as const;

export type FontFamilyToken = keyof typeof fontFamily;

/**
 * Tamanhos em rem. `lineHeight` e `letterSpacing` acompanham o que o design
 * usa hoje; o reset global de headings aplica `-0.015em` de letter-spacing.
 */
export const fontSize = {
  xs: { size: '0.75rem', lineHeight: '1rem' },
  sm: { size: '0.875rem', lineHeight: '1.25rem' },
  base: { size: '1rem', lineHeight: '1.5rem' },
  lg: { size: '1.125rem', lineHeight: '1.75rem' },
  xl: { size: '1.25rem', lineHeight: '1.75rem' },
  '2xl': { size: '1.5rem', lineHeight: '2rem' },
  '3xl': { size: '1.875rem', lineHeight: '2.25rem' },
  '4xl': { size: '2.25rem', lineHeight: '2.5rem' },
  '5xl': { size: '3rem', lineHeight: '1.1' },
} as const;

export type FontSizeToken = keyof typeof fontSize;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export type FontWeightToken = keyof typeof fontWeight;

/**
 * WCAG: texto normal exige 4.5:1, texto grande (>=24px, ou >=18.66px bold)
 * exige 3:1. Tokens que carregam texto devem respeitar este piso.
 */
export const contrast = {
  normalText: 4.5,
  largeText: 3,
  nonText: 3,
} as const;
