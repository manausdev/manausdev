import styles from './AuthTemplate.module.css';

export interface AuthTemplateProps {
  /** Conteudo do badge no topo do cartao (ex. emoji em <span>). */
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * Estrutura das paginas de autenticacao (login, register): cartao
 * centralizado max-w-md com cabecalho de icone + titulo + subtitulo.
 */
export function AuthTemplate({ icon, title, subtitle, children }: AuthTemplateProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          {icon ? <div className={styles.iconBox}>{icon}</div> : null}
          <h1 className={styles.title}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </div>
  );
}