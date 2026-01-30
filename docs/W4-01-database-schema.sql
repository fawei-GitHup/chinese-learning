-- ================================================================
-- W4-01: 用户数据表接入 - 数据库 Schema
-- ================================================================
-- 说明：本脚本需要在 Supabase SQL Editor 中手动执行
-- 前序工单：W0-01 (Supabase client)、W0-04 (认证)
-- ================================================================

-- ================================================================
-- 1. user_saved_items - 用户收藏表
-- ================================================================
-- 功能：用户可以收藏课程、阅读材料、语法点、医学术语、场景对话等内容
-- ================================================================

CREATE TABLE IF NOT EXISTS public.user_saved_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 收藏内容类型和ID
  item_type TEXT NOT NULL CHECK (item_type IN ('lesson', 'reading', 'grammar', 'medical_term', 'scenario', 'other')),
  item_id TEXT NOT NULL,
  
  -- 元数据（存储内容标题、描述等快照信息，避免重复查询）
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- 时间戳
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 唯一约束：同一用户不能重复收藏同一内容
  UNIQUE(user_id, item_type, item_id)
);

-- 索引优化
CREATE INDEX IF NOT EXISTS idx_user_saved_items_user_id ON public.user_saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_items_item_type ON public.user_saved_items(item_type);
CREATE INDEX IF NOT EXISTS idx_user_saved_items_created_at ON public.user_saved_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_saved_items_user_type ON public.user_saved_items(user_id, item_type);

-- RLS 策略
ALTER TABLE public.user_saved_items ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的收藏
CREATE POLICY "Users can view own saved items" ON public.user_saved_items
  FOR SELECT USING (auth.uid() = user_id);

-- 用户只能创建自己的收藏
CREATE POLICY "Users can create own saved items" ON public.user_saved_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户只能删除自己的收藏
CREATE POLICY "Users can delete own saved items" ON public.user_saved_items
  FOR DELETE USING (auth.uid() = user_id);

-- 用户只能更新自己的收藏（仅 metadata 字段）
CREATE POLICY "Users can update own saved items" ON public.user_saved_items
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ================================================================
-- 2. user_srs_cards - 用户 SRS 卡片表
-- ================================================================
-- 功能：存储用户的间隔重复学习（SRS）卡片
-- 算法：基于 SM-2 算法（SuperMemo 2）
-- ================================================================

CREATE TABLE IF NOT EXISTS public.user_srs_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 卡片类型
  card_type TEXT NOT NULL CHECK (card_type IN ('vocabulary', 'sentence', 'grammar', 'medical_term', 'custom')),
  
  -- 卡片内容（JSONB 格式，灵活存储不同类型卡片的数据）
  -- 例如：{ "front": "医生", "back": "doctor", "pinyin": "yīshēng", "audio_url": "..." }
  content JSONB NOT NULL,
  
  -- 来源信息（可选，关联到原始内容）
  source_type TEXT, -- 'lesson', 'reading', 'medical_term' 等
  source_id TEXT,
  
  -- SRS 参数（SM-2 算法）
  difficulty INTEGER NOT NULL DEFAULT 0 CHECK (difficulty >= 0), -- 难度等级（新卡片 = 0）
  interval INTEGER NOT NULL DEFAULT 0 CHECK (interval >= 0), -- 当前间隔（天数）
  ease_factor DECIMAL(4, 2) NOT NULL DEFAULT 2.50 CHECK (ease_factor >= 1.30), -- 难易度因子（默认 2.5）
  
  -- 下次复习时间
  next_review TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 统计信息
  review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0), -- 总复习次数
  correct_count INTEGER NOT NULL DEFAULT 0 CHECK (correct_count >= 0), -- 正确次数
  
  -- 时间戳
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 索引约束
  CONSTRAINT valid_correct_count CHECK (correct_count <= review_count)
);

