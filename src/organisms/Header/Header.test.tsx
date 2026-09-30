import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header';
import styles from './Header.module.css';

const NAV_LINKS = [
  { href: '/devs', label: 'Desenvolvedores' },
  { href: '/projetos', label: 'Projetos' },
  { href: '/vagas', label: 'Vagas' },
  { href: '/comunidades', label: 'Comunidades' },
  { href: '/canais', label: 'Canais' },
  { href: '/noticias', label: 'Notícias' },
  { href: '/eventos', label: 'Eventos' },
  { href: '/empresas', label: 'Empresas' },
];

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getUser: async () => ({ data: { user: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
  }),
}));

describe('Header', () => {
  it('renderiza a marca e os links da navegacao', async () => {
    render(<Header />);
    const brand = document.querySelector(`.${styles.brand}`)!;
    expect(brand.textContent).toBe('</>ManausDevAMAZONAS • TECH');
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('href', '/projetos');
    expect(screen.getByRole('link', { name: 'Vagas' })).toHaveAttribute('href', '/vagas');
    expect(screen.getByRole('link', { name: 'Comunidades' })).toHaveAttribute('href', '/comunidades');
    await waitFor(() => screen.getByRole('link', { name: 'Entrar' }));
  });

  it(' expoe todas as rotas de navegacao, incluindo as novas', async () => {
    render(<Header />);

    for (const { href, label } of NAV_LINKS) {
      const link = screen.getAllByRole('link', { name: label })[0];
      expect(link, `link ${label} ausente`).toBeDefined();
      expect(link).toHaveAttribute('href', href);
    }

    await waitFor(() => screen.getByRole('link', { name: 'Entrar' }));
  });

  it('nao duplica hrefs de navegacao', async () => {
    render(<Header />);
    const hrefs = screen
      .getAllByRole('link')
      .map((el) => el.getAttribute('href'))
      .filter((href) => href !== null);

    for (const { href } of NAV_LINKS) {
      const count = hrefs.filter((h) => h === href).length;
      // Uma ocorrência desktop + uma no menu móvel. Mais que isso é bug de cópia.
      expect(count, `${href} apareceu ${count} vezes`).toBeLessThanOrEqual(2);
    }

    await waitFor(() => screen.getByRole('link', { name: 'Entrar' }));
  });

  it('usa a classe base do modulo', async () => {
    render(<Header />);
    expect(document.querySelector('header')).toHaveClass(styles.header);
    await waitFor(() => screen.getByRole('link', { name: 'Entrar' }));
  });
});