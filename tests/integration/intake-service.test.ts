import { describe, expect, it, vi } from 'vitest';
import { processIntake } from '@/features/intake/service';

const valid = {
  jobType: 'residential',
  serviceType: 'troubleshooting',
  description: 'Kitchen breaker trips whenever the microwave runs.',
  urgency: 'soon',
  address: { street: '10 Main St', city: 'Binghamton', state: 'NY', zip: '13905' },
  customer: { name: 'Alex Customer', email: 'alex@example.com', phone: '6075551212', preferredContact: 'phone' },
  preferredWindows: [{ date: '2026-09-08', period: 'morning' }],
  consent: true,
} as const;

describe('processIntake', () => {
  it('persists a validated lead before attempting notification', async () => {
    const order: string[] = [];
    const repository = {
      createLead: vi.fn(async () => { order.push('persist'); return { id: 'lead-1', referenceNumber: 'APE-20260902-AAAA' }; }),
    };
    const notifier = {
      notifyNewLead: vi.fn(async () => { order.push('notify'); }),
    };

    const result = await processIntake(valid, { repository, notifier, now: () => new Date('2026-09-02T12:00:00Z'), random: () => 0 });

    expect(result.ok).toBe(true);
    expect(order).toEqual(['persist', 'notify']);
    expect(repository.createLead).toHaveBeenCalledTimes(1);
  });

  it('keeps the lead successful when notification delivery fails', async () => {
    const repository = {
      createLead: vi.fn(async () => ({ id: 'lead-2', referenceNumber: 'APE-20260902-BBBB' })),
    };
    const notifier = {
      notifyNewLead: vi.fn(async () => { throw new Error('mail provider unavailable'); }),
    };

    const result = await processIntake(valid, { repository, notifier, now: () => new Date('2026-09-02T12:00:00Z'), random: () => 0 });

    expect(result).toMatchObject({ ok: true, notificationStatus: 'failed' });
    expect(repository.createLead).toHaveBeenCalledTimes(1);
  });

  it('rejects invalid input before persistence', async () => {
    const repository = { createLead: vi.fn() };
    const notifier = { notifyNewLead: vi.fn() };

    const result = await processIntake({ ...valid, consent: false }, { repository, notifier });

    expect(result.ok).toBe(false);
    expect(repository.createLead).not.toHaveBeenCalled();
    expect(notifier.notifyNewLead).not.toHaveBeenCalled();
  });
});
