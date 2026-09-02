export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type LeadRow = {
  id: string; reference_number: string; idempotency_key: string | null; job_type: string; service_type: string;
  description: string; urgency: string; street: string; city: string; state: string; zip: string;
  customer_name: string; customer_email: string; customer_phone: string; preferred_contact: string;
  preferred_windows: Json; status: string; consented_at: string; created_at: string; updated_at: string;
};
type LeadInsert = Omit<LeadRow, 'id' | 'status' | 'consented_at' | 'created_at' | 'updated_at'> & Partial<Pick<LeadRow, 'id' | 'status' | 'consented_at' | 'created_at' | 'updated_at'>>;
type LeadUpdate = Partial<LeadInsert>;
type AttachmentRow = { id: string; lead_id: string; storage_path: string; original_filename: string; mime_type: string; byte_size: number; created_at: string };
type AttachmentInsert = Omit<AttachmentRow, 'id' | 'created_at'> & Partial<Pick<AttachmentRow, 'id' | 'created_at'>>;
type NoteRow = { id: string; lead_id: string; author_user_id: string | null; body: string; created_at: string };
type NoteInsert = Omit<NoteRow, 'id' | 'created_at'> & Partial<Pick<NoteRow, 'id' | 'created_at'>>;

export type Database = {
  public: {
    Tables: {
      leads: { Row: LeadRow; Insert: LeadInsert; Update: LeadUpdate; Relationships: [] };
      lead_attachments: { Row: AttachmentRow; Insert: AttachmentInsert; Update: Partial<AttachmentInsert>; Relationships: [] };
      lead_notes: { Row: NoteRow; Insert: NoteInsert; Update: Partial<NoteInsert>; Relationships: [] };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
