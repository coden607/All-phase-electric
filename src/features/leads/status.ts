import type { LeadStatus } from './types';
const transitions: Record<LeadStatus, readonly LeadStatus[]> = {
  new:['contacted','lost','archived'], contacted:['scheduled','estimate_sent','won','lost','archived'], scheduled:['estimate_sent','won','lost','archived'], estimate_sent:['won','lost','archived'], won:['archived'], lost:['archived'], archived:[],
};
export function canTransitionLeadStatus(from:LeadStatus,to:LeadStatus){return transitions[from].includes(to)}
export function allowedLeadStatusTransitions(from:LeadStatus){return transitions[from]}
