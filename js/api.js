import { getSeedData, initSeedData } from './seed.js';

const STORAGE_KEY = 'manausdev_db';
const DELAY = 50;

function loadData() {
  initSeedData();
  const seed = getSeedData();
  let stored = localStorage.getItem(STORAGE_KEY);
  
  if (!stored) {
    if (seed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
  } else {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.developers && parsed.developers.length > 5) {
        return parsed;
      }
    } catch {}
  }

  if (seed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  return { developers: [], projects: [], companies: [], events: [], communities: [], jobs: [] };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function delay() {
  return new Promise((resolve) => setTimeout(resolve, DELAY));
}

function generateId(entity) {
  const data = loadData();
  const list = data[entity] || [];
  return list.length > 0 ? Math.max(...list.map((i) => i.id)) + 1 : 1;
}

export const api = {
  async getAll(entity) {
    await delay();
    const data = loadData();
    return data[entity] || [];
  },

  async getById(entity, id) {
    await delay();
    const data = loadData();
    const list = data[entity] || [];
    return list.find((item) => item.id === Number(id)) || null;
  },

  async create(entity, payload) {
    await delay();
    const data = loadData();
    const list = data[entity] || [];
    const newItem = { ...payload, id: generateId(entity) };
    list.push(newItem);
    data[entity] = list;
    saveData(data);
    return newItem;
  },

  async update(entity, id, payload) {
    await delay();
    const data = loadData();
    const list = data[entity] || [];
    const index = list.findIndex((item) => item.id === Number(id));
    if (index === -1) throw new Error(`${entity} not found`);
    list[index] = { ...list[index], ...payload };
    data[entity] = list;
    saveData(data);
    return list[index];
  },

  async delete(entity, id) {
    await delay();
    const data = loadData();
    const list = data[entity] || [];
    const filtered = list.filter((item) => item.id !== Number(id));
    data[entity] = filtered;
    saveData(data);
    return { success: true };
  },

  async search(entity, query) {
    await delay();
    const data = loadData();
    const list = data[entity] || [];
    const lower = query.toLowerCase();
    return list.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lower),
      ),
    );
  },
};

export function initMockData() {
  loadData();
}
