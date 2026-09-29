import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DetailTemplate } from './DetailTemplate';
import styles from './DetailTemplate.module.css';

describe('DetailTemplate', () => {
  it('renderiza slot de voltar e cartao de conteudo', () => {
    render(
      <DetailTemplate back={<a href="/vagas">Voltar</a>}>
        <h1>Titulo da vaga</h1>
      </DetailTemplate>
    );
    expect(screen.getByText('Voltar')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Titulo da vaga' }).parentElement).toHaveClass(styles.card);
  });
});