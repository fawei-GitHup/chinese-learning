# W3-01：全站搜索 - 实现文档

**工单编号**: W3-01  
**优先级**: P0  
**状态**: ✅ 已完成  
**实施日期**: 2026-01-29

---

## 📋 功能概述

全站搜索功能支持跨多种内容类型的统一搜索，包括：
- 医疗词汇 (medical_term)
- 课程 (lesson)
- 阅读 (reading)
- 语法 (grammar)
- 场景 (scenario)

支持三种搜索方式：
- **中文搜索**: 匹配词汇、标题、描述
- **拼音搜索**: 匹配拼音字段
- **英文搜索**: 匹配英文释义、翻译

---

## 🏗️ 技术架构

### 核心文件

1. **`lib/search/unified-search.ts`**
   - 统一搜索接口 `unifiedSearch()`
   - 搜索匹配逻辑和评分算法
   - 搜索历史管理 (localStorage)
   - 文本高亮辅助函数

2. **`components/search/SearchResultCard.tsx`**
   - 根据内容类型渲染不同的结果卡片
   - 支持关键词高亮显示
   - 点击跳转到详情页

3. **`components/search/SearchFilters.tsx`**
   - 内容类型多选过滤器
   - 难度级别过滤器
   - 分类过滤器（根据内容类型动态显示）

4. **`app/(app)/search/page.tsx`**
   - 搜索主页面
   - 实时搜索（300ms 防抖）
   - 搜索历史显示
   - 结果分组展示

---

## 🔍 搜索策略

### 匹配字段与权重

搜索时会根据不同字段计算匹配得分：

| 字段 | 权重 | 适用类型 |
|------|------|----------|
| title | 50 | 所有类型 |
| word | 50 | medical_term |
| pattern | 50 | grammar |
| pinyin | 40 | medical_term |
| chief_complaint_zh | 40 | scenario |
| chief_complaint_en | 35 | scenario |
| meanings | 35 | medical_term |
| description | 30 | 所有类型 |
| explanation | 30 | grammar |
| tags | 20 | lesson, reading |

### 搜索流程

1. 用户输入关键词（自动转小写）
2. 300ms 防抖后触发搜索
3. 并行搜索所有选中的内容类型
4. 对每个结果计算匹配得分
5. 按得分排序，每种类型取前 10 条
6. 按类型分组展示结果
7. 保存到搜索历史（最多 10 条）

---

## 📊 API 文档

### `unifiedSearch(options)`

统一搜索接口。

**参数**: `SearchOptions`
```typescript
interface SearchOptions {
  query: string                // 搜索关键词（必填）
  types?: ContentType[]        // 内容类型过滤（可选）
  level?: string               // 难度级别过滤（可选）
  category?: string            // 分类过滤（可选）
  limitPerType?: number        // 每种类型最大结果数（默认 10）
  saveToHistory?: boolean      // 是否保存到历史（默认 true）
}
```

**返回**: `Promise<GroupedSearchResults>`
```typescript
interface GroupedSearchResults {
  query: string
  totalCount: number
  groups: {
    type: ContentType
    label: string
    count: number
    results: SearchResult[]
  }[]
}
```

**示例**:
```typescript
const results = await unifiedSearch({
  query: '头痛',
  types: ['medical_term', 'scenario'],
  level: 'HSK3',
  limitPerType: 5,
})
```

### 搜索历史 API

```typescript
// 获取搜索历史
getSearchHistory(): string[]

// 保存搜索关键词
saveSearchHistory(query: string): void

// 清除所有历史
clearSearchHistory(): void
```

### 文本高亮 API

```typescript
// 高亮文本中的匹配部分
highlightText(text: string, query: string): {
  text: string
  isHighlight: boolean
}[]
```

---

## 🎨 UI 组件

### 页面布局

```
┌─────────────────────────────────────────────┐
│ [← 返回首页] 全站搜索                         │
│ [🔍 搜索框]                                  │
├──────────────┬──────────────────────────────┤
│ 过滤器       │ 搜索结果                       │
│ - 内容类型   │ ┌──────────────────────────┐ │
│ - 难度级别   │ │ 医疗词汇 (3 条)           │ │
│ - 分类       │ │ ├─ 卡片1                 │ │
│              │ │ ├─ 卡片2                 │ │
│              │ │ └─ 卡片3                 │ │
│              │ ├──────────────────────────┤ │
│              │ │ 课程 (2 条)               │ │
│              │ │ ├─ 卡片1                 │ │
│              │ │ └─ 卡片2                 │ │
│              │ └──────────────────────────┘ │
└──────────────┴──────────────────────────────┘
```

