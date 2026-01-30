/**
 * W6-02: 个性化推荐算法引擎
 * 
 * 基于用户等级、兴趣、学习行为的智能推荐系统
 */

import type {
  UserProfile,
  ContentMetadata,
  RecommendationScore,
  RecommendationResult,
  RecommendationInput,
  RecommendationOutput,
  RecommendationConfig,
  RecommendedContentType,
} from './types'
import { DEFAULT_RECOMMENDATION_CONFIG } from './types'

// ================================================================
// 推荐算法核心引擎
// ================================================================

export class RecommendationEngine {
  private config: RecommendationConfig

  constructor(config?: Partial<RecommendationConfig>) {
    this.config = { ...DEFAULT_RECOMMENDATION_CONFIG, ...config }
  }

  /**
   * 生成个性化推荐
   */
  generate(input: RecommendationInput): RecommendationOutput {
    const { user_profile, available_content, completed_content_ids, context } = input
    
    // 1. 过滤和评分所有内容
    const scored_content = available_content
      .filter(content => {
        // 排除已完成的内容
        if (this.config.prefer_incomplete && completed_content_ids.includes(content.id)) {
          return false
        }
        // 根据上下文过滤医学内容
        if (!this.config.include_medical && content.type === 'medical') {
          return false
        }
        return true
      })
      .map(content => this.scoreContent(content, user_profile, completed_content_ids))
      .filter(result => result.score.total >= this.config.min_score)
      .sort((a, b) => b.score.total - a.score.total)

    // 2. 确保多样性
    const diverse_results = this.ensureDiversity(scored_content, this.config.max_results)

    // 3. 应用上下文特定调整
    const contextualized_results = context
      ? this.applyContextualBoost(diverse_results, context, user_profile)
      : diverse_results

    // 4. 最终切割到指定数量
    const final_results = contextualized_results.slice(0, context?.limit || this.config.max_results)

    return {
      recommendations: final_results,
      user_profile_summary: this.generateProfileSummary(user_profile),
      algorithm_version: 'v1.0.0',
    }
  }

  /**
   * 为单个内容项评分
   */
  private scoreContent(
    content: ContentMetadata,
    profile: UserProfile,
    completed_ids: string[]
  ): RecommendationResult {
    const factors = {
      level_match: this.calculateLevelMatch(content, profile),
      progress_continuity: this.calculateProgressContinuity(content, profile),
      interest_relevance: this.calculateInterestRelevance(content, profile),
      diversity_bonus: 0,  // 稍后计算
      freshness_bonus: this.calculateFreshnessBonus(content, profile),
      popularity_bonus: this.calculatePopularityBonus(content),
    }

    const penalties = {
      already_completed: completed_ids.includes(content.id) ? -50 : 0,
      too_difficult: this.calculateDifficultyPenalty(content, profile),
      too_easy: this.calculateEasyPenalty(content, profile),
    }

    const penalties_sum = Object.values(penalties).reduce((sum, val) => sum + val, 0)
    const factors_sum = Object.values(factors).reduce((sum, val) => sum + val, 0)
    const total = Math.max(0, factors_sum + penalties_sum)

    const score: RecommendationScore = {
      total,
      factors,
      penalties,
    }

    return {
      content,
      score,
      reason: this.generateReason(content, score, profile),
      debug_info: `L:${factors.level_match} P:${factors.progress_continuity} I:${factors.interest_relevance} F:${factors.freshness_bonus}`,
    }
  }

  /**
   * 计算等级匹配度 (0-30分)
   */
  private calculateLevelMatch(content: ContentMetadata, profile: UserProfile): number {
    const user_level = profile.level.current
    const content_level = content.level

    // HSK 等级映射到数字
    const level_to_num: Record<string, number> = {
      'HSK1': 1, 'HSK2': 2, 'HSK3': 3, 'HSK4': 4, 'HSK5': 5, 'HSK6': 6
    }

    const user_num = level_to_num[user_level] || 2
    const content_num = level_to_num[content_level] || 2
    const diff = Math.abs(user_num - content_num)

    if (diff === 0) return 30  // 完全匹配
    if (diff === 1) return 20  // 相邻级别（鼓励挑战）
    if (diff === 2) return 10  // 差两级
    return 0  // 相差过多
  }

