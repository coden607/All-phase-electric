export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const MAX_UPLOAD_COUNT = 6;

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/pdf',
]);

export interface UploadMetadata {
  name: string;
  type: string;
  size: number;
}

export type UploadValidationResult =
  | { ok: true }
  | { ok: false; reason: 'too-many-files' | 'unsupported-type' | 'file-too-large' | 'invalid-size'; file?: string };

export function validateUploadMetadata(files: readonly UploadMetadata[]): UploadValidationResult {
  if (files.length > MAX_UPLOAD_COUNT) return { ok: false, reason: 'too-many-files' };

  for (const file of files) {
    if (!Number.isFinite(file.size) || file.size < 0) return { ok: false, reason: 'invalid-size', file: file.name };
    if (!ALLOWED_TYPES.has(file.type)) return { ok: false, reason: 'unsupported-type', file: file.name };
    if (file.size > MAX_UPLOAD_BYTES) return { ok: false, reason: 'file-too-large', file: file.name };
  }

  return { ok: true };
}
