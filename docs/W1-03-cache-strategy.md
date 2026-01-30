# W1-03: 缓存策略实现文档

## 概述

本文档描述了项目中实现的缓存策略，包括服务端缓存（Next.js）和客户端缓存（SWR）。

## 缓存架构

### 1. 缓存层次

```
┌─────────────────────────────────────────────┐
│          Browser (客户端)                    │
├─────────────────────────────────────────────┤
│  SWR Cache (客户端组件)                      │
│  - 内存缓存                                   │
│  - 自动重新验证                               │
│  - 乐观更新支持                               │
├─────────────────────────────────────────────┤
│  Next.js Fetch Cache (服务端组件)            │
│  - unstable_cache API                       │
│  - 基于时间的重新验证                         │
│  - 标签刷新支持                               │
├─────────────────────────────────────────────┤
│  Supabase Database                          │
└─────────────────────────────────────────────┘
```

### 2. 缓存时间配置

| 内容类型 | 缓存时间 | 说明 |
|---------|---------|------|
| Published 内容 | 1 小时 | 医疗词汇、场景、课程、语法等已发布内容 |
| 列表页 | 30 分钟 | 内容列表页面 |
| 详情页 | 1 小时 | 内容详情页面 |
| 用户数据 | 1 分钟 | SRS 复习记录、学习进度等用户相关数据 |
| Dashboard 数据 | 5 分钟 | 聚合的 Dashboard 统计数据 |
| 静态内容 | 24 小时 | 很少改变的静态数据 |

## 实现详情

### 1. 配置文件

**位置**: `lib/cache/config.ts`

包含：
- `CACHE_TIMES`: 各类内容的缓存时间（秒）
- `NEXT_CACHE_OPTIONS`: Next.js fetch 缓存选项
- `SWR_CONFIG`: SWR 配置选项
- `cacheKeys`: 缓存键生成器

### 2. 服务端缓存

**位置**: `lib/cache/server-fetcher.ts`

用于 Server Components，使用 Next.js `unstable_cache` API：

```typescript
// 使用示例
import { getCachedContentList } from '@/lib/cache/server-fetcher'

export default async function MyServerComponent() {
  const result = await getCachedContentList('medical_term', {
    page: 1,
    limit: 12
  })
  
  return <div>{/* render */}</div>
}
```

**提供的函数**:
- `getCachedContentList()`: 带缓存的内容列表获取
- `getCachedContentDetail()`: 带缓存的内容详情获取
- `getCachedDashboardData()`: 带缓存的 Dashboard 数据获取
- `getCachedReviewStats()`: 带缓存的 SRS 统计获取
- `getCachedUserProgress()`: 带缓存的用户进度获取

### 3. 客户端缓存

**位置**: `lib/cache/client-hooks.ts`

用于 Client Components，使用 SWR hooks：

```typescript
// 使用示例
'use client'
import { useContentList } from '@/lib/cache/client-hooks'

export function MyClientComponent() {
  const { data, error, isLoading, mutate } = useContentList('medical_term', {
    page: 1,
    limit: 12
  })
  
  // 手动刷新
  const handleRefresh = () => mutate()
  
  if (isLoading) return <Loading />
  if (error) return <Error error={error} onRetry={mutate} />
  
  return <div>{/* render */}</div>
}
```

**提供的 Hooks**:
- `useContentList()`: 内容列表
- `useContentDetail()`: 内容详情
- `useDashboard()`: Dashboard 数据
- `useSRSStats()`: SRS 统计
- `useUserProgress()`: 用户进度

**预加载函数**:
- `preloadContentList()`: 预加载列表
- `preloadContentDetail()`: 预加载详情

## 已应用缓存的页面

### 1. 医疗词汇页 (`app/(marketing)/medical/vocabulary/VocabularyPageClient.tsx`)

- ✅ 使用 `useContentList` 获取数据
- ✅ 添加手动刷新按钮
- ✅ 缓存时间：30 分钟

### 2. 医疗场景页 (`app/(marketing)/medical/scenarios/ScenariosPageClient.tsx`)

- ✅ 使用 `useContentList` 获取数据
- ✅ 添加手动刷新按钮
- ✅ 缓存时间：30 分钟

### 3. Dashboard 页 (`app/(app)/dashboard/page.tsx`)

- ✅ 使用 `useDashboard` 获取 Dashboard 数据
- ✅ 使用 SWR 获取完成统计
- ✅ 添加手动刷新按钮
- ✅ 缓存时间：5 分钟（Dashboard）/ 1 分钟（用户数据）

## 缓存刷新机制

### 1. 自动刷新

SWR 配置支持以下自动刷新场景：

```typescript
{
  revalidateOnFocus: false,      // 窗口聚焦时不自动刷新（列表/详情）
  revalidateOnFocus: true,       // 窗口聚焦时自动刷新（用户数据/Dashboard）
  revalidateOnReconnect: true,   // 网络重连时自动刷新
  refreshInterval: 0,            // 列表/详情：不定时刷新
  refreshInterval: 60000,        // 用户数据：每分钟刷新
  refreshInterval: 300000,       // Dashboard：每 5 分钟刷新
}
```