  /**
   * 计算进度连续性 (0-25分)
   */
  private calculateProgressContinuity(content: ContentMetadata, profile: UserProfile): number {
    const { behavior } = profile

    // 基于用户最近的学习活跃度
    let score = 0

    // 如果用户最近很活跃，给予连续性加分
    if (behavior.recent_activity_count >= 5) {
      score += 15
    } else if (behavior.recent_activity_count >= 3) {
      score += 10
    } else if (behavior.recent_activity_count >= 1) {
      score += 5
    }

    // 根据用户的完成数量推荐相应难度
    const total_completed = 
      behavior.total_lessons_completed + 
      behavior.total_readings_completed + 
      behavior.total_grammar_completed

    if (total_completed >= 20) {
      score += 10  // 经验丰富，推荐更多内容
    } else if (total_completed >= 10) {
      score += 5
    }

    return Math.min(25, score)
  }

  /**
   * 计算兴趣相关性 (0-20分)
   */
  private calculateInterestRelevance(content: ContentMetadata, profile: UserProfile): number {
    const user_tags = profile.interests.tags
    const content_tags = content.tags

    if (user_tags.length === 0) return 10  // 默认分数

    // 计算标签交集
    const intersection = content_tags.filter(tag => 
      user_tags.some(user_tag => 
        tag.toLowerCase().includes(user_tag.toLowerCase()) ||
        user_tag.toLowerCase().includes(tag.toLowerCase())
      )
    )

    const relevance_ratio = intersection.length / Math.max(content_tags.length, 1)
    return Math.round(relevance_ratio * 20)
  }

  /**
   * 计算新鲜度加分 (0-10分)
   * 推荐用户未学过的新类型内容
   */
  private calculateFreshnessBonus(content: ContentMetadata, profile: UserProfile): number {
    const { behavior } = profile

    // 如果用户某类内容学得少，推荐更多该类内容
    if (content.type === 'lesson' && behavior.total_lessons_completed < 3) return 10
    if (content.type === 'reading' && behavior.total_readings_completed < 3) return 10
    if (content.type === 'grammar' && behavior.total_grammar_completed < 3) return 10

    return 5  // 默认新鲜度加分
  }

  /**
   * 计算热度加分 (0-5分)
   */
  private calculatePopularityBonus(content: ContentMetadata): number {
    if (!content.popularity_score) return 0
    
    // 假设 popularity_score 在 0-100 范围
    return Math.min(5, Math.round(content.popularity_score / 20))
  }

  /**
   * 计算难度惩罚 (0 或 -20)
   */
  private calculateDifficultyPenalty(content: ContentMetadata, profile: UserProfile): number {
    const user_level = profile.level.current
    const content_level = content.level

    const level_to_num: Record<string, number> = {
      'HSK1': 1, 'HSK2': 2, 'HSK3': 3, 'HSK4': 4, 'HSK5': 5, 'HSK6': 6
    }

    const user_num = level_to_num[user_level] || 2
    const content_num = level_to_num[content_level] || 2

    // 如果内容难度超过用户2个级别，施加惩罚
    if (content_num - user_num > 2) return -20

    return 0
  }

  /**
   * 计算过易惩罚 (0 或 -15)
   */
  private calculateEasyPenalty(content: ContentMetadata, profile: UserProfile): number {
    const user_level = profile.level.current
    const content_level = content.level

    const level_to_num: Record<string, number> = {
      'HSK1': 1, 'HSK2': 2, 'HSK3': 3, 'HSK4': 4, 'HSK5': 5, 'HSK6': 6
    }

    const user_num = level_to_num[user_level] || 2
    const content_num = level_to_num[content_level] || 2

    // 如果内容难度低于用户2个级别，施加较小惩罚
    if (user_num - content_num > 2) return -15

    return 0
  }

