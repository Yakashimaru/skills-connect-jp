import { supabase } from './supabase'
import type { Event, EventCategory, RsvpStatus } from './types'

export async function getEvents(params?: {
  category?: EventCategory
  location?: string
  limit?: number
  offset?: number
}) {
  let q = supabase
    .from('events')
    .select('*, host:profiles!host_id(*)')
    .gte('start_at', new Date().toISOString())
    .order('start_at', { ascending: true })

  if (params?.category) q = q.eq('category', params.category)
  if (params?.location) q = q.eq('location', params.location)
  if (params?.limit) q = q.limit(params.limit)
  if (params?.offset) {
    const end = params.offset + (params.limit ?? 10) - 1
    q = q.range(params.offset, end)
  }

  return q
}

export async function getEvent(id: string) {
  return supabase
    .from('events')
    .select('*, host:profiles!host_id(*)')
    .eq('id', id)
    .maybeSingle()
}

export async function createEvent(
  event: Omit<Event, 'id' | 'participant_count' | 'created_at' | 'updated_at'>
) {
  return supabase.from('events').insert(event).select().single()
}

export async function rsvpToEvent(
  eventId: string,
  userId: string,
  status: RsvpStatus = 'attending'
) {
  return supabase
    .from('event_rsvps')
    .upsert(
      { event_id: eventId, user_id: userId, status },
      { onConflict: 'event_id,user_id' }
    )
    .select()
    .single()
}

export async function cancelRsvp(eventId: string, userId: string) {
  return supabase
    .from('event_rsvps')
    .update({ status: 'cancelled' })
    .eq('event_id', eventId)
    .eq('user_id', userId)
}

export async function getUserRsvps(userId: string) {
  return supabase
    .from('event_rsvps')
    .select('*, event:events(*)')
    .eq('user_id', userId)
    .neq('status', 'cancelled')
}
