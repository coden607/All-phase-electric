export type DemoLeadStatus = 'new' | 'contacted' | 'scheduled' | 'won' | 'lost';
export type DemoJobType = 'Residential' | 'Commercial' | 'Industrial';

export type DemoLead = {
  id: string;
  customer: string;
  company?: string;
  phone: string;
  email: string;
  jobType: DemoJobType;
  service: string;
  description: string;
  urgency: 'Normal' | 'Soon' | 'Urgent';
  address: string;
  preferredWindow: string;
  preferredContact: 'Call' | 'Text' | 'Email';
  estimatedValue: number;
  status: DemoLeadStatus;
  minutesSinceCreated: number;
  hasPhotos: boolean;
  followUpDue: boolean;
};

export const demoLeads: DemoLead[] = [
  {
    id: 'APE-20260902-7K4M', customer: 'Megan Carter', phone: '607-555-0148', email: 'megan@example.com',
    jobType: 'Residential', service: 'Panel / service upgrade',
    description: 'Older 100A panel, adding a heat pump and EV charger. Wants to know whether a 200A service upgrade is needed.',
    urgency: 'Soon', address: 'Johnson City, NY', preferredWindow: 'Thursday 3–5 PM', preferredContact: 'Call',
    estimatedValue: 4200, status: 'new', minutesSinceCreated: 38, hasPhotos: true, followUpDue: true,
  },
  {
    id: 'APE-20260902-2P8N', customer: 'David Kim', company: 'Twin Rivers Dental', phone: '607-555-0192', email: 'david@example.com',
    jobType: 'Commercial', service: 'Lighting retrofit',
    description: 'Replace aging fluorescent fixtures in reception, operatories, and exterior signage with LED lighting.',
    urgency: 'Normal', address: 'Vestal, NY', preferredWindow: 'Friday 8–10 AM', preferredContact: 'Email',
    estimatedValue: 6800, status: 'contacted', minutesSinceCreated: 190, hasPhotos: true, followUpDue: false,
  },
  {
    id: 'APE-20260901-9R3B', customer: 'Luis Hernandez', company: 'Southern Tier Fabrication', phone: '607-555-0163', email: 'luis@example.com',
    jobType: 'Industrial', service: 'Equipment circuit / disconnect',
    description: 'New 3-phase production equipment needs a dedicated circuit, disconnect, and installation coordination.',
    urgency: 'Soon', address: 'Binghamton, NY', preferredWindow: 'Wednesday morning', preferredContact: 'Call',
    estimatedValue: 9200, status: 'scheduled', minutesSinceCreated: 930, hasPhotos: false, followUpDue: false,
  },
  {
    id: 'APE-20260830-4T6C', customer: 'Rachel Owens', phone: '607-555-0127', email: 'rachel@example.com',
    jobType: 'Residential', service: 'Generator interlock / inlet',
    description: 'Customer wants a safe portable-generator connection and panel interlock before winter.',
    urgency: 'Normal', address: 'Endicott, NY', preferredWindow: 'Any weekday after 4 PM', preferredContact: 'Text',
    estimatedValue: 1450, status: 'won', minutesSinceCreated: 4100, hasPhotos: true, followUpDue: false,
  },
  {
    id: 'APE-20260902-8M1Q', customer: 'Anthony Bell', phone: '607-555-0111', email: 'anthony@example.com',
    jobType: 'Residential', service: 'Troubleshooting / partial outage',
    description: 'Several kitchen and dining-room outlets are out after a breaker trip; reset did not restore power.',
    urgency: 'Urgent', address: 'Binghamton, NY', preferredWindow: 'As soon as possible', preferredContact: 'Call',
    estimatedValue: 650, status: 'new', minutesSinceCreated: 82, hasPhotos: false, followUpDue: true,
  },
];

export function getAttentionLevel(lead: DemoLead): 'normal' | 'soon' | 'urgent' {
  if (lead.status !== 'new') return 'normal';
  if (lead.minutesSinceCreated >= 60 || lead.urgency === 'Urgent') return 'urgent';
  if (lead.minutesSinceCreated >= 20 || lead.followUpDue) return 'soon';
  return 'normal';
}

export function getPipelineMetrics(leads: DemoLead[]) {
  const open = leads.filter((lead) => !['won', 'lost'].includes(lead.status));
  const won = leads.filter((lead) => lead.status === 'won');
  return {
    openCount: open.length,
    pipelineValue: open.reduce((sum, lead) => sum + lead.estimatedValue, 0),
    wonValue: won.reduce((sum, lead) => sum + lead.estimatedValue, 0),
    needsAttention: leads.filter((lead) => getAttentionLevel(lead) !== 'normal').length,
  };
}

export function getSmartSummary(lead: DemoLead) {
  const photoNote = lead.hasPhotos ? 'Customer included job photos.' : 'No photos attached yet.';
  return `${lead.jobType} ${lead.service} request in ${lead.address}. ${lead.description} Preferred contact: ${lead.preferredContact}. Requested timing: ${lead.preferredWindow}. ${photoNote}`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}
