import { requireSupabaseUser, supabase } from './supabase';

export interface ChatThread {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

/** List only the signed-in user's chat threads. RLS must independently enforce the same ownership rule. */
export async function listChatThreads(): Promise<ChatThread[]> {
  const user = await requireSupabaseUser();
  const { data, error } = await supabase
    .from('chat_threads')
    .select('id,user_id,title,created_at,updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });
  if (error) throw new Error(`Could not load conversations: ${error.message}`);
  return (data ?? []) as ChatThread[];
}

export async function createChatThread(title = 'New conversation'): Promise<ChatThread> {
  const user = await requireSupabaseUser();
  const { data, error } = await supabase
    .from('chat_threads')
    .insert({ user_id: user.id, title: title.trim().slice(0, 200) || 'New conversation' })
    .select('id,user_id,title,created_at,updated_at')
    .single();
  if (error) throw new Error(`Could not create conversation: ${error.message}`);
  return data as ChatThread;
}

export async function loadChatThread(threadId: string) {
  const user = await requireSupabaseUser();
  const { data: thread, error: threadError } = await supabase
    .from('chat_threads')
    .select('id,user_id,title,created_at,updated_at')
    .eq('id', threadId)
    .eq('user_id', user.id)
    .maybeSingle();
  if (threadError) throw new Error(`Could not load conversation: ${threadError.message}`);
  if (!thread) throw new Error('Conversation not found.');

  const { data: rows, error: messagesError } = await supabase
    .from('chat_messages')
    .select('message,created_at')
    .eq('thread_id', threadId)
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });
  if (messagesError) throw new Error(`Could not load conversation messages: ${messagesError.message}`);
  return { thread: thread as ChatThread, messages: rows ?? [] };
}

export async function renameChatThread(threadId: string, title: string): Promise<void> {
  const user = await requireSupabaseUser();
  const cleanTitle = title.trim();
  if (!cleanTitle || cleanTitle.length > 200) throw new Error('Conversation names must be 1–200 characters.');
  const { data, error } = await supabase
    .from('chat_threads')
    .update({ title: cleanTitle, updated_at: new Date().toISOString() })
    .eq('id', threadId)
    .eq('user_id', user.id)
    .select('id')
    .maybeSingle();
  if (error) throw new Error(`Could not rename conversation: ${error.message}`);
  if (!data) throw new Error('Conversation not found.');
}

export async function deleteChatThread(threadId: string): Promise<void> {
  const user = await requireSupabaseUser();

  // Match the web app's cleanup order; memories linked to this thread are private user data too.
  const { error: memoriesError } = await supabase
    .from('ai_memories')
    .delete()
    .eq('source_thread_id', threadId)
    .eq('user_id', user.id);
  if (memoriesError) throw new Error(`Could not remove conversation memories: ${memoriesError.message}`);

  const { data, error } = await supabase
    .from('chat_threads')
    .delete()
    .eq('id', threadId)
    .eq('user_id', user.id)
    .select('id')
    .maybeSingle();
  if (error) throw new Error(`Could not delete conversation: ${error.message}`);
  if (!data) throw new Error('Conversation not found.');
}
