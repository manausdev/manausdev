import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import styles from './Button.module.css';

describe('Button', () => {
  it('renderiza com type="button" por padrao para nao submeter formulario inadvertidamente', () => {
    render(<Button>Salvar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('permite sobrescrever o type', () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('dispara onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Salvar</Button>);

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('nao dispara onClick quando desabilitado', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Salvar
      </Button>,
    );

    await userEvent.click(screen.getByRole('button'));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('expoe o estado disabled para tecnologia assistiva', () => {
    render(<Button disabled>Salvar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('encaminha o ref para o elemento button', () => {
    let node: HTMLButtonElement | null = null;
    render(<Button ref={(el) => { node = el; }}>Salvar</Button>);
    expect(node).toBeInstanceOf(HTMLButtonElement);
  });

  it('aplica as classes da variant e do size', () => {
    const { rerender } = render(<Button variant="leaf" size="lg">Ok</Button>);
    expect(screen.getByRole('button').className).toContain(styles.leaf);
    expect(screen.getByRole('button').className).toContain(styles.lg);

    rerender(<Button variant="secondary" size="sm">Ok</Button>);
    expect(screen.getByRole('button').className).toContain(styles.secondary);
    expect(screen.getByRole('button').className).toContain(styles.sm);
  });

  it('permite sobrescrever classes sem perder as do variant', () => {
    render(
      <Button variant="primary" className="custom-override">
        GitHub
      </Button>,
    );
    const className = screen.getByRole('button').className;
    expect(className).toContain(styles.primary);
    expect(className).toContain(styles.base);
    expect(className).toContain('custom-override');
  });
});
