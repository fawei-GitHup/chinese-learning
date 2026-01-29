# Project Status

<!-- Record manual operation guides here -->

## 工单完成记录

### W0-03：学习区路由保护 `/app/*`（P0）✅

**完成日期**：2026-01-26

**实现方案**：
- 新增 [`middleware.ts`](../middleware.ts)：Next.js 中间件，在请求层面拦截所有 `/app/*` 路由
- 修改 [`app/(app)/layout.tsx`](../app/(app)/layout.tsx)：改为服务端组件，作为双重保护

**受保护的路由**：
| 路由 | 说明 |
|------|------|
| `/dashboard/*` | 仪表板 |
| `/account/*` | 账户设置 |
| `/dictionary/*` | 词典 |
| `/grammar/*` | 语法 |
| `/lesson/*` | 课程 |
| `/medical-reader/*` | 医学阅读器 |
| `/path/*` | 学习路径 |
| `/reader/*` | 阅读器 |
| `/srs/*` | 间隔重复系统 |

**重定向逻辑**：
- 未登录访问以上路由 → 跳转 `/login?redirect={原路径}`
- 例如：访问 `/dashboard` → 跳转 `/login?redirect=%2Fdashboard`

**验收测试**：
1. 清除浏览器 cookies 或使用隐私窗口
2. 访问 `/dashboard` → 应跳转到 `/login?redirect=%2Fdashboard`
3. 访问 `/srs` → 应跳转到 `/login?redirect=%2Fsrs`
4. 登录后应自动跳转回原路径（需登录页支持 redirect 参数）

---

## Supabase 手动配置指南

### Supabase 控制台路径

访问 Supabase 控制台：https://supabase.com/dashboard

1. 登录你的账户。
2. 选择你的项目（如果多个项目）。

**截图点位**：主页的项目列表。**预期结果**：显示你的项目仪表板。

### Google OAuth 应用创建步骤

1. 访问 Google Cloud Console：https://console.cloud.google.com/
2. 创建新项目或选择现有项目。
3. 启用 Google+ API 和 Google Identity API。
   - 在 "API 和服务" > "库" 中搜索并启用 "Google+ API" 和 "Google Identity API"。
   - **截图点位**：API 启用页面，显示启用状态。
4. 创建 OAuth 2.0 客户端 ID。
   - 转到 "凭据" 页面。
   - 点击 "创建凭据" > "OAuth 客户端 ID"。
   - 应用类型选择 "Web 应用程序"。
   - 在 "授权的重定向 URI" 中添加你的回调URL，例如：https://your-project.supabase.co/auth/v1/callback
   - **截图点位**：凭据创建页面。**预期结果**：获得客户端 ID 和客户端密钥。

**截图点位**：控制台主页。**预期结果**：项目概览页。

### GitHub OAuth 应用创建步骤

1. 访问 GitHub 开发者设置：https://github.com/settings/developers
2. 点击 "New OAuth App"。
3. 填写应用详情：
   - Application name：你的应用名称
   - Homepage URL：你的网站URL
   - Authorization callback URL：https://your-project.supabase.co/auth/v1/callback
4. 点击 "Register application"。
   - **截图点位**：应用创建表单。**预期结果**：获得 Client ID 和 Client Secret。

**截图点位**：OAuth Apps 列表。**预期结果**：显示你创建的应用。

### 在 Supabase 项目中添加提供商的步骤

1. 在 Supabase 控制台中，选择你的项目。
2. 导航到 "Authentication" > "Providers"。
3. 对于 Google：
   - 点击 "Google" 并启用。
   - 输入从 Google Cloud Console 获取的客户端 ID 和客户端密钥。
   - **截图点位**：Google 配置表单。**预期结果**：启用状态。
4. 对于 GitHub：
   - 点击 "GitHub" 并启用。
   - 输入从 GitHub 获取的 Client ID 和 Client Secret。
   - **截图点位**：GitHub 配置表单。**预期结果**：启用状态。

**截图点位**：提供商页面。**预期结果**：OAuth 提供商启用并配置。