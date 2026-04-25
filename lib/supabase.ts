import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type UserRecord = {
  id: string
  clerk_id: string
  email: string
  subscription_tier: 'free' | 'starter' | 'pro' | 'max'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  questions_used: number
  created_at: string
}

export type Message = {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export type Conversation = {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

export type Note = {
  id: string
  user_id: string
  title: string
  content: string
  subject: string
  created_at: string
}
