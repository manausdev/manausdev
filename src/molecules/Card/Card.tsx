import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './Card.module.css';

export type CardVariant = 'default' | 'glass' | 'dark' | 'flush';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: CardPadding;
  /** Desliga a elevacao no hover, para cards dentro de link. */
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
        styles.card,
        styles[variant],
        padding !== 'none' && styles[padding],
        interactive && variant === 'default' && styles.interactive,
        className,
      )}
      {...props}
    />
  );
});