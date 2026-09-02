import type { NormalizedIntake } from '@/features/intake/schema';
import { createServiceSupabase } from '@/lib/supabase/service';

export async function persistLead(input: { intake: NormalizedIntake; referenceNumber: string; idempotencyKey: string }) {
  const supabase = createServiceSupabase();
  const row = {
    reference_number: input.referenceNumber, idempotency_key: input.idempotencyKey,
    job_type: input.intake.jobType, service_type: input.intake.serviceType, description: input.intake.description,
    urgency: input.intake.urgency, street: input.intake.address.street, city: input.intake.address.city,
    state: input.intake.address.state, zip: input.intake.address.zip, customer_name: input.intake.customer.name,
    customer_email: input.intake.customer.email, customer_phone: input.intake.customer.phone,
    preferred_contact: input.intake.customer.preferredContact, preferred_windows: input.intake.preferredWindows,
  };
  const { data, error } = await supabase.from('leads').insert(row).select('id,reference_number').single();
  if (!error && data) return { id: data.id as string, referenceNumber: data.reference_number as string };
  if (error?.code === '23505') {
    const existing = await supabase.from('leads').select('id,reference_number').eq('idempotency_key', input.idempotencyKey).maybeSingle();
    if (existing.data) return { id: existing.data.id as string, referenceNumber: existing.data.reference_number as string };
  }
  throw new Error(error?.message ?? 'Unable to save estimate request.');
}
