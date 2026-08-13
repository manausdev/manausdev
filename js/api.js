const STORAGE_KEY = 'manausdev_db';
const DELAY = 300;

const mockData = {
  users: [
    { id: 1, name: 'Ana Silva', email: 'ana@example.com', role: 'developer', avatar: 'https://i.pravatar.cc/150?u=1' },
    { id: 2, name: 'Bruno Costa', email: 'bruno@example.com', role: 'company', avatar: 'https://i.pravatar.cc/150?u=2' },
  ],
  developers: [
    { id: 1, name: 'Ana Silva', skills: ['JavaScript', 'React', 'Node.js'], location: 'Manaus-AM', available: true },
    { id: 2, name: 'Carlos Lima', skills: ['Python', 'Django', 'AWS'], location: 'Manaus-AM', available: false },
  ],
  projects: [
    { id: 1, title: 'E-commerce Local', description: 'Plataforma para pequenos negócios', status: 'active', userId: 1 },
    { id: 2, title: 'App de Turismo', description: 'Guia turístico de Manaus', status: 'planning', userId: 2 },
  ],
  companies: [
    { id: 1, name: 'TechNorte', industry: 'Software', location: 'Manaus-AM', size: '50-200' },
    { id: 2, name: 'Amazônia Digital', industry: 'E-commerce', location: 'Manaus-AM', size: '10-50' },
  ],
  jobs: [
    { id: 1, title: 'Frontend Developer', companyId: 1, type: 'CLT', remote: false, salary: 'R$ 4.000 - R$ 6.000' },
    { id: 2, title: 'Backend Developer', companyId: 2, type: 'PJ', remote: true, salary: 'R$ 5.000 - R$ 8.000' },
  ],
  teams: [
    { id: 1, name: 'Amazônia Devs', description: 'Comunidade de devs da região', members: [1, 2], projectId: 1 },
    { id: 2, name: 'TechNorte Squad', description: 'Time de desenvolvimento interno', members: [2], projectId: null },
  ],
  events: [
    { id: 1, title: 'Meetup React Manaus', date: '2026-09-15', location: 'Manaus-AM', type: 'meetup' },
    { id: 2, title: 'Hackathon Amazônia', date: '2026-10-01', location: 'Manaus-AM', type: 'hackathon' },
  ],
  communities: [
    { id: 1, name: 'Manaus Tech', description: 'Comunidade de tecnologia de Manaus', members: 1200, type: 'tech' },
    { id: 2, name: 'Devs do Norte', description: 'Rede de desenvolvedores da região Norte', members: 850, type: 'tech' },
  ],
  articles: [
    { id: 1, title: 'O ecossistema tech de Manaus', content: 'Manaus tem crescido no cenário tech...', authorId: 1, publishedAt: '2026-08-01' },
    { id: 2, title: 'Dicas para devs iniciantes', content: 'Começar na programação pode ser desafiador...', authorId: 2, publishedAt: '2026-08-05' },
  ],
};

function loadData() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    return JSON.parse(JSON.stringify(mockData));
  }
  return JSON.parse(stored);
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
