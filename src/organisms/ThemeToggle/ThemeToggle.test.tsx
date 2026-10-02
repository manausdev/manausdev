import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ThemeToggle, themeInitScript } from './ThemeToggle';
import styles from './ThemeToggle.module.css';

describe('ThemeToggle', () => {
  it('renderiza como botao com a classe do modulo', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveClass(styles.button);
  });

  it('alterna a classe dark no documentElement', () => {
    document.documentElement.classList.remove('dark');
    render(<ThemeToggle />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    fireEvent.click(btn);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('themeInitScript suporta parâmetro de URL para auditoria', () => {
    expect(themeInitScript).toContain('URLSearchParams');
    expect(themeInitScript).toContain('theme');
    expect(themeInitScript).toContain('dark');
  });
});