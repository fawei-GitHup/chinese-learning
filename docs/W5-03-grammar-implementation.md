# W5-03: Grammar 列表 + 详情 实施文档

## 工单目标
接入语法点（Grammar）功能，包括列表页面和详情页面，例句可加入 SRS（句子卡），语法详情页可被搜索引擎收录。

## 实施内容

### 1. 新增文件

#### 1.1 Grammar 列表页面
- **文件**: `app/(app)/grammar/page.tsx`
- **功能**: 服务器组件，导出静态 metadata，渲染 GrammarPageClient
- **SEO**: 静态 metadata 用于列表页面

#### 1.2 Grammar 列表客户端组件
- **文件**: `app/(app)/grammar/GrammarPageClient.tsx`
- **功能**:
  - 使用 `getContentList('grammar')` API 获取语法点列表
  - 支持级别筛选（All Levels, HSK1-6, Medical）
  - 支持搜索功能（搜索 pattern）
  - 分页支持（page: 1, limit: 20）
  - 显示语法卡片（pattern、level、explanation）
  - 错误处理和空状态
  - 骨架屏加载状态

### 2. 修改文件

#### 2.1 Grammar 详情页面
- **文件**: `app/(app)/grammar/[pattern]/page.tsx`
- **改动**:
  - 从 mock 数据（`grammarEntries`, `medicalGrammar`）改为使用 `getContentBySlug('grammar', pattern)` API
  - 添加状态管理：
    - `bookmarked`: 收藏状态（BookmarkPlus 图标）
    - `addedToSRS`: Set<number> 跟踪已加入 SRS 的例句索引
  - **例句 SRS 功能**:
    - 每个例句下方显示 SRS 按钮
    - 未添加状态：Plus 图标 + "Add to SRS"
    - 已添加状态：Star 图标（filled）+ "Added to SRS"
    - 绿色高亮显示已添加的例句
  - **收藏功能**:
    - 页面右上角显示 BookmarkPlus 按钮
    - 点击切换收藏状态（黄色高亮 + fill 图标）
  - 移除 mock 数据依赖和相关逻辑
  - 保留 SEO 结构化数据（JSON-LD）
  - 添加学习进度卡片（显示已加入 SRS 的句子数量）

#### 2.2 Grammar Layout（动态 SEO）
- **文件**: `app/(app)/grammar/[pattern]/layout.tsx`
- **改动**:
  - 添加 `generateMetadata` 函数
  - 使用 `getContentBySlug('grammar', pattern)` 获取内容
  - 动态生成页面标题：`{pattern} - {level} | Learn Chinese`
  - 动态生成描述：优先使用 `geo_snippet`，fallback 到 `description` 或 `explanation`
  - 添加 OpenGraph metadata
  - 添加 canonical URL

### 3. 数据结构

#### Grammar 数据结构
```typescript
interface GrammarData {
  id: string
  slug: string
  title: string
  description?: string
  type: 'grammar'
  level: string           // HSK1-6 或 Medical
  pattern?: string        // 语法点模式（如 "把字句"）
  explanation?: string    // 详细解释
  examples?: Array<{      // 例句数组
    cn: string           // 中文
    en: string           // 英文
  }>
  common_mistakes?: string[]    // 常见错误
  key_points?: string[]         // 关键点
  faq?: string[]                // FAQ（偶数索引为问题，奇数索引为答案）
  geo_snippet?: string          // SEO 摘要
  relatedPatterns?: string[]    // 相关语法点
}
```

### 4. UI/UX 特性

#### 列表页面
- 卡片式布局（grid，4列）
- 每个卡片显示：
  - 级别 badge（cyan 主题）
  - Pattern 标题
  - 解释摘要（最多3行）
  - 收藏按钮（占位，点击暂无功能）
- 筛选栏：级别下拉 + 搜索框
- 悬停效果：border 高亮

#### 详情页面
- 两栏布局（主内容 2/3 + 侧边栏 1/3）
- 主内容区：
  - 例句区域（每个例句配 SRS 按钮）
  - 常见错误（可选）
  - 关键点和 FAQ（可选）
- 侧边栏：
  - SEO 预览卡片
  - 学习进度卡片（显示已加 SRS 的句子数）
- 顶部：返回按钮 + 收藏按钮

#### SRS 按钮交互
- 样式参考词汇 SRS 交互模式
- 未添加：灰色背景 + Plus 图标
- 已添加：绿色背景 + Star filled 图标
- 状态本地管理（未持久化）

### 5. API 使用

#### 列表获取
```typescript
const response = await getContentList('grammar', {
  level: selectedLevel !== "all" ? selectedLevel : undefined,
  search: searchQuery || undefined,
  page: 1,
  limit: 20,
})
```

#### 详情获取
```typescript
const response = await getContentBySlug('grammar', pattern)
```

### 6. 路由
- 列表页面: `/grammar`
- 详情页面: `/grammar/[pattern]`（pattern 可以是 slug 或 id）

## 验收步骤

### 前置条件
确保开发服务器已启动：
```bash
npm run dev
```

