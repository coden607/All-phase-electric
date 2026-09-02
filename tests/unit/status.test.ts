import { describe, expect, it } from 'vitest';
import { canTransitionLeadStatus } from '@/features/leads/status';

describe('canTransitionLeadStatus', () => {
  it('allows the normal sales pipeline', () => {
    expect(canTransitionLeadStatus('new', 'contacted')).toBe(true);
    expect(canTransitionLeadStatus('contacted', 'scheduled')).toBe(true);
    expect(canTransitionLeadStatus('scheduled', 'won')).toBe(true);
    expect(canTransitionLeadStatus('scheduled', 'lost')).toBe(true);
  });

  it('rejects reopening terminal states implicitly', () => {
    expect(canTransitionLeadStatus('won', 'new')).toBe(false);
    expect(canTransitionLeadStatus('lost', 'scheduled')).toBe(false);
  });
});
