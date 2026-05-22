import { supabase } from './supabase'

export async function submitContact(params: {
  name: string
  email: string
  subject: string
  message: string
}) {
  return supabase.from('contact_messages').insert(params)
}
