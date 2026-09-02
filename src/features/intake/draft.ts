const DRAFT_KEY = 'all-phase-intake-draft-v1';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function toSerializable(value: unknown): JsonValue | undefined {
  if (typeof File !== 'undefined' && value instanceof File) return undefined;
  if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;

  if (Array.isArray(value)) {
    return value.map(toSerializable).filter((entry): entry is JsonValue => entry !== undefined);
  }

  if (typeof value === 'object') {
    const output: Record<string, JsonValue> = {};
    for (const [key, entry] of Object.entries(value)) {
      const clean = toSerializable(entry);
      if (clean !== undefined && !(Array.isArray(clean) && clean.length === 0 && key === 'files')) output[key] = clean;
    }
    return output;
  }

  return undefined;
}

export function saveIntakeDraft(value: unknown): void {
  if (typeof window === 'undefined') return;
  const serializable = toSerializable(value);
  if (serializable === undefined) return;
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(serializable));
}

export function loadIntakeDraft<T extends object = Record<string, unknown>>(): T | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as T) : null;
  } catch {
    return null;
  }
}

export function clearIntakeDraft(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DRAFT_KEY);
}
