import { supabase } from './supabase'
import type { Booking, BookingStatus } from './types'

export async function createBooking(
  booking: Omit<Booking, 'id' | 'status' | 'stripe_payment_id' | 'created_at' | 'updated_at'>
) {
  return supabase.from('bookings').insert(booking).select().single()
}

export async function getBooking(id: string) {
  return supabase
    .from('bookings')
    .select('*, provider:profiles!provider_id(*), seeker:profiles!seeker_id(*)')
    .eq('id', id)
    .single()
}

export async function getBookingsForUser(userId: string, role: 'provider' | 'seeker') {
  const column = role === 'provider' ? 'provider_id' : 'seeker_id'
  return supabase
    .from('bookings')
    .select('*, provider:profiles!provider_id(*), seeker:profiles!seeker_id(*)')
    .eq(column, userId)
    .order('scheduled_at', { ascending: false })
}

export async function updateBookingStatus(id: string, status: BookingStatus) {
  return supabase.from('bookings').update({ status }).eq('id', id)
}
