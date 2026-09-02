import { describe, expect, it } from 'vitest';
import { canTransitionLeadStatus } from '@/features/leads/status';
describe('canTransitionLeadStatus',()=>{
 it('allows the normal sales pipeline',()=>{expect(canTransitionLeadStatus('new','contacted')).toBe(true);expect(canTransitionLeadStatus('contacted','scheduled')).toBe(true);expect(canTransitionLeadStatus('scheduled','estimate_sent')).toBe(true);expect(canTransitionLeadStatus('estimate_sent','won')).toBe(true);expect(canTransitionLeadStatus('scheduled','lost')).toBe(true);});
 it('keeps archived terminal and prevents accidental reopening',()=>{expect(canTransitionLeadStatus('archived','new')).toBe(false);expect(canTransitionLeadStatus('lost','scheduled')).toBe(false);expect(canTransitionLeadStatus('won','new')).toBe(false);});
});
