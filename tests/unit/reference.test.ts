import { describe, expect, it } from 'vitest';
import { createLeadReference } from '@/features/intake/reference';

describe('createLeadReference', () => {
  it('creates a readable deterministic reference from injected inputs', () => {
    const ref = createLeadReference(new Date('2026-09-02T12:00:00Z'), () => 0.42);
    expect(ref).toMatch(/^APE-20260902-[A-Z0-9]{4}$/);
    expect(ref).toBe(createLeadReference(new Date('2026-09-02T12:00:00Z'), () => 0.42));
  });
});
