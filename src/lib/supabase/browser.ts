'use client';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
let client: SupabaseClient<Database> | undefined;
export function getBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error('Supabase browser environment is not configured.');
  client ??= createClient<Database>(url, key);
  return client;
}
