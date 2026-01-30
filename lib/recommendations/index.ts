/**
 * W6-02: 个性化推荐系统 - 统一导出
 */

// 导出核心引擎
export { RecommendationEngine, createRecommendationEngine, generate推荐 } from './engine'

// 导出类型
export type {
  UserProfile,
  UserLevel,
  UserInterests,
  UserBehavior,
  ContentMetadata,
  ContentDifficulty,
  RecommendationScore,
  RecommendationResult,
  RecommendationConfig,
  RecommendationContext,
  RecommendationInput,
  RecommendationOutput,
  RecommendedContentType,
} from './types'

// 导出默认配置
export { DEFAULT_RECOMMENDATION_CONFIG } from './types'

// 导出工具函数
export {
  buildUserProfile,
  lessonToMetadata,
  readerToMetadata,
  lessonsToMetadata,
  readersToMetadata,
  aggregateAllContent,
  extractCompletedIds,
  estimateUserLevel,
  formatRecommendationReason,
  getContentTypeLabel,
  getDifficultyLabel,
} from './utils'

// 导出 API 函数
export {
  getPersonalizedRecommendations,
  getDashboardRecommendations,
  getPathRecommendations,
  getPostCompletionRecommendations,
  refreshRecommendations,
  recordRecommendationClick,
  recordRecommendationFeedback,
} from './api'
