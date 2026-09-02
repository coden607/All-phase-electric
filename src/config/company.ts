export const companyConfig = {
  displayName: 'All Phase Electric & Maintenance, Inc.',
  shortName: 'All Phase Electric',
  jobTypes: ['residential', 'commercial', 'industrial'] as const,
  services: [
    'troubleshooting',
    'residential-electrical',
    'commercial-electrical',
    'industrial-electrical',
    'maintenance',
    'system-installation',
  ] as const,
  notifications: {
    email: {
      enabledByDefault: true,
      recipientEnvKey: 'LEAD_NOTIFICATION_EMAIL',
    },
    sms: {
      enabledByDefault: false,
    },
  },
  integration: {
    hostAgnostic: true,
    publicPath: '/estimate',
    embedPath: '/estimate/embed',
  },
} as const;

export type JobType = (typeof companyConfig.jobTypes)[number];
export type ServiceType = (typeof companyConfig.services)[number];
