import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const SupabaseAuthPanel: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true); setError(''); setNotice('');
    try {
      const result = isCreatingAccount
        ? await supabase.auth.signUp({ email: email.trim(), password })
        : await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (result.error) throw result.error;
      if (isCreatingAccount && !result.data.session) {
        setNotice('Check your email to confirm your account, then return here to sign in.');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Sign-in failed. Please try again.');
    } finally { setBusy(false); }
  };

  const signInWithGoogle = async () => {
    setBusy(true); setError('');
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (oauthError) throw oauthError;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Google sign-in failed.');
      setBusy(false);
    }
  };

  return <div className="mx-auto flex h-full w-full max-w-md flex-col justify-center gap-4 p-5 text-slate-100">
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">OmniAI Account</p>
      <h2 className="mt-2 text-2xl font-bold">{isCreatingAccount ? 'Create your account' : 'Sign in to OmniAI'}</h2>
      <p className="mt-2 text-sm text-slate-400">Use the same OmniAI account as the web app to share conversations.</p>
    </div>
    <form onSubmit={submit} className="space-y-3">
      <label className="block text-sm">Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></label>
      <label className="block text-sm">Password<input required minLength={6} type="password" autoComplete={isCreatingAccount ? 'new-password' : 'current-password'} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2" /></label>
      <button disabled={busy} className="w-full rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-950 disabled:opacity-50">{busy ? 'Please wait…' : isCreatingAccount ? 'Create account' : 'Sign in'}</button>
    </form>
    <button type="button" disabled={busy} onClick={() => void signInWithGoogle()} className="w-full rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:opacity-50">Continue with Google</button>
    <button type="button" disabled={busy} onClick={() => { setIsCreatingAccount((value) => !value); setNotice(''); setError(''); }} className="text-sm text-cyan-200">{isCreatingAccount ? 'Already have an account? Sign in' : 'Need an account? Create one'}</button>
    {notice && <p role="status" className="text-sm text-emerald-300">{notice}</p>}
    {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
  </div>;
};
