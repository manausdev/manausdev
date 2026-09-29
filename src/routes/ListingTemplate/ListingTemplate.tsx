import { cn } from '@/lib/utils';
import { ListingGrid, type ListingGridVariant } from '@/organisms/ListingGrid/ListingGrid';
import styles from './ListingTemplate.module.css';

export interface ListingTemplateProps {
  badge?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Bloco de filtros (busca, chips) renderizado acima do grid. */
  filters?: React.ReactNode;
  gridVariant?: ListingGridVariant;
  loading?: boolean;
  /** Numero de skeletons exibidos durante o loading. */
  loadingCount?: number;
  /** Mensagem ou bloco exibido quando a listagem esta vazia. */
  empty?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Estrutura comum das paginas de listagem (devs, projetos, vagas,
 * empresas, eventos, comunidades): container max-w-7xl, hero com
 * badge + titulo + subtitulo, slot de filtros e grid de cards.
 */
export function ListingTemplate({
  badge,
  title,
  subtitle,
  filters,
  gridVariant = 'cards',
  loading = false,
  loadingCount = 6,
  empty,
  children,
}: ListingTemplateProps) {
  const isEmpty = !loading && (empty != null || children == null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {badge ? <span className={styles.badge}>{badge}</span> : null}
        <h1 className={styles.title}>{title}</h1>
        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
      </div>

      {filters ? <div className={styles.filters}>{filters}</div> : null}

      {loading ? (
        <ListingGrid variant={gridVariant}>
          {Array.from({ length: loadingCount }, (_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </ListingGrid>
      ) : isEmpty ? (
        <div className={styles.empty}>{empty ?? 'Nenhum resultado encontrado.'}</div>
      ) : (
        <ListingGrid variant={gridVariant}>{children}</ListingGrid>
      )}
    </div>
  );
}