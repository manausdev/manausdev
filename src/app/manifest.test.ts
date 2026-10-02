import { describe, it, expect } from 'vitest';
import manifest from './manifest';
import { describe, it, expect } from 'vitest';

describe('manifest', () => {
  it('should include PWA icons with correct sizes', () => {
    const m = manifest();
    expect(m.icons).toBeDefined();
    const icons192 = m.icons?.filter(i => i.src === '/icon' && i.sizes === '192x192');
    const icons512 = m.icons?.filter(i => i.src === '/icon' && i.sizes === '512x512');
    const apple = m.icons?.find(i => i.src === '/apple-icon');
    expect(icons192).toHaveLength(1);
    expect(icons192?.[0].type).toBe('image/png');
    expect(icons512).toHaveLength(1);
    expect(icons512?.[0].type).toBe('image/png');
    expect(apple).toBeDefined();
    expect(apple?.sizes).toBe('180x180');
    expect(apple?.type).toBe('image/png');
  });
});
