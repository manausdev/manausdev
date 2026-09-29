import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AvailabilityChip } from './AvailabilityChip';
import styles from './AvailabilityChip.module.css';

describe('AvailabilityChip', () => {
  it('traduz open', () => {
    render(<AvailabilityChip value="open" />);
    expect(screen.getByText('Aberto a projetos')).toBeInTheDocument();
  });

  it('traduz offers', () => {
    render(<AvailabilityChip value="offers" />);
    expect(screen.getByText('Aberto a ofertas')).toBeInTheDocument();
  });

  it('traduz busy', () => {
    render(<AvailabilityChip value="busy" />);
    expect(screen.getByText('Ocupado')).toBeInTheDocument();
  });

  it('cai em busy quando o valor e nulo, em vez de assumir open', () => {
    render(<AvailabilityChip value={null} />);
    expect(screen.getByText('Ocupado')).toBeInTheDocument();
  });

  it('cai em busy para valor desconhecido vindo do banco', () => {
    render(<AvailabilityChip value="indisponivel" />);
    expect(screen.getByText('Ocupado')).toBeInTheDocument();
  });

  it('cai em busy sem valor', () => {
    render(<AvailabilityChip />);
    expect(screen.getByText('Ocupado')).toBeInTheDocument();
  });

  it('aceita sobrescrever o rotulo', () => {
    render(<AvailabilityChip value="open">Disponivel</AvailabilityChip>);
    expect(screen.getByText('Disponivel')).toBeInTheDocument();
  });

  it('aplica o tone de cada estado', () => {
    const { rerender, container } = render(<AvailabilityChip value="open" />);
    expect(container.firstElementChild!.className).toContain(styles.open);

    rerender(<AvailabilityChip value="offers" />);
    expect(container.firstElementChild!.className).toContain(styles.offers);

    rerender(<AvailabilityChip value="busy" />);
    expect(container.firstElementChild!.className).toContain(styles.busy);
  });

  it('busy nao usa texto de baixo contraste', () => {
    const { container } = render(<AvailabilityChip value="busy" />);
    expect(container.firstElementChild!.className).toContain(styles.busy);
  });
});