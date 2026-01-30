/**
 * W6-02: 推荐系统 API
 * 
 * 对外统一接口，集成用户数据并返回个性化推荐
 */

import { createBrowserClient } from '@/lib/supabase/client'
import { getReviewStats } from '@/lib/srs/api'
import { getRecentProgress, getCompletionStats } from '@/lib/progress/api'
import { lessons, readers, type HSKLevel } from '@/lib/web-mock'
import { createRecommendationEngine } from './engine'
import {
  buildUserProfile,
  aggregateAllContent,
  extractCompletedIds,
  estimateUserLevel,
} from './utils'
import type {
  RecommendationResult,
  RecommendationContext,
  RecommendationConfig,
} from './types'

// ================================================================
// 主推荐 API
// ================================================================

/**
 * 获取个性化推荐内容
 * 
 * @param context 推荐上下文（可选）
 * @param config 推荐配置（可选）
 * @returns 推荐结果数组
 */
export async function getPersonalizedRecommendations(
  context?: RecommendationContext,
  config?: Partial<RecommendationConfig>
): Promise<RecommendationResult[]> {
  const supabase = createBrowserClient()

  // 1. 获取当前用户
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    // 未登录用户返回默认推荐
    return getDefaultRecommendations()
  }

  try {
    // 2. 并行获取用户数据
    const [progressList, srsStats] = await Promise.all([
      getRecentProgress(50),  // 获取最近50条学习记录
      getReviewStats().catch(() => undefined),
    ])

    //  3. 获取用户等级（暂时使用估算）
    const userLevel = estimateUserLevel(progressList)

    // 4. 构建用户画像
    const userProfile = await buildUserProfile({
      user_level: userLevel,
      progress_list: progressList,
      srs_stats: srsStats,
    })

    // 5. 聚合所有可用内容
    const availableContent = aggregateAllContent({
      lessons,
      readers,
      // 可以在这里添加 grammar 和 medical 内容
    })

    // 6. 提取已完成内容IDs
    const completedIds = extractCompletedIds(progressList)

    // 7. 创建推荐引擎并生成推荐
    const engine = createRecommendationEngine(config)
    const output = engine.generate({
      user_profile: userProfile,
      available_content: availableContent,
      completed_content_ids: completedIds,
      context,
      config,
    })

    return output.recommendations
  } catch (error) {
    console.error('生成个性化推荐失败:', error)
    return getDefaultRecommendations()
  }
}

/**
 * 获取Dashboard推荐（快捷方法）
 */
export async function getDashboardRecommendations(
  limit: number = 6
): Promise<RecommendationResult[]> {
  return getPersonalizedRecommendations(
    {
      page: 'dashboard',
      limit,
    },
    {
      max_results: limit,
      diversity_threshold: 0.6,
      prefer_incomplete: true,
    }
  )
}

/**
 * 获取学习路径推荐（快捷方法）
 */
export async function getPathRecommendations(
  level: HSKLevel,
  limit: number = 8
): Promise<RecommendationResult[]> {
  return getPersonalizedRecommendations(
    {
      page: 'path',
      limit,
    },
    {
      max_results: limit,
      diversity_threshold: 0.5,
      prefer_incomplete: true,
    }
  )
}

/**
 * 获取完成内容后的推荐（快捷方法）
 */
export async function getPostCompletionRecommendations(
  completedType: 'lesson' | 'reading',
  completedId: string,
  limit: number = 3
): Promise<RecommendationResult[]> {
  const page = completedType === 'lesson' ? 'lesson_complete' : 'reading_complete'
  
  return getPersonalizedRecommendations(
    {
      page,
      current_content_id: completedId,
      current_content_type: completedType,
      limit,
    },
    {
      max_results: limit,
      diversity_threshold: 0.7,
    }
  )
}

// ================================================================
// 默认推荐（未登录或出错时使用）
// ================================================================

/**
 * 获取默认推荐（未登录用户或错误回退）
 */
function getDefaultRecommendations(): RecommendationResult[] {
  // 返回一些HSK1-HSK2的热门内容
  const defaultContent = [
    ...lessons.filter(l => l.level === 'HSK1' || l.level === 'HSK2').slice(0, 3),
    ...readers.filter(r => r.level === 'HSK1' || r.level === 'HSK2').slice(0, 3),
  ]

  return defaultContent.map((content, index) => {
    const isLesson = 'dialogue' in content
    return {
      content: {
        id: content.id,
        type: isLesson ? 'lesson' : 'reading',
        title: content.title,
        description: content.summary,
        level: content.level,
        difficulty: content.level === 'HSK1' ? 'beginner' : 'elementary',
        tags: content.tags,
        estimated_minutes: isLesson ? (content as any).durationMin : Math.ceil((content as any).wordCount / 150),
        word_count: isLesson ? (content as any).vocab.length : (content as any).wordCount,
        popularity_score: 80 - index * 5,
      },
      score: {
        total: 70 - index * 5,
        factors: {
          level_match: 20,
          progress_continuity: 10,
          interest_relevance: 15,
          diversity_bonus: 10,
          freshness_bonus: 10,
          popularity_bonus: 5,
        },
        penalties: {
          already_completed: 0,
          too_difficult: 0,
          too_easy: 0,
        },
      },
      reason: '适合初学者',
    }
  })
}

// ================================================================
// 推荐刷新和缓存管理
// ================================================================

/**
 * 触发推荐刷新（在用户完成内容、修改偏好后调用）
 * 
 * 注意：当前版本不使用缓存，直接重新计算
 * 未来可以集成 SWR 或 React Query 进行缓存管理
 */
export async function refreshRecommendations(): Promise<void> {
  // 目前不需要做任何事，因为每次都是实时计算
  // 未来可以在这里清除缓存
  console.log('推荐已刷新（实时计算）')
}

/**
 * 记录推荐点击（用于优化算法）
 * 
 * 未来功能：记录用户对推荐的点击，用于优化推荐算法
 */
export async function recordRecommendationClick(
  recommendationId: string,
  contentType: string
): Promise<void> {
  // 未来实现：将点击记录到数据库
  console.log('推荐点击记录:', recommendationId, contentType)
}

/**
 * 记录推荐反馈（点赞/点踩）
 * 
 * 未来功能：允许用户对推荐反馈，优化算法
 */
export async function recordRecommendationFeedback(
  recommendationId: string,
  feedback: 'like' | 'dislike'
): Promise<void> {
  // 未来实现：记录反馈到数据库
  console.log('推荐反馈:', recommendationId, feedback)
}
