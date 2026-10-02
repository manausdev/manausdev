import { availabilityMeta } from '@/domains/developers/model';
import { cn } from '@/lib/utils';
import styles from './AvailabilityChip.module.css';

export interface AvailabilityChipProps {
  value?: string | null;
  /** `sm` para cards na listagem, `md` para o perfil. */
  size?: 'sm' | 'md';
  className?: string;
  children?: React.ReactNode;
}

type Tone = 'open' | 'offers' | 'busy';

const chipTone: Record<Tone, string> = {
  open: styles.open,
  offers: styles.offers,
  busy: styles.busy,
};

const dotTone: Record<Tone, string> = {
  open: styles.dotOpen,
  offers: styles.dotOffers,
  busy: styles.dotBusy,
};

function toneFor(value?: string | null): Tone {
  return value === 'open' || value === 'offers' ? value : 'busy';
}

/**
 * Chip de disponibilidade tri-state (open / offers / busy).
 *
 * A marcacao original repetia a traducao do estado em tres lugares e o
 * fallback era `open`, entao um dev sem valor aparecia como "Aberto a
 * projetos". Aqui o fallback e `busy`, que e o estado conservador, e a
 * traducao do rotulo vem de `availabilityMeta`.
 */
export function AvailabilityChip({ value, size = 'sm', className, children }: AvailabilityChipProps) {
  const meta = availabilityMeta(value);
  const tone = toneFor(value);

  return (
    <span className={cn(styles.chip, chipTone[tone], size === 'md' && styles.md, className)}>
      <span className={cn(styles.dot, dotTone[tone])} />
      {children ?? meta.label}
    </span>
  );
}