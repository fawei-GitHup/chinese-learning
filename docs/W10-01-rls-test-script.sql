-- ================================================================
-- W10-01: 权限与RLS回归测试 - SQL测试脚本
-- ================================================================
-- 说明：本脚本用于验证RLS策略是否正确实施
-- 目标：确保跨账号数据隔离、未登录用户无法访问数据
-- 前序工单：W4-01 (创建表和RLS策略)
-- ================================================================

-- ================================================================
-- 准备工作：创建测试用户数据
-- ================================================================
-- 注意：在实际执行前，请先通过应用或Supabase Auth创建两个测试用户：
-- 用户A: test-user-a@example.com
-- 用户B: test-user-b@example.com
-- 然后获取他们的UUID，替换下面的占位符
-- ================================================================

-- 设置测试用户UUID（替换为实际UUID）
-- 例如：\set user_a_id '123e4567-e89b-12d3-a456-426614174000'
-- 例如：\set user_b_id '123e4567-e89b-12d3-a456-426614174001'

-- ================================================================
-- 测试场景 1: user_saved_items 表 RLS 验证
-- ================================================================

-- 1.1 准备测试数据
-- 使用管理员权限插入测试数据（绕过RLS）
BEGIN;

SET LOCAL ROLE postgres; -- 或其他管理员角色

-- 为用户A插入收藏数据
INSERT INTO public.user_saved_items (user_id, item_type, item_id, metadata)
VALUES 
  (:user_a_id, 'lesson', 'lesson-001', '{"title": "用户A的课程收藏"}'),
  (:user_a_id, 'grammar', 'grammar-001', '{"title": "用户A的语法收藏"}'),
  (:user_a_id, 'medical_term', 'medical-001', '{"title": "用户A的医学术语收藏"}');

-- 为用户B插入收藏数据
INSERT INTO public.user_saved_items (user_id, item_type, item_id, metadata)
VALUES 
  (:user_b_id, 'lesson', 'lesson-002', '{"title": "用户B的课程收藏"}'),
  (:user_b_id, 'reading', 'reading-001', '{"title": "用户B的阅读收藏"}');

COMMIT;

-- 1.2 验证用户只能查看自己的收藏
-- 模拟用户A登录（设置auth.uid()）
BEGIN;
SET LOCAL "request.jwt.claims" TO '{"sub": ":user_a_id"}'; -- Supabase RLS上下文

-- 用户A应该能看到3条自己的收藏
SELECT COUNT(*) as expected_3 FROM public.user_saved_items;

-- 用户A不应该看到用户B的收藏
SELECT COUNT(*) as expected_0 FROM public.user_saved_items WHERE user_id = :user_b_id;

ROLLBACK;

-- 1.3 验证用户只能创建自己的收藏
BEGIN;
SET LOCAL "request.jwt.claims" TO '{"sub": ":user_a_id"}';

-- 成功：用户A可以创建自己的收藏
INSERT INTO public.user_saved_items (user_id, item_type, item_id, metadata)
VALUES (:user_a_id, 'scenario', 'scenario-001', '{"title": "新收藏"}');

-- 失败：用户A不能创建其他人的收藏（应抛出错误）
-- INSERT INTO public.user_saved_items (user_id, item_type, item_id, metadata)
-- VALUES (:user_b_id, 'scenario', 'scenario-002', '{"title": "非法收藏"}');
-- 预期结果：ERROR: new row violates row-level security policy

ROLLBACK;

-- 1.4 验证用户只能删除自己的收藏
BEGIN;
SET LOCAL "request.jwt.claims" TO '{"sub": ":user_a_id"}';

-- 成功：用户A可以删除自己的收藏
DELETE FROM public.user_saved_items 
WHERE user_id = :user_a_id AND item_type = 'lesson' AND item_id = 'lesson-001';

-- 失败：用户A不能删除用户B的收藏（应该影响0行）
DELETE FROM public.user_saved_items 
WHERE user_id = :user_b_id AND item_type = 'lesson' AND item_id = 'lesson-002';
-- 预期结果：DELETE 0（RLS策略阻止）

ROLLBACK;


-- ================================================================
-- 测试场景 2: user_srs_cards 表 RLS 验证
-- ================================================================

-- 2.1 准备测试数据
BEGIN;

SET LOCAL ROLE postgres;

-- 为用户A插入SRS卡片
INSERT INTO public.user_srs_cards (user_id, card_type, content, source_type, source_id)
VALUES 
  (:user_a_id, 'vocabulary', '{"front": "医生", "back": "doctor", "pinyin": "yīshēng"}', 'lesson', 'lesson-001'),
  (:user_a_id, 'grammar', '{"front": "Grammar pattern 1", "back": "Explanation"}', 'grammar', 'grammar-001');

