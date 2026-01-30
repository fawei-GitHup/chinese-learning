# W6-01: 学习总览 Dashboard - 实施文档

## 📋 概述

实现了学习总览 Dashboard 页面，展示核心学习指标、最近活动、推荐内容等，与 SRS 系统完全联动。

## ✅ 已完成功能

### 1. 核心指标展示
- **今日待复习卡片数**: 从 `user_srs_cards` 表查询到期卡片
- **今日已完成复习数**: 统计当天的复习记录数
- **学习连续天数**: 基于 `user_srs_reviews` 计算连续复习天数
- **总卡片数**: 显示用户创建的所有 SRS 卡片数量及记忆保持率

### 2. 最近学习活动
- 从 `user_srs_reviews` 表获取最近10条复习记录
- 显示卡片内容、复习质量、时间戳
- 时间格式化为"x 分钟前/小时前/天前"
- 空状态提示引导用户开始学习

### 3. 推荐内容
- 基于用户 HSK 级别推荐 lessons/readings/grammar
- 显示内容标题、描述、级别、预计时长
- 分类标签和图标视觉区分
- 点击卡片跳转到对应内容页面

### 4. 快速访问入口
- **开始复习**: 跳转到 `/srs`，显示待复习卡片数
- **浏览课程**: 跳转到 `/lessons`
- **医学阅读**: 跳转到 `/medical-reader`
- **搜索内容**: 跳转到 `/search`

### 5. 学习时间统计
- **今日学习时间**: 基于 `user_srs_reviews.time_spent` 累计（分钟）
- **本周学习时间**: 最近7天的学习时间总和
- 环形进度条显示今日目标完成度（默认目标30分钟）
- 平均每日学习时间计算

### 6. 连续天数徽章
- 显示最长连续学习天数
- 鼓励信息提示用户保持或打破纪录
- 火焰图标视觉强化

## 🏗️ 技术架构

### 数据层 (`lib/dashboard/`)

#### `types.ts`
```typescript
// 核心类型定义
export interface DashboardData {
  reviewStats: ReviewStats      // SRS 统计
  streak: StreakData            // 连续天数
  recentActivities: Activity[]  // 最近活动
  recommendedContent: RecommendedItem[]  // 推荐内容
  studyTime: { today: number; thisWeek: number }  // 学习时间
}
```

#### `api.ts`
```typescript
// 主要 API 函数
export async function getDashboardData(): Promise<DashboardData>  // 聚合所有数据
export async function getUserStreak(): Promise<StreakData>        // 计算连续天数
export async function getRecentActivity(): Promise<Activity[]>    // 最近活动
export async function getRecommendedContent(): Promise<RecommendedItem[]>  // 推荐内容
export async function getStudyTimeStats(): Promise<{ today: number; thisWeek: number }>
```

### 组件层 (`components/dashboard/`)

#### `DashboardMetrics.tsx`
- 使用现有 `KpiCard` 组件显示4个核心指标
- 自动计算复习进度百分比
- 趋势指示器（up/neutral）

#### `ActivityTimeline.tsx`
- 卡片式列表展示最近活动
- 图标分类（SRS/Lesson/Reading/Grammar）
- 时间智能格式化
- 空状态友好提示

#### `RecommendedContent.tsx`
- 3列栅格布局（响应式）
- 卡片悬停效果
- 类型标签和元信息（时长/字数）
- 推荐理由显示

#### `QuickActions.tsx`
- 4个快速访问按钮
- 颜色编码区分不同功能
- 待复习数量动态显示

### 页面层 (`app/(app)/dashboard/page.tsx`)

#### 数据加载流程
1. 检查用户认证状态
2. 并行获取所有 Dashboard 数据
3. 处理加载/错误/成功状态

#### UI 状态管理
- **Loading**: Skeleton 加载占位符
- **Error**: 错误提示 + 重试按钮
- **Success**: 完整 Dashboard 展示

## 📊 数据来源

### Supabase 表
- `user_srs_cards`: 卡片列表、到期时间
- `user_srs_reviews`: 复习记录、时间统计
- 通过 RLS 自动过滤当前用户数据

### Mock 数据
- `lessons`: 课程推荐（lib/web-mock.ts）
- `readers`: 阅读推荐（lib/web-mock.ts）
- `grammarEntries`: 语法推荐（lib/web-mock.ts）

## 🔗 与 SRS 系统联动

### 实时数据同步
1. 用户在 `/srs` 页面完成复习
2. `recordReview()` 更新 `user_srs_reviews` 表
3. 返回 Dashboard 时，`getDashboardData()` 自动反映最新数据：
   - "今日已完成"数量增加
   - "待复习卡片"数量减少
   - "最近活动"显示新的复习记录
   - "学习时间"累计增加

