import { createClient } from '@supabase/supabase-js'

// These environment variables need to be set in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Debug info for Supabase configuration
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Supabase configuration:')
  console.log(`URL configured: ${supabaseUrl ? 'Yes' : 'No'}`)
  console.log(`URL length: ${supabaseUrl?.length || 0}`)
  console.log(`Anon key configured: ${supabaseAnonKey ? 'Yes' : 'No'}`)
  console.log(`Anon key length: ${supabaseAnonKey?.length || 0}`)
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ Missing Supabase environment variables. Please check your .env.local file.')
  }
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
}) 