-- 为用户B插入SRS卡片
INSERT INTO public.user_srs_cards (user_id, card_type, content, source_type, source_id)
VALUES 
  (:user_b_id, 'vocabulary', '{"front": "护士", "back": "nurse", "pinyin": "hùshi"}', 'lesson', 'lesson-002');

COMMIT;

-- 2.2 验证用户只能查看自己的卡片
BEGIN;
SET LOCAL "request.jwt.claims" TO '{"sub": ":user_a_id"}';

-- 用户A应该能看到2张自己的卡片
SELECT COUNT(*) as expected_2 FROM public.user_srs_cards;

-- 用户A不应该看到用户B的卡片
SELECT COUNT(*) as expected_0 FROM public.user_srs_cards WHERE user_id = :user_b_id;

ROLLBACK;

-- 2.3 验证用户只能更新自己的卡片
BEGIN;
SET LOCAL "request.jwt.claims" TO '{"sub": ":user_a_id"}';

-- 成功：用户A可以更新自己的卡片
UPDATE public.user_srs_cards 
SET difficulty = 1, interval = 3, ease_factor = 2.6
WHERE user_id = :user_a_id AND card_type = 'vocabulary';

-- 失败：用户A不能更新用户B的卡片（应该影响0行）
UPDATE public.user_srs_cards 
SET difficulty = 1
WHERE user_id = :user_b_id;
-- 预期结果：UPDATE 0

ROLLBACK;

-- 2.4 验证用户不能修改user_id（防止数据劫持）
BEGIN;
SET LOCAL "request.jwt.claims" TO '{"sub": ":user_a_id"}';

-- 失败：用户A不能将自己的卡片转移给用户B
-- UPDATE public.user_srs_cards 
-- SET user_id = :user_b_id
-- WHERE user_id = :user_a_id LIMIT 1;
-- 预期结果：ERROR: new row violates row-level security policy

ROLLBACK;


-- ================================================================
-- 测试场景 3: user_srs_reviews 表 RLS 验证
-- ================================================================

-- 3.1 准备测试数据
BEGIN;

SET LOCAL ROLE postgres;

-- 获取用户A的第一张卡片ID
WITH card_a AS (
  SELECT id FROM public.user_srs_cards WHERE user_id = :user_a_id LIMIT 1
)
INSERT INTO public.user_srs_reviews (user_id, card_id, quality, previous_interval, previous_ease_factor, new_interval, new_ease_factor, time_spent)
SELECT :user_a_id, id, 4, 0, 2.50, 1, 2.60, 15
FROM card_a;

-- 获取用户B的第一张卡片ID
WITH card_b AS (
  SELECT id FROM public.user_srs_cards WHERE user_id = :user_b_id LIMIT 1
)
INSERT INTO public.user_srs_reviews (user_id, card_id, quality, previous_interval, previous_ease_factor, new_interval, new_ease_factor, time_spent)
SELECT :user_b_id, id, 5, 0, 2.50, 1, 2.60, 10
FROM card_b;

COMMIT;

-- 3.2 验证用户只能查看自己的复习记录
BEGIN;
SET LOCAL "request.jwt.claims" TO '{"sub": ":user_a_id"}';

-- 用户A应该能看到自己的复习记录
SELECT COUNT(*) as expected_gt_0 FROM public.user_srs_reviews;

-- 用户A不应该看到用户B的复习记录
SELECT COUNT(*) as expected_0 FROM public.user_srs_reviews WHERE user_id = :user_b_id;

ROLLBACK;

-- 3.3 验证用户只能创建自己的复习记录
BEGIN;
SET LOCAL "request.jwt.claims" TO '{"sub": ":user_a_id"}';

-- 成功：用户A可以创建自己的复习记录
WITH card_a AS (
  SELECT id FROM public.user_srs_cards WHERE user_id = :user_a_id LIMIT 1
)
INSERT INTO public.user_srs_reviews (user_id, card_id, quality, previous_interval, previous_ease_factor, new_interval, new_ease_factor)
SELECT :user_a_id, id, 3, 1, 2.60, 3, 2.50
FROM card_a;

-- 失败：用户A不能创建其他用户的复习记录
-- WITH card_b AS (
--   SELECT id FROM public.user_srs_cards WHERE user_id = :user_b_id LIMIT 1
-- )
-- INSERT INTO public.user_srs_reviews (user_id, card_id, quality, previous_interval, previous_ease_factor, new_interval, new_ease_factor)
-- SELECT :user_b_id, id, 3, 1, 2.60, 3, 2.50
-- FROM card_b;
-- 预期结果：ERROR: new row violates row-level security policy

ROLLBACK;

-- 3.4 验证不允许更新或删除复习记录（保证数据完整性）
BEGIN;
SET LOCAL "request.jwt.claims" TO '{"sub": ":user_a_id"}';