### 结果卡片样式

每种内容类型有不同的配色和图标：

- 🏥 **医疗词汇**: 蓝色 (blue-500)
- 📚 **课程**: 绿色 (green-500)
- 📖 **阅读**: 紫色 (purple-500)
- 📝 **语法**: 橙色 (orange-500)
- 💬 **场景**: 青色 (cyan-500)

---

## ✅ 验收步骤

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 访问搜索页面

在浏览器中打开：
```
http://localhost:3000/search
```

### 3. 测试中文搜索

**测试用例 1**: 搜索 "头痛"
- 应返回医疗词汇 "头痛" (mw8)
- 应返回场景 "头痛问诊" (ms3)
- 结果应分组显示
- 关键词应高亮显示

**测试用例 2**: 搜索 "挂号"
- 应返回医疗词汇 "挂号" (mw1)
- 应返回场景 "医院挂号" (ms1)
- 应返回相关医疗词汇 "挂号费" (mw23)

### 4. 测试拼音搜索

**测试用例 3**: 搜索 "toutong" 或 "tóu tòng"
- 应匹配 "头痛" 的拼音字段
- 关键词应在拼音部分高亮

**测试用例 4**: 搜索 "guahao"
- 应匹配 "挂号" 及相关词汇

### 5. 测试英文搜索

**测试用例 5**: 搜索 "headache"
- 应返回医疗词汇 "头痛" (meanings: ["headache"])
- 英文释义应高亮显示

**测试用例 6**: 搜索 "register"
- 应返回 "挂号" (meanings: ["to register", "registration"])

### 6. 测试过滤器

**测试用例 7**: 筛选内容类型
- 取消勾选所有类型，只保留 "医疗词汇"
- 搜索 "痛" - 应只显示医疗词汇结果

**测试用例 8**: 筛选难度级别
- 选择 "HSK3"
- 搜索 "发烧" - 应只显示 HSK3 级别的内容

**测试用例 9**: 筛选分类
- 选择内容类型 "医疗词汇"
- 选择分类 "symptom"
- 应只显示症状类医疗词汇

### 7. 测试搜索历史

**测试用例 10**: 搜索历史
- 搜索几个不同的关键词："头痛", "挂号", "发烧"
- 点击搜索框，应显示历史记录下拉框
- 点击历史记录，应重新搜索该关键词
- 刷新页面，历史记录应保留

**测试用例 11**: 清除历史
- 点击"清除"按钮
- 历史记录应全部清空

### 8. 测试空状态

**测试用例 12**: 无结果
- 搜索 "asdfasdf"（不存在的内容）
- 应显示"没有找到相关结果"提示
- 应提供"清除过滤条件"按钮

**测试用例 13**: 初始状态
- 访问 `/search` （无查询参数）
- 应显示欢迎界面
- 应显示常见搜索建议
- 应显示支持的内容类型

### 9. 测试结果跳转

**测试用例 14**: 点击结果
- 点击医疗词汇 → 应跳转到 `/medical/dictionary/[slug]`
- 点击课程 → 应跳转到 `/lesson/[slug]`
- 点击阅读 → 应跳转到 `/reader/[slug]`
- 点击语法 → 应跳转到 `/grammar/[slug]`
- 点击场景 → 应跳转到 `/medical/scenarios/[slug]`

### 10. 测试响应式设计

- 在桌面端（1920x1080）：侧边栏+主内容两列布局
- 在移动端（375x667）：过滤器和结果堆叠显示

---

## 🔗 依赖关系

### 前序工单
- ✅ W1-01: Web 内容查询层 - 提供 `getContentList()` API
- ✅ W2: 医疗内容 - 提供医疗词汇和场景数据

### 数据源
- `lib/medical-mock.ts` - 医疗数据
- `lib/web-mock.ts` - 通用学习内容数据
- `lib/content/index.ts` - 统一内容查询接口

---

## 🎯 实现的功能清单

