import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('expoe o placeholder como nome acessivel por padrao', () => {
    render(<SearchInput placeholder="Buscar devs..." />);
    expect(screen.getByRole('searchbox', { name: 'Buscar devs...' })).toBeInTheDocument();
  });

  it('usa o label quando informado', () => {
    render(<SearchInput label="Buscar por nome ou cargo" placeholder="Buscar..." />);
    expect(screen.getByRole('searchbox', { name: 'Buscar por nome ou cargo' })).toBeInTheDocument();
  });

  it('encaminha digitacao', async () => {
    const onChange = vi.fn();
    render(<SearchInput label="Busca" onChange={onChange} />);

    await userEvent.type(screen.getByRole('searchbox'), 'ana');

    expect(onChange).toHaveBeenCalled();
  });

  it('nao mostra o botao de limpar sem valor', () => {
    render(<SearchInput label="Busca" onClear={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Limpar busca' })).not.toBeInTheDocument();
  });

  it('nao mostra o botao de limpar sem onClear', () => {
    render(<SearchInput label="Busca" value="ana" />);
    expect(screen.queryByRole('button', { name: 'Limpar busca' })).not.toBeInTheDocument();
  });

  it('mostra o botao de limpar quando ha valor e handler', () => {
    render(<SearchInput label="Busca" value="ana" onClear={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Limpar busca' })).toBeInTheDocument();
  });

  it('dispara onClear', async () => {
    const onClear = vi.fn();
    render(<SearchInput label="Busca" value="ana" onClear={onClear} />);

    await userEvent.click(screen.getByRole('button', { name: 'Limpar busca' }));

    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('o botao de limpar nao submete o formulario', () => {
    const { container } = render(<SearchInput label="Busca" value="ana" onClear={vi.fn()} />);
    expect(container.querySelector('button')).toHaveAttribute('type', 'button');
  });

  it('e do tipo search, para exibir a tecla de limpar nativa', () => {
    render(<SearchInput label="Busca" />);
    expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search');
  });

  it('encaminha o ref', () => {
    let node: HTMLInputElement | null = null;
    render(<SearchInput label="Busca" ref={(el) => { node = el; }} />);
    expect(node).toBeInstanceOf(HTMLInputElement);
  });
});
