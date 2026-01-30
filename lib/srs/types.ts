/**
 * SRS（间隔重复学习）模块 - 类型定义
 * 
 * 对应数据库表：
 * - user_saved_items
 * - user_srs_cards
 * - user_srs_reviews
 */

// ================================================================
// 1. 收藏相关类型
// ================================================================

/**
 * 可收藏的内容类型
 */
export type SavedItemType = 
  | 'lesson'        // 课程
  | 'reading'       // 阅读材料
  | 'grammar'       // 语法点
  | 'medical_term'  // 医学术语
  | 'scenario'      // 场景对话
  | 'other';        // 其他

/**
 * 收藏内容的元数据（快照信息）
 */
export interface SavedItemMetadata {
  title?: string;           // 标题
  description?: string;     // 描述
  imageUrl?: string;        // 缩略图
  category?: string;        // 分类
  difficulty?: string;      // 难度
  [key: string]: any;       // 其他自定义字段
}

/**
 * 用户收藏项（数据库表：user_saved_items）
 */
export interface SavedItem {
  id: string;
  user_id: string;
  item_type: SavedItemType;
  item_id: string;
  metadata: SavedItemMetadata;
  created_at: string;       // ISO 8601 格式
}

/**
 * 创建收藏项的输入
 */
export interface CreateSavedItemInput {
  item_type: SavedItemType;
  item_id: string;
  metadata?: SavedItemMetadata;
}


// ================================================================
// 2. SRS 卡片相关类型
// ================================================================

/**
 * SRS 卡片类型
 */
export type CardType = 
  | 'vocabulary'    // 词汇卡
  | 'sentence'      // 句子卡
  | 'grammar'       // 语法卡
  | 'medical_term'  // 医学术语卡
  | 'custom';       // 自定义卡片

/**
 * SRS 卡片内容（JSONB，不同类型卡片有不同结构）
 */
export interface SRSCardContent {
  front: string;            // 正面（问题）
  back: string;             // 背面（答案）
  pinyin?: string;          // 拼音（中文卡片）
  audioUrl?: string;        // 音频 URL
  imageUrl?: string;        // 图片 URL
  example?: string;         // 例句
  notes?: string;           // 备注
  [key: string]: any;       // 其他自定义字段
}

/**
 * 卡片来源类型
 */
export type CardSourceType = 
  | 'lesson' 
  | 'reading' 
  | 'medical_term' 
  | 'grammar'
  | 'manual';               // 用户手动创建

/**
 * SRS 卡片（数据库表：user_srs_cards）
 */
export interface SRSCard {
  id: string;
  user_id: string;
  card_type: CardType;
  content: SRSCardContent;
  source_type?: CardSourceType | null;
  source_id?: string | null;
  
  // SM-2 算法参数
  difficulty: number;       // 难度等级（0 = 新卡片）
  interval: number;         // 当前间隔（天数）
  ease_factor: number;      // 难易度因子（1.3 - 2.5+）
  next_review: string;      // 下次复习时间（ISO 8601）
  
  // 统计信息
  review_count: number;     // 总复习次数
  correct_count: number;    // 正确次数
  
  // 时间戳
  created_at: string;
  updated_at: string;
}

/**
 * 创建 SRS 卡片的输入
 */
export interface CreateSRSCardInput {
  card_type: CardType;
  content: SRSCardContent;
  source_type?: CardSourceType;
  source_id?: string;
}

/**
 * 更新 SRS 卡片的输入（部分字段可选）
 */
export interface UpdateSRSCardInput {
  content?: SRSCardContent;
  difficulty?: number;
  interval?: number;
  ease_factor?: number;
  next_review?: string;
  review_count?: number;
  correct_count?: number;
}


// ================================================================
// 3. SRS 复习相关类型
// ================================================================

/**
 * 复习质量评分（SM-2 算法）
 */
export enum ReviewQuality {
  Again = 0,      // 完全不记得
  Hard1 = 1,      // 几乎不记得，很困难
  Hard2 = 2,      // 记得，但很困难
  Good1 = 3,      // 记得，有点困难
  Good2 = 4,      // 记得，比较容易
  Easy = 5,       // 完全记得，非常容易
}

/**
 * 复习质量的标签（用于显示）
 */
export const ReviewQualityLabels: Record<ReviewQuality, string> = {
  [ReviewQuality.Again]: '再来一次',
  [ReviewQuality.Hard1]: '很困难',
  [ReviewQuality.Hard2]: '困难',
  [ReviewQuality.Good1]: '一般',
  [ReviewQuality.Good2]: '良好',
  [ReviewQuality.Easy]: '简单',
};

/**
 * 复习记录（数据库表：user_srs_reviews）
 */
export interface SRSReview {
  id: string;
  user_id: string;
  card_id: string;
  reviewed_at: string;      // ISO 8601
  quality: ReviewQuality;
  
  // 复习前的参数
  previous_interval: number;
  previous_ease_factor: number;
  
  // 复习后的新参数
  new_interval: number;
  new_ease_factor: number;
  
  // 用时（秒）
  time_spent?: number | null;
}

/**
 * 记录复习的输入
 */
export interface RecordReviewInput {
  card_id: string;
  quality: ReviewQuality;
  time_spent?: number;
}

/**
 * 复习结果（包含更新后的卡片信息）
 */
export interface ReviewResult {
  review: SRSReview;        // 复习记录
  updatedCard: SRSCard;     // 更新后的卡片
}


// ================================================================
// 4. 查询和过滤类型
// ================================================================

/**
 * 查询收藏项的过滤条件
 */
export interface SavedItemsFilter {
  item_type?: SavedItemType;
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'item_type';
  orderDirection?: 'asc' | 'desc';
}

/**
 * 查询 SRS 卡片的过滤条件
 */
export interface SRSCardsFilter {
  card_type?: CardType;
  source_type?: CardSourceType;
  source_id?: string;
  due_only?: boolean;       // 仅查询到期卡片（next_review <= now）
  limit?: number;
  offset?: number;
  orderBy?: 'created_at' | 'next_review' | 'updated_at';
  orderDirection?: 'asc' | 'desc';
}

/**
 * 查询复习记录的过滤条件
 */
export interface SRSReviewsFilter {
  card_id?: string;
  start_date?: string;      // ISO 8601
  end_date?: string;        // ISO 8601
  limit?: number;
  offset?: number;
  orderBy?: 'reviewed_at';
  orderDirection?: 'asc' | 'desc';
}


// ================================================================
// 5. 统计和分析类型
// ================================================================

/**
 * 复习统计信息
 */
export interface ReviewStats {
  total_reviews: number;            // 总复习次数
  reviews_today: number;            // 今日复习次数
  cards_due_today: number;          // 今日到期卡片数
  cards_due_total: number;          // 所有到期卡片数
  total_cards: number;              // 总卡片数
  average_ease_factor: number;      // 平均难易度因子
  retention_rate: number;           // 记忆保持率（correct_count / review_count）
}

/**
 * 每日复习数据（用于图表）
 */
export interface DailyReviewData {
  date: string;                     // YYYY-MM-DD
  review_count: number;
  average_quality: number;
  time_spent: number;               // 总用时（秒）
}


// ================================================================
// 6. SM-2 算法辅助类型
// ================================================================

/**
 * SM-2 算法计算参数
 */
export interface SM2Params {
  quality: ReviewQuality;
  interval: number;
  ease_factor: number;
  difficulty: number;
}

/**
 * SM-2 算法计算结果
 */
export interface SM2Result {
  interval: number;         // 新的间隔
  ease_factor: number;      // 新的难易度因子
  difficulty: number;       // 新的难度等级
}
