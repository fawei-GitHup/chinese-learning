/**
 * Supabase Server Client
 * 
 * 提供服务端 Supabase 客户端，用于：
 * - Server Components
 * - Route Handlers
 * - Server Actions
 * - Sitemap 生成
 * 
 * 遵循 Next.js App Router 最佳实践，使用 @supabase/ssr 包
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * 创建服务端 Supabase 客户端
 * 
 * 用于需要访问数据库的服务端场景（如 sitemap 生成、SSR 等）
 * 支持 cookie-based 认证状态管理
 * 
 * @returns Supabase 客户端实例
 * 
 * @example
 * ```typescript
 * import { createServerSupabaseClient } from '@/lib/supabase/server'
 * 
 * export async function getData() {
 *   const supabase = await createServerSupabaseClient()
 *   const { data, error } = await supabase
 *     .from('lessons')
 *     .select('*')
 *     .eq('status', 'published')
 *   
 *   return data
 * }
 * ```
 */
export async function createServerSupabaseClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase Server] 环境变量缺失，无法创建客户端')
    throw new Error('Supabase 环境变量未配置')
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}

/**
 * 创建只读的服务端 Supabase 客户端（用于公开数据查询）
 * 
 * 不依赖 cookies，适用于不需要用户认证的场景
 * 例如：sitemap 生成、公开内容查询等
 * 
 * @returns Supabase 客户端实例
 * 
 * @example
 * ```typescript
 * import { createReadonlyServerClient } from '@/lib/supabase/server'
 * 
 * export async function sitemap() {
 *   const supabase = createReadonlyServerClient()
 *   const { data } = await supabase
 *     .from('lessons')
 *     .select('id, slug, updated_at')
 *     .eq('status', 'published')
 *   
 *   return data || []
 * }
 * ```
 */
export function createReadonlyServerClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Supabase Server] 环境变量缺失，无法创建客户端')
    throw new Error('Supabase 环境变量未配置')
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return []
      },
      setAll() {
        // Readonly client doesn't set cookies
      },
    },
  })
}
