import type { EventItem, NewsItem } from '@/types/database';

export type AgendaKind = 'noticia' | 'evento';

export interface AgendaItem {
  id: string;
  kind: AgendaKind;
  title: string;
  href: string;
  date: string;
  label: string;
  meta: string;
  imageUrl?: string | null;
}

const MONTHS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function timestamp(iso: string): number {
  if (!iso) return 0;
  const parsed = Date.parse(iso.includes('T') ? iso : `${iso}T23:59:59Z`);
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function eventToAgendaItem(event: EventItem): AgendaItem {
  return {
    id: event.id,
    kind: 'evento',
    title: event.title,
    href: `/eventos/${event.id}`,
    date: `${event.date}T23:59:59Z`,
    label: event.type || 'Evento',
    meta: event.location,
    imageUrl: event.image_url,
  };
}

export function newsToAgendaItem(item: NewsItem, categoryName: string): AgendaItem {
  return {
    id: item.id,
    kind: 'noticia',
    title: item.title,
    href: `/noticias/${item.id}`,
    date: item.published_at || item.created_at || '',
    label: categoryName,
    meta: item.excerpt || '',
    imageUrl: item.image_url,
  };
}

/**
 * Intercala as duas fontes por proximidade de hoje: um evento que acontece
 * amanha e uma noticia de ontem empatam, porque ambos sao "agora". Um evento
 * daqui a tres meses perde para uma noticia de semana passada, que e a
 * hierarquia que a secao "o que esta acontecendo" precisa ter.
 * Empate vai para o evento: prazo concreto ganha de conteudo atemporal.
 */
export function buildAgenda(
  news: NewsItem[],
  events: EventItem[],
  categoryName: (item: NewsItem) => string,
  limit = 6,
  now: number = Date.now(),
): AgendaItem[] {
  const items = [
    ...news.filter((item) => item.published !== false).map((item) => newsToAgendaItem(item, categoryName(item))),
    ...events.map(eventToAgendaItem),
  ];

  return items
    .sort((a, b) => {
      const diff = Math.abs(timestamp(a.date) - now) - Math.abs(timestamp(b.date) - now);
      if (diff !== 0) return diff;
      return a.kind === b.kind ? 0 : a.kind === 'evento' ? -1 : 1;
    })
    .slice(0, limit);
}

export function agendaDay(iso: string): string {
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return '--';
  return `${day.slice(0, 2)} ${MONTHS[parseInt(month, 10) - 1] ?? ''}`;
}
