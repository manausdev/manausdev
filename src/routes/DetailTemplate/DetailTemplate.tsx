import styles from './DetailTemplate.module.css';

export interface DetailTemplateProps {
  /** Link "voltar" (ou breadcrumb) renderizado acima do cartao. */
  back?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Estrutura das paginas de detalhe ([id]): container max-w-7xl,
 * slot de voltar/breadcrumb e um cartao de conteudo.
 */
export function DetailTemplate({ back, children }: DetailTemplateProps) {
  return (
    <div className={styles.container}>
      {back}
      <div className={styles.card}>{children}</div>
    </div>
  );
}