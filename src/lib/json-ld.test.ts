import { describe, it, expect } from 'vitest';
import { serializeJsonLd } from './json-ld';

describe('serializeJsonLd', () => {
  it('escapes < to \\u003c', () => {
    const data = { title: '</script><script>alert(1)</script>' };
    const out = serializeJsonLd(data);
    expect(out).not.toContain('</script>');
    expect(out).toContain('\\u003c/script>');
  });

  it('escapes line separators', () => {
    const data = { text: 'a\u2028b\u2029c' };
    const out = serializeJsonLd(data);
    expect(out).not.toContain('\u2028');
    expect(out).not.toContain('\u2029');
    expect(out).toContain('\\u2028');
    expect(out).toContain('\\u2029');
  });

  it('produces valid JSON after parsing', () => {
    const data = { a: 1, b: '<test>' };
    const out = serializeJsonLd(data);
    const parsed = JSON.parse(out);
    expect(parsed).toEqual(data);
  });
});
