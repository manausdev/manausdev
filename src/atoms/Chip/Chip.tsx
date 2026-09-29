import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './Chip.module.css';

export type ChipVariant = 'leaf' | 'river' | 'neutral' | 'success' | 'danger' | 'dark';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: ChipVariant;
}

export const Chip = forwardRef<HTMLSpanElement, ChipProps>(function Chip(
  { variant = 'river', className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        styles.base,
        styles[variant],
        className,
      )}
      {...props}
    />
  );
});