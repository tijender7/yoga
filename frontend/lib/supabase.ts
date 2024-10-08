import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function fetchPricingPlans() {
  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*')

  if (error) {
    console.error('Error fetching pricing plans:', error)
    return []
  }

  return data
}
