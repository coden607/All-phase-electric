import type { CreatedLead } from '@/features/leads/repository';
import type { NormalizedIntake } from '@/features/intake/schema';

export interface NewLeadNotification {
  lead: CreatedLead;
  intake: NormalizedIntake;
}

export interface LeadNotifier {
  notifyNewLead(input: NewLeadNotification): Promise<void>;
}
