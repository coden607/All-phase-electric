import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const sql = readFileSync('supabase/migrations/001_initial_schema.sql', 'utf8');

describe('initial Supabase schema', () => {
  it('supports every lead status used by the admin workflow', () => {
    for (const status of ['new','contacted','scheduled','estimate_sent','won','lost','archived']) {
      expect(sql).toContain(`'${status}'`);
    }
  });

  it('is safe to reapply trigger and policy definitions during setup', () => {
    expect(sql).toContain('drop trigger if exists leads_set_updated_at');
    expect(sql).toContain('drop trigger if exists notification_preferences_set_updated_at');
    expect(sql).toContain('drop policy if exists "admins can view leads"');
    expect(sql).toContain('drop policy if exists "admins can read lead attachment objects"');
  });
});
