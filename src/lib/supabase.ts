import { createClient, User, Session } from '@supabase/supabase-js';

// Retrieve Supabase credentials from Vite environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[OmniAI Supabase] VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY is not defined in the environment.'
  );
}

// Client-side Supabase client instance with localStorage session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'omni-phone-supabase-auth',
  },
});

export interface ChatThreadItem {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessageRecord {
  id: string;
  user_id: string;
  thread_id: string;
  sdk_id: string;
  message: any;
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
}

// -------------------------------------------------------------
// Authentication Helpers
// -------------------------------------------------------------

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('Error fetching current Supabase user:', err);
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (err) {
    console.error('Error fetching Supabase session:', err);
    return null;
  }
}

export function onAuthStateChange(callback: (user: User | null, session: Session | null) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null, session);
  });
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}

export async function signUpWithEmail(email: string, password: string, displayName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        display_name: displayName || email.split('@')[0],
      },
    },
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.warn('Error fetching profile:', error);
    return null;
  }
  return data as UserProfile | null;
}

// -------------------------------------------------------------
// Chat Thread Operations (Enforces user_id ownership via RLS)
// -------------------------------------------------------------

export async function listChatThreads(userId: string): Promise<ChatThreadItem[]> {
  const { data, error } = await supabase
    .from('chat_threads')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error listing chat threads:', error);
    throw error;
  }
  return (data || []) as ChatThreadItem[];
}

export async function createChatThread(userId: string, title = 'New conversation'): Promise<ChatThreadItem> {
  const { data, error } = await supabase
    .from('chat_threads')
    .insert({
      user_id: userId,
      title: title.slice(0, 100),
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating chat thread:', error);
    throw error;
  }
  return data as ChatThreadItem;
}

export async function renameChatThread(threadId: string, userId: string, newTitle: string): Promise<void> {
  const { error } = await supabase
    .from('chat_threads')
    .update({
      title: newTitle.trim().slice(0, 100),
      updated_at: new Date().toISOString(),
    })
    .eq('id', threadId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error renaming chat thread:', error);
    throw error;
  }
}

export async function deleteChatThread(threadId: string, userId: string): Promise<void> {
  // 1. Delete associated AI memories
  await supabase
    .from('ai_memories')
    .delete()
    .eq('user_id', userId)
    .eq('source_thread_id', threadId);

  // 2. Delete thread (cascades to chat_messages via foreign key)
  const { error } = await supabase
    .from('chat_threads')
    .delete()
    .eq('id', threadId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting chat thread:', error);
    throw error;
  }
}

// -------------------------------------------------------------
// Chat Messages Operations (Enforces thread_id & user_id via RLS)
// -------------------------------------------------------------

export async function loadThreadMessages(threadId: string, userId: string): Promise<ChatMessageRecord[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('thread_id', threadId)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error loading thread messages:', error);
    throw error;
  }
  return (data || []) as ChatMessageRecord[];
}

export async function saveChatMessage(
  threadId: string,
  userId: string,
  sdkId: string,
  messagePayload: any
): Promise<void> {
  const { error } = await supabase
    .from('chat_messages')
    .upsert(
      {
        user_id: userId,
        thread_id: threadId,
        sdk_id: sdkId,
        message: messagePayload,
      },
      { onConflict: 'thread_id,sdk_id' }
    );

  if (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }

  // Touch thread updated_at timestamp
  await supabase
    .from('chat_threads')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', threadId)
    .eq('user_id', userId);
}