### 2. 手动刷新

所有使用缓存的页面都提供了手动刷新按钮：

```typescript
const { mutate } = useContentList(...)

<Button onClick={() => mutate()}>
  <RefreshCw className={isLoading ? 'animate-spin' : ''} />
  刷新
</Button>
```

### 3. 乐观更新

用户操作后可以立即更新缓存，无需等待服务器响应：

```typescript
const { mutate } = useDashboard()

// 完成课程后刷新 Dashboard
const handleCompleteLesson = async () => {
  await completeLesson(lessonId)
  mutate() // 刷新缓存
}
```

### 4. 服务端缓存刷新

使用 Next.js 的缓存标签系统：

```typescript
import { revalidateTag } from 'next/cache'

// 在 Server Action 中
export async function updateContent() {
  // 更新内容...
  
  // 刷新相关缓存
  revalidateTag('content-list')
  revalidateTag('content-detail')
}
```

## 验收标准

### ✅ 已完成

1. **重复访问不频繁请求**
   - SWR 在缓存有效期内直接返回缓存数据
   - Server Components 使用 unstable_cache 缓存数据
   - 相同查询的去重（dedupingInterval）

2. **更新后能刷新**
   - 所有页面都有手动刷新按钮
   - SWR 支持 mutate() 手动刷新
   - 服务端支持 revalidateTag 刷新

3. **合理的缓存时间**
   - Published 内容：1 小时
   - 用户数据：1 分钟
   - Dashboard：5 分钟
   - 根据数据特征配置不同的缓存时间

## 性能提升

### 预期效果

1. **减少网络请求**
   - 列表页重复访问：减少 ~90% 请求（30 分钟内）
   - 详情页重复访问：减少 ~90% 请求（1 小时内）
   - Dashboard：减少 ~80% 请求（5 分钟内）

2. **提升响应速度**
   - 缓存命中时：<10ms（内存读取）
   - 无缓存时：100-500ms（网络请求）
   - 提升比例：10-50x

3. **改善用户体验**
   - 即时显示缓存数据
   - 后台静默更新
   - 加载状态更流畅

## 最佳实践

### 1. 选择合适的缓存策略

- **Server Components**：使用 `getCachedXxx` 函数
  - 适用于：SEO 需求、初始渲染性能
  - 优点：服务端渲染、更快的首屏

- **Client Components**：使用 `useXxx` hooks
  - 适用于：交互性强、需要实时更新
  - 优点：自动重新验证、乐观更新

### 2. 缓存时间设置原则

- 静态内容（很少变化）：长缓存（数小时到数天）
- 动态内容（经常变化）：中缓存（几分钟到一小时）
- 实时数据（用户操作）：短缓存（秒到分钟）

### 3. 刷新时机

- 用户主动操作后：立即刷新相关缓存
- 窗口聚焦：选择性刷新（用户数据）
- 网络重连：自动刷新
- 定时刷新：仅用于关键数据

## 注意事项

1. **不要缓存敏感数据**
   - 用户密码、令牌等不应缓存
   - 支付信息等关键数据使用短缓存或不缓存

2. **注意缓存一致性**
   - 更新数据后及时刷新相关缓存
   - 使用缓存标签管理相关缓存

3. **避免过度缓存**
   - 根据实际需求设置缓存时间
   - 监控缓存命中率和数据新鲜度

4. **Supabase 表结构**
   - 不要随意更改 Supabase 表结构
   - 如需更改，需同步更新管理后台

## 后续优化

### 短期（已完成）
- [x] 安装并配置 SWR
- [x] 创建缓存配置和工具函数
- [x] 应用到关键页面（词汇、场景、Dashboard）
- [x] 实现手动刷新功能

### 中期（待完成）
- [ ] 应用到更多页面（课程、语法、阅读等）
- [ ] 添加缓存性能监控
- [ ] 实现预加载策略（hover 预加载）
- [ ] 优化缓存键生成策略

### 长期（计划）
- [ ] 实现离线缓存（Service Worker）
- [ ] 添加缓存大小限制
- [ ] 实现智能缓存过期策略
- [ ] 缓存数据压缩

## 相关文件

### 核心文件
- `lib/cache/config.ts` - 缓存配置
- `lib/cache/server-fetcher.ts` - 服务端缓存工具
- `lib/cache/client-hooks.ts` - 客户端缓存 hooks
- `lib/cache/index.ts` - 模块入口

### 已更新页面
- `app/(marketing)/medical/vocabulary/VocabularyPageClient.tsx`
- `app/(marketing)/medical/scenarios/ScenariosPageClient.tsx`
- `app/(app)/dashboard/page.tsx`

### 文档
- `docs/W1-03-cache-strategy.md` - 缓存策略文档（本文档）
- `docs/project-status.md` - 项目状态文档

## 总结

本次缓存策略实现完整覆盖了服务端和客户端的缓存需求，通过合理的缓存时间配置和刷新机制，在保证数据新鲜度的同时显著提升了应用性能和用户体验。所有关键页面都已应用缓存，并提供了手动刷新功能，满足了工单 W1-03 的所有验收标准。
