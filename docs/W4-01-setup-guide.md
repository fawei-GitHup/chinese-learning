# W4-01: 用户数据表接入 - 设置指南

## 📋 概述

本工单为 SRS（间隔重复学习）功能建立数据库基础，包括三个核心表：
- `user_saved_items` - 用户收藏
- `user_srs_cards` - SRS 学习卡片
- `user_srs_reviews` - 复习记录

所有表都配置了 RLS（Row Level Security），确保用户只能访问自己的数据。

## ⚠️ 重要说明

**Kilo Code 无法自动在 Supabase 控制台创建数据库表，需要您手动执行 SQL 脚本。**

## 🔧 手动操作步骤

### 步骤 1: 登录 Supabase Dashboard

1. 打开浏览器，访问 [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. 登录您的账号
3. 选择本项目对应的 Supabase 项目

### 步骤 2: 打开 SQL Editor

1. 在左侧导航栏找到并点击 **"SQL Editor"**
2. 点击 **"New query"** 创建新查询

### 步骤 3: 执行 SQL 脚本

1. 打开本项目的 [`docs/W4-01-database-schema.sql`](./W4-01-database-schema.sql) 文件
2. 复制全部内容
3. 粘贴到 Supabase SQL Editor 中
4. 点击右下角的 **"Run"** 按钮执行脚本
5. 等待执行完成（应该显示 "Success. No rows returned"）

### 步骤 4: 验证表创建

在 SQL Editor 中执行以下验证查询：

```sql
-- 验证表是否创建成功
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_saved_items', 'user_srs_cards', 'user_srs_reviews');
```

**预期结果**：应该返回 3 行，分别是三个表名。

### 步骤 5: 验证 RLS 策略

```sql
-- 验证 RLS 策略
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('user_saved_items', 'user_srs_cards', 'user_srs_reviews')
ORDER BY tablename, policyname;
```

**预期结果**：应该看到每个表都有多个策略（SELECT、INSERT、UPDATE、DELETE）。

## 📊 表结构说明

### 1. user_saved_items（用户收藏表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户 ID（外键到 auth.users） |
| item_type | TEXT | 收藏类型（lesson/reading/grammar/medical_term/scenario/other） |
| item_id | TEXT | 收藏内容的 ID |
| metadata | JSONB | 内容元数据（标题、描述等快照） |
| created_at | TIMESTAMPTZ | 创建时间 |

**RLS 策略**：用户只能操作自己的收藏（SELECT/INSERT/UPDATE/DELETE）

### 2. user_srs_cards（SRS 卡片表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户 ID |
| card_type | TEXT | 卡片类型（vocabulary/sentence/grammar/medical_term/custom） |
| content | JSONB | 卡片内容（正面、背面、拼音、音频等） |
| source_type | TEXT | 来源类型（可选） |
| source_id | TEXT | 来源 ID（可选） |
| difficulty | INTEGER | 难度等级（默认 0） |
| interval | INTEGER | 复习间隔（天数） |
| ease_factor | DECIMAL | 难易度因子（SM-2 算法，默认 2.5） |
| next_review | TIMESTAMPTZ | 下次复习时间 |
| review_count | INTEGER | 总复习次数 |
| correct_count | INTEGER | 正确次数 |
| created_at | TIMESTAMPTZ | 创建时间 |
| updated_at | TIMESTAMPTZ | 更新时间（自动触发器） |

**RLS 策略**：用户只能操作自己的卡片（SELECT/INSERT/UPDATE/DELETE）

### 3. user_srs_reviews（复习记录表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 用户 ID |
| card_id | UUID | 卡片 ID（外键到 user_srs_cards） |
| reviewed_at | TIMESTAMPTZ | 复习时间 |
| quality | INTEGER | 复习质量（0-5，SM-2 评分） |
| previous_interval | INTEGER | 复习前间隔 |
| previous_ease_factor | DECIMAL | 复习前难易度因子 |
| new_interval | INTEGER | 复习后间隔 |
| new_ease_factor | DECIMAL | 复习后难易度因子 |
| time_spent | INTEGER | 用时（秒，可选） |

**RLS 策略**：用户只能查看和创建自己的复习记录（SELECT/INSERT）

## 🎯 SRS 算法说明（SM-2）

本项目使用 **SuperMemo 2 (SM-2)** 算法进行间隔重复学习：

### 复习质量评分（quality）

- **0** - 完全不记得（Again）
- **1** - 几乎不记得，很困难（Hard）
- **2** - 记得，但很困难（Hard）
- **3** - 记得，有点困难（Good）
- **4** - 记得，比较容易（Good）
- **5** - 完全记得，非常容易（Easy）

### 算法核心参数

- **interval**（间隔）：距离下次复习的天数
- **ease_factor**（难易度因子）：1.3 - 2.5+，越高表示越容易
- **difficulty**（难度等级）：0（新卡片）- N（复习次数）

## 🔐 安全说明

### RLS（Row Level Security）保护

所有表都启用了 RLS，确保：
1. ✅ 用户只能查看自己的数据
2. ✅ 用户只能修改自己的数据
3. ✅ 不同用户的数据完全隔离
4. ✅ 即使直接使用 Supabase API，也无法访问他人数据

### 测试 RLS

在应用中登录两个不同账号，尝试查询对方的数据，应该返回空结果。

## ✅ 验收清单

完成以下检查后，本工单即可通过验收：

- [ ] 三个表创建成功（user_saved_items, user_srs_cards, user_srs_reviews）
- [ ] 所有表都启用了 RLS
- [ ] 每个表都有正确的 RLS 策略（可以通过上面的验证查询确认）
- [ ] 索引创建成功（查询性能优化）
- [ ] updated_at 触发器正常工作（user_srs_cards）
- [ ] TypeScript API 函数可以正常调用（通过前端测试）

## 🚀 后续工单

- **W4-02**: SRS 学习界面（使用本工单的表和 API）
- **W4-03**: SRS 统计面板（基于 user_srs_reviews 数据）

## 📚 相关文件

- SQL 脚本：[`docs/W4-01-database-schema.sql`](./W4-01-database-schema.sql)
- TypeScript 类型：[`lib/srs/types.ts`](../lib/srs/types.ts)
- API 函数：[`lib/srs/api.ts`](../lib/srs/api.ts)
- 模块入口：[`lib/srs/index.ts`](../lib/srs/index.ts)

## ❓ 常见问题

### Q: 执行 SQL 时提示权限错误？
A: 确保您是项目的 Owner 或有数据库管理权限。

### Q: 表已存在，如何重新创建？
A: 先执行 `DROP TABLE` 删除旧表（注意备份数据），然后重新执行脚本。

### Q: 如何查看当前的 RLS 策略？
A: 使用步骤 5 中的验证查询，或在 Supabase Dashboard 的 "Table Editor" 中查看。

### Q: 是否需要手动创建索引？
A: 不需要，SQL 脚本已包含所有必要的索引。

---

**完成以上步骤后，数据库部分即设置完成！🎉**
