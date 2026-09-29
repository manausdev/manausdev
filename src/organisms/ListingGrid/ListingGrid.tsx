import { cn } from '@/lib/utils';
import styles from './ListingGrid.module.css';

export type ListingGridVariant = 'cards' | 'cardsWide' | 'duo';

export interface ListingGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * cards: 1/2(sm)/3(lg) - comunidades, empresas, projetos.
   * cardsWide: 1/2(md)/3(xl) - devs.
   * duo: 1/2(md) - eventos.
   */
  variant?: ListingGridVariant;
}

/**
 * Grid das paginas de listagem. Cada pagina repetia o par
 * `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6` inline; aqui os
 * breakpoints vivem num lugar so.
 */
export function ListingGrid({ variant = 'cards', className, ...props }: ListingGridProps) {
  return <div className={cn(styles.grid, styles[variant], className)} {...props} />;
}