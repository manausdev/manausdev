import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListingTemplate } from './ListingTemplate';
import styles from './ListingTemplate.module.css';

describe('ListingTemplate', () => {
  it('renderiza hero com badge, titulo e subtitulo', () => {
    render(
      <ListingTemplate
        badge="Inovacao"
        title={<>Projetos no <span className={styles.accent}>Amazonas</span></>}
        subtitle="Aplicacoes construidas na regiao."
      >
        <div>card</div>
      </ListingTemplate>
    );
    expect(screen.getByText('Inovacao')).toHaveClass(styles.badge);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Projetos no Amazonas');
    expect(screen.getByText('Aplicacoes construidas na regiao.')).toHaveClass(styles.subtitle);
  });

  it('renderiza filtros e children no grid', () => {
    render(
      <ListingTemplate title="Devs" filters={<div data-testid="filtros" />}>
        <div data-testid="card" />
      </ListingTemplate>
    );
    expect(screen.getByTestId('filtros')).toBeInTheDocument();
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });

  it('exibe skeletons durante loading', () => {
    render(<ListingTemplate title="Devs" loading loadingCount={3} />);
    const skeletons = document.querySelectorAll('.' + styles.skeleton);
    expect(skeletons).toHaveLength(3);
  });

  it('exibe estado vazio quando nao ha children', () => {
    render(<ListingTemplate title="Devs" empty="Nada por aqui." />);
    expect(screen.getByText('Nada por aqui.')).toHaveClass(styles.empty);
  });
});