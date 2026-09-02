import { describe, expect, it } from 'vitest';
import { demoLeads, getAttentionLevel, getPipelineMetrics, getSmartSummary } from '@/features/demo/sales-tools';

describe('demo sales tools', () => {
  it('calculates pipeline value and won value', () => {
    const metrics = getPipelineMetrics(demoLeads);
    expect(metrics.pipelineValue).toBeGreaterThan(0);
    expect(metrics.wonValue).toBeGreaterThan(0);
    expect(metrics.openCount).toBeGreaterThan(0);
  });

  it('flags old untouched leads as urgent', () => {
    expect(getAttentionLevel({ ...demoLeads[0], status: 'new', minutesSinceCreated: 75 })).toBe('urgent');
  });

  it('creates a concise useful job summary', () => {
    const summary = getSmartSummary(demoLeads[0]);
    expect(summary).toContain(demoLeads[0].service);
    expect(summary.length).toBeGreaterThan(30);
  });
});
