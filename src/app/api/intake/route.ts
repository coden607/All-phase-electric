import { NextResponse } from 'next/server';
import { handleIntakeRequest } from '@/features/intake/route-handler';
import { persistLead } from '@/features/leads/supabase-repository';
import { notifyLead } from '@/features/notifications/resend';
import { storeLeadAttachments } from '@/features/intake/attachments';
import { validateUploadMetadata } from '@/lib/uploads/policy';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') || '';
  let payload: unknown; let files: File[] = [];
  try {
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData(); const raw = form.get('payload');
      if (typeof raw !== 'string') return NextResponse.json({ error: 'Missing request payload.' }, { status: 400 });
      payload = JSON.parse(raw); files = form.getAll('files').filter((v): v is File => v instanceof File && v.size > 0);
      const valid = validateUploadMetadata(files.map(f=>({name:f.name,type:f.type,size:f.size})));
      if (!valid.ok) return NextResponse.json({ error: `Attachment rejected: ${valid.reason}`, file: valid.file }, { status: 400 });
    } else if (contentType.includes('application/json')) payload = await request.json();
    else return NextResponse.json({ error: 'Content-Type must be application/json or multipart/form-data.' }, { status: 415 });
  } catch { return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 }); }
  const idempotencyKey = request.headers.get('idempotency-key') || '';
  try {
    const result = await handleIntakeRequest({ payload, idempotencyKey }, { persist: persistLead, notify: notifyLead, afterPersist: files.length ? ({lead}) => storeLeadAttachments(lead.id, files) : undefined });
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error('intake failed', error);
    return NextResponse.json({ error: 'We could not save your request. Please try again or call the office.' }, { status: 503 });
  }
}
