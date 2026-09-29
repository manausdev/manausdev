import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ChipVariant = 'leaf' | 'river' | 'neutral' | 'success' | 'danger' | 'dark';

const base =
  'inline-flex items-center gap-1.5 font-medium rounded px-2.5 py-1 text-xs ' +
  'border whitespace-nowrap';

const variants: Record<ChipVariant, string> = {
  leaf: 'bg-accent-soft text-accent-text border-accent/25',
  river: 'bg-surface-2 text-ink border-border',
  neutral: 'bg-surface-1 text-muted border-border',
  success: 'bg-success-soft text-success-text border-success/30',
  danger: 'bg-danger-soft text-danger-text border-danger/30',
  dark: 'bg-deep text-on-dark border-transparent',
};

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { variant = 'river', className, ...props },
  ref,
) {
  return <span ref={ref} className={cn(base, variants[variant], className)} {...props} />;
});
