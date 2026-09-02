import type { LeadStatus } from './types';

const transitions: Record<LeadStatus, readonly LeadStatus[]> = {
  new: ['contacted', 'lost'],
  contacted: ['scheduled', 'won', 'lost'],
  scheduled: ['won', 'lost'],
  won: [],
  lost: [],
};

export function canTransitionLeadStatus(from: LeadStatus, to: LeadStatus): boolean {
  return transitions[from].includes(to);
}

export function allowedLeadStatusTransitions(from: LeadStatus): readonly LeadStatus[] {
  return transitions[from];
}
