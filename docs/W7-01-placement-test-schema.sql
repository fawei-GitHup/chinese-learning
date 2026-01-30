-- ============================================================================
-- W7-01: 分级测试题库与答题 - 数据库架构
-- ============================================================================
-- 创建日期: 2026-01-30
-- 用途: 存储用户等级、分级测试结果和题库数据
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. 用户档案表 (user_profiles)
-- ----------------------------------------------------------------------------
-- 存储用户的HSK等级、分级测试结果等个人学习档案信息
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 基本等级信息
  hsk_level TEXT NOT NULL DEFAULT 'HSK1' CHECK (hsk_level IN ('HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6')),
  
  -- 分级测试结果
  placement_score INTEGER CHECK (placement_score >= 0 AND placement_score <= 100),
  placement_completed_at TIMESTAMPTZ,
  
  -- 元数据
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 唯一约束
  UNIQUE(user_id)
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_hsk_level ON user_profiles(hsk_level);

-- 注释
COMMENT ON TABLE user_profiles IS '用户学习档案：存储HSK等级、分级测试结果等';
COMMENT ON COLUMN user_profiles.user_id IS '关联的用户ID（auth.users）';
COMMENT ON COLUMN user_profiles.hsk_level IS '用户当前HSK等级（HSK1-HSK6）';
COMMENT ON COLUMN user_profiles.placement_score IS '分级测试得分（0-100）';
COMMENT ON COLUMN user_profiles.placement_completed_at IS '完成分级测试的时间';

-- ----------------------------------------------------------------------------
-- 2. RLS 策略 (Row Level Security)
-- ----------------------------------------------------------------------------

-- 启用RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 用户只能查看和修改自己的档案
CREATE POLICY "用户可以查看自己的档案"
  ON user_profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的档案"
  ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的档案"
  ON user_profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 3. 分级测试记录表 (placement_test_attempts)
-- ----------------------------------------------------------------------------
-- 存储每次分级测试的详细记录，支持重测
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS placement_test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 测试结果
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  total_questions INTEGER NOT NULL DEFAULT 24,
  correct_answers INTEGER NOT NULL CHECK (correct_answers >= 0),
  
  -- 测试详情 (JSONB格式存储答题记录)
  answers JSONB NOT NULL DEFAULT '[]', -- [{question_id, user_answer, correct_answer, is_correct}]
  
  -- 分级结果
  assessed_level TEXT NOT NULL CHECK (assessed_level IN ('HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6')),
  
  -- 时间戳
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_placement_attempts_user_id ON placement_test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_placement_attempts_completed_at ON placement_test_attempts(completed_at DESC);

-- 注释
COMMENT ON TABLE placement_test_attempts IS '分级测试记录：存储每次测试的详细结果';
COMMENT ON COLUMN placement_test_attempts.score IS '测试总分（0-100）';
COMMENT ON COLUMN placement_test_attempts.answers IS '详细答题记录（JSONB数组）';
COMMENT ON COLUMN placement_test_attempts.assessed_level IS '基于分数评估的HSK等级';

-- RLS 策略
ALTER TABLE placement_test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "用户可以查看自己的测试记录"
  ON placement_test_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建自己的测试记录"
  ON placement_test_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- 4. 自动更新时间戳触发器
-- ----------------------------------------------------------------------------

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为 user_profiles 表添加触发器
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ----------------------------------------------------------------------------
-- 5. 辅助函数
-- ----------------------------------------------------------------------------

-- 获取或创建用户档案
CREATE OR REPLACE FUNCTION get_or_create_user_profile(p_user_id UUID)
RETURNS user_profiles AS $$
DECLARE
  v_profile user_profiles;
BEGIN
  -- 尝试获取现有档案
  SELECT * INTO v_profile
  FROM user_profiles
  WHERE user_id = p_user_id;
  
  -- 如果不存在则创建
  IF v_profile IS NULL THEN
    INSERT INTO user_profiles (user_id, hsk_level)
    VALUES (p_user_id, 'HSK1')
    RETURNING * INTO v_profile;
  END IF;
  
  RETURN v_profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 根据分数计算HSK等级
CREATE OR REPLACE FUNCTION calculate_hsk_level(p_score INTEGER)
RETURNS TEXT AS $$
BEGIN
  CASE
    WHEN p_score >= 85 THEN RETURN 'HSK6';
    WHEN p_score >= 70 THEN RETURN 'HSK5';
    WHEN p_score >= 55 THEN RETURN 'HSK4';
    WHEN p_score >= 40 THEN RETURN 'HSK3';
    WHEN p_score >= 25 THEN RETURN 'HSK2';
    ELSE RETURN 'HSK1';
  END CASE;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 保存分级测试结果并更新用户档案
CREATE OR REPLACE FUNCTION save_placement_test_result(
  p_user_id UUID,
  p_score INTEGER,
  p_total_questions INTEGER,
  p_correct_answers INTEGER,
  p_answers JSONB,
  p_started_at TIMESTAMPTZ,
  p_completed_at TIMESTAMPTZ
)
RETURNS JSONB AS $$
DECLARE
  v_assessed_level TEXT;
  v_attempt_id UUID;
  v_result JSONB;
BEGIN
  -- 计算等级
  v_assessed_level := calculate_hsk_level(p_score);
  
  -- 插入测试记录
  INSERT INTO placement_test_attempts (
    user_id,
    score,
    total_questions,
    correct_answers,
    answers,
    assessed_level,
    started_at,
    completed_at
  ) VALUES (
    p_user_id,
    p_score,
    p_total_questions,
    p_correct_answers,
    p_answers,
    v_assessed_level,
    p_started_at,
    p_completed_at
  )
  RETURNING id INTO v_attempt_id;
  
  -- 更新或创建用户档案
  INSERT INTO user_profiles (
    user_id,
    hsk_level,
    placement_score,
    placement_completed_at
  ) VALUES (
    p_user_id,
    v_assessed_level,
    p_score,
    p_completed_at
  )
  ON CONFLICT (user_id)
  DO UPDATE SET
    hsk_level = v_assessed_level,
    placement_score = p_score,
    placement_completed_at = p_completed_at,
    updated_at = NOW();
  
  -- 返回结果
  v_result := jsonb_build_object(
    'attempt_id', v_attempt_id,
    'assessed_level', v_assessed_level,
    'score', p_score,
    'message', '分级测试完成！'
  );
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 6. 示例数据 (仅用于开发/测试)
-- ----------------------------------------------------------------------------

-- 注意：生产环境中应该删除或注释掉此部分

-- 示例：为测试用户创建档案
-- INSERT INTO user_profiles (user_id, hsk_level, placement_score, placement_completed_at)
-- VALUES 
--   ('00000000-0000-0000-0000-000000000001', 'HSK3', 65, NOW()),
--   ('00000000-0000-0000-0000-000000000002', 'HSK1', 20, NOW())
-- ON CONFLICT (user_id) DO NOTHING;

-- ============================================================================
-- 部署说明
-- ============================================================================
-- 1. 在 Supabase Dashboard 中执行此 SQL
-- 2. 确认所有表和策略创建成功
-- 3. 测试 RLS 策略是否正常工作
-- 4. 验证触发器和函数是否按预期执行
-- ============================================================================

-- 验证查询
-- SELECT * FROM user_profiles;
-- SELECT * FROM placement_test_attempts ORDER BY completed_at DESC LIMIT 10;
-- SELECT calculate_hsk_level(75); -- 应该返回 'HSK5'
