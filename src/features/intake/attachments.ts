import { createServiceSupabase } from '@/lib/supabase/service';
import { validateUploadMetadata } from '@/lib/uploads/policy';

export async function storeLeadAttachments(leadId: string, files: File[]) {
  const validation = validateUploadMetadata(files.map(file => ({ name: file.name, type: file.type, size: file.size })));
  if (!validation.ok) throw new Error(`Invalid attachment: ${validation.reason}`);
  if (!files.length) return;
  const supabase = createServiceSupabase();
  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, '-').slice(-120) || 'attachment';
    const path = `${leadId}/${crypto.randomUUID()}-${safeName}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const upload = await supabase.storage.from('all-phase-lead-attachments').upload(path, bytes, { contentType: file.type, upsert: false });
    if (upload.error) throw new Error(upload.error.message);
    const meta = await supabase.from('all_phase_lead_attachments').insert({ lead_id: leadId, storage_path: path, original_filename: file.name, mime_type: file.type, byte_size: file.size });
    if (meta.error) { await supabase.storage.from('all-phase-lead-attachments').remove([path]); throw new Error(meta.error.message); }
  }
}
