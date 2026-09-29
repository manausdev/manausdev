import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ListingGrid } from './ListingGrid';
import styles from './ListingGrid.module.css';

describe('ListingGrid', () => {
  it('aplica a variante cards por padrao', () => {
    render(<ListingGrid data-testid="grid" />);
    expect(screen.getByTestId('grid')).toHaveClass(styles.grid, styles.cards);
  });

  it('aplica variantes alternativas', () => {
    const { rerender } = render(<ListingGrid variant="cardsWide" data-testid="grid" />);
    expect(screen.getByTestId('grid')).toHaveClass(styles.cardsWide);
    rerender(<ListingGrid variant="duo" data-testid="grid" />);
    expect(screen.getByTestId('grid')).toHaveClass(styles.duo);
  });

  it('aceita className extra', () => {
    render(<ListingGrid className="extra" data-testid="grid" />);
    expect(screen.getByTestId('grid')).toHaveClass('extra');
  });
});