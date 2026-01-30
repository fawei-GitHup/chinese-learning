/**
 * SRS（间隔重复学习）模块 - API 函数
 * 
 * 功能：
 * 1. 收藏管理：保存、取消保存、查询收藏
 * 2. SRS 卡片：创建、更新、删除、查询
 * 3. 复习记录：记录复习、查询历史、统计分析
 * 
 * 所有函数都基于 RLS，自动过滤当前用户的数据
 */

import { createBrowserClient } from '@/lib/supabase/client';
import type {
  SavedItem,
  SavedItemType,
  CreateSavedItemInput,
  SavedItemsFilter,
  SRSCard,
  CreateSRSCardInput,
  UpdateSRSCardInput,
  SRSCardsFilter,
  SRSReview,
  RecordReviewInput,
  ReviewResult,
  SRSReviewsFilter,
  ReviewStats,
  DailyReviewData,
  SM2Params,
  SM2Result,
  ReviewQuality,
} from './types';

// ================================================================
// 辅助函数：SM-2 算法实现
// ================================================================

/**
 * SM-2 算法：计算下次复习的间隔和难易度因子
 * 
 * @see https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 */
function calculateSM2(params: SM2Params): SM2Result {
  const { quality, interval, ease_factor, difficulty } = params;

  let newEaseFactor = ease_factor;
  let newInterval = interval;
  let newDifficulty = difficulty;

  // 更新难易度因子
  newEaseFactor = Math.max(
    1.3, // 最小值
    ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // 根据质量计算新间隔
  if (quality < 3) {
    // 回答错误（Again 或 Hard），重置间隔
    newInterval = 1;
    newDifficulty = 0; // 重置为新卡片
  } else {
    // 回答正确
    newDifficulty += 1;

    if (newDifficulty === 1) {
      newInterval = 1;
    } else if (newDifficulty === 2) {
      newInterval = 6;
    } else {
      // 第三次及以后：interval * ease_factor
      newInterval = Math.round(interval * newEaseFactor);
    }
  }

  return {
    interval: newInterval,
    ease_factor: newEaseFactor,
    difficulty: newDifficulty,
  };
}

/**
 * 计算下次复习时间（基于当前时间 + 间隔天数）
 */
function calculateNextReviewDate(intervalDays: number): string {
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + intervalDays);
  return nextDate.toISOString();
}


// ================================================================
// 1. 收藏管理 API
// ================================================================

/**
 * 保存（收藏）内容
 */
export async function saveItem(input: CreateSavedItemInput): Promise<SavedItem> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('未登录');
  }

  const { data, error } = await supabase
    .from('user_saved_items')
    .insert({
      user_id: userData.user.id,
      item_type: input.item_type,
      item_id: input.item_id,
      metadata: input.metadata || {},
    })
    .select()
    .single();

  if (error) {
    // 处理唯一约束冲突（已收藏）
    if (error.code === '23505') {
      throw new Error('该内容已收藏');
    }
    throw new Error(`收藏失败: ${error.message}`);
  }

  return data;
}

/**
 * 取消保存（取消收藏）
 */
export async function unsaveItem(
  itemType: SavedItemType,
  itemId: string
): Promise<void> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('未登录');
  }

  const { error } = await supabase
    .from('user_saved_items')
    .delete()
    .eq('user_id', userData.user.id)
    .eq('item_type', itemType)
    .eq('item_id', itemId);

  if (error) {
    throw new Error(`取消收藏失败: ${error.message}`);
  }
}

/**
 * 检查内容是否已收藏
 */
export async function checkIfSaved(
  itemType: SavedItemType,
  itemId: string
): Promise<boolean> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return false;
  }

  const { data, error } = await supabase
    .from('user_saved_items')
    .select('id')
    .eq('user_id', userData.user.id)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .single();

  if (error) {
    return false;
  }

  return !!data;
}

/**
 * 获取用户的收藏列表
 */
export async function getSavedItems(
  filter?: SavedItemsFilter
): Promise<SavedItem[]> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('未登录');
  }

  let query = supabase
    .from('user_saved_items')
    .select('*')
    .eq('user_id', userData.user.id);

  // 应用过滤条件
  if (filter?.item_type) {
    query = query.eq('item_type', filter.item_type);
  }

  // 排序
  const orderBy = filter?.orderBy || 'created_at';
  const orderDirection = filter?.orderDirection || 'desc';
  query = query.order(orderBy, { ascending: orderDirection === 'asc' });

  // 分页
  if (filter?.limit) {
    query = query.limit(filter.limit);
  }
  if (filter?.offset) {
    query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`获取收藏列表失败: ${error.message}`);
  }

  return data || [];
}


// ================================================================
// 2. SRS 卡片管理 API
// ================================================================

/**
 * 创建 SRS 卡片
 */
