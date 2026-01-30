/**
 * W6-02: 推荐系统工具函数
 * 
 * 用于构建用户画像、转换内容元数据等
 */

import type { HSKLevel, Lesson, Reader } from '@/lib/web-mock'
import type { UserProgress, ContentType } from '@/lib/progress/api'
import type { ReviewStats } from '@/lib/srs/types'
import type {
  UserProfile,
  UserLevel,
  UserInterests,
  UserBehavior,
  ContentMetadata,
  ContentDifficulty,
} from './types'

// ================================================================
// 用户画像构建
// ================================================================

/**
 * 从数据库数据构建完整用户画像
 */
export async function buildUserProfile(params: {
  user_level?: HSKLevel
  progress_list: UserProgress[]
  srs_stats?: ReviewStats
  placement_test_score?: number
}): Promise<UserProfile> {
  const { user_level, progress_list, srs_stats, placement_test_score } = params

  // 构建等级信息
  const level: UserLevel = {
    current: user_level || 'HSK2',  // 默认HSK2
    placement_test_score,
    estimated_level: user_level,
  }

  // 构建兴趣标签（目前从进度推断）
  const interests: UserInterests = inferInterestsFromProgress(progress_list)

  // 构建学习行为数据
  const behavior: UserBehavior = buildBehaviorFromProgress(progress_list, srs_stats)

  return {
    level,
    interests,
    behavior,
  }
}

/**
 * 从学习进度推断用户兴趣
 */
function inferInterestsFromProgress(progress_list: UserProgress[]): UserInterests {
  const tags: string[] = []
  const type_counts: Record<ContentType, number> = {
    lesson: 0,
    reading: 0,
  }

  // 统计各类型内容数量
  progress_list.forEach(progress => {
    type_counts[progress.content_type]++
  })

  // 根据完成数量推断偏好
  const preferred_content_types: any[] = []
  if (type_counts.lesson >= 3) preferred_content_types.push('lesson')
  if (type_counts.reading >= 3) preferred_content_types.push('reading')

  // 如果都没学过多少，默认推荐 lesson
  if (preferred_content_types.length === 0) {
    preferred_content_types.push('lesson', 'reading')
  }

  return {
    tags,
    preferred_content_types,
  }
}

/**
 * 从进度和SRS统计构建学习行为数据
 */
