/**
 * Dashboard 模块 - API 函数
 *
 * 聚合各模块数据，为 Dashboard 提供统一接口
 */

import { createBrowserClient } from '@/lib/supabase/client'
import { getReviewStats, getReviewHistory } from '@/lib/srs/api'
import { getRecentProgress, getCompletionStats, getRecommendedNext } from '@/lib/progress/api'
import type {
  DashboardData,
  Activity,
  StreakData,
  RecommendedItem,
  GetRecentActivityParams,
  GetRecommendedContentParams,
} from './types'
import { lessons, readers, grammarEntries } from '@/lib/web-mock'

// ================================================================
// 1. 学习连续天数
// ================================================================

/**
 * 计算用户学习连续天数
 * 基于 user_srs_reviews 表
 */
export async function getUserStreak(): Promise<StreakData> {
  const supabase = createBrowserClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return {
      current: 0,
      longest: 0,
      lastActivityDate: null,
    }
  }

  // 获取所有复习记录，按日期分组
  const { data: reviews, error } = await supabase
    .from('user_srs_reviews')
    .select('reviewed_at')
    .eq('user_id', userData.user.id)
    .order('reviewed_at', { ascending: false })

  if (error || !reviews || reviews.length === 0) {
    return {
      current: 0,
      longest: 0,
      lastActivityDate: null,
    }
  }

  // 提取唯一的日期（YYYY-MM-DD）
  const uniqueDates = Array.from(
    new Set(reviews.map((r: any) => r.reviewed_at.split('T')[0]))
  ).sort((a, b) => b.localeCompare(a)) // 降序

  if (uniqueDates.length === 0) {
    return {
      current: 0,
      longest: 0,
      lastActivityDate: null,
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // 计算当前连续天数
  let currentStreak = 0
  const mostRecentDate = uniqueDates[0]

  // 如果最近一次学习是今天或昨天，开始计算连续天数
  if (mostRecentDate === today || mostRecentDate === yesterday) {
    let checkDate = mostRecentDate
    for (const date of uniqueDates) {
      if (date === checkDate) {
        currentStreak++
        // 移动到前一天
        const d = new Date(checkDate)
        d.setDate(d.getDate() - 1)
        checkDate = d.toISOString().split('T')[0]
      } else {
        break
      }
    }
  }

  // 计算最长连续天数
  let longestStreak = 0
  let tempStreak = 1
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i])
    const next = new Date(uniqueDates[i + 1])
    const diffDays = Math.round((current.getTime() - next.getTime()) / 86400000)

    if (diffDays === 1) {
      tempStreak++
    } else {
      longestStreak = Math.max(longestStreak, tempStreak)
      tempStreak = 1
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak)

  return {
    current: currentStreak,
    longest: longestStreak,
    lastActivityDate: uniqueDates[0],
  }
}

// ================================================================
// 2. 最近学习活动
// ================================================================

/**
 * 获取最近学习活动
 * 从 SRS reviews 和 user_progress 获取
 */
export async function getRecentActivity(
  params?: GetRecentActivityParams
): Promise<Activity[]> {
  const limit = params?.limit || 10

  const supabase = createBrowserClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return []
  }

  // 获取最近的复习记录
  let reviewQuery = supabase
    .from('user_srs_reviews')
    .select(`
      id,
      reviewed_at,
      quality,
      time_spent,
      card_id,
      user_srs_cards (
        content
      )
    `)
    .eq('user_id', userData.user.id)
    .order('reviewed_at', { ascending: false })
    .limit(limit)

  if (params?.startDate) {
    reviewQuery = reviewQuery.gte('reviewed_at', params.startDate)
  }
  if (params?.endDate) {
    reviewQuery = reviewQuery.lte('reviewed_at', params.endDate)
  }

  const { data: reviews, error: reviewError } = await reviewQuery

  // 获取学习进度记录
  const progressActivities = await getRecentProgress(limit)

  const activities: Activity[] = []

  // 转换复习记录为 Activity 格式
  if (reviews && !reviewError) {
    reviews.forEach((review: any) => {
      const cardContent = review.user_srs_cards?.content || {}
      const title = cardContent.front || '未知词汇'
      const qualityDesc = getQualityDescription(review.quality)

      activities.push({
        id: review.id,
        type: 'srs_review',
        title: `复习: ${title}`,
        description: cardContent.back || '',
        timestamp: review.reviewed_at,
        metadata: {
          quality: review.quality,
          duration: review.time_spent,
          result: qualityDesc,
        },
      })
    })
  }

  // 转换学习进度为 Activity 格式
  progressActivities.forEach((progress) => {
    const type = progress.content_type as 'lesson' | 'reading'
    activities.push({
      id: progress.id,
      type,
      title: progress.completed
        ? `完成${type === 'lesson' ? '课程' : '阅读'}`
        : `学习${type === 'lesson' ? '课程' : '阅读'}`,
      description: `进度: ${progress.progress_percentage}%`,
      timestamp: progress.updated_at,
      metadata: {
        contentId: progress.content_id,
        progress: progress.progress_percentage,
        completed: progress.completed,
      },
    })
  })

  // 按时间排序并返回前 N 条
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

/**
 * 获取质量描述
 */
function getQualityDescription(quality: number): string {
  switch (quality) {
    case 0:
      return '不认识'
    case 1:
    case 2:
      return '模糊'
    case 3:
    case 4:
      return '认识'
    case 5:
      return '简单'
    default:
      return '已复习'
  }
}

// ================================================================
// 3. 推荐内容
// ================================================================

/**
 * 获取推荐内容
 * 使用 W6-02 个性化推荐引擎
 */
