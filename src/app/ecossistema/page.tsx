import { MOCK_DEVS } from '@/domains/developers/mock-data';
import { MOCK_PROJECTS, MOCK_EVENTS, MOCK_COMPANIES, MOCK_COMMUNITIES, MOCK_JOBS } from '@/lib/data/mock';
import { useMockData } from '@/lib/env';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default function EcosystemPage() {
  const useMock = useMockData();

  if (!useMock) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Ecossistema</h1>
        <p className={styles.empty}>Dados indisponíveis em produção.</p>
      </div>
    );
  }

  const devs = MOCK_DEVS;
  const projects = MOCK_PROJECTS;
  const events = MOCK_EVENTS;
  const companies = MOCK_COMPANIES;
  const communities = MOCK_COMMUNITIES;
  const jobs = MOCK_JOBS;

  // Simple static layout for demo
  const nodes = [
    ...devs.map(d => ({ id: `dev-${d.id}`, label: d.full_name, type: 'person', x: 100 + (parseInt(d.id) * 120) % 800, y: 100 })),
    ...companies.map(c => ({ id: `co-${c.id}`, label: c.name, type: 'company', x: 100 + (parseInt(c.id) * 150) % 800, y: 250 })),
    ...projects.map(p => ({ id: `pr-${p.id}`, label: p.title, type: 'project', x: 100 + (parseInt(p.id) * 130) % 800, y: 400 })),
    ...events.map(e => ({ id: `ev-${e.id}`, label: e.title, type: 'event', x: 100 + (parseInt(e.id) * 140) % 800, y: 550 })),
  ];

  const edges = [
    ...projects.map(p => ({ from: `dev-${p.author_id}`, to: `pr-${p.id}`, label: 'mantém' })),
    ...events.map(e => ({ from: `dev-${e.organizer_id}`, to: `ev-${e.id}`, label: 'organiza' })),
    ...jobs.map(j => ({ from: `co-${j.company_name ? companies.find(c => c.name === j.company_name)?.id : '1' }`, to: `job-${j.id}`, label: 'posta' })),
  ].filter(e => e.from && e.to);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Grafo do Ecossistema</h1>
      <p className={styles.subtitle}>Conexões entre pessoas, empresas, projetos e eventos em Manaus.</p>

      <div className={styles.legend}>
        <span className={`${styles.legendItem} ${styles.person}`}>Pessoa</span>
        <span className={`${styles.legendItem} ${styles.company}`}>Empresa</span>
        <span className={`${styles.legendItem} ${styles.project}`}>Projeto</span>
        <span className={`${styles.legendItem} ${styles.event}`}>Evento</span>
      </div>

      <svg className={styles.svg} viewBox="0 0 1000 700">
        {/* Edges */}
        {edges.map((e, i) => {
          const fromNode = nodes.find(n => n.id === e.from);
          const toNode = nodes.find(n => n.id === e.to);
          if (!fromNode || !toNode) return null;
          return (
            <g key={i}>
              <line x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} className={styles.edge} />
              <text x={(fromNode.x + toNode.x) / 2} y={(fromNode.y + toNode.y) / 2} className={styles.edgeLabel}>{e.label}</text>
            </g>
          );
        })}
        {/* Nodes */}
        {nodes.map(n => (
          <g key={n.id} transform={`translate(${n.x},${n.y})`}>
            <circle r="30" className={`${styles.node} ${styles[n.type]}`} />
            <text y="45" textAnchor="middle" className={styles.nodeLabel}>{n.label}</text>
          </g>
        ))}
      </svg>

      <div className={styles.stats}>
        <div className={styles.stat}><strong>{devs.length}</strong> Pessoas</div>
        <div className={styles.stat}><strong>{companies.length}</strong> Empresas</div>
        <div className={styles.stat}><strong>{projects.length}</strong> Projetos</div>
        <div className={styles.stat}><strong>{events.length}</strong> Eventos</div>
        <div className={styles.stat}><strong>{communities.length}</strong> Comunidades</div>
        <div className={styles.stat}><strong>{jobs.length}</strong> Vagas</div>
      </div>
    </div>
  );
}
