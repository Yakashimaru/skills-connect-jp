import { supabase } from './supabase'
import type { SubscriptionPlan } from './types'

export async function getActiveSubscription(userId: string) {
  // Use order + limit(1) instead of maybeSingle() so that legacy users who
  // ended up with multiple active rows (from the pre-fix re-subscribe bug)
  // don't get a PGRST116 error that silently makes them appear unsubscribed.
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
  return { data: data?.[0] ?? null, error }
}

// Checks any subscription row regardless of status — used to determine
// whether a user is a returning subscriber so the UI shows correct pricing.
export async function hasSubscribedBefore(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .limit(1)
    .maybeSingle()
  return !!data
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
