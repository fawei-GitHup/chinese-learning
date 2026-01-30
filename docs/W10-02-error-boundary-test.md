# W10-02 错误边界测试文档

## 概述

本文档描述了应用程序错误边界测试的验收标准和测试场景。验证所有页面正确处理以下错误场景：
- 断网情况
- 空数据情况
- 内容被下架（status != 'published'）
- 加载状态

## 错误处理组件

### 1. ErrorDisplay 组件
**位置**: [`components/web/ErrorDisplay.tsx`](../components/web/ErrorDisplay.tsx:1)

**功能**: 
- 显示错误信息
- 提供重试按钮
- 适用于网络错误、服务器错误等场景

**使用示例**:
```tsx
<ErrorDisplay
  error={error}
  title="加载失败"
  onRetry={() => window.location.reload()}
/>
```

### 2. EmptyState 组件
**位置**: [`components/web/EmptyState.tsx`](../components/web/EmptyState.tsx:1)

**功能**:
- 显示空数据状态
- 提供可选的操作按钮
- 支持自定义图标和描述

**使用示例**:
```tsx
<EmptyState
  icon={BookOpen}
  title="暂无数据"
  description="内容将在发布后显示"
  action={{
    label: "刷新",
    onClick: () => reload()
  }}
/>
```

### 3. SkeletonCard 组件
**位置**: [`components/web/SkeletonCard.tsx`](../components/web/SkeletonCard.tsx:1)

**功能**:
- 显示加载状态
- 提供多种骨架屏变体（列表、卡片、详情）
- 改善用户体验

**使用示例**:
```tsx
{loading ? (
  <SkeletonList count={12} />
) : (
  <ContentList data={data} />
)}
```

## 测试场景

### 场景 1: 断网测试

**测试步骤**:
1. 打开浏览器开发者工具
2. 切换到 Network 标签
3. 启用 "Offline" 模式
4. 访问各个页面
5. 尝试重新加载内容

**预期结果**:
- 显示 [`ErrorDisplay`](../components/web/ErrorDisplay.tsx:14) 组件
- 显示友好的错误消息（如："网络连接失败"）
- 提供 "重试" 按钮
- 点击重试按钮后尝试重新加载

**适用页面**:
- ✅ 医疗词汇列表: [`/medical/vocabulary`](../app/(marketing)/medical/vocabulary/page.tsx:1)
- ✅ 场景列表: [`/medical/scenarios`](../app/(marketing)/medical/scenarios/page.tsx:1)
- ✅ Lessons 列表: [`/lessons`](../app/(app)/lessons/page.tsx:1)
- ⚠️ Reading 详情: [`/reader/[id]`](../app/(app)/reader/[id]/page.tsx:1)
- ⚠️ Grammar 列表: [`/grammar`](../app/(app)/grammar/page.tsx:1)
- ⚠️ Dashboard: [`/dashboard`](../app/(app)/dashboard/page.tsx:1)
- ⚠️ SRS: [`/srs`](../app/(app)/srs/page.tsx:1)
- ⚠️ Search: [`/search`](../app/(app)/search/page.tsx:1)

### 场景 2: 空数据测试

**测试步骤**:
1. 清空数据库或使用空数据的测试环境
2. 访问各个列表页面
3. 执行搜索或筛选操作，确保无结果

**预期结果**:
- 显示 [`EmptyState`](../components/web/EmptyState.tsx:20) 组件
- 显示清晰的空状态消息
- 提供相关的操作建议（如："清除搜索"、"查看全部"）

**适用页面**:
- ✅ 医疗词汇列表: 无数据时显示 "No medical terms found"
- ✅ 场景列表: 无数据时显示 "No scenarios found"
- ✅ Lessons 列表: 无数据时显示 "No lessons found"
- ⚠️ Grammar 列表: 需要验证
- ⚠️ Search 结果: 需要验证

### 场景 3: 内容被下架测试

**测试步骤**:
1. 修改数据库中某个内容的 status 字段为 'draft' 或 'archived'
2. 尝试通过直接 URL 访问该内容
3. 尝试在列表中查看该内容

**预期结果**:
- 详情页显示 404 或友好提示 "内容不可用"
- 列表页自动过滤未发布的内容
- 不显示未发布内容的链接

**适用页面**:
- ⚠️ 医疗词汇详情: [`/medical/dictionary/[word]`](../app/(marketing)/medical/dictionary/[word]/page.tsx:1)
- ⚠️ 场景详情: [`/medical/scenarios/[id]`](../app/(marketing)/medical/scenarios/[id]/page.tsx:1)
- ⚠️ Lesson 详情: [`/lesson/[id]`](../app/(app)/lesson/[id]/page.tsx:1)
- ⚠️ Reading 详情: [`/reader/[id]`](../app/(app)/reader/[id]/page.tsx:1)
- ⚠️ Grammar 详情: [`/grammar/[pattern]`](../app/(app)/grammar/[pattern]/page.tsx:1)

**注意**: 需要在 [`lib/content.ts`](../lib/content.ts:1) 或数据库查询中添加 status 过滤逻辑

