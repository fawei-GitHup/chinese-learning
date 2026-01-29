import { createServerClient, createBrowserClient } from '@supabase/ssr'
import { Provider } from '@supabase/supabase-js'

export async function getSession() {
  const isServer = typeof window === 'undefined'

  const supabase = isServer
    ? createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: async () => {
              const { cookies: getCookies } = await import('next/headers')
              const cookieStore = await getCookies()
              return cookieStore.getAll()
            },
            setAll: async (cookiesToSet) => {
              const { cookies: getCookies } = await import('next/headers')
              const cookieStore = await getCookies()
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            }
          }
        }
      )
    : createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function signOut() {
  const isServer = typeof window === 'undefined'

  const supabase = isServer
    ? createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: async () => {
              const { cookies: getCookies } = await import('next/headers')
              const cookieStore = await getCookies()
              return cookieStore.getAll()
            },
            setAll: async (cookiesToSet) => {
              const { cookies: getCookies } = await import('next/headers')
              const cookieStore = await getCookies()
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            }
          }
        }
      )
    : createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function signInWithOAuth(provider: Provider, options?: { redirectTo?: string; scopes?: string }) {
  const isServer = typeof window === 'undefined'

  const supabase = isServer
    ? createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: async () => {
              const { cookies: getCookies } = await import('next/headers')
              const cookieStore = await getCookies()
              return cookieStore.getAll()
            },
            setAll: async (cookiesToSet) => {
              const { cookies: getCookies } = await import('next/headers')
              const cookieStore = await getCookies()
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options)
              })
            }
          }
        }
      )
    : createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: options?.redirectTo || '/auth/callback',
      scopes: options?.scopes,
      ...options
    }
  })
  return { data, error }
}

export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const isServer = typeof window === 'undefined'

  if (isServer) {
    // 在服务器端返回一个 no-op
    return {
      unsubscribe: () => {}
    }
  }

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return subscription
}