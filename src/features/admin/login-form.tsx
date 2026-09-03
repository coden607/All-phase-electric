'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserSupabase } from '@/lib/supabase/browser';

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setBusy(true); setError('');
    try { const { error } = await getBrowserSupabase().auth.signInWithPassword({ email, password }); if (error) throw error; router.push('/admin'); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to sign in.'); } finally { setBusy(false); }
  }
  return <form className="admin-login" onSubmit={submit}><h1>Lead dashboard</h1><p>Authorized All Phase staff only.</p><label>Email<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)} /></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} /></label>{error && <p role="alert" className="form-error">{error}</p>}<button className="primary-button wide" disabled={busy}>{busy?'Signing in…':'Sign in'}</button></form>;
}
