import NextLink from 'next/link';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './Link.module.css';

export type LinkVariant = 'default' | 'button' | 'buttonSecondary' | 'buttonLeaf' | 'nav' | 'footer';

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
  return <NextLink ref={ref} className={cn(styles.base, styles[variant], className)} {...props} />;
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
      className={cn(styles.base, styles.default, className)}
      {...props}
    >
      {children}
      <span className={styles.srOnly}> ({externalLabel})</span>
    </a>
  );
});