### 1. 验证列表页面
1. 在浏览器访问 `http://localhost:3000/grammar`
2. **预期结果**:
   - 页面标题显示 "Grammar Guide"
   - 显示级别筛选器（All Levels, HSK1-6, Medical）
   - 显示搜索框（placeholder: "Search grammar patterns..."）
   - 显示语法卡片网格（如果数据库有数据）或空状态提示
   - 卡片显示：pattern、level badge、explanation 摘要
   - 悬停卡片时 border 高亮为 cyan

### 2. 验证搜索和筛选
1. 在搜索框输入关键词（如"把"）
2. **预期结果**: 列表只显示包含关键词的语法点
3. 选择级别筛选（如 HSK3）
4. **预期结果**: 列表只显示该级别的语法点
5. 清空筛选，验证显示全部语法点

### 3. 验证详情页面
1. 点击任一语法卡片进入详情页
2. **预期结果**:
   - 显示语法 pattern 和级别
   - 显示详细解释
   - 显示例句列表（如果有）
   - 每个例句下方有 "Add to SRS" 按钮
   - 右上角有收藏按钮（BookmarkPlus 图标）
   - 侧边栏显示 SEO 预览

### 4. 验证 SRS 功能
1. 在详情页面点击任一例句的 "Add to SRS" 按钮
2. **预期结果**:
   - 按钮文字变为 "Added to SRS"
   - 图标从 Plus 变为 Star（filled）
   - 按钮背景变为绿色
   - 侧边栏出现"Learning Progress"卡片，显示"Sentences in SRS: 1"
3. 再次点击该按钮
4. **预期结果**: 状态恢复为未添加，进度卡片数字减1

### 5. 验证收藏功能
1. 点击页面右上角的收藏按钮
2. **预期结果**:
   - 图标填充（fill-current）
   - 按钮背景变为黄色
3. 再次点击
4. **预期结果**: 状态恢复为未收藏

### 6. 验证 SEO
1. 在详情页面查看页面源代码（右键 -> 查看页面源代码）
2. **预期结果**:
   - `<title>` 标签包含语法 pattern 和级别
   - `<meta name="description">` 包含语法描述
   - 如果有 FAQ，包含 JSON-LD 结构化数据（`<script type="application/ld+json">`）

### 7. 验证错误处理
1. 访问不存在的语法点: `http://localhost:3000/grammar/nonexistent-pattern`
2. **预期结果**:
   - 显示 "Grammar pattern not found" 提示
   - 显示 "Browse Grammar Guide" 按钮
   - 点击按钮返回列表页

### 8. 数据库集成测试
**注意**: 如果 Supabase 未配置或数据库无数据：
- 列表页和详情页会自动回退到 mock 数据
- 控制台会显示警告信息

**如需测试数据库集成**:
1. 确保 `.env.local` 配置了 Supabase 凭证
2. 在 Supabase 后台创建 `grammar_points` 表并发布数据（status = 'published'）
3. 刷新页面验证从数据库加载数据

## 关键代码片段

### 例句 SRS 按钮
```tsx
<button
  onClick={() => handleToggleSRS(i)}
  className={cn(
    "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors",
    addedToSRS.has(i)
      ? "bg-green-500/20 text-green-400 border border-green-500/30"
      : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-cyan-400"
  )}
>
  {addedToSRS.has(i) ? (
    <>
      <Star className="h-3.5 w-3.5 fill-current" />
      Added to SRS
    </>
  ) : (
    <>
      <Plus className="h-3.5 w-3.5" />
      Add to SRS
    </>
  )}
</button>
```

### 收藏按钮
```tsx
<button
  onClick={() => setBookmarked(!bookmarked)}
  className={cn(
    "p-2 rounded-lg transition-colors",
    bookmarked
      ? "bg-yellow-500/20 text-yellow-400"
      : "text-zinc-500 hover:text-yellow-400"
  )}
  title={bookmarked ? "Remove bookmark" : "Bookmark this pattern"}
>
  <BookmarkPlus className={cn("h-5 w-5", bookmarked && "fill-current")} />
</button>
```

## 建议 Commit Message

```
feat(grammar): implement grammar list and detail pages (W5-03)

- Add grammar list page with filtering and search
- Update grammar detail page to use database API
- Add sentence SRS feature for example sentences
- Add bookmark functionality to detail page
- Implement dynamic SEO metadata generation
- Support both database and mock data fallback

Closes W5-03
```

## 备注
1. **SRS 状态**: 当前仅在客户端内存中管理，刷新页面后会重置。后续可集成真实的 SRS 系统持久化状态。
2. **收藏功能**: 当前仅为 UI 状态切换，未连接后端 API。需要在后续工单中集成统一的收藏系统。
3. **数据库回退**: 使用 `getContentList` 和 `getContentBySlug` API，会自动在数据库不可用时回退到 mock 数据。
4. **相关词汇**: 详情页面中原有的"Related Vocabulary"和"Related Patterns"部分依赖 mock 数据，需要在数据库中建立关联关系后才能正常工作。