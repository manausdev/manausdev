import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';
import styles from './Footer.module.css';

describe('Footer', () => {
  it('renderiza as colunas de links', () => {
    render(<Footer />);
    expect(screen.getByText('Explorar')).toBeInTheDocument();
    expect(screen.getByText('Comunidade')).toBeInTheDocument();
    expect(screen.getByText('Transparência')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Projetos Tech & Bioeconomia' })).toHaveAttribute('href', '/projetos');
    expect(screen.getByRole('link', { name: 'Calendário de Eventos' })).toHaveAttribute('href', '/eventos');
  });

  it('usa a classe base do modulo', () => {
    render(<Footer />);
    expect(document.querySelector('footer')).toHaveClass(styles.footer);
  });
});