  /**
   * 确保推荐内容的多样性
   * 不同类型的内容应均匀分布
   */
  private ensureDiversity(
    scored_content: RecommendationResult[],
    max_results: number
  ): RecommendationResult[] {
    if (scored_content.length <= max_results) return scored_content

    const results: RecommendationResult[] = []
    const type_counts: Record<string, number> = {}

    // 先按分数排序
    const sorted = [...scored_content]

    // 依次选择，确保类型多样性
    for (const result of sorted) {
      if (results.length >= max_results) break

      const type = result.content.type
      const current_count = type_counts[type] || 0
      const max_per_type = Math.ceil(max_results / 3)  // 最多占1/3

      if (current_count < max_per_type) {
        results.push(result)
        type_counts[type] = current_count + 1
      }
    }

    // 如果还没填满，填充剩余高分内容
    if (results.length < max_results) {
      for (const result of sorted) {
        if (results.length >= max_results) break
        if (!results.includes(result)) {
          results.push(result)
        }
      }
    }

    return results
  }

  /**
   * 应用上下文特定的推荐加成
   */
  private applyContextualBoost(
    results: RecommendationResult[],
    context: any,
    profile: UserProfile
  ): RecommendationResult[] {
    const boosted = results.map(result => {
      let boost = 0

      switch (context.page) {
        case 'lesson_complete':
          // 完成课程后，推荐相关阅读
          if (result.content.type === 'reading') boost = 10
          break
        case 'reading_complete':
          // 完成阅读后，推荐语法
          if (result.content.type === 'grammar') boost = 10
          break
        case 'path':
          // 学习路径页面，优先推荐系列内容
          boost = 5
          break
      }

      const new_result = { ...result }
      new_result.score.total += boost
      return new_result
    })

    return boosted.sort((a, b) => b.score.total - a.score.total)
  }

  /**
   * 生成推荐理由（用户可见）
   */
  private generateReason(
    content: ContentMetadata,
    score: RecommendationScore,
    profile: UserProfile
  ): string {
    const reasons: string[] = []

    // 等级匹配
    if (score.factors.level_match >= 25) {
      reasons.push(`适合${profile.level.current}级别`)
    } else if (score.factors.level_match >= 15) {
      reasons.push('适度挑战')
    }

    // 兴趣相关
    if (score.factors.interest_relevance >= 15) {
      reasons.push('符合您的兴趣')
    }

    // 连续性
    if (score.factors.progress_continuity >= 20) {
      reasons.push('延续学习进度')
    }

    // 新鲜度
    if (score.factors.freshness_bonus >= 8) {
      reasons.push('探索新内容')
    }

    // 热度
    if (score.factors.popularity_bonus >= 4) {
      reasons.push('广受欢迎')
    }

    // 默认理由
    if (reasons.length === 0) {
      reasons.push('推荐给您')
    }

    return reasons.join(' · ')
  }

  /**
   * 生成用户画像摘要
   */
  private generateProfileSummary(profile: UserProfile): string {
    const { level, interests, behavior } = profile
    const total_completed = 
      behavior.total_lessons_completed + 
      behavior.total_readings_completed + 
      behavior.total_grammar_completed

    return `${level.current} | 已完成${total_completed}项 | ${behavior.recent_activity_count}次最近活动`
  }
}

// ================================================================
// 导出工厂函数
// ================================================================

/**
 * 创建推荐引擎实例
 */
export function createRecommendationEngine(
  config?: Partial<RecommendationConfig>
): RecommendationEngine {
  return new RecommendationEngine(config)
}

/**
 * 快捷函数：直接生成推荐
 */
export function generate推荐(input: RecommendationInput): RecommendationOutput {
  const engine = createRecommendationEngine(input.config)
  return engine.generate(input)
}
