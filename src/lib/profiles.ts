import { supabase } from './supabase'
import type { Profile, ProviderProfile, Education, Experience } from './types'

export async function getProfile(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      provider_profile:provider_profiles(*),
      education(*),
      experience(*)
    `)
    .eq('id', id)
    .single()

  if (error || !data) { console.error('[getProfile]', error); return null }
  return data
}

export async function updateProfile(id: string, updates: Partial<Profile>) {
  return supabase.from('profiles').update(updates).eq('id', id)
}

export async function updateProviderProfile(id: string, updates: Partial<ProviderProfile>) {
  return supabase.from('provider_profiles').upsert({ id, ...updates })
}

export async function searchProfiles(params: {
  locations?: string[]
  query?: string
  limit?: number
  offset?: number
}) {
  let q = supabase
    .from('profiles')
    .select('*, provider_profile:provider_profiles(*)')
    .eq('privacy_mode', 'public')
    .eq('user_type', 'provider')

  if (params.locations?.length) q = q.in('location', params.locations)
  if (params.query) q = q.ilike('name', `%${params.query}%`)
  if (params.limit) q = q.limit(params.limit)
  if (params.offset) {
    const end = params.offset + (params.limit ?? 10) - 1
    q = q.range(params.offset, end)
  }

  return q
}

export async function saveProfile(userId: string, profileId: string) {
  return supabase
    .from('saved_profiles')
    .upsert({ user_id: userId, saved_profile_id: profileId })
}

export async function unsaveProfile(userId: string, profileId: string) {
  return supabase
    .from('saved_profiles')
    .delete()
    .eq('user_id', userId)
    .eq('saved_profile_id', profileId)
}

export async function getSavedProfiles(userId: string) {
  return supabase
    .from('saved_profiles')
    .select('saved_profile_id, profile:profiles!saved_profile_id(*)')
    .eq('user_id', userId)
}

export async function addEducation(entry: Omit<Education, 'id' | 'created_at'>) {
  return supabase.from('education').insert(entry).select().single()
}

export async function removeEducation(id: string) {
  return supabase.from('education').delete().eq('id', id)
}

export async function addExperience(entry: Omit<Experience, 'id' | 'created_at'>) {
  return supabase.from('experience').insert(entry).select().single()
}

export async function removeExperience(id: string) {
  return supabase.from('experience').delete().eq('id', id)
}

export async function updateEducation(id: string, updates: { degree?: string; school?: string; year?: string | null }) {
  return supabase.from('education').update(updates).eq('id', id)
}

export async function updateExperience(id: string, updates: { role?: string; company?: string; years?: string | null }) {
  return supabase.from('experience').update(updates).eq('id', id)
}
