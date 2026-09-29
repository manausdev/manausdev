'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/atoms/Icon';
import styles from './SearchInput.module.css';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Rotulo acessivel. O placeholder nao substitui um label. */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  onClear?: () => void;
}

const sizes = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
} as const;

/**
 * Campo de busca com icone e acao de limpar. Extraido do filtro de `/devs`,
 * que repetia o posicionamento absoluto do icone e o `pl-10` a cada uso.
 *
 * Sem `label` o campo vira decorativo para leitor de tela via `aria-label` do
 * placeholder; passe `label` sempre que puder.
 */
export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { label, size = 'md', onClear, className, value, placeholder = 'Buscar...', ...props },
  ref,
) {
  const showClear = Boolean(value) && Boolean(onClear);
  const iconSize = size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md';

  return (
    <div className={styles.wrapper}>
      <Icon size={iconSize} className={styles.icon}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </Icon>

      <input
        ref={ref}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className={cn(styles.input, sizes[size], className)}
        {...props}
      />

      {showClear ? (
        <button type="button" onClick={onClear} aria-label="Limpar busca" className={styles.clear}>
          <Icon size="sm">
            <path d="M18 6 6 18M6 6l12 12" />
          </Icon>
        </button>
      ) : null}
    </div>
  );
});