import styles from './TextTemplate.module.css';

export interface TextTemplateProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Estrutura das paginas de texto (privacidade, termos): container
 * max-w-4xl, titulo display e um cartao de conteudo em prosa.
 */
export function TextTemplate({ title, children }: TextTemplateProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.card}>{children}</div>
    </div>
  );
}