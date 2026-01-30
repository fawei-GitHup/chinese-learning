-- ============================================
-- W5-04: 学习进度追踪表
-- ============================================
-- 功能：记录用户在 lesson 和 reading 中的学习进度
-- 依赖：需要先完成 W4-01 用户数据表模式

-- 创建 user_progress 表
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('lesson', 'reading')),
    content_id TEXT NOT NULL,
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    last_position JSONB, -- 可选，用于阅读进度（如滚动位置、段落索引等）
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- 复合唯一约束：防止同一用户对同一内容的重复记录
    UNIQUE(user_id, content_type, content_id)
);

-- 创建索引提升查询性能
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_content ON public.user_progress(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_updated_at ON public.user_progress(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON public.user_progress(completed);

-- 创建更新时间戳的触发器
CREATE OR REPLACE FUNCTION update_user_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    -- 自动设置 completed_at
    IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
        NEW.completed_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_progress_updated_at
    BEFORE UPDATE ON public.user_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_user_progress_updated_at();

-- ============================================
-- RLS (Row Level Security) 策略
-- ============================================

-- 启用 RLS
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- 策略1：用户只能查看自己的进度
CREATE POLICY "Users can view their own progress"
    ON public.user_progress
    FOR SELECT
    USING (auth.uid() = user_id);

-- 策略2：用户只能插入自己的进度
CREATE POLICY "Users can insert their own progress"
    ON public.user_progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- 策略3：用户只能更新自己的进度
CREATE POLICY "Users can update their own progress"
    ON public.user_progress
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 策略4：用户只能删除自己的进度
CREATE POLICY "Users can delete their own progress"
    ON public.user_progress
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 辅助视图（可选）
-- ============================================

-- 创建视图：用户完成统计
CREATE OR REPLACE VIEW public.user_completion_stats AS
SELECT 
    user_id,
    content_type,
    COUNT(*) as total_items,
    COUNT(*) FILTER (WHERE completed = TRUE) as completed_items,
    COUNT(*) FILTER (WHERE completed = FALSE) as in_progress_items,
    ROUND(AVG(progress_percentage), 2) as avg_progress,
    MAX(updated_at) as last_activity
FROM public.user_progress
GROUP BY user_id, content_type;

-- ============================================
-- 示例查询
-- ============================================

-- 查询用户最近的学习活动
-- SELECT * FROM public.user_progress 
-- WHERE user_id = 'xxx' 
-- ORDER BY updated_at DESC 
-- LIMIT 10;

-- 查询特定内容的进度
-- SELECT * FROM public.user_progress 
-- WHERE user_id = 'xxx' 
-- AND content_type = 'lesson' 
-- AND content_id = 'lesson-1';

-- 查询用户完成统计
-- SELECT * FROM public.user_completion_stats 
-- WHERE user_id = 'xxx';
