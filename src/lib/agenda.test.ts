import { describe, expect, it } from 'vitest';
import { agendaDay, buildAgenda, eventToAgendaItem } from './agenda';
import type { EventItem, NewsItem } from '@/types/database';

const NOW = Date.parse('2026-09-30T23:59:59Z');

function event(overrides: Partial<EventItem>): EventItem {
  return {
    id: 'ev-1',
    title: 'Meetup',
    description: null,
    date: '2026-12-15',
    location: 'Manaus',
    type: 'Meetup',
    link: null,
    image_url: null,
    organizer_id: null,
    created_at: undefined,
    ...overrides,
  };
}

function news(overrides: Partial<NewsItem>): NewsItem {
  return {
    id: 'nw-1',
    title: 'Noticia',
    excerpt: 'resumo',
    content: null,
    image_url: null,
    category: 'geral',
    published: true,
    published_at: '2026-09-29T12:00:00Z',
    author_id: null,
    created_at: undefined,
    updated_at: undefined,
    ...overrides,
  };
}

describe('buildAgenda', () => {
  it('ordena por proximidade de hoje: noticia fresca ganha de evento distante', () => {
    const items = buildAgenda(
      [news({ id: 'n1', published_at: '2026-09-28T12:00:00Z' })],
      [event({ id: 'e1', date: '2026-12-15' })],
      () => 'Geral',
      6,
      NOW,
    );

    expect(items.map((i) => i.id)).toEqual(['n1', 'e1']);
  });

  it('evento iminente ganha de noticia velha', () => {
    const items = buildAgenda(
      [news({ id: 'n1', published_at: '2026-08-01T12:00:00Z' })],
      [event({ id: 'e1', date: '2026-10-02' })],
      () => 'Geral',
      6,
      NOW,
    );

    expect(items.map((i) => i.id)).toEqual(['e1', 'n1']);
  });

  it('empate de proximidade favorece o evento', () => {
    const items = buildAgenda(
      [news({ id: 'n1', published_at: '2026-09-29T23:59:59Z' })],
      [event({ id: 'e1', date: '2026-10-01' })],
      () => 'Geral',
      6,
      NOW,
    );

    expect(items[0].id).toBe('e1');
  });

  it('descarta noticia nao publicada', () => {
    const items = buildAgenda(
      [news({ id: 'n1', published: false, published_at: null, created_at: '2026-09-29T00:00:00Z' })],
      [],
      () => 'Geral',
      6,
      NOW,
    );

    expect(items).toEqual([]);
  });

  it('respeita o limite', () => {
    const items = buildAgenda(
      [
        news({ id: 'n1', published_at: '2026-09-29T12:00:00Z' }),
        news({ id: 'n2', published_at: '2026-09-20T12:00:00Z' }),
        news({ id: 'n3', published_at: '2026-09-10T12:00:00Z' }),
      ],
      [event({ id: 'e1', date: '2026-10-05' })],
      () => 'Geral',
      2,
      NOW,
    );

    expect(items).toHaveLength(2);
  });

  it('monta o item de evento com href, label e data em fim do dia UTC', () => {
    const item = eventToAgendaItem(event({ id: 'e9', date: '2026-10-05', type: 'Hackathon' }));

    expect(item.href).toBe('/eventos/e9');
    expect(item.kind).toBe('evento');
    expect(item.label).toBe('Hackathon');
    expect(item.date).toBe('2026-10-05T23:59:59Z');
  });
});

describe('agendaDay', () => {
  it('formata dia e mes curto', () => {
    expect(agendaDay('2026-10-05T23:59:59Z')).toBe('05 Out');
  });

  it('nao explode com data vazia', () => {
    expect(agendaDay('')).toBe('--');
  });
});

describe('timestamp do evento sem fuso', () => {
  it('trata date-only como UTC para nao voltar um dia', () => {
    const ts = Date.parse(`${eventToAgendaItem(event({ date: '2026-10-05' })).date}`);
    expect(new Date(ts).toISOString()).toBe('2026-10-05T23:59:59.000Z');
  });
});
