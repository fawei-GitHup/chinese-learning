'use client'

import React, { createContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Session, User, AuthChangeEvent } from '@supabase/supabase-js'
import { createBrowserClient } from '@/lib/supabase/client'

interface AuthContextType {
  session: Session | null
  user: User | null
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
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 获取 Supabase 客户端实例（单例）
    const supabase = createBrowserClient()

    // 初始化：获取当前 session
    const initSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('[AuthProvider] 获取 session 失败:', error.message)
        } else {
          setSession(currentSession)
          setUser(currentSession?.user ?? null)
        }
      } catch (err) {
        console.error('[AuthProvider] 初始化 session 时出错:', err)
      } finally {
        setLoading(false)
      }
    }

    // 调用初始化
    initSession()

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, newSession: Session | null) => {
        console.log('[AuthProvider] Auth state changed:', event)
        setSession(newSession)
        setUser(newSession?.user ?? null)
        setLoading(false)
      }
    )

    // 清理订阅
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    try {
      const supabase = createBrowserClient()
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('[AuthProvider] Sign out error:', error)
      } else {
        // 清空本地状态
        setSession(null)
        setUser(null)
        // 重定向到登录页
        router.replace('/login')
      }
    } catch (err) {
      console.error('[AuthProvider] Sign out 时出错:', err)
    }
  }, [router])

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  )
}