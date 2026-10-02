// @vitest-environment node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const migrationPath = join(process.cwd(), 'supabase/migrations/20261002100000_fix_username_collision.sql');
const schemaPath = join(process.cwd(), 'supabase/schema.sql');

describe('handle_new_user username collision fix', () => {
  it('migration defines unique username generation with suffix', () => {
    const sql = readFileSync(migrationPath, 'utf8');
    expect(sql).toContain('while exists (select 1 from public.profiles where username = candidate_username)');
    expect(sql).toContain('candidate_username := base_username || \'_\'' );
    expect(sql).toContain('lower(regexp_replace(base_username, \'[^a-z0-9_]\', \'_\', \'g\'))');
  });

  it('schema.sql reflects the same fix', () => {
    const sql = readFileSync(schemaPath, 'utf8');
    expect(sql).toContain('while exists (select 1 from public.profiles where username = candidate_username)');
    expect(sql).toContain('candidate_username := base_username || \'_\'' );
  });
});
