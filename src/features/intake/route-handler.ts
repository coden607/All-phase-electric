import { intakeSchema, type NormalizedIntake } from './schema';
import { createLeadReference } from './reference';

export interface RoutePersistResult { id: string; referenceNumber: string }
export interface RouteDeps {
  persist: (input: { intake: NormalizedIntake; referenceNumber: string; idempotencyKey: string }) => Promise<RoutePersistResult>;
  notify: (input: { lead: RoutePersistResult; intake: NormalizedIntake }) => Promise<void>;
  now?: () => Date;
  random?: () => number;
}

export async function handleIntakeRequest(request: { payload: unknown; idempotencyKey: string }, deps: RouteDeps) {
  const idempotencyKey = request.idempotencyKey.trim();
  if (idempotencyKey.length < 3 || idempotencyKey.length > 200) return { status: 400 as const, body: { error: 'A valid idempotency key is required.' } };
  const parsed = intakeSchema.safeParse(request.payload);
  if (!parsed.success) return { status: 400 as const, body: { error: 'Invalid estimate request.', issues: parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`) } };
  const referenceNumber = createLeadReference(deps.now?.() ?? new Date(), deps.random ?? Math.random);
  const lead = await deps.persist({ intake: parsed.data, referenceNumber, idempotencyKey });
  try {
    await deps.notify({ lead, intake: parsed.data });
    return { status: 201 as const, body: { leadId: lead.id, reference: lead.referenceNumber, notificationQueued: true } };
  } catch {
    return { status: 201 as const, body: { leadId: lead.id, reference: lead.referenceNumber, notificationQueued: false } };
  }
}
