-- 用户反馈表
-- 用于存储用户提交的反馈、建议、Bug报告等

-- 创建反馈表
CREATE TABLE IF NOT EXISTS user_feedback (
  feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- 可选，支持匿名反馈
  page_url TEXT NOT NULL, -- 反馈来源页面
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('bug', 'feature', 'improvement', 'other')), -- 反馈类型
  title TEXT NOT NULL, -- 标题
  description TEXT NOT NULL, -- 详细描述
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 可选，1-5星评分
  screenshot_url TEXT, -- 可选，截图URL
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')), -- 状态
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_user_feedback_status ON user_feedback(status);
CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at ON user_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_feedback_type ON user_feedback(feedback_type);

-- 创建触发器自动更新updated_at
CREATE OR REPLACE FUNCTION update_user_feedback_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_feedback_updated_at
  BEFORE UPDATE ON user_feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_user_feedback_updated_at();

-- 启用行级安全策略 (RLS)
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- RLS策略：任何用户都可以创建反馈（支持匿名反馈）
CREATE POLICY "任何人都可以提交反馈"
  ON user_feedback
  FOR INSERT
  WITH CHECK (true);

-- RLS策略：用户可以查看自己的反馈
CREATE POLICY "用户可以查看自己的反馈"
  ON user_feedback
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IS NULL -- 匿名反馈，创建者无法查看（可选调整）
  );

-- RLS策略：用户可以更新自己的反馈
CREATE POLICY "用户可以更新自己的反馈"
  ON user_feedback
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS策略：管理员可以查看所有反馈（需要先创建admin角色或metadata字段）
-- 注意：这个策略需要在auth.users表中有is_admin字段或通过metadata判断
-- CREATE POLICY "管理员可以查看所有反馈"
--   ON user_feedback
--   FOR ALL
--   USING (
--     EXISTS (
--       SELECT 1 FROM auth.users
--       WHERE auth.users.id = auth.uid()
--       AND (auth.users.raw_user_meta_data->>'is_admin')::boolean = true
--     )
--   );

-- 注释说明
COMMENT ON TABLE user_feedback IS '用户反馈表，存储用户提交的反馈、建议和Bug报告';
COMMENT ON COLUMN user_feedback.feedback_id IS '反馈唯一标识';
COMMENT ON COLUMN user_feedback.user_id IS '用户ID（可选，支持匿名反馈）';
COMMENT ON COLUMN user_feedback.page_url IS '反馈来源页面URL';
COMMENT ON COLUMN user_feedback.feedback_type IS '反馈类型：bug-错误报告, feature-功能建议, improvement-改进建议, other-其他';
COMMENT ON COLUMN user_feedback.title IS '反馈标题';
COMMENT ON COLUMN user_feedback.description IS '反馈详细描述';
COMMENT ON COLUMN user_feedback.rating IS '评分（1-5星，可选）';
COMMENT ON COLUMN user_feedback.screenshot_url IS '截图URL（可选）';
COMMENT ON COLUMN user_feedback.status IS '处理状态：open-待处理, in_progress-处理中, resolved-已解决';
COMMENT ON COLUMN user_feedback.created_at IS '创建时间';
COMMENT ON COLUMN user_feedback.updated_at IS '更新时间';
