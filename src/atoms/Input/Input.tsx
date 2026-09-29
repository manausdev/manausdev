import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type InputSize = 'sm' | 'md' | 'lg';

const base =
  'w-full bg-surface text-ink border border-border rounded transition-all duration-180 ' +
  'placeholder:text-faint focus:outline-none focus:border-accent ' +
  'focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_15%,transparent)] ' +
  'disabled:opacity-50 disabled:cursor-not-allowed ' +
  'aria-[invalid=true]:border-danger aria-[invalid=true]:shadow-[0_0_0_3px_color-mix(in_oklab,var(--danger)_15%,transparent)]';

const sizes: Record<InputSize, string> = {
  sm: 'text-xs py-2 px-3',
  md: 'text-sm py-2.5 px-3.5',
  lg: 'text-base py-3.5 px-4',
};

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  /** Aplica o estilo de erro. Prefira `aria-invalid` para leitores de tela. */
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { size = 'md', invalid = false, className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      aria-invalid={invalid || undefined}
      className={cn(base, sizes[size], className)}
      {...props}
    />
  );
});
