/**
 * 客户端数据钩子（使用 SWR）
 * 工单 W1-03: 缓存策略
 * 
 * 为客户端组件提供带缓存的数据获取hooks
 */

'use client'

import useSWR, { type SWRConfiguration } from 'swr'
import { SWR_CONFIG, cacheKeys } from './config'
import type { 
  ContentType, 
  ContentFilters, 
  ContentListResult,
  ContentDetailResult
} from '@/lib/content'
import type { DashboardData } from '@/lib/dashboard/types'

/**
 * 通用 fetcher 函数
 */
async function fetcher<T>(fn: () => Promise<T>): Promise<T> {
  return fn()
}

/**
 * 使用 SWR 获取内容列表
 * 
 * @example
 * ```tsx
 * function VocabularyPage() {
 *   const { data, error, isLoading, mutate } = useContentList('medical_term', {
 *     page: 1,
 *     limit: 12
 *   })
 * 
 *   // 手动刷新
 *   const handleRefresh = () => mutate()
 * 
 *   return (...)
 * }
 * ```
 */
export function useContentList(
  type: ContentType,
  filters: ContentFilters = {},
  config?: SWRConfiguration
) {
  const key = cacheKeys.contentList(type, filters)
  
  return useSWR<ContentListResult>(
    key,
    async () => {
      const { getContentList } = await import('@/lib/content')
      return getContentList(type, filters)
    },
    {
      ...SWR_CONFIG.list,
      ...config,
    }
  )
}

/**
 * 使用 SWR 获取内容详情
 * 
 * @example
 * ```tsx
 * function LessonDetail({ slug }: { slug: string }) {
 *   const { data, error, isLoading } = useContentDetail('lesson', slug)
 *   
 *   if (error) return <ErrorDisplay error={error} />
 *   if (isLoading) return <Skeleton />
 *   
 *   return <div>{data.data?.title}</div>
 * }
 * ```
 */
export function useContentDetail(
  type: ContentType,
  slug: string,
  config?: SWRConfiguration
) {
  const key = cacheKeys.contentDetail(type, slug)
  
  return useSWR<ContentDetailResult>(
    key,
    async () => {
      const { getContentBySlug } = await import('@/lib/content')
      return getContentBySlug(type, slug)
    },
    {
      ...SWR_CONFIG.detail,
      ...config,
    }
  )
}

/**
 * 使用 SWR 获取 Dashboard 数据
 * 
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { data, error, isLoading, mutate } = useDashboard()
 *   
 *   // 用户操作后刷新
 *   const handleCompleteLesson = async () => {
 *     await completeLesson(lessonId)
 *     mutate() // 刷新 dashboard
 *   }
 *   
 *   return (...)
 * }
 * ```
 */
export function useDashboard(
  userId?: string,
  config?: SWRConfiguration
) {
  const key = cacheKeys.dashboard(userId)
  
  return useSWR<DashboardData>(
    key,
    async () => {
      const { getDashboardData } = await import('@/lib/dashboard/api')
      return getDashboardData()
    },
    {
      ...SWR_CONFIG.dashboard,
      ...config,
    }
  )
}

/**
 * 使用 SWR 获取 SRS 复习统计
 * 
 * @example
 * ```tsx
 * function SRSStats() {
 *   const { data, error, isLoading, mutate } = useSRSStats(userId)
 *   
 *   // 复习后刷新统计
 *   const handleReviewComplete = async () => {
 *     await submitReview(cardId, quality)
 *     mutate() // 刷新统计
 *   }
 *   
 *   return (...)
 * }
 * ```
 */
export function useSRSStats(
  userId: string,
  config?: SWRConfiguration
) {
  const key = cacheKeys.srsStats(userId)
  
  return useSWR(
    userId ? key : null, // 如果没有 userId，不发起请求
    async () => {
      const { getReviewStats } = await import('@/lib/srs/api')
      return getReviewStats()
    },
    {
      ...SWR_CONFIG.userData,
      ...config,
    }
  )
}

/**
 * 使用 SWR 获取用户进度
 * 
 * @example
 * ```tsx
 * function LessonProgress({ userId, lessonId }: Props) {
 *   const { data, error, isLoading, mutate } = useUserProgress(
 *     userId,
 *     'lesson',
 *     lessonId
 *   )
 *   
 *   // 更新进度后刷新
 *   const handleProgressUpdate = async (progress: number) => {
 *     await updateProgress('lesson', lessonId, progress)
 *     mutate() // 刷新进度
 *   }
 *   
 *   return (...)
 * }
 * ```
 */
export function useUserProgress(
  userId: string,
  contentType: 'lesson' | 'reading',
  contentId: string,
  config?: SWRConfiguration
) {
  const key = cacheKeys.userProgress(userId, contentType)
  
  return useSWR(
    userId && contentId ? key : null,
    async () => {
      const { getProgress } = await import('@/lib/progress/api')
      return getProgress(contentType, contentId)
    },
    {
      ...SWR_CONFIG.userData,
      ...config,
    }
  )
}

/**
 * 预加载内容列表（用于优化导航体验）
 *
 * @example
 * ```tsx
 * function NavLink() {
 *   const handleMouseEnter = () => {
 *     preloadContentList('medical_term', { page: 1, limit: 12 })
 *   }
 *
 *   return <a onMouseEnter={handleMouseEnter}>Medical Vocabulary</a>
 * }
 * ```
 */
export async function preloadContentList(
  type: ContentType,
  filters: ContentFilters = {}
) {
  const key = cacheKeys.contentList(type, filters)
  
  try {
    const { getContentList } = await import('@/lib/content')
    const { mutate } = await import('swr')
    
    // 使用 mutate 预加载数据到缓存
    await mutate(
      key,
      getContentList(type, filters),
      { revalidate: false }
    )
  } catch (error) {
    console.error('Preload failed:', error)
  }
}

/**
 * 预加载内容详情
 */
export async function preloadContentDetail(
  type: ContentType,
  slug: string
) {
  const key = cacheKeys.contentDetail(type, slug)
  
  try {
    const { getContentBySlug } = await import('@/lib/content')
    const { mutate } = await import('swr')
    
    await mutate(
      key,
      getContentBySlug(type, slug),
      { revalidate: false }
    )
  } catch (error) {
    console.error('Preload failed:', error)
  }
}
