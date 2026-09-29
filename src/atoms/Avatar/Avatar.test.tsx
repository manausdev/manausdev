import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Avatar } from './Avatar';
import styles from './Avatar.module.css';

describe('Avatar', () => {
  it('mostra as iniciais quando nao ha imagem', () => {
    render(<Avatar name="Ana Silva" />);
    expect(screen.getByText('AS')).toBeInTheDocument();
  });

  it('usa somente a primeira letra para nome unico', () => {
    render(<Avatar name="ana" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('lida com espacos extras', () => {
    render(<Avatar name="  Joana   Doe  " />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('nao quebra com nome vazio', () => {
    render(<Avatar name="   " />);
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('usa a imagem com alt do nome quando ha src', () => {
    render(<Avatar name="Ana Silva" src="https://exemplo.dev/ana.png" />);
    const img = screen.getByRole('img', { name: 'Ana Silva' });
    expect(img).toHaveAttribute('src', 'https://exemplo.dev/ana.png');
  });

  it('esconde as iniciais da acessibilidade', () => {
    const { container } = render(<Avatar name="Ana Silva" />);
    expect(container.querySelector('span[aria-hidden="true"]')).toBeInTheDocument();
  });

  it('aplica as dimensoes do size', () => {
    const { container, rerender } = render(<Avatar name="Ana" size="sm" />);
    expect(container.firstElementChild!.className).toContain(styles.sm);

    rerender(<Avatar name="Ana" size="xl" />);
    expect(container.firstElementChild!.className).toContain(styles.xl);
  });
});
