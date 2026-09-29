import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextTemplate } from './TextTemplate';
import styles from './TextTemplate.module.css';

describe('TextTemplate', () => {
  it('renderiza titulo e cartao de conteudo', () => {
    render(
      <TextTemplate title="Politica de Privacidade">
        <p>Conteudo da pagina.</p>
      </TextTemplate>
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Politica de Privacidade' })).toHaveClass(styles.title);
    expect(screen.getByText('Conteudo da pagina.').parentElement).toHaveClass(styles.card);
  });
});