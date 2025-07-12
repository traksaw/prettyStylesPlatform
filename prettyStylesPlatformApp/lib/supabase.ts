import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.DATABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please check your .env file.")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  avatar_url?: string
  provider: "email" | "google" | "facebook" | "apple"
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  user_id: string
  service_name: string
  service_price: number
  service_duration: string
  appointment_date: string
  appointment_time: string
  status: "confirmed" | "rescheduled" | "cancelled" | "completed"
  deposit_paid: number
  remaining_balance: number
  notes?: string
  cancellation_reason?: string
  deposit_refunded?: boolean
  created_at: string
  updated_at: string
  rescheduled_at?: string
  cancelled_at?: string
}

export interface Review {
  id: string
  booking_id: string
  user_id: string
  user_name: string
  user_avatar?: string
  service_name: string
  rating: number
  comment: string
  photos?: string[]
  helpful_count: number
  verified: boolean
  created_at: string
  updated_at: string
}
