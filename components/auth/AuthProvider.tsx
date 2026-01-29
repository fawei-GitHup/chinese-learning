'use client'

import React, { createContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'
import { onAuthStateChange, signOut } from '@/lib/supabase/auth'

interface AuthContextType {
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { unsubscribe } = onAuthStateChange((event, session) => {
      setSession(session)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      console.error('Sign out error:', error)
    } else {
      router.replace('/login')
    }
  }

  return (
    <AuthContext.Provider value={{ session, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}