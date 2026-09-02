import { describe, expect, it } from 'vitest';
import { companyConfig } from '@/config/company';

describe('company configuration', () => {
  it('keeps All Phase branding and service choices in portable configuration', () => {
    expect(companyConfig.displayName).toBe('All Phase Electric & Maintenance, Inc.');
    expect(companyConfig.jobTypes).toEqual(['residential', 'commercial', 'industrial']);
    expect(companyConfig.notifications.email.enabledByDefault).toBe(true);
    expect(companyConfig.integration.hostAgnostic).toBe(true);
  });
});
