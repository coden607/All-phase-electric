const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function createLeadReference(now = new Date(), random: () => number = Math.random): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  const d = String(now.getUTCDate()).padStart(2, '0');
  let suffix = '';
  for (let index = 0; index < 4; index += 1) {
    const slot = Math.min(ALPHABET.length - 1, Math.floor(random() * ALPHABET.length));
    suffix += ALPHABET[slot];
  }
  return `APE-${y}${m}${d}-${suffix}`;
}
