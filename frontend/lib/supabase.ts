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

// Naya function add karte hain
export async function fetchYogaPricing(region: string) {
  const { data, error } = await supabase
    .from('yoga_pricing')
    .select('id, region, plan_type, monthly_price, total_price, savings, currency, strike_price, discounted_monthly_price, discount_percentage')
    .eq('region', region)

  if (error) {
    console.error('Error fetching yoga pricing:', error)
    return []
  }

  return data
}