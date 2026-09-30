import type { NewsCategory } from '@/types/database';

export const NEWS_CATEGORIES: { value: NewsCategory; label: string }[] = [
  { value: 'geral', label: 'Geral' },
  { value: 'evento', label: 'Eventos' },
  { value: 'vaga', label: 'Vagas' },
  { value: 'lancamento', label: 'Lançamentos' },
  { value: 'analise', label: 'Análises' },
];

const LABELS: Record<NewsCategory, string> = {
  geral: 'Geral',
  evento: 'Evento',
  vaga: 'Vaga',
  lancamento: 'Lançamento',
  analise: 'Análise',
};

export function categoryLabel(value?: string | null): string {
  return LABELS[value as NewsCategory] ?? LABELS.geral;
}

const DATE_FORMAT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(value?: string | null): string {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return DATE_FORMAT.format(parsed);
}
