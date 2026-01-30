/**
 * W6-02: 个性化推荐系统 - 类型定义
 */

import type { HSKLevel } from '@/lib/web-mock'
import type { RecommendedContentType as DashboardContentType } from '@/lib/dashboard/types'

// 重新导出以便内部使用
export type RecommendedContentType = DashboardContentType

// ================================================================
// 用户画像 User Profile
// ================================================================

/**
 * 用户等级信息
 */
export interface UserLevel {
  current: HSKLevel  // 当前HSK等级
  placement_test_score?: number  // 分级测试分数
  estimated_level?: HSKLevel  // 估算等级
}

/**
 * 用户兴趣标签
 */
export interface UserInterests {
  tags: string[]  // 兴趣标签数组 ["business", "culture", "travel"]
  medical_focus?: string  // 医学专业方向 (如果有)
  preferred_content_types: RecommendedContentType[]  // 偏好的内容类型
}

/**
 * 用户学习行为数据
 */
export interface UserBehavior {
  total_lessons_completed: number
  total_readings_completed: number
  total_grammar_completed: number
  recent_activity_count: number  // 最近7天活动次数
  average_session_minutes: number  // 平均学习时长
  preferred_difficulty?: 'easy' | 'medium' | 'hard'  // 偏好难度
  srs_vocab_count: number  // SRS词汇总数
  last_active_date?: string  // 最后活跃日期
}

/**
 * 完整用户画像
 */
export interface UserProfile {
  level: UserLevel
  interests: UserInterests
  behavior: UserBehavior
}

// ================================================================
// 内容元数据 Content Metadata
// ================================================================

/**
 * 内容难度
 */
export type ContentDifficulty = 'beginner' | 'elementary' | 'intermediate' | 'advanced' | 'mastery'

/**
 * 内容元数据（扩展版）
 */
export interface ContentMetadata {
  id: string
  type: RecommendedContentType | 'medical'  // 支持医学内容
  title: string
  description: string
  level: HSKLevel
  difficulty: ContentDifficulty
  tags: string[]
  estimated_minutes: number
  word_count?: number
  popularity_score?: number  // 热度分数（访问量/收藏数）
  completion_rate?: number  // 完成率
}

// ================================================================
// 推荐评分因子 Recommendation Factors
// ================================================================

/**
 * 推荐评分详情
 */
export interface RecommendationScore {
  total: number  // 总分 (0-100)
  factors: {
    level_match: number  // 等级匹配度 (0-30)
    progress_continuity: number  // 进度连续性 (0-25)
    interest_relevance: number  // 兴趣相关性 (0-20)
    diversity_bonus: number  // 多样性加分 (0-10)
    freshness_bonus: number  // 新鲜度加分 (0-10)
    popularity_bonus: number  // 热度加分 (0-5)
  }
  penalties: {
    already_completed: number  // 已完成惩罚 (-50)
    too_difficult: number  // 过难惩罚 (-20)
    too_easy: number  // 过易惩罚 (-15)
  }
}

/**
 * 推荐结果项
 */
export interface RecommendationResult {
  content: ContentMetadata
  score: RecommendationScore
  reason: string  // 推荐理由（用户可见）
  debug_info?: string  // 调试信息（开发用）
}

// ================================================================
// 推荐配置 Recommendation Config
// ================================================================

/**
 * 推荐算法配置
 */
export interface RecommendationConfig {
  max_results: number  // 最多返回结果数
  diversity_threshold: number  // 多样性阈值（不同类型内容比例）
  min_score: number  // 最低分数阈值
  prefer_incomplete: boolean  // 是否优先推荐未完成内容
  include_medical: boolean  // 是否包含医学内容
  boost_next_level: boolean  // 是否提升下一级别内容权重
}

/**
 * 默认推荐配置
 */
export const DEFAULT_RECOMMENDATION_CONFIG: RecommendationConfig = {
  max_results: 6,
  diversity_threshold: 0.5,  // 至少50%的内容类型多样性
  min_score: 20,  // 最低20分
  prefer_incomplete: true,
  include_medical: true,
  boost_next_level: true,
}

// ================================================================
// 推荐上下文 Recommendation Context
// ================================================================

/**
 * 推荐上下文（在特定页面的推荐）
 */
export interface RecommendationContext {
  page: 'dashboard' | 'path' | 'lesson_complete' | 'reading_complete'
  current_content_id?: string  // 当前内容ID
  current_content_type?: RecommendedContentType  // 当前内容类型
  limit?: number  // 本次推荐数量限制
}

// ================================================================
// 导出推荐引擎接口
// ================================================================

/**
 * 推荐引擎输入参数
 */
export interface RecommendationInput {
  user_profile: UserProfile
  available_content: ContentMetadata[]
  completed_content_ids: string[]
  context?: RecommendationContext
  config?: Partial<RecommendationConfig>
}

/**
 * 推荐引擎输出
 */
export interface RecommendationOutput {
  recommendations: RecommendationResult[]
  user_profile_summary: string  // 用户画像摘要
  algorithm_version: string  // 算法版本
}
