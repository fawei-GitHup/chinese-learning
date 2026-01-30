'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { Spinner } from '@/components/ui/spinner'
import { GlassCard } from '@/components/web/GlassCard'

function CallbackPageContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 从 URL 参数获取 redirect 路径，默认为 /dashboard
  const redirectPath = searchParams.get('redirect') || '/dashboard'

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createBrowserClient()

        // 获取当前 session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        setLoading(false)
        
        if (session) {
          // 登录成功，跳转到指定页面
          router.push(redirectPath)
        } else {
          // 如果没有 session，可能需要交换 code
          // Supabase 在某些情况下会自动处理，但如果失败则显示错误
          const errorMsg = sessionError?.message || 'Authentication failed. Please try again.'
          setError(errorMsg)
          setTimeout(() => router.push('/login'), 3000)
        }
      } catch (err) {
        setLoading(false)
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError('Failed to complete authentication: ' + errorMessage)
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    handleAuthCallback()
  }, [router, redirectPath])

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

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 ink-bg">
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/10 pointer-events-none" />
        <div className="flex flex-col items-center gap-4">
          <Spinner className="size-8 text-red-400" />
          <p className="text-white text-sm">正在验证登录...</p>
        </div>
      </div>
    }>
      <CallbackPageContent />
    </Suspense>
  )
}