export async function createSRSCard(input: CreateSRSCardInput): Promise<SRSCard> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('未登录');
  }

  const { data, error } = await supabase
    .from('user_srs_cards')
    .insert({
      user_id: userData.user.id,
      card_type: input.card_type,
      content: input.content,
      source_type: input.source_type || null,
      source_id: input.source_id || null,
      // 默认 SM-2 参数（新卡片）
      difficulty: 0,
      interval: 0,
      ease_factor: 2.5,
      next_review: new Date().toISOString(), // 立即可复习
      review_count: 0,
      correct_count: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`创建卡片失败: ${error.message}`);
  }

  return data;
}

/**
 * 更新 SRS 卡片
 */
export async function updateSRSCard(
  cardId: string,
  input: UpdateSRSCardInput
): Promise<SRSCard> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('未登录');
  }

  const { data, error } = await supabase
    .from('user_srs_cards')
    .update(input)
    .eq('id', cardId)
    .eq('user_id', userData.user.id) // RLS 保护
    .select()
    .single();

  if (error) {
    throw new Error(`更新卡片失败: ${error.message}`);
  }

  return data;
}

/**
 * 删除 SRS 卡片
 */
export async function deleteSRSCard(cardId: string): Promise<void> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('未登录');
  }

  const { error } = await supabase
    .from('user_srs_cards')
    .delete()
    .eq('id', cardId)
    .eq('user_id', userData.user.id); // RLS 保护

  if (error) {
    throw new Error(`删除卡片失败: ${error.message}`);
  }
}

/**
 * 获取单个 SRS 卡片
 */
export async function getSRSCard(cardId: string): Promise<SRSCard | null> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('未登录');
  }

  const { data, error } = await supabase
    .from('user_srs_cards')
    .select('*')
    .eq('id', cardId)
    .eq('user_id', userData.user.id) // RLS 保护
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // 未找到
      return null;
    }
    throw new Error(`获取卡片失败: ${error.message}`);
  }

  return data;
}

/**
 * 获取 SRS 卡片列表
 */
export async function getSRSCards(filter?: SRSCardsFilter): Promise<SRSCard[]> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('未登录');
  }

  let query = supabase
    .from('user_srs_cards')
    .select('*')
    .eq('user_id', userData.user.id);

  // 应用过滤条件
  if (filter?.card_type) {
    query = query.eq('card_type', filter.card_type);
  }
  if (filter?.source_type) {
    query = query.eq('source_type', filter.source_type);
  }
  if (filter?.source_id) {
    query = query.eq('source_id', filter.source_id);
  }
  if (filter?.due_only) {
    query = query.lte('next_review', new Date().toISOString());
  }

  // 排序
  const orderBy = filter?.orderBy || 'created_at';
  const orderDirection = filter?.orderDirection || 'desc';
  query = query.order(orderBy, { ascending: orderDirection === 'asc' });

  // 分页
  if (filter?.limit) {
    query = query.limit(filter.limit);
  }
  if (filter?.offset) {
    query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`获取卡片列表失败: ${error.message}`);
  }

  return data || [];
}

/**
 * 获取到期的 SRS 卡片（待复习）
 */
export async function getDueCards(limit?: number): Promise<SRSCard[]> {
  return getSRSCards({
    due_only: true,
    orderBy: 'next_review',
    orderDirection: 'asc',
    limit: limit || 20,
  });
}


// ================================================================
// 3. SRS 复习 API
// ================================================================

/**
 * 记录复习（核心功能）
 * 
 * 步骤：
 * 1. 获取当前卡片信息
 * 2. 使用 SM-2 算法计算新参数
 * 3. 更新卡片
 * 4. 插入复习记录
 */
export async function recordReview(input: RecordReviewInput): Promise<ReviewResult> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('未登录');
  }

  // 1. 获取卡片
  const card = await getSRSCard(input.card_id);
  if (!card) {
    throw new Error('卡片不存在');
  }

  // 2. 计算新参数（SM-2 算法）
  const sm2Result = calculateSM2({
    quality: input.quality,
    interval: card.interval,
    ease_factor: card.ease_factor,
    difficulty: card.difficulty,
  });

  const nextReviewDate = calculateNextReviewDate(sm2Result.interval);

  // 3. 更新卡片
  const isCorrect = input.quality >= 3; // quality >= 3 视为正确
  const updatedCard = await updateSRSCard(input.card_id, {
    difficulty: sm2Result.difficulty,
    interval: sm2Result.interval,
    ease_factor: sm2Result.ease_factor,
    next_review: nextReviewDate,
    review_count: card.review_count + 1,
    correct_count: card.correct_count + (isCorrect ? 1 : 0),
  });

  // 4. 插入复习记录
  const { data: reviewData, error: reviewError } = await supabase
    .from('user_srs_reviews')
    .insert({
      user_id: userData.user.id,
      card_id: input.card_id,
      reviewed_at: new Date().toISOString(),
      quality: input.quality,
      previous_interval: card.interval,
      previous_ease_factor: card.ease_factor,
      new_interval: sm2Result.interval,
      new_ease_factor: sm2Result.ease_factor,
      time_spent: input.time_spent || null,
    })
    .select()
    .single();

  if (reviewError) {
    throw new Error(`记录复习失败: ${reviewError.message}`);
  }

  return {
    review: reviewData,
    updatedCard,
  };
}

