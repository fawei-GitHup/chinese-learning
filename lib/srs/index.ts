/**
 * SRS（间隔重复学习）模块 - 统一导出
 * 
 * 使用示例：
 * ```typescript
 * import { saveItem, createSRSCard, recordReview } from '@/lib/srs';
 * import type { SRSCard, SavedItem } from '@/lib/srs';
 * ```
 */

// 导出所有类型
export type {
  // 收藏相关
  SavedItemType,
  SavedItemMetadata,
  SavedItem,
  CreateSavedItemInput,
  SavedItemsFilter,
  
  // SRS 卡片相关
  CardType,
  SRSCardContent,
  CardSourceType,
  SRSCard,
  CreateSRSCardInput,
  UpdateSRSCardInput,
  SRSCardsFilter,
  
  // 复习相关
  SRSReview,
  RecordReviewInput,
  ReviewResult,
  SRSReviewsFilter,
  
  // 统计分析
  ReviewStats,
  DailyReviewData,
  
  // SM-2 算法
  SM2Params,
  SM2Result,
} from './types';

// 导出枚举
export { ReviewQuality, ReviewQualityLabels } from './types';

// 导出所有 API 函数
export {
  // 收藏管理
  saveItem,
  unsaveItem,
  checkIfSaved,
  getSavedItems,
  
  // SRS 卡片管理
  createSRSCard,
  updateSRSCard,
  deleteSRSCard,
  getSRSCard,
  getSRSCards,
  getDueCards,
  
  // 复习记录
  recordReview,
  getReviewHistory,
  
  // 统计分析
  getReviewStats,
  getDailyReviewData,
} from './api';