- [x] 统一搜索接口支持 5 种内容类型
- [x] 中文、拼音、英文三种搜索方式
- [x] 搜索结果按类型分组显示
- [x] 内容类型过滤器
- [x] 难度级别过滤器
- [x] 分类过滤器（根据内容类型动态显示）
- [x] 搜索历史（localStorage，最多 10 条）
- [x] 关键词高亮显示
- [x] 空状态友好提示和搜索建议
- [x] 实时搜索（300ms 防抖）
- [x] 响应式设计
- [x] 点击结果跳转到详情页

---

## 🚧 已知限制

1. **搜索范围**
   - 目前只搜索 mock 数据（数据库未配置时）
   - 数据库配置后会自动切换到数据库搜索

2. **拼音搜索**
   - 简单的字符串匹配
   - 未实现声调容错（tou1 tong4 vs toutong）
   - 未实现拼音分词（toutong vs tou tong）

3. **搜索历史**
   - 仅存储在浏览器 localStorage
   - 换设备不同步
   - 清除浏览器数据会丢失

4. **性能**
   - 在客户端进行搜索和过滤
   - 数据量大时可能较慢
   - 建议后续迁移到服务端搜索

---

## 🔮 后续优化建议

### 短期优化（P1）
- [ ] 添加搜索加载骨架屏动画
- [ ] 优化移动端过滤器 UI（可折叠）
- [ ] 添加"按相关性排序/按时间排序"选项
- [ ] 搜索无结果时提供更智能的建议

### 中期优化（P2）
- [ ] 实现服务端全文搜索（Supabase Full-Text Search）
- [ ] 拼音搜索增强（支持声调容错、分词）
- [ ] 搜索结果分页（当前一次性加载）
- [ ] 添加搜索统计和热门搜索

### 长期优化（P3）
- [ ] 集成 Elasticsearch 或 Algolia 搜索服务
- [ ] AI 语义搜索（理解用户意图）
- [ ] 搜索建议/自动完成（输入时实时提示）
- [ ] 用户搜索历史云端同步

---

## 🧪 测试用例汇总

| 编号 | 测试项 | 输入 | 期望输出 |
|------|--------|------|----------|
| T01 | 中文搜索-医疗词汇 | "头痛" | 返回医疗词汇和场景，关键词高亮 |
| T02 | 中文搜索-挂号 | "挂号" | 返回挂号相关词汇和场景 |
| T03 | 拼音搜索 | "toutong" | 匹配"头痛"拼音字段 |
| T04 | 拼音搜索-挂号 | "guahao" | 匹配"挂号"拼音字段 |
| T05 | 英文搜索 | "headache" | 返回"头痛"（英文释义匹配） |
| T06 | 英文搜索-注册 | "register" | 返回"挂号"（meanings匹配） |
| T07 | 类型过滤 | 只选"医疗词汇"，搜索"痛" | 只显示医疗词汇 |
| T08 | 级别过滤 | 选"HSK3"，搜索"发烧" | 只显示HSK3内容 |
| T09 | 分类过滤 | 选"symptom"，搜索"痛" | 只显示症状类词汇 |
| T10 | 搜索历史 | 搜索多个词 | 历史记录显示在下拉框 |
| T11 | 清除历史 | 点击"清除" | 历史记录清空 |
| T12 | 无结果 | "asdfasdf" | 显示友好提示 |
| T13 | 初始状态 | 访问 `/search` | 显示欢迎界面和建议 |
| T14 | 结果跳转 | 点击任意结果 | 正确跳转到详情页 |

---

## 📱 界面截图参考

### 初始状态
- 搜索框居中
- 显示"开始搜索"标题
- 常见搜索建议（头痛、发烧、挂号等）
- 支持的内容类型图标

### 搜索结果
- 顶部：结果数量统计
- 左侧：过滤器面板（桌面端）
- 右侧：分组结果
  - 每组有标题和数量
  - 卡片网格布局（2列）
  - 关键词黄色高亮
  - 不同类型不同配色

### 空结果
- 🔍 图标
- "没有找到相关结果"标题
- 建议调整关键词或过滤条件
- "清除过滤条件"按钮

---

## 🐛 故障排查

### 问题 1: 搜索无反应
**可能原因**: 
- 所有内容类型都被取消勾选
- 过滤器过于严格

**解决方法**: 
- 点击"清除所有过滤"按钮
- 至少选择一种内容类型

### 问题 2: 搜索历史丢失
**可能原因**: 
- 浏览器清除了 localStorage
- 使用了隐私模式

