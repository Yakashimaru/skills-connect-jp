import { supabase } from './supabase'
import type { Message } from './types'

export async function getOrCreateConversation(userId1: string, userId2: string) {
  // Sort IDs so the pair is always stored in a consistent order
  const [p1, p2] = [userId1, userId2].sort()

  const { data: existing } = await supabase
    .from('conversations')
    .select('*')
    .eq('participant1_id', p1)
    .eq('participant2_id', p2)
    .single()

  if (existing) return { data: existing, error: null }

  return supabase
    .from('conversations')
    .insert({ participant1_id: p1, participant2_id: p2 })
    .select()
    .single()
}

export async function getConversations(userId: string) {
  return supabase
    .from('conversations')
    .select(`
      *,
      participant1:profiles!participant1_id(*, provider_profile:provider_profiles(*)),
      participant2:profiles!participant2_id(*, provider_profile:provider_profiles(*))
    `)
    .or(`participant1_id.eq.${userId},participant2_id.eq.${userId}`)
    .order('last_message_at', { ascending: false })
}

export async function getMessages(conversationId: string) {
  return supabase
    .from('messages')
    .select('*, sender:profiles!sender_id(*)')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
}

export async function sendMessage(
  message: Pick<Message, 'conversation_id' | 'sender_id' | 'text' | 'attachment_url'>
) {
  return supabase.from('messages').insert(message).select().single()
}

export function subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => callback(payload.new as Message)
    )
    .subscribe()
}
