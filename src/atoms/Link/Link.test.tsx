import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ExternalLink, Link } from './Link';

describe('Link', () => {
  it('navega para rota interna', () => {
    render(<Link href="/devs">Ver devs</Link>);
    expect(screen.getByRole('link', { name: 'Ver devs' })).toHaveAttribute('href', '/devs');
  });

  it('aplica as classes da variant', () => {
    render(
      <Link href="/devs" variant="button">
        Ver devs
      </Link>,
    );
    expect(screen.getByRole('link').className).toContain('bg-accent');
  });

  it('permite sobrescrever classes preservando a variant', () => {
    render(
      <Link href="/devs" variant="button" className="!py-2.5 !px-4 text-xs">
        GitHub
      </Link>,
    );
    const className = screen.getByRole('link').className;
    expect(className).toContain('bg-accent');
    expect(className).toContain('text-xs');
  });
});

describe('ExternalLink', () => {
  it('abre em nova aba com rel seguro', () => {
    render(<ExternalLink href="https://github.com">GitHub</ExternalLink>);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('anuncia a saida da aplicacao para leitores de tela', () => {
    render(<ExternalLink href="https://exemplo.dev">Portfolio</ExternalLink>);
    expect(screen.getByRole('link', { name: /abre em nova aba/ })).toBeInTheDocument();
  });

  it('permite customizar o rotulo acessivel', () => {
    render(
      <ExternalLink href="https://linkedin.com" externalLabel="LinkedIn, nova aba">
        Perfil
      </ExternalLink>,
    );
    expect(screen.getByRole('link', { name: /LinkedIn, nova aba/ })).toBeInTheDocument();
  });
});