**解决方法**: 
- 正常模式下使用浏览器
- 搜索历史会自动保存

### 问题 3: 拼音搜索不准确
**已知限制**: 
- 当前只支持简单的字符串匹配
- 不支持声调容错

**临时方案**: 
- 使用不带声调的拼音：toutong
- 或直接使用中文/英文搜索

---

## 📦 文件清单

### 新增文件
- `lib/search/unified-search.ts` (239 行)
- `components/search/SearchResultCard.tsx` (268 行)
- `components/search/SearchFilters.tsx` (184 行)
- `docs/W3-01-search-implementation.md` (本文档)

### 修改文件
- `app/(app)/search/page.tsx` (完全重写，245 行)

**总计**: 
- 新增代码: ~691 行
- 修改代码: ~245 行
- 文档: 1 个

---

## 🎓 使用示例

### 示例 1: 医学生查找症状词汇

1. 访问 `/search`
2. 输入 "头痛"
3. 在"医疗词汇"组找到 "头痛" 词条
4. 点击查看详情，学习用法和例句

### 示例 2: 学习者查找特定级别内容

1. 访问 `/search`
2. 选择级别过滤器 "HSK3"
3. 输入 "感冒"
4. 查看所有 HSK3 级别相关内容
5. 选择合适的课程或场景学习

### 示例 3: 通过英文快速查找

1. 访问 `/search`
2. 输入 "fever"
3. 找到 "发烧" 及相关内容
4. 学习中文表达方式

---

## 🔄 数据流程

```
用户输入
  ↓
防抖 (300ms)
  ↓
unifiedSearch()
  ├→ searchContentType('medical_term')
  ├→ searchContentType('lesson')
  ├→ searchContentType('reading')
  ├→ searchContentType('grammar')
  └→ searchContentType('scenario')
       ↓
  getContentList() [from lib/content]
       ↓
  calculateMatch() - 评分和匹配字段识别
       ↓
  排序 + 限制数量
       ↓
按类型分组
  ↓
渲染结果
```

---

## 🔐 安全考虑

- 搜索输入已进行 SQL 注入防护（通过 Supabase `.ilike` 查询）
- 搜索历史仅存储在客户端 localStorage
- 没有服务端日志记录用户搜索内容
- XSS 防护：搜索结果通过 React 自动转义

---

## 📚 相关文档

- [Web PRD](./Web_PRD_Full.md)
- [W1-01: Web 内容查询层](../lib/content/index.ts)
- [W2: 医疗内容实现](./W4-03-implementation.md)
- [Roadmap Checklist](./Roadmap_Checklist_TwoWindows.md)

---

## 📅 版本历史

| 版本 | 日期 | 变更说明 |
|------|------|----------|
| 1.0 | 2026-01-29 | 初始实现，支持 5 种内容类型搜索 |

---

## 🏆 验收标准确认

✅ 支持多种内容类型搜索（medical_term, lesson, reading, grammar, scenario）  
✅ 支持中文、拼音、英文三种搜索方式  
✅ 结果按类型分组显示  
✅ 关键词高亮显示  
✅ 过滤器功能（类型、级别、分类）  
✅ 搜索历史功能（localStorage，最多 10 条）  
✅ 空状态友好提示  
✅ 点击结果正确跳转  
✅ 响应式设计  
✅ 实时搜索（防抖）

---

## 📝 Commit Message

```
feat(search): implement unified search with multi-type content support (W3-01)

- Add unified search functionality supporting 5 content types:
  * medical_term (医疗词汇)
  * lesson (课程)
  * reading (阅读)
  * grammar (语法)
  * scenario (场景)

- Support multiple search methods:
  * Chinese (term/title)
  * Pinyin (phonetic)
  * English (definition/translation)

- Add search features:
  * Real-time search with debounce (300ms)
  * Content type and level filters
  * Search history (localStorage, max 10)
  * Result grouping by type
  * Keyword highlighting
  * Empty state guidance
  * Responsive design

- Components:
  * lib/search/unified-search.ts - Core search logic
  * components/search/SearchResultCard.tsx - Type-specific result cards
  * components/search/SearchFilters.tsx - Filter UI
  * app/(app)/search/page.tsx - Main search page (updated)
  * docs/W3-01-search-implementation.md - Implementation docs

Related: W1-01 (content query layer), W2 (medical content)
Priority: P0
```
