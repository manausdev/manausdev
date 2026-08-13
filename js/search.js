import { api } from './api.js';

export function buildSearchIndex(entities) {
  const index = new Map();
  entities.forEach((entity) => {
    api.getAll(entity).then((list) => {
      list.forEach((item) => {
        const text = Object.values(item)
          .filter((v) => typeof v === 'string')
          .join(' ')
          .toLowerCase();
        index.set(`${entity}:${item.id}`, { entity, item, text });
      });
    });
  });
  return index;
}

export function searchIndex(index, query, options = {}) {
  const { limit = 10, offset = 0, fields } = options;
  const lower = query.toLowerCase();
  let results = [];

  for (const [key, value] of index) {
    if (value.text.includes(lower)) {
      results.push(value);
    }
  }

  if (fields) {
    results = results.filter((r) => fields.includes(r.entity));
  }

  return results.slice(offset, offset + limit);
}

export async function autocomplete(entity, query, limit = 5) {
  const results = await api.search(entity, query);
  return results.slice(0, limit).map((item) => ({
    id: item.id,
    label: item.title || item.name || item.description?.slice(0, 50) || '',
    entity,
  }));
}

export function filterByStatus(list, status) {
  return list.filter((item) => item.status === status);
}

export function sortBy(list, field, order = 'asc') {
  return [...list].sort((a, b) => {
    if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
    if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function filterByDateRange(list, field, start, end) {
  return list.filter((item) => {
    const date = new Date(item[field]);
    return date >= new Date(start) && date <= new Date(end);
  });
}

export function paginate(list, page = 1, pageSize = 10) {
  const start = (page - 1) * pageSize;
  return {
    data: list.slice(start, start + pageSize),
    total: list.length,
    page,
    pageSize,
    totalPages: Math.ceil(list.length / pageSize),
  };
}
