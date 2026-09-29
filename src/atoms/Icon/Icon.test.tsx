import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Icon } from './Icon';

describe('Icon', () => {
  it('e decorativo por padrao', () => {
    const { container } = render(
      <Icon data-testid="ico">
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );
    const svg = container.querySelector('svg')!;
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('role');
  });

  it('ganha papel de imagem e titulo quando recebe title', () => {
    render(
      <Icon title="Localizado em Manaus">
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );
    expect(screen.getByRole('img', { name: 'Localizado em Manaus' })).toBeInTheDocument();
  });

  it('nao marca aria-hidden quando tem title', () => {
    const { container } = render(
      <Icon title="GitHub">
        <path d="M0 0h24v24H0z" />
      </Icon>,
    );
    expect(container.querySelector('svg')).not.toHaveAttribute('aria-hidden');
  });

  it('aplica as dimensoes do size', () => {
    const { rerender, container } = render(<Icon data-testid="ico" size="sm" />);
    expect(container.querySelector('svg')!.className.baseVal).toContain('w-4');

    rerender(<Icon data-testid="ico" size="lg" />);
    expect(container.querySelector('svg')!.className.baseVal).toContain('w-6');
  });

  it('usa currentColor para herdar a cor do texto', () => {
    const { container } = render(<Icon />);
    expect(container.querySelector('svg')).toHaveAttribute('stroke', 'currentColor');
  });

  it('nao entra na ordem de tabulacao', () => {
    const { container } = render(<Icon />);
    expect(container.querySelector('svg')).toHaveAttribute('focusable', 'false');
  });
});
