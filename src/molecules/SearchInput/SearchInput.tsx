'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/atoms/Icon';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Rótulo acessível. O placeholder não substitui um label. */
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  onClear?: () => void;
}

const sizes = {
  sm: 'text-xs py-2 pl-9 text-sm',
  md: 'text-sm py-2.5 pl-10',
  lg: 'text-base py-3.5 pl-11',
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
    <div className="relative w-full">
      <Icon
        size={iconSize}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-faint pointer-events-none"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </Icon>

      <input
        ref={ref}
        type="search"
        value={value}
        placeholder={placeholder}
        aria-label={label ?? placeholder}
        className={cn(
          'w-full bg-surface text-ink border border-border rounded transition-all duration-180 pr-9',
          'placeholder:text-faint focus:outline-none focus:border-accent',
          'focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_15%,transparent)]',
          '[&::-webkit-search-cancel-button]:appearance-none',
          sizes[size],
          className,
        )}
        {...props}
      />

      {showClear ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Limpar busca"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-faint hover:text-ink transition-colors"
        >
          <Icon size="sm">
            <path d="M18 6 6 18M6 6l12 12" />
          </Icon>
        </button>
      ) : null}
    </div>
  );
});