### 场景 4: 加载状态测试

**测试步骤**:
1. 打开浏览器开发者工具
2. 切换到 Network 标签
3. 启用 "Slow 3G" 或 "Fast 3G" 网络限速
4. 访问各个页面

**预期结果**:
- 在数据加载期间显示 [`SkeletonCard`](../components/web/SkeletonCard.tsx:11) 或 [`SkeletonList`](../components/web/SkeletonCard.tsx:96) 组件
- 骨架屏布局与实际内容布局一致
- 加载完成后平滑过渡到实际内容

**适用页面**:
- ✅ 医疗词汇列表: 使用 [`SkeletonList`](../components/web/SkeletonCard.tsx:96)
- ⚠️ 场景列表: 使用简单的 animate-pulse
- ⚠️ Lessons 列表: 使用简单的 animate-pulse
- ⚠️ 其他页面: 需要验证

**建议改进**: 
- 场景列表和 Lessons 列表应使用 [`SkeletonCard`](../components/web/SkeletonCard.tsx:11) 组件替代简单的 animate-pulse
- 详情页面应使用 [`SkeletonDetail`](../components/web/SkeletonCard.tsx:43) 组件

## 页面覆盖清单

| 页面 | 路径 | 断网错误 | 空数据 | 内容下架 | 加载状态 | 状态 |
|------|------|---------|--------|---------|---------|------|
| 医疗词汇列表 | `/medical/vocabulary` | ✅ | ✅ | N/A | ✅ | 完成 |
| 医疗词汇详情 | `/medical/dictionary/[word]` | ⚠️ | N/A | ⚠️ | ⚠️ | 需验证 |
| 场景列表 | `/medical/scenarios` | ✅ | ✅ | N/A | ⚠️ | 部分完成 |
| 场景详情 | `/medical/scenarios/[id]` | ⚠️ | N/A | ⚠️ | ⚠️ | 需验证 |
| Lessons 列表 | `/lessons` | ✅ | ✅ | N/A | ⚠️ | 部分完成 |
| Lesson 详情 | `/lesson/[id]` | ⚠️ | N/A | ⚠️ | ⚠️ | 需验证 |
| Reading 详情 | `/reader/[id]` | ⚠️ | ⚠️ | ⚠️ | ⚠️ | 需验证 |
| Grammar 列表 | `/grammar` | ⚠️ | ⚠️ | N/A | ⚠️ | 需验证 |
| Grammar 详情 | `/grammar/[pattern]` | ⚠️ | N/A | ⚠️ | ⚠️ | 需验证 |
| Dashboard | `/dashboard` | ⚠️ | ⚠️ | N/A | ⚠️ | 需验证 |
| SRS | `/srs` | ⚠️ | ⚠️ | N/A | ⚠️ | 需验证 |
| Search | `/search` | ⚠️ | ⚠️ | N/A | ⚠️ | 需验证 |

## 验收标准

### 必须满足的条件 (P0)

1. **断网处理**:
   - [ ] 所有列表页面在断网时显示 ErrorDisplay
   - [ ] 所有详情页面在断网时显示 ErrorDisplay
   - [ ] 所有 ErrorDisplay 组件提供重试功能

2. **空数据处理**:
   - [ ] 所有列表页面在无数据时显示 EmptyState
   - [ ] EmptyState 提供清晰的说明和操作建议
   - [ ] 搜索无结果时显示适当的 EmptyState

3. **内容下架处理**:
   - [ ] 列表 API 自动过滤 status != 'published' 的内容
   - [ ] 详情页访问未发布内容时显示 404 或友好提示
   - [ ] 不暴露未发布内容的任何信息

4. **加载状态**:
   - [ ] 所有列表页面在加载时显示 SkeletonList
   - [ ] 所有详情页面在加载时显示 SkeletonDetail
   - [ ] 骨架屏与实际内容布局一致

### 建议改进 (P1)

1. **错误消息优化**:
   - 根据错误类型显示不同的消息（网络错误、服务器错误、权限错误等）
   - 提供更具体的解决建议

2. **离线体验**:
   - 考虑使用 Service Worker 缓存关键内容
   - 提供离线可用的功能提示

3. **性能优化**:
   - 使用 React.Suspense 和 Error Boundary 统一处理
   - 实现乐观更新减少加载状态

## 自动化测试

详见:
- [`tests/e2e/error-handling.spec.ts`](../tests/e2e/error-handling.spec.ts) - Playwright 测试脚本
- [`docs/W10-02-test-checklist.md`](./W10-02-test-checklist.md) - 测试清单

## 相关工单

- **前序工单**: W1-02 - 基础组件开发（已完成）
- **后续工单**: W10-03 - 性能监控整合
- **相关工单**: W10-01 - 安全与权限验收

## 参考资料

- [Next.js Error Handling](https://nextjs.org/docs/app/building-your-application/routing/error-handling)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Web.dev: User-centric Performance Metrics](https://web.dev/user-centric-performance-metrics/)
