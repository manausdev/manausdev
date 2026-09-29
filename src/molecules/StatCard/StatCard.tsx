import Link from 'next/link';
import { cn } from '@/lib/utils';

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
  ink: 'text-ink',
  accent: 'text-accent-text',
};

/**
 * Celula da barra de metricas da home. O contraste entre `text-ink` e
 * `text-accent-text` alterna por celula na marcacao original; aqui o tom e
 * explicito, mas ambos passam 4.5:1.
 */
export function StatCard({ value, label, href, tone = 'ink', suffix = '+', className }: StatCardProps) {
  const body = (
    <>
      <span className={cn('font-display font-bold text-3xl sm:text-4xl', tones[tone])}>
        {value}
        {suffix}
      </span>
      <span className="text-xs font-semibold text-muted uppercase tracking-wider mt-1">{label}</span>
    </>
  );

  const classes = cn(
    'flex flex-col items-center justify-center text-center px-4 py-2',
    href && 'hover:opacity-80 transition-opacity',
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {body}
      </Link>
    );
  }

  return <div className={classes}>{body}</div>;
}
