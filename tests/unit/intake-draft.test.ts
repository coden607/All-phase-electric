import { beforeEach, describe, expect, it } from 'vitest';
import { clearIntakeDraft, loadIntakeDraft, saveIntakeDraft } from '@/features/intake/draft';

const draft = {
  jobType: 'residential',
  description: 'Panel replacement request',
  name: 'Alex Customer',
};

describe('intake draft persistence', () => {
  beforeEach(() => localStorage.clear());

  it('saves and restores serializable form values', () => {
    saveIntakeDraft(draft);
    expect(loadIntakeDraft()).toEqual(draft);
  });

  it('never persists File objects', () => {
    const file = new File(['data'], 'panel.jpg', { type: 'image/jpeg' });
    saveIntakeDraft({ ...draft, files: [file] });
    expect(loadIntakeDraft()).toEqual(draft);
  });

  it('fails closed on corrupt storage and can be cleared', () => {
    localStorage.setItem('all-phase-intake-draft-v1', '{broken');
    expect(loadIntakeDraft()).toBeNull();
    saveIntakeDraft(draft);
    clearIntakeDraft();
    expect(loadIntakeDraft()).toBeNull();
  });
});
