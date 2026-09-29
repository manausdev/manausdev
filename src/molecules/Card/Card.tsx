import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type CardVariant = 'default' | 'glass' | 'dark' | 'flush';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

const variants: Record<CardVariant, string> = {
  // Equivale a antiga .manaus-card
  default:
    'bg-surface border border-border shadow-card-ambient hover:shadow-card-hover hover:border-border-strong',
  glass: 'glass-card',
  dark: 'bg-deep border border-border-strong/20 text-on-dark',
  flush: 'bg-surface border border-border',
};

const paddings: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-6 sm:p-10',
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  /** Desliga o elevation no hover, para cards dentro de link. */
  interactive?: boolean;
}

/**
 * Superficie base do sistema. Substitui a classe global `.manaus-card`, que
 * repetia `background`, `border`, `radius` e dois shadows em 51 call sites.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'default', padding = 'md', interactive = true, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-xl transition-all duration-250',
        variants[variant],
        paddings[padding],
        interactive && variant === 'default' && 'hover:-translate-y-0.5',
        className,
      )}
      {...props}
    />
  );
});