-- 索引优化
CREATE INDEX IF NOT EXISTS idx_user_srs_cards_user_id ON public.user_srs_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_srs_cards_card_type ON public.user_srs_cards(card_type);
CREATE INDEX IF NOT EXISTS idx_user_srs_cards_next_review ON public.user_srs_cards(next_review);
CREATE INDEX IF NOT EXISTS idx_user_srs_cards_user_next_review ON public.user_srs_cards(user_id, next_review) WHERE next_review <= NOW();
CREATE INDEX IF NOT EXISTS idx_user_srs_cards_source ON public.user_srs_cards(source_type, source_id);

-- RLS 策略
ALTER TABLE public.user_srs_cards ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的卡片
CREATE POLICY "Users can view own SRS cards" ON public.user_srs_cards
  FOR SELECT USING (auth.uid() = user_id);

-- 用户只能创建自己的卡片
CREATE POLICY "Users can create own SRS cards" ON public.user_srs_cards
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 用户只能更新自己的卡片
CREATE POLICY "Users can update own SRS cards" ON public.user_srs_cards
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 用户只能删除自己的卡片
CREATE POLICY "Users can delete own SRS cards" ON public.user_srs_cards
  FOR DELETE USING (auth.uid() = user_id);

-- 自动更新 updated_at 触发器
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_srs_cards_updated_at
  BEFORE UPDATE ON public.user_srs_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();


-- ================================================================
-- 3. user_srs_reviews - 用户 SRS 复习记录表
-- ================================================================
-- 功能：记录用户的每次复习行为，用于统计分析和学习曲线
-- ================================================================

CREATE TABLE IF NOT EXISTS public.user_srs_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.user_srs_cards(id) ON DELETE CASCADE,
  
  -- 复习时间
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 复习质量（0-5，基于 SM-2）
  -- 0: 完全不记得（Again）
  -- 1: 几乎不记得，很困难（Hard）
  -- 2: 记得，但很困难（Hard）
  -- 3: 记得，有点困难（Good）
  -- 4: 记得，比较容易（Good）
  -- 5: 完全记得，非常容易（Easy）
  quality INTEGER NOT NULL CHECK (quality >= 0 AND quality <= 5),
  
  -- 复习前的 SRS 参数（用于追踪变化）
  previous_interval INTEGER NOT NULL,
  previous_ease_factor DECIMAL(4, 2) NOT NULL,
  
  -- 复习后的新参数
  new_interval INTEGER NOT NULL,
  new_ease_factor DECIMAL(4, 2) NOT NULL,
  
  -- 复习用时（秒）
  time_spent INTEGER CHECK (time_spent >= 0)
);

-- 索引优化
CREATE INDEX IF NOT EXISTS idx_user_srs_reviews_user_id ON public.user_srs_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_user_srs_reviews_card_id ON public.user_srs_reviews(card_id);
CREATE INDEX IF NOT EXISTS idx_user_srs_reviews_reviewed_at ON public.user_srs_reviews(reviewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_srs_reviews_user_reviewed_at ON public.user_srs_reviews(user_id, reviewed_at DESC);

-- RLS 策略
ALTER TABLE public.user_srs_reviews ENABLE ROW LEVEL SECURITY;

-- 用户只能查看自己的复习记录
CREATE POLICY "Users can view own SRS reviews" ON public.user_srs_reviews
  FOR SELECT USING (auth.uid() = user_id);

-- 用户只能创建自己的复习记录
CREATE POLICY "Users can create own SRS reviews" ON public.user_srs_reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 不允许更新或删除复习记录（保证数据完整性）
-- 如果确实需要删除，可以通过管理员权限操作


-- ================================================================
-- 验证脚本（可选）
-- ================================================================
-- 执行以下查询验证表是否创建成功：

-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- AND table_name IN ('user_saved_items', 'user_srs_cards', 'user_srs_reviews');

-- 验证 RLS 策略：
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename IN ('user_saved_items', 'user_srs_cards', 'user_srs_reviews')
-- ORDER BY tablename, policyname;

-- ================================================================
-- 完成！
-- ================================================================
