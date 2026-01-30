import { useContext } from 'react'
import { AuthContext } from '@/components/auth/AuthProvider'
import type { Session, User } from '@supabase/supabase-js'

/**
 * 认证状态 Hook
 * 
 * 提供当前用户的认证状态和登出功能
 * 必须在 AuthProvider 内部使用
 * 
 * @returns 包含 session, user, loading, signOut 的认证状态对象
 * @throws {Error} 如果在 AuthProvider 外部使用
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, session, loading, signOut } = useAuth()
 * 
 *   if (loading) return <div>Loading...</div>
 *   if (!session) return <div>Please login</div>
 * 
 *   return (
 *     <div>
 *       <p>Welcome, {user?.email}</p>
 *       <button onClick={signOut}>Logout</button>
 *     </div>
 *   )
 * }
 * ```
 */
export function useAuth(): {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
} {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}