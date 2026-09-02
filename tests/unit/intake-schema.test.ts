import { describe, expect, it } from 'vitest';
import { intakeSchema } from '@/features/intake/schema';

const valid = {
  jobType: 'residential',
  serviceType: 'troubleshooting',
  description: '  Kitchen breaker trips when the microwave runs.  ',
  urgency: 'soon',
  address: { street: '10 Main St', city: 'Binghamton', state: 'NY', zip: '13905' },
  customer: { name: 'Alex Customer', email: 'alex@example.com', phone: '6075551212', preferredContact: 'phone' },
  preferredWindows: [{ date: '2026-09-08', period: 'morning' }],
  consent: true,
};

describe('intakeSchema', () => {
  it('normalizes a valid estimate request', () => {
    const parsed = intakeSchema.parse(valid);
    expect(parsed.description).toBe('Kitchen breaker trips when the microwave runs.');
    expect(parsed.customer.phone).toBe('6075551212');
  });

  it('rejects unsupported job types', () => {
    expect(() => intakeSchema.parse({ ...valid, jobType: 'government' })).toThrow();
  });

  it('requires at least one preferred window and explicit consent', () => {
    expect(() => intakeSchema.parse({ ...valid, preferredWindows: [] })).toThrow();
    expect(() => intakeSchema.parse({ ...valid, consent: false })).toThrow();
  });
});