/**
 * 获取复习历史
 */
export async function getReviewHistory(
  filter?: SRSReviewsFilter
): Promise<SRSReview[]> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('未登录');
  }

  let query = supabase
    .from('user_srs_reviews')
    .select('*')
    .eq('user_id', userData.user.id);

  // 应用过滤条件
  if (filter?.card_id) {
    query = query.eq('card_id', filter.card_id);
  }
  if (filter?.start_date) {
    query = query.gte('reviewed_at', filter.start_date);
  }
  if (filter?.end_date) {
    query = query.lte('reviewed_at', filter.end_date);
  }

  // 排序
  const orderBy = filter?.orderBy || 'reviewed_at';
  const orderDirection = filter?.orderDirection || 'desc';
  query = query.order(orderBy, { ascending: orderDirection === 'asc' });

  // 分页
  if (filter?.limit) {
    query = query.limit(filter.limit);
  }
  if (filter?.offset) {
    query = query.range(filter.offset, filter.offset + (filter.limit || 10) - 1);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`获取复习历史失败: ${error.message}`);
  }

  return data || [];
}


// ================================================================
// 4. 统计分析 API
// ================================================================

/**
 * 获取复习统计信息
 */
export async function getReviewStats(): Promise<ReviewStats> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('未登录');
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayStartISO = todayStart.toISOString();

  // 并行查询多个统计数据
  const [
    totalReviewsResult,
    reviewsTodayResult,
    cardsDueTodayResult,
    cardsDueTotalResult,
    totalCardsResult,
    avgEaseFactorResult,
  ] = await Promise.all([
    // 总复习次数
    supabase
      .from('user_srs_reviews')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userData.user.id),

    // 今日复习次数
    supabase
      .from('user_srs_reviews')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userData.user.id)
      .gte('reviewed_at', todayStartISO),

    // 今日到期卡片数
    supabase
      .from('user_srs_cards')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userData.user.id)
      .lte('next_review', now.toISOString())
      .gte('next_review', todayStartISO),

    // 所有到期卡片数
    supabase
      .from('user_srs_cards')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userData.user.id)
      .lte('next_review', now.toISOString()),

    // 总卡片数
    supabase
      .from('user_srs_cards')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userData.user.id),

    // 平均难易度因子 & 记忆保持率
    supabase
      .from('user_srs_cards')
      .select('ease_factor, review_count, correct_count')
      .eq('user_id', userData.user.id),
  ]);

  // 计算平均难易度因子和记忆保持率
  let averageEaseFactor = 2.5;
  let retentionRate = 0;

  if (avgEaseFactorResult.data && avgEaseFactorResult.data.length > 0) {
    const sum = avgEaseFactorResult.data.reduce((acc: number, card: any) => acc + card.ease_factor, 0);
    averageEaseFactor = sum / avgEaseFactorResult.data.length;

    const totalReviews = avgEaseFactorResult.data.reduce((acc: number, card: any) => acc + card.review_count, 0);
    const totalCorrect = avgEaseFactorResult.data.reduce((acc: number, card: any) => acc + card.correct_count, 0);
    retentionRate = totalReviews > 0 ? totalCorrect / totalReviews : 0;
  }

  return {
    total_reviews: totalReviewsResult.count || 0,
    reviews_today: reviewsTodayResult.count || 0,
    cards_due_today: cardsDueTodayResult.count || 0,
    cards_due_total: cardsDueTotalResult.count || 0,
    total_cards: totalCardsResult.count || 0,
    average_ease_factor: averageEaseFactor,
    retention_rate: retentionRate,
  };
}

/**
 * 获取每日复习数据（用于图表）
 */
export async function getDailyReviewData(days: number = 30): Promise<DailyReviewData[]> {
  const supabase = createBrowserClient();

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    throw new Error('未登录');
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from('user_srs_reviews')
    .select('reviewed_at, quality, time_spent')
    .eq('user_id', userData.user.id)
    .gte('reviewed_at', startDate.toISOString())
    .order('reviewed_at', { ascending: true });

  if (error) {
    throw new Error(`获取每日数据失败: ${error.message}`);
  }

  // 按日期分组统计
  const dailyMap = new Map<string, { count: number; totalQuality: number; totalTime: number }>();

  data?.forEach((review: any) => {
    const date = review.reviewed_at.split('T')[0]; // YYYY-MM-DD
    const existing = dailyMap.get(date) || { count: 0, totalQuality: 0, totalTime: 0 };

    dailyMap.set(date, {
      count: existing.count + 1,
      totalQuality: existing.totalQuality + review.quality,
      totalTime: existing.totalTime + (review.time_spent || 0),
    });
  });

  // 转换为数组格式
  const result: DailyReviewData[] = [];
  dailyMap.forEach((value, date) => {
    result.push({
      date,
      review_count: value.count,
      average_quality: value.totalQuality / value.count,
      time_spent: value.totalTime,
    });
  });

  return result.sort((a, b) => a.date.localeCompare(b.date));
}
