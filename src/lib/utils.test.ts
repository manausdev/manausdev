import { describe, it, expect } from 'vitest';
import { safeUrl } from './utils';

describe('safeUrl', () => {
  it('allows http and https', () => {
    expect(safeUrl('https://example.com')).toBe('https://example.com');
    expect(safeUrl('http://example.com/path')).toBe('http://example.com/path');
  });

  it('allows mailto', () => {
    expect(safeUrl('mailto:test@example.com')).toBe('mailto:test@example.com');
  });

  it('allows relative URLs', () => {
    expect(safeUrl('/about')).toBe('/about');
  });

  it('rejects javascript:', () => {
    expect(safeUrl('javascript:alert(1)')).toBeNull();
  });

  it('rejects data:', () => {
    expect(safeUrl('data:text/html,<script>alert(1)</script>')).toBeNull();
  });

  it('rejects empty/null', () => {
    expect(safeUrl('')).toBeNull();
    expect(safeUrl(null)).toBeNull();
    expect(safeUrl(undefined)).toBeNull();
  });

  it('trims whitespace', () => {
    expect(safeUrl('  https://example.com  ')).toBe('https://example.com');
  });
});
