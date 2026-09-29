import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renderiza com type="text" por padrao', () => {
    render(<Input aria-label="Nome" />);
    expect(screen.getByLabelText('Nome')).toHaveAttribute('type', 'text');
  });

  it('encaminha-digitacao', async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Nome" onChange={onChange} />);

    await userEvent.type(screen.getByLabelText('Nome'), 'Ana');

    expect(onChange).toHaveBeenCalled();
    expect(screen.getByLabelText('Nome')).toHaveValue('Ana');
  });

  it('nao aceita digitacao quando desabilitado', async () => {
    render(<Input aria-label="Nome" disabled />);
    await userEvent.type(screen.getByLabelText('Nome'), 'Ana');
    expect(screen.getByLabelText('Nome')).toHaveValue('');
  });

  it('marca aria-invalid quando invalid', () => {
    render(<Input aria-label="Nome" invalid />);
    expect(screen.getByLabelText('Nome')).toHaveAttribute('aria-invalid', 'true');
  });

  it('nao marca aria-invalid por padrao', () => {
    render(<Input aria-label="Nome" />);
    expect(screen.getByLabelText('Nome')).not.toHaveAttribute('aria-invalid');
  });

  it('respeita aria-describedby para mensagens de erro', () => {
    render(
      <>
        <Input aria-label="Nome" invalid aria-describedby="erro-nome" />
        <p id="erro-nome">Nome obrigatorio</p>
      </>,
    );
    expect(screen.getByLabelText('Nome')).toHaveAccessibleDescription('Nome obrigatorio');
  });

  it('encaminha o ref', () => {
    let node: HTMLInputElement | null = null;
    render(<Input aria-label="Nome" ref={(el) => { node = el; }} />);
    expect(node).toBeInstanceOf(HTMLInputElement);
  });

  it('aplica as classes do size', () => {
    const { rerender } = render(<Input aria-label="Nome" size="sm" />);
    expect(screen.getByLabelText('Nome').className).toContain('text-xs');

    rerender(<Input aria-label="Nome" size="lg" />);
    expect(screen.getByLabelText('Nome').className).toContain('text-base');
  });
});
