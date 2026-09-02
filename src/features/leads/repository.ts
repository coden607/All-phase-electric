import type { NormalizedIntake } from '@/features/intake/schema';

export interface CreatedLead {
  id: string;
  referenceNumber: string;
}

export interface CreateLeadInput {
  referenceNumber: string;
  intake: NormalizedIntake;
  idempotencyKey?: string;
}

export interface LeadRepository {
  createLead(input: CreateLeadInput): Promise<CreatedLead>;
}
