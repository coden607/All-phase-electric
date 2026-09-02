import { companyConfig } from '@/config/company';
import type { NormalizedIntake } from '@/features/intake/schema';

export async function notifyLead(input: { lead: { id: string; referenceNumber: string }; intake: NormalizedIntake }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NOTIFICATION_FROM_EMAIL;
  const to = process.env.NOTIFICATION_TO_EMAIL || companyConfig.notificationEmail;
  if (!apiKey || !from || !to) throw new Error('Email provider is not configured.');
  const html = `<h2>New estimate request ${input.lead.referenceNumber}</h2><p><strong>${escapeHtml(input.intake.customer.name)}</strong> — ${escapeHtml(input.intake.jobType)} / ${escapeHtml(input.intake.serviceType)}</p><p>${escapeHtml(input.intake.description)}</p><p>${escapeHtml(input.intake.customer.phone)} · ${escapeHtml(input.intake.customer.email)}</p>`;
  const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [to], subject: `New estimate request ${input.lead.referenceNumber}`, html }) });
  if (!response.ok) throw new Error(`Email provider returned ${response.status}.`);
}
function escapeHtml(value: string) { return value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c] || c)); }
