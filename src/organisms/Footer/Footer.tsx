import Link from 'next/link';
import styles from './Footer.module.css';

const COLUMNS: Array<{ title: string; links: Array<{ href: string; label: string; external?: boolean }> }> = [
  {
    title: 'Explorar',
    links: [
      { href: '/devs', label: 'Desenvolvedores' },
      { href: '/projetos', label: 'Projetos Tech & Bioeconomia' },
      { href: '/vagas', label: 'Oportunidades & Vagas' },
      { href: '/empresas', label: 'Empresas & Polos' },
    ],
  },
  {
    title: 'Comunidade',
    links: [
      { href: '/comunidades', label: 'Grupos & Meetups' },
      { href: '/eventos', label: 'Calendário de Eventos' },
      { href: '/sobre', label: 'Sobre a Iniciativa' },
      { href: '/contato', label: 'Fale Conosco' },
    ],
  },
  {
    title: 'Transparência',
    links: [
      { href: '/termos', label: 'Termos de Uso' },
      { href: '/privacidade', label: 'Privacidade (LGPD)' },
      { href: 'https://github.com/manausdev', label: 'GitHub ManausDev', external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.about}>
            <div className={styles.brandRow}>
              <span className={styles.logo}>{'</>'}</span>
              <span className={styles.brandName}>
                Manaus<span className={styles.brandAccent}>Dev</span>
              </span>
            </div>
            <p className={styles.aboutText}>
              O ecossistema que conecta desenvolvedores, comunidades, empresas e projetos
              tecnológicos sustentáveis no Amazonas.
            </p>
            <div className={styles.badge}>
              <span>🍃</span> Feito em Manaus • 100% Regional
            </div>
          </div>

          {COLUMNS.map(({ title, links }) => (
            <div key={title} className={styles.col}>
              <h4 className={styles.colTitle}>{title}</h4>
              <ul className={styles.list}>
                {links.map(({ href, label, external }) => (
                  <li key={href}>
                    {external ? (
                      <a href={href} target="_blank" rel="noreferrer" className={styles.link}>
                        {label}
                      </a>
                    ) : (
                      <Link href={href} className={styles.link}>
                        {label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} ManausDev Community. Licença Apache-2.0.</p>
          <p className={styles.stackNote}>Next.js • Supabase • Green-Tech Design System 🌿</p>
        </div>
      </div>
    </footer>
  );
}