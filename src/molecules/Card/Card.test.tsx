import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renderiza o conteudo', () => {
    render(<Card>Conteudo</Card>);
    expect(screen.getByText('Conteudo')).toBeInTheDocument();
  });

  it('usa a variant default com elevation no hover', () => {
    render(<Card>Conteudo</Card>);
    const className = screen.getByText('Conteudo').className;
    expect(className).toContain('bg-surface');
    expect(className).toContain('shadow-card-ambient');
    expect(className).toContain('hover:shadow-card-hover');
  });

  it('nao translada quando interactive=false', () => {
    render(<Card interactive={false}>Conteudo</Card>);
    expect(screen.getByText('Conteudo').className).not.toContain('hover:-translate-y-0.5');
  });

  it('permite sobrescrever padding', () => {
    const { rerender } = render(<Card padding="sm">Conteudo</Card>);
    expect(screen.getByText('Conteudo').className).toContain('p-4');

    rerender(<Card padding="none">Conteudo</Card>);
    expect(screen.getByText('Conteudo').className).not.toContain('p-6');
  });

  it('a variant dark nao usa texto de baixo contraste', () => {
    render(<Card variant="dark">Conteudo</Card>);
    expect(screen.getByText('Conteudo').className).toContain('text-on-dark');
  });

  it('encaminha o ref', () => {
    let node: HTMLDivElement | null = null;
    render(<Card ref={(el) => { node = el; }}>Conteudo</Card>);
    expect(node).toBeInstanceOf(HTMLDivElement);
  });
});