function buildBehaviorFromProgress(
  progress_list: UserProgress[],
  srs_stats?: ReviewStats
): UserBehavior {
  // 统计各类型完成数
  const completed_by_type = progress_list.reduce((acc, p) => {
    if (p.completed) {
      acc[p.content_type] = (acc[p.content_type] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  // 计算最近7天活动
  const now = new Date()
  const seven_days_ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const recent_activity_count = progress_list.filter(p => {
    const updated = new Date(p.updated_at)
    return updated >= seven_days_ago
  }).length

  // 获取最后活跃日期
  const sorted = [...progress_list].sort((a, b) => 
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  )
  const last_active_date = sorted[0]?.updated_at

  return {
    total_lessons_completed: completed_by_type['lesson'] || 0,
    total_readings_completed: completed_by_type['reading'] || 0,
    total_grammar_completed: 0,  // 暂无grammar进度追踪
    recent_activity_count,
    average_session_minutes: 15,  // 默认15分钟
    srs_vocab_count: srs_stats?.total_cards || 0,
    last_active_date,
  }
}

// ================================================================
// 内容元数据转换
// ================================================================

/**
 * 将 Lesson 转换为 ContentMetadata
 */
export function lessonToMetadata(lesson: Lesson): ContentMetadata {
  return {
    id: lesson.id,
    type: 'lesson',
    title: lesson.title,
    description: lesson.summary,
    level: lesson.level,
    difficulty: levelToDifficulty(lesson.level),
    tags: lesson.tags,
    estimated_minutes: lesson.durationMin,
    word_count: lesson.vocab.length,
    popularity_score: 50,  // 默认热度
    completion_rate: 0.7,  // 默认完成率
  }
}

/**
 * 将 Reader 转换为 ContentMetadata
 */
export function readerToMetadata(reader: Reader): ContentMetadata {
  return {
    id: reader.id,
    type: 'reading',
    title: reader.title,
    description: reader.summary,
    level: reader.level,
    difficulty: levelToDifficulty(reader.level),
    tags: reader.tags,
    estimated_minutes: Math.ceil(reader.wordCount / 150),  // 假设150字/分钟
    word_count: reader.wordCount,
    popularity_score: 50,
    completion_rate: 0.65,
  }
}

/**
 * 批量转换 Lessons 到 ContentMetadata
 */
export function lessonsToMetadata(lessons: Lesson[]): ContentMetadata[] {
  return lessons.map(lessonToMetadata)
}

/**
 * 批量转换 Readers 到 ContentMetadata
 */
export function readersToMetadata(readers: Reader[]): ContentMetadata[] {
  return readers.map(readerToMetadata)
}

/**
 * 合并所有内容为统一的 ContentMetadata 数组
 */
export function aggregateAllContent(params: {
  lessons: Lesson[]
  readers: Reader[]
}): ContentMetadata[] {
  const { lessons, readers } = params
  return [
    ...lessonsToMetadata(lessons),
    ...readersToMetadata(readers),
  ]
}

// ================================================================
// 辅助函数
// ================================================================

/**
 * HSK 等级映射到难度
 */
function levelToDifficulty(level: HSKLevel): ContentDifficulty {
  const mapping: Record<HSKLevel, ContentDifficulty> = {
    'HSK1': 'beginner',
    'HSK2': 'elementary',
    'HSK3': 'intermediate',
    'HSK4': 'intermediate',
    'HSK5': 'advanced',
    'HSK6': 'mastery',
  }
  return mapping[level] || 'elementary'
}

/**
 * 从完成ID列表提取内容ID
 */
export function extractCompletedIds(progress_list: UserProgress[]): string[] {
  return progress_list
    .filter(p => p.completed)
    .map(p => p.content_id)
}

/**
 * 估算用户HSK等级（如果没有明确等级）
 */
export function estimateUserLevel(progress_list: UserProgress[]): HSKLevel {
  const completed_count = progress_list.filter(p => p.completed).length

  if (completed_count === 0) return 'HSK1'
  if (completed_count < 5) return 'HSK1'
  if (completed_count < 10) return 'HSK2'
  if (completed_count < 20) return 'HSK3'
  if (completed_count < 35) return 'HSK4'
  if (completed_count < 50) return 'HSK5'
  return 'HSK6'
}

/**
 * 格式化推荐理由（添加emoji）
 */
export function formatRecommendationReason(reason: string): string {
  let formatted = reason

  // 添加emoji
  if (reason.includes('适合')) formatted = '🎯 ' + formatted
  else if (reason.includes('挑战')) formatted = '💪 ' + formatted
  else if (reason.includes('兴趣')) formatted = '❤️ ' + formatted
  else if (reason.includes('进度')) formatted = '📈 ' + formatted
  else if (reason.includes('新')) formatted = '✨ ' + formatted
  else if (reason.includes('热门')) formatted = '🔥 ' + formatted
  else formatted = '💡 ' + formatted

  return formatted
}

/**
 * 获取推荐类型的显示文本
 */
export function getContentTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    'lesson': '课程',
    'reading': '阅读',
    'grammar': '语法',
    'medical': '医学',
  }
  return labels[type] || type
}

/**
 * 获取难度等级的显示文本
 */
export function getDifficultyLabel(difficulty: ContentDifficulty): string {
  const labels: Record<ContentDifficulty, string> = {
    'beginner': '入门',
    'elementary': '初级',
    'intermediate': '中级',
    'advanced': '高级',
    'mastery': '精通',
  }
  return labels[difficulty] || difficulty
}
