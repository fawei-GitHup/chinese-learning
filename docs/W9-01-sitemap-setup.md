# W9-01: 自动 Sitemap 实施文档

## 📋 工单概述

**工单编号**: W9-01  
**优先级**: P0  
**标题**: 自动 sitemap（按 published 内容生成）  
**前序工单**: W1-01（内容查询层）、W2（医疗内容）、W5（Lessons/Readings/Grammar）

## ✅ 已完成的工作

### 1. 创建服务端 Supabase 客户端

**文件位置**: [`lib/supabase/server.ts`](../lib/supabase/server.ts)

**功能**:
- `createServerSupabaseClient()` - 支持 cookie 的完整服务端客户端
- `createReadonlyServerClient()` - 只读客户端（用于 sitemap 等公开数据查询）

**特性**:
- 支持 Next.js 15 的 async cookies API
- 符合 @supabase/ssr 最佳实践
- 提供错误处理和日志输出

---

### 2. 创建 Sitemap 生成器

**文件位置**: [`app/sitemap.ts`](../app/sitemap.ts)

**功能**:
- 从数据库自动获取所有 `status='published'` 的内容
- 支持的内容类型：
  - 医疗词汇 (medical_terms) → `/medical/dictionary/[word]`
  - 医疗场景 (medical_scenarios) → `/medical/scenarios/[id]`
  - 课程 (lessons) → `/lesson/[id]`
  - 阅读材料 (readings) → `/reader/[id]`
  - 语法点 (grammar_points) → `/grammar/[pattern]`
- 包含静态页面（首页、专题页、列表页）

**SEO 配置**:

| 页面类型 | priority | changeFrequency | 说明 |
|---------|----------|-----------------|------|
| 首页 | 1.0 | daily | 最高优先级 |
| 医疗专题页 | 1.0 | daily | 核心专题页 |
| 列表页 | 0.6 | daily | 内容列表 |
| 详情页 | 0.8 | weekly | 具体内容 |
| 登录页 | 0.3 | monthly | 低优先级 |

**特性**:
- 使用 `Promise.all` 并行查询优化性能
- 自动使用 `updated_at` 作为 `lastModified`
- 优雅的错误处理（数据库查询失败时返回静态页面）
- 控制台日志输出便于调试

---

## 🔧 环境变量配置

### 必需环境变量

在 `.env.local` 文件中添加以下变量：

```bash
# Supabase 配置（必需）
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# 网站 URL（可选，默认为示例域名）
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 如何获取 Supabase 凭据

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择你的项目
3. 前往 **Settings** → **API**
4. 复制：
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 📊 验收步骤

### 1. 启动开发服务器

```bash
npm run dev
```

### 2. 访问 Sitemap

在浏览器中打开：

```
http://localhost:3000/sitemap.xml
```

### 3. 验证内容

检查 sitemap.xml 是否包含：

- ✅ **静态页面**:
  - `http://localhost:3000/` (首页)
  - `http://localhost:3000/medical` (医疗专题)
  - `http://localhost:3000/medical/vocabulary` (词汇列表)
  - `http://localhost:3000/medical/scenarios` (场景列表)
  - `http://localhost:3000/lessons` (课程列表)
  - `http://localhost:3000/grammar` (语法列表)

- ✅ **动态页面** (如果数据库有 published 数据):
  - `/medical/dictionary/[word]` - 医疗词汇详情页
  - `/medical/scenarios/[id]` - 医疗场景详情页
  - `/lesson/[id]` - 课程详情页
  - `/reader/[id]` - 阅读详情页
  - `/grammar/[pattern]` - 语法详情页

### 4. 验证 XML 格式

每个 URL 应包含：
- `<loc>` - URL 地址
- `<lastmod>` - 最后修改时间
- `<changefreq>` - 更新频率
- `<priority>` - 优先级

示例：
```xml
<url>
  <loc>http://localhost:3000/medical/dictionary/医生</loc>
  <lastmod>2026-01-29T14:59:00.000Z</lastmod>
  <changefreq>weekly</changefreq>
  <priority>0.8</priority>
</url>
```

### 5. 检查控制台日志

开发服务器应输出类似日志：

```
[Sitemap] 已获取内容数量: {
  lessons: 10,
  readings: 5,
  grammarPoints: 8,
  medicalTerms: 50,
  medicalScenarios: 12
}
[Sitemap] 总计 92 个 URL
```

---

## 🚀 生产环境配置

### 1. 设置生产环境变量

在 Vercel/Netlify 等部署平台添加环境变量：

```bash
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. 提交 Sitemap 到搜索引擎

#### Google Search Console

1. 前往 [Google Search Console](https://search.google.com/search-console)
2. 选择你的网站
3. 左侧菜单 → **Sitemaps**
4. 输入 sitemap URL: `https://your-domain.com/sitemap.xml`
5. 点击 **Submit**