-- 失败：不允许更新复习记录（没有UPDATE策略）
-- UPDATE public.user_srs_reviews SET quality = 5 WHERE user_id = :user_a_id;
-- 预期结果：ERROR: permission denied或UPDATE 0

-- 失败：不允许删除复习记录（没有DELETE策略）
-- DELETE FROM public.user_srs_reviews WHERE user_id = :user_a_id;
-- 预期结果：ERROR: permission denied或DELETE 0

ROLLBACK;


-- ================================================================
-- 测试场景 4: 未登录用户访问验证
-- ================================================================

-- 4.1 模拟未登录状态（无auth.uid()）
BEGIN;
-- 不设置 request.jwt.claims，模拟匿名用户

-- 失败：匿名用户无法查看任何收藏
SELECT COUNT(*) as expected_0 FROM public.user_saved_items;

-- 失败：匿名用户无法查看任何SRS卡片
SELECT COUNT(*) as expected_0 FROM public.user_srs_cards;

-- 失败：匿名用户无法查看任何复习记录
SELECT COUNT(*) as expected_0 FROM public.user_srs_reviews;

-- 失败：匿名用户无法创建数据
-- INSERT INTO public.user_saved_items (user_id, item_type, item_id)
-- VALUES (:user_a_id, 'lesson', 'test');
-- 预期结果：ERROR: new row violates row-level security policy

ROLLBACK;


-- ================================================================
-- 测试场景 5: 跨表关联查询验证
-- ================================================================

-- 5.1 验证用户只能看到自己的卡片和复习记录的关联
BEGIN;
SET LOCAL "request.jwt.claims" TO '{"sub": ":user_a_id"}';

-- 用户A查询自己的卡片和复习记录
SELECT 
  c.id,
  c.card_type,
  COUNT(r.id) as review_count
FROM public.user_srs_cards c
LEFT JOIN public.user_srs_reviews r ON c.id = r.card_id
WHERE c.user_id = :user_a_id
GROUP BY c.id, c.card_type;
-- 预期：只返回用户A的数据

-- 用户A不应该能通过JOIN看到用户B的数据
SELECT COUNT(*) as expected_0
FROM public.user_srs_cards c
JOIN public.user_srs_reviews r ON c.id = r.card_id
WHERE c.user_id = :user_b_id;

ROLLBACK;


-- ================================================================
-- 清理测试数据（可选）
-- ================================================================

-- 清理所有测试数据
BEGIN;

SET LOCAL ROLE postgres;

DELETE FROM public.user_srs_reviews WHERE user_id IN (:user_a_id, :user_b_id);
DELETE FROM public.user_srs_cards WHERE user_id IN (:user_a_id, :user_b_id);
DELETE FROM public.user_saved_items WHERE user_id IN (:user_a_id, :user_b_id);

COMMIT;


-- ================================================================
-- 验证RLS策略配置
-- ================================================================

-- 查看所有表的RLS状态
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('user_saved_items', 'user_srs_cards', 'user_srs_reviews')
ORDER BY tablename;
-- 预期：所有表的 rls_enabled = true

-- 查看所有RLS策略详情
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename IN ('user_saved_items', 'user_srs_cards', 'user_srs_reviews')
ORDER BY tablename, policyname;
-- 预期：每个表都有正确的SELECT、INSERT、UPDATE、DELETE策略


-- ================================================================
-- 测试总结检查清单
-- ================================================================

/*
□ user_saved_items 表
  □ 用户只能SELECT自己的收藏
  □ 用户只能INSERT自己的收藏
  □ 用户只能UPDATE自己的收藏
  □ 用户只能DELETE自己的收藏
  □ 用户无法访问其他用户的收藏

□ user_srs_cards 表
  □ 用户只能SELECT自己的卡片
  □ 用户只能INSERT自己的卡片
  □ 用户只能UPDATE自己的卡片
  □ 用户只能DELETE自己的卡片
  □ 用户无法修改user_id字段
  □ 用户无法访问其他用户的卡片

□ user_srs_reviews 表
  □ 用户只能SELECT自己的复习记录
  □ 用户只能INSERT自己的复习记录
  □ 用户无法UPDATE复习记录
  □ 用户无法DELETE复习记录
  □ 用户无法访问其他用户的复习记录

□ 跨账号数据隔离
  □ 用户A完全无法看到用户B的数据
  □ 用户A无法修改用户B的数据
  □ 跨表JOIN查询也受RLS保护

□ 未登录用户保护
  □ 匿名用户无法SELECT任何表
  □ 匿名用户无法INSERT任何数据
  □ 匿名用户无法UPDATE任何数据
  □ 匿名用户无法DELETE任何数据

□ RLS配置验证
  □ 所有表已启用RLS
  □ 所有策略已正确创建
  □ 策略使用auth.uid()进行验证
*/

-- ================================================================
-- 完成！
-- ================================================================
