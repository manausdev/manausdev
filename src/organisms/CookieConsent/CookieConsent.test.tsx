import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CookieConsent } from './CookieConsent';
import styles from './CookieConsent.module.css';

const KEY = 'manausdev_cookie_consent';

describe('CookieConsent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.localStorage.removeItem(KEY);
  });

  afterEach(() => {
    vi.useRealTimers();
    window.localStorage.removeItem(KEY);
  });

  it('aparece apos o delay e aceita', () => {
    render(<CookieConsent />);
    expect(screen.queryByText(/cookies essenciais/i)).not.toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(1300); });
    const accept = screen.getByRole('button', { name: /concordar/i });
    expect(accept).toBeInTheDocument();
    fireEvent.click(accept);
    expect(window.localStorage.getItem(KEY)).toBe('accepted');
    expect(screen.queryByText(/cookies essenciais/i)).not.toBeInTheDocument();
  });

  it('usa a classe base do modulo', () => {
    render(<CookieConsent />);
    act(() => { vi.advanceTimersByTime(1300); });
    expect(document.querySelector(`.${styles.aside}`)).toBeInTheDocument();
  });
});