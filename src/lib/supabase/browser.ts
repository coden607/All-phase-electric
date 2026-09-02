'use client';
import { createClient } from '@supabase/supabase-js';
let client: ReturnType<typeof createClient> | undefined;
export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase browser environment is not configured.');
  client ??= createClient(url, key);
  return client;
}
