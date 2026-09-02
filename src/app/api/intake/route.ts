import { NextResponse } from 'next/server';
import { handleIntakeRequest } from '@/features/intake/route-handler';
import { persistLead } from '@/features/leads/supabase-repository';
import { notifyLead } from '@/features/notifications/resend';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return NextResponse.json({ error: 'Content-Type must be application/json.' }, { status: 415 });
  let payload: unknown;
  try { payload = await request.json(); } catch { return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 }); }
  const idempotencyKey = request.headers.get('idempotency-key') || '';
  try {
    const result = await handleIntakeRequest({ payload, idempotencyKey }, { persist: persistLead, notify: notifyLead });
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error('intake failed', error);
    return NextResponse.json({ error: 'We could not save your request. Please try again or call the office.' }, { status: 503 });
  }
}
