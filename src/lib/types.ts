export type UserType = 'provider' | 'seeker'
export type PrivacyMode = 'public' | 'hidden' | 'anonymous'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'
export type SubscriptionPlan = 'standard' | 'premium' | 'elite'
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired'
export type EventCategory = 'social' | 'sports' | 'culture' | 'business' | 'wellness' | 'food'
export type RsvpStatus = 'attending' | 'interested' | 'cancelled'

export interface Profile {
  id: string
  name: string
  user_type: UserType
  avatar_url: string | null
  cover_url: string | null
  location: string | null
  bio: string | null
  mbti: string | null
  privacy_mode: PrivacyMode
  verified: boolean
  created_at: string
  updated_at: string
}

export interface ProviderProfile {
  id: string
  title: string | null
  skills: string[]
  hourly_rate: number | null
  session_types: string[]
  rating: number
  review_count: number
}

export interface Education {
  id: string
  profile_id: string
  degree: string
  school: string
  year: string | null
  created_at: string
}

export interface Experience {
  id: string
  profile_id: string
  role: string
  company: string
  years: string | null
  created_at: string
}

export interface Booking {
  id: string
  provider_id: string
  seeker_id: string
  session_type: string
  scheduled_at: string
  duration_minutes: number
  rate: number
  status: BookingStatus
  notes: string | null
  stripe_payment_id: string | null
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  reviewer_id: string
  provider_id: string
  booking_id: string | null
  rating: number
  text: string | null
  created_at: string
}

export interface Conversation {
  id: string
  participant1_id: string
  participant2_id: string
  created_at: string
  last_message_at: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  text: string
  attachment_url: string | null
  created_at: string
}

export interface Event {
  id: string
  host_id: string
  title: string
  description: string | null
  image_url: string | null
  category: EventCategory
  location: string
  start_at: string
  max_participants: number | null
  participant_count: number
  price: number
  created_at: string
  updated_at: string
}

export interface EventRsvp {
  id: string
  event_id: string
  user_id: string
  status: RsvpStatus
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  plan: SubscriptionPlan
  amount_monthly: number
  status: SubscriptionStatus
  stripe_subscription_id: string | null
  stripe_customer_id: string | null
  started_at: string
  renews_at: string | null
  cancelled_at: string | null
}

export interface SavedProfile {
  id: string
  user_id: string
  saved_profile_id: string
  created_at: string
}

// Enriched types (joined data from multiple tables)

export interface ProfileWithProvider extends Profile {
  provider_profile: ProviderProfile | null
  education: Education[]
  experience: Experience[]
}

export interface BookingWithProfiles extends Booking {
  provider: Profile
  seeker: Profile
}

export interface ReviewWithReviewer extends Review {
  reviewer: Profile
}

export interface MessageWithSender extends Message {
  sender: Profile
}

export interface ConversationWithParticipants extends Conversation {
  participant1: Profile
  participant2: Profile
  last_message: Message | null
}

export interface EventWithHost extends Event {
  host: Profile
  user_rsvp?: EventRsvp | null
}
