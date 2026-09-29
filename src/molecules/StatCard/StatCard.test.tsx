import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatCard } from './StatCard';

describe('StatCard', () => {
  it('mostra valor e rotulo', () => {
    render(<StatCard value={128} label="Devs Cadastrados" />);
    expect(screen.getByText(/128/)).toBeInTheDocument();
    expect(screen.getByText('Devs Cadastrados')).toBeInTheDocument();
  });

  it('aceita valor textual', () => {
    render(<StatCard value="1.2k" label="Projetos" />);
    expect(screen.getByText(/1\.2k/)).toBeInTheDocument();
  });

  it('nao vira link sem href', () => {
    render(<StatCard value={10} label="Vagas" />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('vira link quando recebe href', () => {
    render(<StatCard value={10} label="Vagas" href="/vagas" />);
    expect(screen.getByRole('link')).toHaveAttribute('href', '/vagas');
  });

  it('omite o sufixo quando suffix e string vazia', () => {
    render(<StatCard value={10} label="Vagas" suffix="" />);
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.queryByText('10+')).not.toBeInTheDocument();
  });

  it('aceita tom semantico em vez de classe arbitraria', () => {
    const { rerender } = render(<StatCard value={1} label="A" tone="ink" />);
    expect(screen.getByText(/1/).className).toContain('text-ink');

    rerender(<StatCard value={1} label="A" tone="accent" />);
    expect(screen.getByText(/1/).className).toContain('text-accent-text');
  });
});
