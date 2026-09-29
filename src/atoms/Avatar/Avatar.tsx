import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const sizes: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl',
};

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string | null;
  /** Usado no alt e no fallback quando nao ha imagem. */
  name: string;
  size?: AvatarSize;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, name, size = 'md', className, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-full overflow-hidden',
        'bg-deep text-on-dark font-display font-bold shrink-0',
        sizes[size],
        className,
      )}
      {...props}
    >
      {src ? (
        // next/image nao e usado aqui: a fonte vem de avatar_url gravada pelo
        // usuario e o host varia, o que exigiria remotePatterns por perfil.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  );
});