export async function getRecommendedContent(
  params?: GetRecommendedContentParams
): Promise<RecommendedItem[]> {
  const limit = params?.limit || 6

  try {
    // 使用新的个性化推荐引擎
    const { getDashboardRecommendations } = await import('@/lib/recommendations')
    const recommendations = await getDashboardRecommendations(limit)

    // 转换为 RecommendedItem 格式
    return recommendations.map(rec => ({
      id: rec.content.id,
      type: rec.content.type as 'lesson' | 'reading' | 'grammar',
      title: rec.content.title,
      description: rec.content.description,
      level: rec.content.level,
      durationMin: rec.content.type === 'lesson' ? rec.content.estimated_minutes : undefined,
      wordCount: rec.content.type === 'reading' ? rec.content.word_count : undefined,
      tags: rec.content.tags,
      reason: rec.reason,
    }))
  } catch (error) {
    console.error('使用个性化推荐引擎失败，回退到默认推荐:', error)
    
    // 回退到默认推荐
    const userLevel = params?.userLevel || 'HSK1'
    const recommended: RecommendedItem[] = []

    // 获取智能推荐的下一步内容
    const nextRecommended = await getRecommendedNext()
    
    if (nextRecommended) {
      // 根据推荐类型查找内容
      if (nextRecommended.type === 'lesson') {
        const lesson = lessons.find((l) => l.id === nextRecommended.id)
        if (lesson) {
          recommended.push({
            id: lesson.id,
            type: 'lesson',
            title: lesson.title,
            description: lesson.summary,
            level: lesson.level,
            durationMin: lesson.durationMin,
            tags: lesson.tags,
            reason: nextRecommended.reason,
          })
        }
      } else if (nextRecommended.type === 'reading') {
        const reader = readers.find((r) => r.id === nextRecommended.id)
        if (reader) {
          recommended.push({
            id: reader.id,
            type: 'reading',
            title: reader.title,
            description: reader.summary,
            level: reader.level,
            wordCount: reader.wordCount,
            tags: reader.tags,
            reason: nextRecommended.reason,
          })
        }
      }
    }

    // 从 lessons 推荐
    const matchingLessons = lessons
      .filter((lesson) =>
        lesson.level === userLevel &&
        !recommended.some(r => r.id === lesson.id)
      )
      .slice(0, 2)

    matchingLessons.forEach((lesson) => {
      recommended.push({
        id: lesson.id,
        type: 'lesson',
        title: lesson.title,
        description: lesson.summary,
        level: lesson.level,
        durationMin: lesson.durationMin,
        tags: lesson.tags,
        reason: `适合 ${userLevel} 级别`,
      })
    })

    // 从 readers 推荐
    const matchingReaders = readers
      .filter((reader) =>
        reader.level === userLevel &&
        !recommended.some(r => r.id === reader.id)
      )
      .slice(0, 2)

    matchingReaders.forEach((reader) => {
      recommended.push({
        id: reader.id,
        type: 'reading',
        title: reader.title,
        description: reader.summary,
        level: reader.level,
        wordCount: reader.wordCount,
        tags: reader.tags,
        reason: `${reader.wordCount} 字，适合阅读练习`,
      })
    })

    // 从 grammar 推荐
    const matchingGrammar = grammarEntries
      .filter((entry) => entry.level === userLevel)
      .slice(0, 2)

    matchingGrammar.forEach((entry) => {
      recommended.push({
        id: entry.id,
        type: 'grammar',
        title: entry.pattern,
        description: entry.explanation,
        level: entry.level,
        tags: [],
        reason: '重要语法点',
      })
    })

    return recommended.slice(0, limit)
  }
}

// ================================================================
// 4. 学习时间统计
// ================================================================

/**
 * 获取学习时间统计（今日/本周）
 */
export async function getStudyTimeStats(): Promise<{
  today: number
  thisWeek: number
}> {
  const supabase = createBrowserClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { today: 0, thisWeek: 0 }
  }

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart.getTime() - 7 * 86400000)

  // 查询今日学习时间
  const { data: todayReviews } = await supabase
    .from('user_srs_reviews')
    .select('time_spent')
    .eq('user_id', userData.user.id)
    .gte('reviewed_at', todayStart.toISOString())

  // 查询本周学习时间
  const { data: weekReviews } = await supabase
    .from('user_srs_reviews')
    .select('time_spent')
    .eq('user_id', userData.user.id)
    .gte('reviewed_at', weekStart.toISOString())

  const todayMinutes = todayReviews
    ? Math.round(
        todayReviews.reduce((sum: number, r: any) => sum + (r.time_spent || 0), 0) / 60
      )
    : 0

  const weekMinutes = weekReviews
    ? Math.round(
        weekReviews.reduce((sum: number, r: any) => sum + (r.time_spent || 0), 0) / 60
      )
    : 0

  return {
    today: todayMinutes,
    thisWeek: weekMinutes,
  }
}

// ================================================================
// 5. 聚合 API：获取完整 Dashboard 数据
// ================================================================

/**
 * 获取完整的 Dashboard 数据
 * 
 * 并行获取所有数据以提高性能
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    // 并行获取所有数据
    const [reviewStats, streak, recentActivities, recommendedContent, studyTime] =
      await Promise.all([
        getReviewStats(),
        getUserStreak(),
        getRecentActivity({ limit: 10 }),
        getRecommendedContent({ limit: 6 }),
        getStudyTimeStats(),
      ])

    return {
      reviewStats,
      streak,
      recentActivities,
      recommendedContent,
      studyTime,
    }
  } catch (error) {
    console.error('获取 Dashboard 数据失败:', error)
    throw error
  }
}
