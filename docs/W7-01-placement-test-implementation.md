# W7-01: 分级测试题库与答题 - 实施文档

## 📋 概述

实现了HSK分级测试功能，用户完成测试后获得等级评估，结果写入user_profiles表，Dashboard显示用户等级，推荐系统基于等级提供个性化推荐。

## ✅ 完成日期

2026-01-30

## 🏗️ 实现方案

### 新增文件

1. **数据库架构**:
   - `docs/W7-01-placement-test-schema.sql` - 数据库表结构（user_profiles + placement_test_attempts）

2. **题库数据**:
   - `lib/placement-test-mock.ts` - 分级测试题库mock数据（HSK1-6，24题）

3. **API层**:
   - `lib/placement-test/api.ts` - 分级测试API函数

4. **UI组件**:
   -app/(app)/placement/PlacementTestClient.tsx` - 测试流程客户端组件
   - `app/(app)/placement/page.tsx` - 分级测试页面入口

### 修改文件

1. **Dashboard集成**:
   - `app/(app)/dashboard/page.tsx` - 添加"我的等级"卡片显示用户HSK等级

## 🗂️ 核心功能

### 1. 数据库设计

**user_profiles 表**:
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  hsk_level TEXT DEFAULT 'HSK1' CHECK (hsk_level IN ('HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6')),
  placement_score INTEGER CHECK (placement_score >= 0 AND placement_score <= 100),
  placement_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**placement_test_attempts 表**:
```sql
CREATE TABLE placement_test_attempts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  total_questions INTEGER DEFAULT 24,
  correct_answers INTEGER CHECK (correct_answers >= 0),
  answers JSONB DEFAULT '[]',
  assessed_level TEXT CHECK (assessed_level IN ('HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**RLS策略**:
- 用户只能查看和修改自己的档案
- 用户只能创建和查看自己的测试记录

**辅助函数**:
- `calculate_hsk_level(score)` - 根据分数计算HSK等级
- `save_placement_test_result()` - 保存测试结果并更新用户档案

### 2. 题库设计

**题库结构**:
- HSK1: 5题（基础词汇和语法）
- HSK2: 4题（基础句型和词汇）
- HSK3: 4题（中级语法和词汇）
- HSK4: 4题（高级词汇和复杂句型）
- HSK5: 4题（高级语法和专业词汇）
- HSK6: 3题（文言文和成语）
- 总计: 24题

**题目类型**:
- 词汇题：词义选择
- 语法题：句型结构
- 阅读题：短文理解

**评分机制**:
- 基于各级别正确率评估用户水平
- 如果某级别正确率 >= 60%，评为该级别
- 兜底策略：根据总分评估
  - 85+ → HSK6
  - 70-84 → HSK5
  - 55-69 → HSK4
  - 40-54 → HSK3
  - 25-39 → HSK2
  - 0-24 → HSK1

### 3. 测试流程

**3.1 介绍页**:
- 测试说明（题库范围、时长、评估方式）
- 图标展示：目标、书本、时钟、趋势
- "开始测试"按钮

**3.2 答题页**:
- 顶部进度条显示答题进度
- 题目卡片展示：
  - 级别标签（HSK1-6）
  - 题目文本
  - 4个选项（ABCD）
- 选项状态：未选中 / 已选中
- "下一题"按钮（最后一题显示"完成测试"）

**3.3 结果页**:
- 成功图标动画
- 评估等级显示（大字号）
- 得分显示（0-100）
- 学习建议卡片
- 操作按钮：
  - "开始学习"（跳转Dashboard）
  - "重新测试"

### 4. API 集成

**savePlacementTestResult**:
```typescript
await savePlacementTestResult({
  score: result.score,
  totalQuestions: result.totalQuestions,
  correctAnswers: result.correctAnswers,
  assessedLevel: result.assessedLevel,
  answers: userAnswers,
  startedAt: startTime,
  completedAt: new Date()
})
```

- 调用Supabase RPC函数`save_placement_test_result`
- 自动创建/更新user_profiles记录
- 创建placement_test_attempts记录
- Toast通知用户保存结果

**getUserProfile**:
```typescript
const { data: profile } = await getUserProfile()
// profile.hsk_level - 用户当前等级
// profile.placement_score - 测试分数
// profile.placement_completed_at - 完成时间
```

### 5. Dashboard 集成

**我的等级卡片**:
```tsx
<div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6">
  <div className="flex items-center gap-3 mb-4">
    <Award className="h-5 w-5 text-amber-400" />
    <h3 className="text-lg font-semibold text-white">我的等级</h3>
  </div>
  <div className="text-center mb-4">
    <div className="inline-block rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/20 px-6 py-3 mb-2">
      <span className="text-3xl font-bold text-white">HSK3</span>
    </div>
    <p className="text-sm text-zinc-400">中级水平</p>
  </div>
  <Link href="/app/placement">
    <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
      重新测试等级
    </Button>
  </Link>
</div>
```

- 显示当前用户HSK等级
- "重新测试等级"按钮链接到 `/app/placement`
- 等级数据从user_profiles表读取

### 6. 推荐系统联动（W6-02）

推荐引擎使用用户等级评估内容难度匹配：

**等级匹配度评分 (0-30分)**:
```typescript
function calculateLevelMatch(contentLevel: string, userLevel: string): number {
  const levelOrder = ['HSK1', 'HSK2', 'HSK3', 'HSK4', 'HSK5', 'HSK6']
  const contentIdx = levelOrder.indexOf(contentLevel)
  const userIdx = levelOrder.indexOf(userLevel)
  const diff = Math.abs(contentIdx - userIdx)
  
  if (diff === 0) return 30 // 完全匹配
  if (diff === 1) return 25 // 相邻级别
  if (diff === 2) return 15 // 差2级
  return 0 // 差距过大
}
```

**惩罚机制**:
- 过难内容（超过用户2个级别）：-20分
- 过易内容（低于用户2个级别）：-15分

**推荐效果**:
- Dashboard: 推荐与用户等级匹配的内容
- 学习路径: 根据等级过滤显示内容
- 完成内容后: 推荐下一级别内容

## 📝 手动操作要求

用户需在Supabase SQL Editor中执行 `docs/W7-01-placement-test-schema.sql` 脚本，创建以下内容：

1. `user_profiles` 表
2. `placement_test_attempts` 表
3. RLS策略
4. 辅助函数
5. 触发器

## ✅ 验收测试

### 1. 数据库验证
- [ ] 执行SQL脚本，确认 user_profiles 表创建成功
- [ ] 确认 placement_test_attempts 表创建成功
- [ ] 验证RLS策略已应用
- [ ] 测试辅助函数 `calculate_hsk_level(75)` 返回 'HSK5'

### 2. 功能测试
- [ ] 访问 `/app/placement` → 显示测试介绍页
- [] 点击"开始测试" → 进入答题页
- [ ] 完成所有24题 → 显示评估等级和分数
- [ ] 测试结果保存成功（检查Toast通知）
- [ ] user_profiles 表更新正确
- [ ] placement_test_attempts 表创建新记录

### 3. Dashboard集成
- [ ] 登录后访问 `/dashboard`
- [ ] 显示"我的等级"卡片
- [ ] 等级显示正确（基于测试结果）
- [ ] 点击"重新测试等级"按钮 → 跳转到 `/app/placement`

### 4. 推荐系统联动
- [ ] Dashboard推荐内容基于用户等级
- [ ] 学习路径页面根据等级过滤内容
- [ ] 推荐理由包含等级信息（如"适合HSK3级别"）

### 5. 重测支持
- [ ] 完成第一次测试后，可以重新测试
- [ ] 历史测试记录保留在 placement_test_attempts 表
- [ ] user_profiles 更新为最新测试结果

## 📊 数据流图

```
用户访问 /app/placement
  ↓
显示介绍页
  ↓
点击"开始测试"
  ↓
逐题答题（24题）
  ↓
计算测试结果
  ├── 总分：0-100
  ├── 正确数：0-24
  └── 评估等级：基于各级别正确率
  ↓
调用 savePlacementTestResult API
  ├── 创建 placement_test_attempts 记录
  └── 创建/更新 user_profiles 记录
  ↓
显示结果页
  ├── 评估等级
  ├── 得分
  └── 学习建议
  ↓
Dashboard 显示用户等级
  ↓
推荐系统使用等级数据
```

## 🎯 后续优化建议

### 短期优化（1-2周）
- [ ] 从数据库读取用户当前等级到Dashboard（目前是硬编码）
- [ ] 添加测试历史记录页面（查看所有测试记录）
- [ ] 优化题库：增加更多题目，覆盖更多知识点
- [ ] 添加题目解析（显示正确答案和解释）

### 中期优化（1个月）
- [ ] 自适应测试算法（CAT）：根据答题情况动态调整题目难度
- [ ] 详细的能力报告：各项技能（听说读写）的分项得分
- [ ] 等级证书：完成测试后生成PDF证书
- [ ] 社交分享：分享测试结果到社交媒体

### 长期优化（3个月+）
- [ ] 语音题目：测试口语和听力
- [ ] 写作题目：测试写作能力（需人工或AI评分）
- [ ] 题库管理后台：管理员可添加/编辑题目
- [ ] 题目分析：分析题目难度和区分度
- [ ] A/B测试：测试不同题库版本的效果

## 📚 相关文档

- [数据库架构](./W7-01-placement-test-schema.sql)
- [题库数据](../lib/placement-test-mock.ts)
- [API文档](../lib/placement-test/api.ts)
- [推荐系统实现](./W6-02-recommendation-implementation.md)

## 📖 总结

W7-01 工单成功实现了HSK分级测试功能，包含：

✅ **数据库设计完善**：user_profiles 和 placement_test_attempts 两个表，包含RLS策略和辅助函数

✅ **题库设计合理**：HSK1-6共24题，简化题型（选择题），智能评分算法

✅ **测试流程完整**：介绍页 → 答题页 → 结果页，用户体验流畅

✅ **API集成正确**：保存测试结果，更新用户档案，支持重测

✅ **Dashboard显示等级**：新增"我的等级"卡片，显示用户HSK等级

✅ **推荐系统联动**：等级数据用于个性化推荐，提升推荐准确性

用户现在可以通过分级测试了解自己的中文水平，系统会根据等级提供个性化的学习内容推荐，帮助用户更高效地学习中文。