#### Bing Webmaster Tools

1. 前往 [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. 选择你的网站
3. **Sitemaps** → **Submit a sitemap**
4. 输入: `https://your-domain.com/sitemap.xml`

---

## 🧪 测试场景

### 场景 1: Supabase 未配置

**预期**: sitemap 仅返回静态页面，不包含动态内容

```bash
# 临时删除或注释 .env.local 中的 Supabase 配置
# 访问 http://localhost:3000/sitemap.xml
# 应该只看到首页、专题页、列表页等静态页面
```

### 场景 2: 数据库为空

**预期**: sitemap 返回静态页面 + 空的动态内容列表

### 场景 3: 正常情况

**预期**: sitemap 包含所有静态页面 + 所有 published 的动态内容

---

## 📝 数据库要求

### 必需字段

所有内容表（lessons、readings、grammar_points、medical_terms、medical_scenarios）必须包含：

- `id` (UUID/TEXT) - 主键
- `slug` (TEXT, 可选) - URL 友好的标识符
- `status` (TEXT) - 发布状态，必须为 'published' 才会出现在 sitemap
- `updated_at` (TIMESTAMPTZ, 可选) - 最后更新时间
- `created_at` (TIMESTAMPTZ, 可选) - 创建时间

### 示例数据插入

```sql
-- 插入一个医疗词汇
INSERT INTO medical_terms (id, slug, title, status, updated_at, created_at)
VALUES (
  gen_random_uuid(),
  '医生',
  '医生',
  'published',
  NOW(),
  NOW()
);

-- 插入一个医疗场景
INSERT INTO medical_scenarios (id, slug, title_en, status, updated_at, created_at)
VALUES (
  gen_random_uuid(),
  'registration',
  'Patient Registration',
  'published',
  NOW(),
  NOW()
);
```

---

## 🐛 故障排查

### 问题 1: Sitemap 返回 500 错误

**原因**: Supabase 环境变量未配置

**解决**:
1. 检查 `.env.local` 文件
2. 确保 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 存在
3. 重启开发服务器

---

### 问题 2: Sitemap 只有静态页面，没有动态内容

**可能原因**:
1. 数据库表不存在
2. 表中没有 `status='published'` 的数据
3. 表结构缺少必需字段

**解决**:
1. 检查控制台日志查看具体错误
2. 在 Supabase SQL Editor 中运行：
   ```sql
   SELECT COUNT(*) FROM medical_terms WHERE status = 'published';
   ```
3. 确认表结构符合要求

---

### 问题 3: Sitemap URL 不正确

**原因**: `NEXT_PUBLIC_SITE_URL` 未设置或设置错误

**解决**:
1. 在 `.env.local` 添加：
   ```bash
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```
2. 生产环境使用实际域名

---

## 📦 相关文件

- [`lib/supabase/server.ts`](../lib/supabase/server.ts) - 服务端 Supabase 客户端
- [`app/sitemap.ts`](../app/sitemap.ts) - Sitemap 生成器
- [`lib/content/index.ts`](../lib/content/index.ts) - 内容查询层（W1-01）

---

## 🎯 建议 Commit Message

```
feat(W9-01): Add automatic sitemap generation

- Create server-side Supabase client for SSR
- Implement sitemap.ts with published content from database
- Include medical terms, scenarios, lessons, readings, grammar
- Set appropriate priority and changeFrequency for SEO
- Add static pages with highest priority

Files:
- lib/supabase/server.ts (new)
- app/sitemap.ts (new)
- docs/W9-01-sitemap-setup.md (new)

Tables queried:
- lessons
- readings
- grammar_points
- medical_terms
- medical_scenarios

Routes covered:
- /medical/dictionary/[word]
- /medical/scenarios/[id]
- /lesson/[id]
- /reader/[id]
- /grammar/[pattern]
- Static pages (/medical, /medical/vocabulary, etc.)

SEO configuration:
- Homepage & medical hub: priority 1.0, daily
- Detail pages: priority 0.8, weekly
- List pages: priority 0.6, daily
```

---

## ✅ 工单状态

- [x] 创建服务端 Supabase 客户端
- [x] 实现 sitemap.ts
- [x] 设置合理的 priority 和 changeFrequency
- [x] 支持所有内容类型（medical_term, scenario, lesson, reading, grammar）
- [x] 添加静态页面
- [x] 编写文档
- [x] 提供验收步骤

**完成时间**: 2026-01-29  
**验收状态**: 待验收  
**下一步**: 访问 http://localhost:3000/sitemap.xml 验证
