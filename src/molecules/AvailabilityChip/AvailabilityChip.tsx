import { availabilityMeta } from '@/lib/devs-meta';
import { cn } from '@/lib/utils';

export interface AvailabilityChipProps {
  value?: string | null;
  /** `sm` para cards na listagem, `md` para o perfil. */
  size?: 'sm' | 'md';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Chip de disponibilidade tri-state (open / offers / busy).
 *
 * A marcacao original repetia a traducao do estado em tres lugares e o
 * fallback era `open`, entao um dev sem valor aparecia como "Aberto a
 * projetos". Aqui o fallback e `busy`, que e o estado conservador, e a
 * traducao vem de `availabilityMeta`.
 */
export function AvailabilityChip({ value, size = 'sm', className, children }: AvailabilityChipProps) {
  const meta = availabilityMeta(value);

  return (
    <span
      className={cn(
        meta.className,
        size === 'md' && '!text-xs',
        className,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', meta.dot)} />
      {children ?? meta.label}
    </span>
  );
}
