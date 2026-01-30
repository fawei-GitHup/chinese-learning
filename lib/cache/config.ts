/**
 * 缓存策略配置
 * 工单 W1-03: 缓存策略
 * 
 * 为不同类型的内容定义缓存时间和策略
 */

/**
 * 缓存时间配置（秒）
 */
export const CACHE_TIMES = {
  /** Published 内容 - 1小时 */
  CONTENT: 3600,
  
  /** 列表页 - 30分钟 */
  LIST: 1800,
  
  /** 用户数据 (SRS、进度) - 1分钟 */
  USER_DATA: 60,
  
  /** Dashboard 聚合数据 - 5分钟 */
  DASHBOARD: 300,
  
  /** 详情页 - 1小时 */
  DETAIL: 3600,
  
  /** 静态内容 (很少改变) - 24小时 */
  STATIC: 86400,
} as const

/**
 * Next.js fetch 缓存选项
 */
export const NEXT_CACHE_OPTIONS = {
  /** Published 内容 */
  content: {
    next: {
      revalidate: CACHE_TIMES.CONTENT,
      tags: ['content'],
    },
  },
  
  /** 列表页 */
  list: {
    next: {
      revalidate: CACHE_TIMES.LIST,
      tags: ['list'],
    },
  },
  
  /** 用户数据 */
  userData: {
    next: {
      revalidate: CACHE_TIMES.USER_DATA,
      tags: ['user-data'],
    },
  },
  
  /** Dashboard 数据 */
  dashboard: {
    next: {
      revalidate: CACHE_TIMES.DASHBOARD,
      tags: ['dashboard'],
    },
  },
  
  /** 详情页 */
  detail: {
    next: {
      revalidate: CACHE_TIMES.DETAIL,
      tags: ['detail'],
    },
  },
  
  /** 静态内容 */
  static: {
    next: {
      revalidate: CACHE_TIMES.STATIC,
      tags: ['static'],
    },
  },
  
  /** 禁用缓存（用于实时数据） */
  noStore: {
    cache: 'no-store' as const,
  },
} as const

/**
 * SWR 配置选项
 */
export const SWR_CONFIG = {
  /** 默认配置 */
  default: {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 2000,
  },
  
  /** 内容列表 */
  list: {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    refreshInterval: 0, // 不自动刷新
  },
  
  /** 内容详情 */
  detail: {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000,
    refreshInterval: 0,
  },
  
  /** 用户数据 (需要实时) */
  userData: {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 1000,
    refreshInterval: 60000, // 每分钟刷新
  },
  
  /** Dashboard 数据 */
  dashboard: {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 3000,
    refreshInterval: 300000, // 每5分钟刷新
  },
} as const

/**
 * 缓存键生成器
 */
export const cacheKeys = {
  /** 内容列表 */
  contentList: (type: string, filters?: Record<string, any>) => {
    const filterStr = filters ? JSON.stringify(filters) : ''
    return `content:list:${type}:${filterStr}`
  },
  
  /** 内容详情 */
  contentDetail: (type: string, slug: string) => {
    return `content:detail:${type}:${slug}`
  },
  
  /** Dashboard 数据 */
  dashboard: (userId?: string) => {
    return userId ? `dashboard:${userId}` : 'dashboard:guest'
  },
  
  /** SRS 复习统计 */
  srsStats: (userId: string) => {
    return `srs:stats:${userId}`
  },
  
  /** 用户进度 */
  userProgress: (userId: string, contentType?: string) => {
    return contentType 
      ? `progress:${userId}:${contentType}`
      : `progress:${userId}:all`
  },
} as const

/** 导出类型 */
export type CacheKey = keyof typeof CACHE_TIMES
export type NextCacheOption = keyof typeof NEXT_CACHE_OPTIONS
export type SWRConfigOption = keyof typeof SWR_CONFIG
