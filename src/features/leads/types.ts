import type { JobType, ServiceType } from '@/config/company';

export type LeadStatus = 'new' | 'contacted' | 'scheduled' | 'won' | 'lost';
export type PreferredContact = 'email' | 'phone' | 'text';

export interface LeadSummary {
  id: string;
  referenceNumber: string;
  jobType: JobType;
  serviceType: ServiceType;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  preferredContact: PreferredContact;
  status: LeadStatus;
  createdAt: string;
}
