/**
 * 用户反馈API模块
 * 提供反馈提交、查询和管理功能
 */

import createClient from '@/lib/supabase/client';

export type FeedbackType = 'bug' | 'feature' | 'improvement' | 'other';
export type FeedbackStatus = 'open' | 'in_progress' | 'resolved';

export interface Feedback {
  feedback_id: string;
  user_id?: string;
  page_url: string;
  feedback_type: FeedbackType;
  title: string;
  description: string;
  rating?: number;
  screenshot_url?: string;
  status: FeedbackStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateFeedbackInput {
  page_url: string;
  feedback_type: FeedbackType;
  title: string;
  description: string;
  rating?: number;
  screenshot_url?: string;
}

export interface UpdateFeedbackStatusInput {
  feedback_id: string;
  status: FeedbackStatus;
}

/**
 * 提交用户反馈
 * @param input 反馈数据
 * @returns 创建的反馈记录
 */
export async function submitFeedback(
  input: CreateFeedbackInput
): Promise<{ data: Feedback | null; error: Error | null }> {
  try {
    const supabase = createClient();

    // 获取当前用户（可能为null，支持匿名反馈）
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const feedbackData = {
      user_id: user?.id || null,
      page_url: input.page_url,
      feedback_type: input.feedback_type,
      title: input.title,
      description: input.description,
      rating: input.rating || null,
      screenshot_url: input.screenshot_url || null,
      status: 'open' as FeedbackStatus,
    };

    const { data, error } = await supabase
      .from('user_feedback')
      .insert(feedbackData)
      .select()
      .single();

    if (error) {
      console.error('提交反馈失败:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error('提交反馈异常:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('未知错误'),
    };
  }
}

/**
 * 获取当前用户的反馈列表
 * @param limit 限制返回数量
 * @param offset 偏移量
 * @returns 用户的反馈列表
 */
export async function getUserFeedback(
  limit: number = 10,
  offset: number = 0
): Promise<{ data: Feedback[] | null; error: Error | null; count: number }> {
  try {
    const supabase = createClient();

    // 获取当前用户
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        data: null,
        error: new Error('未登录用户无法查看反馈'),
        count: 0,
      };
    }

    // 查询用户的反馈，按创建时间降序排列
    const { data, error, count } = await supabase
      .from('user_feedback')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('获取反馈列表失败:', error);
      return { data: null, error: new Error(error.message), count: 0 };
    }

    return { data, error: null, count: count || 0 };
  } catch (err) {
    console.error('获取反馈列表异常:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('未知错误'),
      count: 0,
    };
  }
}

/**
 * 更新反馈状态（管理员功能）
 * @param input 更新数据
 * @returns 更新后的反馈记录
 */
export async function updateFeedbackStatus(
  input: UpdateFeedbackStatusInput
): Promise<{ data: Feedback | null; error: Error | null }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('user_feedback')
      .update({ status: input.status })
      .eq('feedback_id', input.feedback_id)
      .select()
      .single();

    if (error) {
      console.error('更新反馈状态失败:', error);
      return { data: null, error: new Error(error.message) };
    }

    return { data, error: null };
  } catch (err) {
    console.error('更新反馈状态异常:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('未知错误'),
    };
  }
}

/**
 * 获取所有反馈（管理员功能）
 * @param limit 限制返回数量
 * @param offset 偏移量
 * @param status 筛选状态
 * @param feedbackType 筛选类型
 * @returns 所有反馈列表
 */
export async function getAllFeedback(
  limit: number = 20,
  offset: number = 0,
  status?: FeedbackStatus,
  feedbackType?: FeedbackType
): Promise<{ data: Feedback[] | null; error: Error | null; count: number }> {
  try {
    const supabase = createClient();

    let query = supabase
      .from('user_feedback')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // 可选筛选
    if (status) {
      query = query.eq('status', status);
    }
    if (feedbackType) {
      query = query.eq('feedback_type', feedbackType);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('获取所有反馈失败:', error);
      return { data: null, error: new Error(error.message), count: 0 };
    }

    return { data, error: null, count: count || 0 };
  } catch (err) {
    console.error('获取所有反馈异常:', err);
    return {
      data: null,
      error: err instanceof Error ? err : new Error('未知错误'),
      count: 0,
    };
  }
}
