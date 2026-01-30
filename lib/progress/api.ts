/**
 * W5-04: 学习进度 API
 * 用于管理用户在 lesson 和 reading 中的学习进度
 */

import createBrowserClient from '@/lib/supabase/client';

export type ContentType = 'lesson' | 'reading';

export interface UserProgress {
  id: string;
  user_id: string;
  content_type: ContentType;
  content_id: string;
  progress_percentage: number;
  completed: boolean;
  last_position?: any;
  started_at: string;
  completed_at?: string;
  updated_at: string;
}

export interface CompletionStats {
  total_items: number;
  completed_items: number;
  in_progress_items: number;
  avg_progress: number;
  last_activity: string;
}

/**
 * 更新进度
 * @param type 内容类型（lesson/reading）
 * @param id 内容ID
 * @param percentage 进度百分比（0-100）
 * @param lastPosition 可选的最后位置信息
 */
export async function updateProgress(
  type: ContentType,
  id: string,
  percentage: number,
  lastPosition?: any
): Promise<UserProgress | null> {
  const supabase = createBrowserClient();

  // 验证百分比
  const validatedPercentage = Math.max(0, Math.min(100, percentage));
  const isCompleted = validatedPercentage === 100;

  // 获取当前用户
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('用户未登录');
  }

  // 使用 upsert 插入或更新记录
  const { data, error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: user.id,
        content_type: type,
        content_id: id,
        progress_percentage: validatedPercentage,
        completed: isCompleted,
        last_position: lastPosition || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,content_type,content_id',
        ignoreDuplicates: false,
      }
    )
    .select()
    .single();

  if (error) {
    console.error('更新进度失败:', error);
    throw error;
  }

  return data;
}

/**
 * 标记为完成
 * @param type 内容类型（lesson/reading）
 * @param id 内容ID
 */
export async function markComplete(
  type: ContentType,
  id: string
): Promise<UserProgress | null> {
  return updateProgress(type, id, 100);
}

/**
 * 获取单个内容的进度
 * @param type 内容类型（lesson/reading）
 * @param id 内容ID
 */
export async function getProgress(
  type: ContentType,
  id: string
): Promise<UserProgress | null> {
  const supabase = createBrowserClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('content_type', type)
    .eq('content_id', id)
    .single();

  if (error) {
    // 如果没有找到记录，返回 null 而不是抛出错误
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('获取进度失败:', error);
    return null;
  }

  return data;
}

/**
 * 获取最近的学习进度
 * @param limit 返回数量限制
 */
export async function getRecentProgress(
  limit: number = 10
): Promise<UserProgress[]> {
  const supabase = createBrowserClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('获取最近进度失败:', error);
    return [];
  }

  return data || [];
}

/**
 * 获取完成统计
 * @param type 可选的内容类型过滤
 */
export async function getCompletionStats(
  type?: ContentType
): Promise<Record<ContentType, CompletionStats> | CompletionStats | null> {
  const supabase = createBrowserClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  // 如果指定了类型，只返回该类型的统计
  if (type) {
    const { data, error } = await supabase
      .from('user_completion_stats')
      .select('*')
      .eq('user_id', user.id)
      .eq('content_type', type)
      .single();

    if (error) {
      console.error('获取完成统计失败:', error);
      return null;
    }

    return data;
  }

  // 否则返回所有类型的统计
  const { data, error } = await supabase
    .from('user_completion_stats')
    .select('*')
    .eq('user_id', user.id);

  if (error) {
    console.error('获取完成统计失败:', error);
    return null;
  }

  // 转换为字典格式
  const stats: Record<string, CompletionStats> = {};
  data?.forEach((stat: any) => {
    stats[stat.content_type] = stat;
  });

  return stats as Record<ContentType, CompletionStats>;
}

/**
 * 获取推荐的下一步内容
 * 基于用户的学习进度推荐下一个应该学习的内容
 */
export async function getRecommendedNext(): Promise<{
  type: ContentType;
  id: string;
  reason: string;
} | null> {
  const supabase = createBrowserClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return null;
  }

  // 获取所有进度
  const { data: progressList, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('获取进度列表失败:', error);
    return null;
  }

  // 如果没有任何进度，推荐第一个 lesson
  if (!progressList || progressList.length === 0) {
    return {
      type: 'lesson',
      id: '1',
      reason: '开始您的学习之旅',
    };
  }

  // 查找未完成的内容
  const inProgress = progressList.find((p: any) => !p.completed);
  if (inProgress) {
    return {
      type: inProgress.content_type as ContentType,
      id: inProgress.content_id,
      reason: '继续上次的学习',
    };
  }

  // 如果所有内容都已完成，推荐下一个编号的内容
  const lastLesson = progressList
    .filter((p: any) => p.content_type === 'lesson')
    .sort((a: any, b: any) => {
      const numA = parseInt(a.content_id);
      const numB = parseInt(b.content_id);
      return numB - numA;
    })[0];

  if (lastLesson) {
    const nextId = (parseInt(lastLesson.content_id) + 1).toString();
    return {
      type: 'lesson',
      id: nextId,
      reason: '开始新的课程',
    };
  }

  return null;
}

/**
 * 获取内容的完成状态（简化版）
 */
export async function isContentCompleted(
  type: ContentType,
  id: string
): Promise<boolean> {
  const progress = await getProgress(type, id);
  return progress?.completed || false;
}

/**
 * 批量获取多个内容的进度
 * @param items 内容列表 [{type, id}]
 */
export async function getBatchProgress(
  items: Array<{ type: ContentType; id: string }>
): Promise<Map<string, UserProgress>> {
  const supabase = createBrowserClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return new Map();
  }

  // 构建查询条件
  const progressMap = new Map<string, UserProgress>();

  for (const item of items) {
    const { data } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('content_type', item.type)
      .eq('content_id', item.id)
      .single();

    if (data) {
      const key = `${item.type}-${item.id}`;
      progressMap.set(key, data);
    }
  }

  return progressMap;
}
