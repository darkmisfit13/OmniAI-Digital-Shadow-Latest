import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://sernddvfnlaioxiqpbxu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_PUBLISHABLE_KEY) {
  throw new Error('Missing VITE_SUPABASE_PUBLISHABLE_KEY. Configure the Supabase publishable/anon key for this app.');
}

/** Browser/PWA client. This key is publishable; authorization must still be enforced by Supabase RLS. */
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});

export async function requireSupabaseUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message || 'Please sign in to continue.');
  if (!data.user) throw new Error('Please sign in to continue.');
  return data.user;
}

export async function getSupabaseAccessToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error(error.message || 'Could not read the OmniAI session.');
  if (!data.session?.access_token) throw new Error('Please sign in to continue.');
  return data.session.access_token;
}
