import { createServerClient } from '@supabase/ssr'
import { Provider, AuthChangeEvent, Session } from '@supabase/supabase-js'
import { createBrowserClient } from '@/lib/supabase/client'

/**
 * 创建服务端 Supabase 客户端
 * 仅用于服务端环境（Server Components, Route Handlers 等）
 */
async function createSupabaseServerClient() {
  const { cookies: getCookies } = await import('next/headers')
  const cookieStore = await getCookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        }
      }
    }
  )
}

/**
 * 获取当前用户的 session
 * 支持服务端和客户端调用
 */
export async function getSession() {
  const isServer = typeof window === 'undefined'

  const supabase = isServer
    ? await createSupabaseServerClient()
    : createBrowserClient()

  const { data: { session } } = await supabase.auth.getSession()
  return session
}

/**
 * 用户登出
 * 支持服务端和客户端调用
 */
export async function signOut() {
  const isServer = typeof window === 'undefined'

  const supabase = isServer
    ? await createSupabaseServerClient()
    : createBrowserClient()

  const { error } = await supabase.auth.signOut()
  return { error }
}

/**
 * 使用 OAuth 提供商登录
 * 只能在客户端调用（需要浏览器重定向）
 */
export async function signInWithOAuth(provider: Provider, options?: { redirectTo?: string; scopes?: string }) {
  const isServer = typeof window === 'undefined'

  if (isServer) {
    console.error('[Auth] signInWithOAuth 只能在客户端调用')
    return { data: null, error: new Error('signInWithOAuth 只能在客户端调用') }
  }

  const supabase = createBrowserClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: options?.redirectTo || `${window.location.origin}/auth/callback`,
      scopes: options?.scopes,
    }
  })
  return { data, error }
}

/**
 * 监听认证状态变化
 * 只能在客户端调用
 * 
 * @param callback 状态变化回调函数
 * @returns 包含 unsubscribe 方法的订阅对象
 */
export function onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  const isServer = typeof window === 'undefined'

  if (isServer) {
    // 在服务器端返回一个 no-op
    return {
      unsubscribe: () => {}
    }
  }

  const supabase = createBrowserClient()

  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return subscription
}