export const AVAILABILITY_FILTERS = [
  { param: 'aberto', db: 'open', label: 'Aberto a projetos' },
  { param: 'ofertas', db: 'offers', label: 'Aberto a ofertas' },
  { param: 'ocupado', db: 'busy', label: 'Ocupado agora' },
] as const;

export interface AvailabilityMeta {
  label: string;
}

export const AVAILABILITY_META: Record<string, AvailabilityMeta> = {
  open: {
    label: 'Aberto a projetos',
  },
  offers: {
    label: 'Aberto a ofertas',
  },
  busy: {
    label: 'Ocupado',
  },
};

export function availabilityMeta(value?: string | null): AvailabilityMeta {
  return AVAILABILITY_META[value ?? ''] ?? AVAILABILITY_META.busy;
}

export const SENIORITY_LABELS: Record<string, string> = {
  junior: 'Júnior',
  pleno: 'Pleno',
  senior: 'Sênior',
  lead: 'Lead',
};

export function seniorityLabel(value?: string | null): string | null {
  if (!value) return null;
  return SENIORITY_LABELS[value] ?? value;
}

export const SORT_OPTIONS = [
  { value: 'recentes', label: 'Mais recentes' },
  { value: 'nome', label: 'Nome (A-Z)' },
  { value: 'antigos', label: 'Mais antigos' },
] as const;
