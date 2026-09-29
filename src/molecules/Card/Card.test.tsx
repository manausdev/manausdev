import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';
import styles from './Card.module.css';

describe('Card', () => {
  it('renderiza o conteudo', () => {
    render(<Card>Conteudo</Card>);
    expect(screen.getByText('Conteudo')).toBeInTheDocument();
  });

  it('usa a variant default com elevation no hover', () => {
    render(<Card>Conteudo</Card>);
    const className = screen.getByText('Conteudo').className;
    expect(className).toContain(styles.default);
    expect(className).toContain(styles.interactive);
  });

  it('nao translada quando interactive=false', () => {
    render(<Card interactive={false}>Conteudo</Card>);
    expect(screen.getByText('Conteudo').className).not.toContain(styles.interactive);
  });

  it('permite sobrescrever padding', () => {
    const { rerender } = render(<Card padding="sm">Conteudo</Card>);
    expect(screen.getByText('Conteudo').className).toContain(styles.sm);

    rerender(<Card padding="none">Conteudo</Card>);
    expect(screen.getByText('Conteudo').className).not.toContain(styles.md);
  });

  it('a variant dark nao usa texto de baixo contraste', () => {
    render(<Card variant="dark">Conteudo</Card>);
    expect(screen.getByText('Conteudo').className).toContain(styles.dark);
  });

  it('encaminha o ref', () => {
    let node: HTMLDivElement | null = null;
    render(<Card ref={(el) => { node = el; }}>Conteudo</Card>);
    expect(node).toBeInstanceOf(HTMLDivElement);
  });
});