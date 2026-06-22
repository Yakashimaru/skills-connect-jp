import { supabase } from './supabase'
import type { SubscriptionPlan } from './types'

export async function getActiveSubscription(userId: string) {
  return supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()
}

export async function createCheckoutSession(plan: SubscriptionPlan): Promise<{ url: string } | { error: string }> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Not authenticated' }

  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { plan },
  })
  if (error) return { error: error.message }
  return data as { url: string }
}

// Cancels via Stripe (cancel_at_period_end: true) then records cancelled_at in DB.
// Status stays 'active' until the billing period ends, at which point the
// stripe-webhook sets it to 'cancelled'. Do NOT update the DB directly here —
// only Stripe should be the source of truth for subscription state.
export async function cancelSubscription(): Promise<{ success: true } | { error: string }> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return { error: 'Not authenticated' }

  const { data, error } = await supabase.functions.invoke('cancel-subscription')
  if (error) return { error: error.message }
  return (data as { success: true }) ?? { success: true }
}
