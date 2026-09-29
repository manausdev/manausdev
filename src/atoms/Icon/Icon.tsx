import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  /**
   * Rotulo acessivel. Quando omitido, o icone e marcado como decorativo
   * (`aria-hidden`), que e o padrao correto para icone ao lado de texto.
   */
  title?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
} as const;

/**
 * Base para icones SVG do design system. Garante as dimensoes, `currentColor`
 * e o comportamento de acessibilidade, para que o componente concreto so
 * precise fornecer o `path`.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { title, size = 'md', className, children, ...props },
  ref,
) {
  const decorative = title === undefined;

  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(sizes[size], 'shrink-0', className)}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
});
