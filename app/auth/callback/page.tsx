'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Spinner } from '@/components/ui/spinner'
import { GlassCard } from '@/components/web/GlassCard'

export default function CallbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    supabase.auth.getSession().then(({ data: { session }, error: sessionError }) => {
      setLoading(false)
      if (session) {
        router.push('/dashboard')
      } else {
        const errorMsg = sessionError?.message || 'Authentication failed'
        setError(errorMsg)
        setTimeout(() => router.push('/login'), 3000)
      }
    }).catch((err) => {
      setLoading(false)
      setError('Failed to get session: ' + err.message)
      setTimeout(() => router.push('/login'), 3000)
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 ink-bg">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/10 pointer-events-none" />
      {loading && (
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-8 text-red-400" />
          <p className="text-white text-sm">正在验证登录...</p>
        </div>
      )}
      {error && (
        <GlassCard className="p-6 max-w-md">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-900/20 border border-red-800/30">
                <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">登录失败</h2>
            <p className="text-zinc-400 mb-4">{error}</p>
            <p className="text-sm text-zinc-500">正在跳转到登录页面...</p>
          </div>
        </GlassCard>
      )}
    </div>
  )
}