import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'leaf' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-semibold rounded transition-all duration-180 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ' +
  'focus-visible:ring-offset-canvas disabled:pointer-events-none disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-accent text-on-accent shadow-[0_2px_8px_rgba(0,115,253,0.2)] hover:bg-accent-hover hover:-translate-y-px',
  secondary:
    'bg-transparent text-accent-text border border-accent hover:bg-accent-soft',
  leaf:
    'bg-neon text-on-neon shadow-[0_2px_8px_rgba(75,215,109,0.25)] hover:brightness-95 hover:-translate-y-px',
  ghost: 'bg-transparent text-accent-text hover:bg-accent-soft',
  danger: 'bg-danger text-white hover:brightness-95',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'text-xs py-2 px-3',
  md: 'text-sm py-2.5 px-5',
  lg: 'text-base py-3.5 px-6',
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', fullWidth = false, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    />
  );
});
