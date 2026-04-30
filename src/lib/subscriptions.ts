import { supabase } from './supabase'
import type { Subscription } from './types'

export async function getActiveSubscription(userId: string) {
  return supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()
}

export async function createSubscription(
  subscription: Omit<Subscription, 'id' | 'started_at'>
) {
  return supabase.from('subscriptions').insert(subscription).select().single()
}

export async function cancelSubscription(id: string) {
  return supabase
    .from('subscriptions')
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq('id', id)
}
