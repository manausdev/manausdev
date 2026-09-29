import NextLink from 'next/link';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type LinkVariant = 'default' | 'button' | 'buttonSecondary' | 'buttonLeaf' | 'nav' | 'footer';

const variants: Record<LinkVariant, string> = {
  default: 'text-accent-text hover:underline',
  button:
    'inline-flex items-center justify-center gap-2 rounded bg-accent text-on-accent font-semibold ' +
    'py-2.5 px-5 text-sm transition-all duration-180 shadow-[0_2px_8px_rgba(0,115,253,0.2)] ' +
    'hover:bg-accent-hover hover:-translate-y-px',
  buttonSecondary:
    'inline-flex items-center justify-center gap-2 rounded bg-transparent text-accent-text border border-accent ' +
    'font-semibold py-2.5 px-5 text-sm transition-all duration-180 hover:bg-accent-soft',
  buttonLeaf:
    'inline-flex items-center justify-center gap-2 rounded bg-neon text-on-neon font-semibold ' +
    'py-2.5 px-5 text-sm transition-all duration-180 shadow-[0_2px_8px_rgba(75,215,109,0.25)] ' +
    'hover:brightness-95 hover:-translate-y-px',
  nav: 'text-sm text-muted hover:text-ink transition-colors',
  footer: 'text-sm text-faint hover:text-accent-text transition-colors',
};

export interface LinkProps extends React.ComponentPropsWithoutRef<typeof NextLink> {
  variant?: LinkVariant;
}

/**
 * Link interno via `next/link`. Para destinos externos, use `ExternalLink`:
 * um `<a>` com `rel="noreferrer"` e indicacao visual de que sai da aplicacao.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { variant = 'default', className, ...props },
  ref,
) {
  return <NextLink ref={ref} className={cn('inline-flex', variants[variant], className)} {...props} />;
});

export interface ExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Rotulo do icone de saida, para leitores de tela. */
  externalLabel?: string;
}

export const ExternalLink = forwardRef<HTMLAnchorElement, ExternalLinkProps>(function ExternalLink(
  { href, externalLabel = 'abre em nova aba', className, children, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn('inline-flex items-center gap-1.5', variants.default, className)}
      {...props}
    >
      {children}
      <span className="sr-only"> ({externalLabel})</span>
    </a>
  );
});
