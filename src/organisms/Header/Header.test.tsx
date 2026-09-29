import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header';
import styles from './Header.module.css';

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

  it('usa a classe base do modulo', async () => {
    render(<Header />);
    expect(document.querySelector('header')).toHaveClass(styles.header);
    await waitFor(() => screen.getByRole('link', { name: 'Entrar' }));
  });
});