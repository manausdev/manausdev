import Link from 'next/link';
import { cn } from '@/lib/utils';
import styles from './StatCard.module.css';

export type StatTone = 'ink' | 'accent';

export interface StatCardProps {
  value: number | string;
  label: string;
  href?: string;
  tone?: StatTone;
  /** Sufixo exibido depois do numero. A home usava "+". */
  suffix?: string;
  className?: string;
}

const tones: Record<StatTone, string> = {
  ink: styles.toneInk,
  accent: styles.toneAccent,
};

/**
 * Celula da barra de metricas da home. O contraste entre `toneInk` e
 * `toneAccent` alterna por celula na marcacao original; aqui o tom e
 * explicito, mas ambos passam 4.5:1.
 */
export function StatCard({ value, label, href, tone = 'ink', suffix = '+', className }: StatCardProps) {
  const body = (
    <>
      <span className={cn(styles.value, tones[tone])}>
        {value}
        {suffix}
      </span>
      <span className={styles.label}>{label}</span>
    </>
  );

  const classes = cn(styles.base, href && styles.link, className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    );
  }

  return <div className={classes}>{body}</div>;
}