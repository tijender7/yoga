import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unexpected error occurred')
        setLoading(false)
      }
    }

    getInitialSession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        if (event === 'SIGNED_IN') {
          try {
            // Call your backend API to create Razorpay customer
            const response = await fetch('/api/create-razorpay-customer', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: session?.user.id })
            })
            if (!response.ok) throw new Error('Failed to create Razorpay customer')
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to set up user profile')
          }
        }
      }
    )

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  return { user, loading, error, setUser }
}