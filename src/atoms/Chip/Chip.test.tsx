import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Chip } from './Chip';
import styles from './Chip.module.css';

describe('Chip', () => {
  it('renderiza o conteudo', () => {
    render(<Chip>React</Chip>);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('usa variant river por padrao', () => {
    render(<Chip>React</Chip>);
    expect(screen.getByText('React').className).toContain(styles.river);
  });

  it('aplica a variant leaf', () => {
    render(<Chip variant="leaf">Next.js</Chip>);
    expect(screen.getByText('Next.js').className).toContain(styles.leaf);
  });

  it('permite sobrescrever classes preservando a variant', () => {
    render(
      <Chip variant="river" className="!text-[11px] font-mono font-semibold">
        TypeScript
      </Chip>,
    );
    const className = screen.getByText('TypeScript').className;
    expect(className).toContain(styles.river);
    expect(className).toContain('font-mono');
  });

  it('nao usa texto de baixo contraste no variant dark', () => {
    render(<Chip variant="dark">Lead</Chip>);
    const className = screen.getByText('Lead').className;
    expect(className).toContain(styles.dark);
    expect(className).not.toContain(styles.faint);
  });

  it('encaminha o ref', () => {
    let node: HTMLSpanElement | null = null;
    render(<Chip ref={(el) => { node = el; }}>React</Chip>);
    expect(node).toBeInstanceOf(HTMLSpanElement);
  });
});
