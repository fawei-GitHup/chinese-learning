/**
 * Supabase Browser Client
 *
 * 提供 Web 端 Supabase 客户端的创建和环境变量校验功能。
 * 遵循 Next.js App Router 最佳实践，使用 @supabase/ssr 包。
 */

import { createBrowserClient as createSupabaseBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

// 环境变量配置类型
interface SupabaseConfig {
  url: string
  anonKey: string
}

// 自定义错误类，用于环境变量缺失场景
export class SupabaseEnvError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SupabaseEnvError'
  }
}

/**
 * 验证 Supabase 环境变量是否存在
 * 缺失时会在控制台输出错误并抛出友好错误
 *
 * @returns 包含 url 和 anonKey 的配置对象
 * @throws {SupabaseEnvError} 当环境变量缺失时抛出
 */
export function validateSupabaseEnv(): SupabaseConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const missingVars: string[] = []

  if (!url) {
    missingVars.push('NEXT_PUBLIC_SUPABASE_URL')
  }

  if (!anonKey) {
    missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  }

  if (missingVars.length > 0) {
    const errorMessage = `Supabase 配置错误: 缺少必需的环境变量 - ${missingVars.join(', ')}。请在 .env.local 文件中设置这些变量。`

    // 在控制台输出详细错误信息
    console.error('========================================')
    console.error('[Supabase Client] 环境变量校验失败')
    console.error('----------------------------------------')
    console.error(`缺少以下环境变量: ${missingVars.join(', ')}`)
    console.error('')
    console.error('解决方案:')
    console.error('1. 在项目根目录创建或编辑 .env.local 文件')
    console.error('2. 添加以下配置:')
    console.error('   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url')
    console.error('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key')
    console.error('')
    console.error('您可以在 Supabase 项目设置中找到这些值:')
    console.error('https://supabase.com/dashboard/project/_/settings/api')
    console.error('========================================')

    throw new SupabaseEnvError(errorMessage)
  }

  // 此时 url 和 anonKey 一定存在，使用类型断言
  return { url: url as string, anonKey: anonKey as string }
}

// 单例模式：缓存浏览器客户端实例
let browserClient: SupabaseClient | null = null

/**
 * 创建并返回 Supabase 浏览器端客户端
 *
 * 使用单例模式确保整个应用中只创建一个客户端实例，
 * 避免多次实例化带来的性能开销。
 *
 * @returns Supabase 客户端实例
 * @throws {SupabaseEnvError} 当环境变量缺失时抛出
 *
 * @example
 * ```typescript
 * import { createBrowserClient } from '@/lib/supabase/client'
 *
 * // 获取客户端实例
 * const supabase = createBrowserClient()
 *
 * // 获取当前 session
 * const { data: { session } } = await supabase.auth.getSession()
 *
 * // 监听认证状态变化
 * supabase.auth.onAuthStateChange((event, session) => {
 *   console.log('Auth state changed:', event, session)
 * })
 * ```
 */
export function createBrowserClient(): SupabaseClient {
  // 如果已有缓存的客户端实例，直接返回
  if (browserClient) {
    return browserClient
  }

  // 验证环境变量
  const { url, anonKey } = validateSupabaseEnv()

  // 创建新的客户端实例
  browserClient = createSupabaseBrowserClient(url, anonKey)

  return browserClient
}

/**
 * 获取当前用户 session 的便捷方法
 *
 * @returns Promise<session | null> 当前用户的 session，未登录时返回 null
 * @throws {SupabaseEnvError} 当环境变量缺失时抛出
 *
 * @example
 * ```typescript
 * import { getSession } from '@/lib/supabase/client'
 *
 * const session = await getSession()
 * if (session) {
 *   console.log('User is logged in:', session.user.email)
 * }
 * ```
 */
export async function getSession() {
  const supabase = createBrowserClient()
  const { data: { session }, error } = await supabase.auth.getSession()

  if (error) {
    console.error('[Supabase Client] 获取 session 失败:', error.message)
    return null
  }

  return session
}

/**
 * 获取当前登录用户的便捷方法
 *
 * @returns Promise<user | null> 当前登录用户，未登录时返回 null
 * @throws {SupabaseEnvError} 当环境变量缺失时抛出
 *
 * @example
 * ```typescript
 * import { getUser } from '@/lib/supabase/client'
 *
 * const user = await getUser()
 * if (user) {
 *   console.log('Current user:', user.email)
 * }
 * ```
 */
export async function getUser() {
  const supabase = createBrowserClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error) {
    console.error('[Supabase Client] 获取用户失败:', error.message)
    return null
  }

  return user
}

// 默认导出 createBrowserClient 函数
export default createBrowserClient
