import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

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
      className={cn(styles.base, styles[size], className)}
      {...props}
    >
      {src ? (
        // next/image nao e usado aqui: a fonte vem de avatar_url gravada pelo
        // usuario e o host varia, o que exigiria remotePatterns por perfil.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} loading="lazy" />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  );
});
