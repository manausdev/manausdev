/**
 * Fonte unica da URL canônica do site. `NEXT_PUBLIC_SITE_URL` e o que o Vercel
 * injeta por ambiente; os fallbacks cobrem o build local e o caso de variavel
 * faltando em producao, que antes fazia o metadataBase apontar para
 * `manausdev.vercel.app` em vez do dominio real.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === 'production' ? 'https://manausdev.com.br' : 'http://localhost:3000')
).replace(/\/$/, '');

export function siteUrl(path = '/'): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
