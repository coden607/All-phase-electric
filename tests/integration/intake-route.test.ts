import { describe, expect, it, vi } from 'vitest';
import { handleIntakeRequest } from '@/features/intake/route-handler';

const validPayload = {
  jobType: 'residential',
  serviceType: 'troubleshooting',
  description: 'Kitchen lights flicker when the microwave starts and one breaker feels warm.',
  street: '123 Main St', city: 'Binghamton', state: 'NY', zip: '13901',
  name: 'Test Customer', email: 'test@example.com', phone: '6075551212',
  preferredContact: 'phone', consent: true,
};

describe('intake route handler', () => {
  it('rejects malformed input before persistence', async () => {
    const persist = vi.fn();
    const result = await handleIntakeRequest({ payload: { ...validPayload, email: 'bad' }, idempotencyKey: 'abc' }, { persist, notify: vi.fn() });
    expect(result.status).toBe(400);
    expect(persist).not.toHaveBeenCalled();
  });

  it('returns a saved reference and remains successful when notification fails', async () => {
    const persist = vi.fn().mockResolvedValue({ id: 'lead-1', reference: 'APE-260902-AB12' });
    const result = await handleIntakeRequest({ payload: validPayload, idempotencyKey: 'abc' }, { persist, notify: vi.fn().mockRejectedValue(new Error('provider down')) });
    expect(result.status).toBe(201);
    expect(result.body.reference).toBe('APE-260902-AB12');
    expect(result.body.notificationQueued).toBe(false);
  });

  it('requires an idempotency key', async () => {
    const result = await handleIntakeRequest({ payload: validPayload, idempotencyKey: '' }, { persist: vi.fn(), notify: vi.fn() });
    expect(result.status).toBe(400);
  });
});
