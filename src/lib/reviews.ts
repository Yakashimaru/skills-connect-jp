import { supabase } from './supabase'
import type { Review } from './types'

export async function getReviews(providerId: string) {
  return supabase
    .from('reviews')
    .select('*, reviewer:profiles!reviewer_id(*)')
    .eq('provider_id', providerId)
    .order('created_at', { ascending: false })
}

export async function createReview(review: Omit<Review, 'id' | 'created_at'>) {
  return supabase.from('reviews').insert(review).select().single()
}

export async function updateReview(id: string, updates: Pick<Review, 'rating' | 'text'>) {
  return supabase.from('reviews').update(updates).eq('id', id)
}