### 连续天数计算算法
```typescript
// 基于 user_srs_reviews 表的 reviewed_at 字段
// 1. 提取所有唯一日期（YYYY-MM-DD）
// 2. 检查最近一次复习是今天或昨天
// 3. 从最近日期开始，向前逐日检查连续性
// 4. 计算当前连续天数和历史最长连续天数
```

## 🧪 验收测试

### 1. 终端验证
```bash
# 启动开发服务器
npm run dev

# 访问 Dashboard
# http://localhost:3000/dashboard
```

### 2. 功能测试
| 测试项 | 操作 | 预期结果 |
|--------|------|----------|
| **核心指标准确性** | 查看4个 KPI 卡片 | 显示正确的数值，无加载错误 |
| **SRS 联动** | 在 /srs 完成复习 → 返回 dashboard | "今日已完成"数量 +1 |
| **最近活动** | 查看最近活动列表 | 显示最近复习的卡片，时间格式正确 |
| **推荐内容** | 查看推荐卡片 | 显示适合用户级别的内容 |
| **快速访问** | 点击"开始复习"按钮 | 跳转到 /srs 页面 |
| **学习时间** | 查看今日/本周学习时间 | 数值与复习记录时长一致 |
| **连续天数** | 连续多天复习 | 连续天数自动增加 |
| **空状态** | 新用户或无数据 | 显示友好的空状态提示 |
| **加载状态** | 页面首次加载/刷新 | 显示 Skeleton 加载动画 |
| **错误处理** | 模拟网络错误 | 显示错误提示 + 重试按钮 |

### 3. 数据验证
```sql
-- 在 Supabase SQL Editor 中验证数据
-- 1. 查看用户卡片数
SELECT COUNT(*) FROM user_srs_cards WHERE user_id = 'your-user-id';

-- 2. 查看今日复习数
SELECT COUNT(*) FROM user_srs_reviews 
WHERE user_id = 'your-user-id' 
  AND DATE(reviewed_at) = CURRENT_DATE;

-- 3. 查看到期卡片数
SELECT COUNT(*) FROM user_srs_cards 
WHERE user_id = 'your-user-id' 
  AND next_review <= NOW();
```

## 🔄 未来优化方向

### 短期优化
- [ ] 添加日/周/月视图切换
- [ ] 学习热力图（类似 GitHub Contribution）
- [ ] 学习时间趋势图表（折线图）
- [ ] 不同时间段的对比统计

### 中期优化
- [ ] 个性化推荐算法（基于学习历史）
- [ ] 学习目标设置和跟踪
- [ ] 成就系统和徽章
- [ ] 学习报告导出（PDF/图片）

### 长期优化
- [ ] 多设备数据同步状态提示
- [ ] 社交功能（学习小组、排行榜）
- [ ] AI 学习建议和个性化路径
- [ ] 语音提醒和通知

## 📝 相关文件

### 新增文件
- `lib/dashboard/types.ts` - 类型定义
- `lib/dashboard/api.ts` - API 函数
- `components/dashboard/DashboardMetrics.tsx`
- `components/dashboard/ActivityTimeline.tsx`
- `components/dashboard/RecommendedContent.tsx`
- `components/dashboard/QuickActions.tsx`

### 修改文件
- `app/(app)/dashboard/page.tsx` - 更新为真实数据

### 依赖文件
- `lib/srs/api.ts` - getReviewStats(), getDueCards()
- `lib/srs/types.ts` - ReviewStats, SRSCard
- `lib/web-mock.ts` - lessons, readers, grammarEntries
- `components/web/KpiCard.tsx`
- `components/web/GlassCard.tsx`
- `components/web/ProgressRing.tsx`

## 🎯 建议 Commit Message
```
feat(W6-01): 实现学习总览 Dashboard

- 新增 dashboard API (getDashboardData, getUserStreak, getRecentActivity)
- 更新 dashboard 页面使用真实 SRS 数据
- 添加 dashboard 组件集 (Metrics, Timeline, Recommended, QuickActions)
- 实现与 SRS 系统的数据联动
- 显示核心学习指标、最近活动、推荐内容
- 添加快速访问入口和学习时间统计

验收标准：
✅ 显示今日 SRS 复习任务和完成数
✅ 学习连续天数统计
✅ 最近学习活动时间线
✅ 基于用户等级的内容推荐
✅ 快速访问链接正常工作
✅ 与 SRS 复习实时联动
```

## 📚 参考资料
- [Supabase RLS 文档](https://supabase.com/docs/guides/auth/row-level-security)
- [SM-2 算法](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/)
