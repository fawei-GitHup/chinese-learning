/**
 * Dashboard 模块 - 类型定义
 * 
 * 用于学习总览 Dashboard 的数据类型
 */

import type { ReviewStats } from '@/lib/srs/types'

// ================================================================
// 学习活动类型
// ================================================================

/**
 * 活动类型
 */
export type ActivityType = 
  | 'srs_review'      // SRS 复习
  | 'lesson'          // 课程学习
  | 'reading'         // 阅读
  | 'grammar'         // 语法学习

/**
 * 学习活动记录
 */
export interface Activity {
  id: string
  type: ActivityType
  title: string
  description?: string
  timestamp: string       // ISO 8601
  metadata?: {
    quality?: number      // SRS 复习质量 (0-5)
    duration?: number     // 学习时长（秒）
    result?: string       // 活动结果描述
    [key: string]: any
  }
}

// ================================================================
// 连续天数类型
// ================================================================

/**
 * 学习连续天数数据
 */
export interface StreakData {
  current: number         // 当前连续天数
  longest: number         // 最长连续天数
  lastActivityDate: string | null  // 最后活动日期 (YYYY-MM-DD)
}

// ================================================================
// 推荐内容类型
// ================================================================

/**
 * 推荐内容类型
 */
export type RecommendedContentType = 'lesson' | 'reading' | 'grammar'

/**
 * 推荐内容项
 */
export interface RecommendedItem {
  id: string
  type: RecommendedContentType
  title: string
  description: string
  level: string           // HSK1, HSK2 等
  durationMin?: number    // 预计学习时长
  wordCount?: number      // 词数（仅 reading）
  tags: string[]
  reason?: string         // 推荐理由
}

// ================================================================
// Dashboard 核心数据
// ================================================================

/**
 * Dashboard 完整数据
 */
export interface DashboardData {
  // SRS 统计
  reviewStats: ReviewStats
  
  // 连续天数
  streak: StreakData
  
  // 最近活动
  recentActivities: Activity[]
  
  // 推荐内容
  recommendedContent: RecommendedItem[]
  
  // 学习时间（今日/本周）
  studyTime: {
    today: number         // 分钟
    thisWeek: number      // 分钟
  }
}

// ================================================================
// API 参数类型
// ================================================================

/**
 * 获取最近活动的参数
 */
export interface GetRecentActivityParams {
  limit?: number
  types?: ActivityType[]
  startDate?: string      // ISO 8601
  endDate?: string        // ISO 8601
}

/**
 * 获取推荐内容的参数
 */
export interface GetRecommendedContentParams {
  userLevel?: string      // 用户 HSK 级别
  limit?: number
  types?: RecommendedContentType[]
  excludeCompleted?: boolean
}
