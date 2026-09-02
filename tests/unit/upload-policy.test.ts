import { describe, expect, it } from 'vitest';
import { MAX_UPLOAD_BYTES, MAX_UPLOAD_COUNT, validateUploadMetadata } from '@/lib/uploads/policy';

describe('upload policy', () => {
  it('allows common image and PDF evidence within limits', () => {
    expect(validateUploadMetadata([{ name: 'panel.jpg', type: 'image/jpeg', size: 2_000_000 }])).toEqual({ ok: true });
    expect(validateUploadMetadata([{ name: 'scope.pdf', type: 'application/pdf', size: 1_000_000 }])).toEqual({ ok: true });
  });

  it('rejects dangerous types, oversized files, and too many files', () => {
    expect(validateUploadMetadata([{ name: 'run.exe', type: 'application/x-msdownload', size: 1000 }]).ok).toBe(false);
    expect(validateUploadMetadata([{ name: 'huge.jpg', type: 'image/jpeg', size: MAX_UPLOAD_BYTES + 1 }]).ok).toBe(false);
    const tooMany = Array.from({ length: MAX_UPLOAD_COUNT + 1 }, (_, index) => ({ name: `p${index}.jpg`, type: 'image/jpeg', size: 1000 }));
    expect(validateUploadMetadata(tooMany).ok).toBe(false);
  });
});
