import { intakeSchema } from './schema';
import { createLeadReference } from './reference';
import type { LeadRepository } from '@/features/leads/repository';
import type { LeadNotifier } from '@/features/notifications/types';

interface ProcessIntakeDependencies {
  repository: Pick<LeadRepository, 'createLead'>;
  notifier: Pick<LeadNotifier, 'notifyNewLead'>;
  now?: () => Date;
  random?: () => number;
  idempotencyKey?: string;
}

export type ProcessIntakeResult =
  | { ok: false; code: 'invalid-input'; issues: string[] }
  | { ok: true; leadId: string; referenceNumber: string; notificationStatus: 'sent' | 'failed' };

export async function processIntake(rawInput: unknown, dependencies: ProcessIntakeDependencies): Promise<ProcessIntakeResult> {
  const parsed = intakeSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      code: 'invalid-input',
      issues: parsed.error.issues.map((issue) => `${issue.path.join('.') || 'request'}: ${issue.message}`),
    };
  }

  const now = dependencies.now?.() ?? new Date();
  const random = dependencies.random ?? Math.random;
  const referenceNumber = createLeadReference(now, random);
  const lead = await dependencies.repository.createLead({
    referenceNumber,
    intake: parsed.data,
    idempotencyKey: dependencies.idempotencyKey,
  });

  try {
    await dependencies.notifier.notifyNewLead({ lead, intake: parsed.data });
    return { ok: true, leadId: lead.id, referenceNumber: lead.referenceNumber, notificationStatus: 'sent' };
  } catch {
    return { ok: true, leadId: lead.id, referenceNumber: lead.referenceNumber, notificationStatus: 'failed' };
  }
}
