/**
 * 服务端数据获取工具（带缓存）
 * 工单 W1-03: 缓存策略
 * 
 * 为 Server Components 提供带缓存的数据获取函数
 * 使用 Next.js 内置的 fetch 缓存机制
 */

import { unstable_cache } from 'next/cache'
import { CACHE_TIMES, cacheKeys } from './config'
import type { ContentType, ContentFilters, ContentListResult, ContentDetailResult } from '@/lib/content'

/**
 * 带缓存的内容列表获取
 * 
 * 使用 Next.js unstable_cache API 实现服务端缓存
 */
export async function getCachedContentList(
  type: ContentType,
  filters: ContentFilters = {}
): Promise<ContentListResult> {
  // 动态导入避免在客户端执行
  const { getContentList } = await import('@/lib/content')
  
  // 生成缓存键
  const cacheKey = cacheKeys.contentList(type, filters)
  
  // 使用 unstable_cache 包装
  const cachedFn = unstable_cache(
    async () => getContentList(type, filters),
    [cacheKey],
    {
      revalidate: CACHE_TIMES.LIST,
      tags: ['content-list', `content-list-${type}`],
    }
  )
  
  return cachedFn()
}

/**
 * 带缓存的内容详情获取
 */
export async function getCachedContentDetail(
  type: ContentType,
  slug: string
): Promise<ContentDetailResult> {
  const { getContentBySlug } = await import('@/lib/content')
  
  const cacheKey = cacheKeys.contentDetail(type, slug)
  
  const cachedFn = unstable_cache(
    async () => getContentBySlug(type, slug),
    [cacheKey],
    {
      revalidate: CACHE_TIMES.DETAIL,
      tags: ['content-detail', `content-detail-${type}`, `content-detail-${type}-${slug}`],
    }
  )
  
  return cachedFn()
}

/**
 * 带缓存的 Dashboard 数据获取
 */
export async function getCachedDashboardData() {
  const { getDashboardData } = await import('@/lib/dashboard/api')
  
  const cachedFn = unstable_cache(
    async () => getDashboardData(),
    ['dashboard-data'],
    {
      revalidate: CACHE_TIMES.DASHBOARD,
      tags: ['dashboard'],
    }
  )
  
  return cachedFn()
}

/**
 * 带缓存的 SRS 复习统计获取
 */
export async function getCachedReviewStats() {
  const { getReviewStats } = await import('@/lib/srs/api')
  
  const cachedFn = unstable_cache(
    async () => getReviewStats(),
    ['srs-review-stats'],
    {
      revalidate: CACHE_TIMES.USER_DATA,
      tags: ['srs-stats'],
    }
  )
  
  return cachedFn()
}

/**
 * 带缓存的用户进度获取
 */
export async function getCachedUserProgress(contentType: 'lesson' | 'reading', contentId: string) {
  const { getProgress } = await import('@/lib/progress/api')
  
  const cachedFn = unstable_cache(
    async () => getProgress(contentType, contentId),
    [`user-progress-${contentType}-${contentId}`],
    {
      revalidate: CACHE_TIMES.USER_DATA,
      tags: ['user-progress', `user-progress-${contentType}`],
    }
  )
  
  return cachedFn()
}

/**
 * 辅助函数：清除特定类型的缓存
 * 
 * 注意：这需要在 Server Actions 中使用
 */
export { revalidateTag, revalidatePath } from 'next/cache'
