// 分级测试 API
import { createBrowserClient } from "@/lib/supabase/client"
import type { HSKLevel } from "@/lib/placement-test-mock"

export interface PlacementTestAttempt {
  id: string
  user_id: string
  score: number
  total_questions: number
  correct_answers: number
  answers: Array<{
    question_id: string
    user_answer: number
    correct_answer: number
    is_correct: boolean
  }>
  assessed_level: HSKLevel
  started_at: string
  completed_at: string
  created_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  hsk_level: HSKLevel
  placement_score: number | null
  placement_completed_at: string | null
  created_at: string
  updated_at: string
}

/**
 * 保存分级测试结果
 */
export async function savePlacementTestResult(params: {
  score: number
  totalQuestions: number
  correctAnswers: number
  assessedLevel: HSKLevel
  answers: Record<string, number> // questionId -> userAnswerIndex
  startedAt: Date
  completedAt: Date
}): Promise<{ success: boolean; error?: string; data?: any }> {
  try {
    const supabase = createBrowserClient()

    // 获取当前用户
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "用户未登录" }
    }

    // 转换answers格式
    const answersArray = Object.entries(params.answers).map(([qId, userIdx]) => ({
      question_id: qId,
      user_answer: userIdx,
      correct_answer: -1, // 前端已经有正确答案，这里可以留空或填-1
      is_correct: false // 同上,计算在前端完成
    }))

    // 调用Supabase函数保存结果
    const { data, error } = await supabase.rpc('save_placement_test_result', {
      p_user_id: user.id,
      p_score: params.score,
      p_total_questions: params.totalQuestions,
      p_correct_answers: params.correctAnswers,
      p_answers: answersArray,
      p_started_at: params.startedAt.toISOString(),
      p_completed_at: params.completedAt.toISOString()
    })

    if (error) {
      console.error("保存测试结果失败:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("保存测试结果异常:", error)
    return { success: false, error: error.message || "未知错误" }
  }
}

/**
 * 获取用户档案（包含HSK等级）
 */
export async function getUserProfile(): Promise<{
  success: boolean
  data?: UserProfile
  error?: string
}> {
  try {
    const supabase = createBrowserClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "用户未登录" }
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      // 如果档案不存在，尝试创建一个
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            hsk_level: 'HSK1'
          })
          .select()
          .single()

        if (createError) {
          return { success: false, error: createError.message }
        }

        return { success: true, data: newProfile }
      }

      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("获取用户档案异常:", error)
    return { success: false, error: error.message || "未知错误" }
  }
}

/**
 * 获取用户的测试历史记录
 */
export async function getUserTestHistory(): Promise<{
  success: boolean
  data?: PlacementTestAttempt[]
  error?: string
}> {
  try {
    const supabase = createBrowserClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "用户未登录" }
    }

    const { data, error } = await supabase
      .from('placement_test_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })
      .limit(10)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: data || [] }
  } catch (error: any) {
    console.error("获取测试历史异常:", error)
    return { success: false, error: error.message || "未知错误" }
  }
}

/**
 * 更新用户HSK等级
 */
export async function updateUserLevel(level: HSKLevel): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = createBrowserClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, error: "用户未登录" }
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: user.id,
        hsk_level: level,
        updated_at: new Date().toISOString()
      })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("更新用户等级异常:", error)
    return { success: false, error: error.message || "未知错误" }
  }
}
