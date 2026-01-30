# Vercel 部署文档

本文档提供了将中文学习应用部署到 Vercel 的完整指南。

## 目录

1. [前置要求](#前置要求)
2. [环境变量配置](#环境变量配置)
3. [部署方式](#部署方式)
4. [Supabase配置](#supabase配置)
5. [域名配置](#域名配置)
6. [部署后验证](#部署后验证)
7. [故障排查](#故障排查)

---

## 前置要求

### 1. Vercel 账号
- 访问 [vercel.com](https://vercel.com) 注册账号
- 推荐使用 GitHub 账号登录，便于代码库集成

### 2. Node.js 环境
```bash
node --version  # 需要 >= 18.0.0
npm --version   # 需要 >= 9.0.0
```

### 3. Vercel CLI（可选，用于命令行部署）
```bash
npm install -g vercel
```

### 4. Git 仓库
- 将代码推送到 GitHub/GitLab/Bitbucket
- 确保 `.gitignore` 已配置正确

---

## 环境变量配置

### 必需的环境变量

在 Vercel 项目设置中需要配置以下环境变量：

#### 1. Supabase 配置

```bash
# Supabase URL（生产环境）
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase 公开的匿名密钥（生产环境）
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **⚠️ 重要安全提示：**
> - 生产环境请使用独立的 Supabase 项目，不要与开发环境共用
> - 确保 Supabase RLS (Row Level Security) 已正确配置
> - 定期轮换 API 密钥

#### 2. 其他可选环境变量

```bash
# Vercel Analytics（已集成，无需配置）
# 自动启用

# Node 环境
NODE_ENV=production  # Vercel 自动设置
```

### 环境变量配置位置

#### 方式1: Vercel Dashboard
1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 进入 `Settings` → `Environment Variables`
4. 添加每个环境变量
5. 选择环境类型：Production / Preview / Development

#### 方式2: Vercel CLI
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# 按提示输入值和选择环境
```

#### 方式3: .env.production（不推荐）
不建议将生产环境变量提交到代码库。

---

## 部署方式

### 方式 1：通过 Vercel Dashboard（推荐）

这是最简单的方式，支持自动部署。

#### 步骤：

1. **登录 Vercel**
   - 访问 [vercel.com/new](https://vercel.com/new)

2. **导入 Git 仓库**
   - 点击 "Import Project"
   - 选择 GitHub/GitLab/Bitbucket
   - 授权 Vercel 访问你的仓库
   - 选择 `learn-chinese-ui-prototype` 仓库

3. **配置项目**
   - **Project Name**: `learn-chinese-app` （或你喜欢的名称）
   - **Framework Preset**: Next.js （自动检测）
   - **Root Directory**: `./` （保持默认）
   - **Build Command**: `npm run build` （自动检测）
   - **Output Directory**: `.next` （自动检测）

4. **配置环境变量**
   - 展开 "Environment Variables" 部分
   - 添加所有必需的环境变量（见上方列表）

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待构建完成（通常 2-5 分钟）

6. **自动部署设置**
   - 部署成功后，Vercel 会自动监听 GitHub 仓库
   - 每次推送到 `main` 分支会触发生产部署
   - 其他分支的推送会创建预览部署

#### 优点：
- ✅ 最简单，无需命令行
- ✅ 自动持续部署（CI/CD）
- ✅ 预览部署功能（每个 PR 独立预览）
- ✅ 回滚功能（一键回退到之前版本）

---

### 方式 2：使用 Vercel CLI

适合命令行爱好者和需要更多控制的场景。

#### 步骤：

1. **安装 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登录 Vercel**
   ```bash
   vercel login
   # 按提示使用邮箱或 GitHub 登录
   ```

3. **首次部署（生成配置）**
   ```bash
   vercel
   ```
   按提示回答：
   - Set up and deploy? `Y`
   - Which scope? 选择你的团队/账号
   - Link to existing project? `N`（首次部署）
   - What's your project's name? `learn-chinese-app`
   - In which directory is your code located? `./`

4. **部署到生产环境**
   ```bash
   vercel --prod
   ```

5. **查看部署状态**
   ```bash
   vercel ls  # 列出所有部署
   ```

#### 配置环境变量（CLI方式）：
```bash
# 添加环境变量
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 按提示输入值

# 查看所有环境变量
vercel env ls

# 下拉环境变量到本地（用于开发）
vercel env pull .env.local
```

#### 优点：
- ✅ 命令行操作，脚本化
- ✅ 可集成到 CI/CD 流水线
- ✅ 更细粒度的控制

---

### 方式 3：Git Push 自动部署

启用自动部署后（方式1），只需：

```bash
# 1. 提交代码
git add .
git commit -m "feat: new feature"

# 2. 推送到 GitHub
git push origin main

# 3. Vercel 自动检测并部署
# 访问 Vercel Dashboard 查看部署进度
```

#### 分支策略：
- `main` 分支 → 自动部署到生产环境
- `develop` / 功能分支 → 自动创建预览部署
- Pull Request → 自动生成预览 URL

---

## Supabase 配置

### 1. 创建生产环境 Supabase 项目

强烈建议为生产环境创建独立的 Supabase 项目：

1. 访问 [supabase.com](https://supabase.com)
2. 创建新项目（New Project）
3. 选择区域（推荐：Singapore 或 Tokyo，距离中国较近）
4. 记录以下信息：
   - Project URL: `https://your-project.supabase.co`
   - `anon` public key

### 2. 数据库迁移

如果有现有数据需要迁移：

```bash
# 导出开发环境数据
supabase db dump -f schema.sql

# 应用到生产环境
psql -h db.your-project.supabase.co -U postgres -d postgres -f schema.sql
```

或使用 Supabase CLI：
```bash
supabase link --project-ref your-project-ref
supabase db push
```

### 3. 配置 RLS（Row Level Security）

确保生产环境启用了行级安全策略：

```sql
-- 示例：用户只能查看自己的学习数据
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = user_id);
```

### 4. 配置认证提供商

在 Supabase Dashboard中配置OAuth：

1. 进入 `Authentication` → `Providers`
2. 配置 Google OAuth：
   - Redirect URL: `https://your-domain.vercel.app/auth/callback`
3. 配置其他登录方式（邮箱/密码等）

### 5. 配置 Allowed Origins

在 Supabase Dashboard：
1. 进入 `Settings` → `API`
2. 在 "Additional Redirect URLs" 添加：
   ```
   https://your-domain.vercel.app/**
   https://*.vercel.app/**
   ```

---

## 域名配置

### 使用 Vercel 默认域名

部署后自动获得：
- `https://learn-chinese-app.vercel.app`
- `https://learn-chinese-app-<random>.vercel.app`（每个部署）

### 配置自定义域名

1. **在 Vercel Dashboard**
   - 进入项目 → `Settings` → `Domains`
   - 点击 "Add Domain"
   - 输入你的域名：`example.com`

2. **配置 DNS 记录**

   在你的域名服务商（如 Cloudflare, GoDaddy）添加记录：

   **选项 A：使用 A 记录**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   **选项 B：使用 CNAME（推荐）**
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

3. **启用自动 HTTPS**
   - Vercel 自动提供 SSL 证书（Let's Encrypt）
   - 通常 5-10 分钟生效

4. **配置子域名（可选）**
   ```
   Type: CNAME
   Name: app
   Value: cname.vercel-dns.com
   ```
   → 访问 `https://app.example.com`

---

## 部署后验证

### 1. 自动检查清单

部署完成后，Vercel 会自动检查：
- ✅ 构建成功
- ✅ 函数正常部署
- ✅ 静态资源上传完成

### 2. 手动验证清单

#### 核心功能测试：

```markdown
- [ ] 网站可正常访问
- [ ] 首页加载正常
- [ ] 用户注册/登录功能正常
- [ ] OAuth 登录（Google等）正常
- [ ] 数据库连接正常（Supabase）
- [ ] 多语言切换正常（中文/英文）
- [ ] 医疗词汇页面正常
- [ ] 医疗场景页面正常
- [ ] 词典查询功能正常
- [ ] 响应式设计在移动端正常
```

#### 性能检查：

1. **使用 Lighthouse 检查**
   - 打开 Chrome DevTools → Lighthouse
   - 运行审计，检查：
     - Performance（性能）> 90
     - Accessibility（可访问性）> 90
     - Best Practices > 90
     - SEO > 90

2. **使用 Vercel Analytics**
   - 访问 Vercel Dashboard → Analytics
   - 查看 Core Web Vitals：
     - LCP (Largest Contentful Paint) < 2.5s
     - FID (First Input Delay) < 100ms
     - CLS (Cumulative Layout Shift) < 0.1

#### 安全检查：

```markdown
- [ ] HTTPS 已启用
- [ ] 环境变量未泄露到客户端代码
- [ ] Supabase RLS 已启用
- [ ] 安全响应头已配置（见 vercel.json）
- [ ] 无明文敏感信息在代码中
```

#### 数据库检查：

```markdown
- [ ] Supabase连接正常
- [ ] 用户数据可正常读写
- [ ] 学习进度可保存
- [ ] 认证流程完整
```

### 3. 使用 Vercel Deployment 日志

查看部署日志：
1. Vercel Dashboard → 项目 → Deployments
2. 点击最新部署
3. 查看 "Build Logs" 和 "Function Logs"
4. 检查是否有错误或警告

---

## 故障排查

### 常见问题

#### 1. 构建失败：`Module not found`

**原因**：依赖未安装或版本不匹配

**解决**：
```bash
# 本地测试构建
npm run build

# 清除并重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 确保 package.json 中所有依赖都正确
```

#### 2. 环境变量未生效

**症状**：页面显示环境变量为 `undefined`

**解决**：
1. 确认在 Vercel Dashboard 中已添加环境变量
2. 确认变量名以 `NEXT_PUBLIC_` 开头（客户端变量）
3. 重新部署（更改环境变量后需重新部署）
```bash
vercel --prod --force
```

#### 3. Supabase 连接失败

**症状**：`Failed to fetch` 或认证错误

**解决**：
1. 检查环境变量是否正确
2. 确认 Supabase project 未暂停
3. 检查 Supabase "Allowed Origins"配置
4. 检查浏览器控制台错误信息

#### 4. 404 错误

**症状**：动态路由返回 404

**解决**：
1. 确认 `vercel.json` 中 rewrites 配置正确
2. 检查文件路径大小写（Vercel 区分大小写）
3. 确认 `[locale]` 路由正常

#### 5. 构建超时

**症状**：Build time exceeded

**解决**：
- 优化依赖：移除未使用的包
- 使用 `next.config.mjs` 中的 `experimental.optimizePackageImports`
- 升级到 Pro Plan（更长构建时间）

#### 6. 图片加载失败

**症状**：图片显示错误或加载慢

**解决**：
```js
// next.config.mjs
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-supabase-project.supabase.co',
    },
  ],
}
```

### 调试工具

#### 1. Vercel CLI 日志
```bash
vercel logs <deployment-url>
```

#### 2. 本地模拟生产环境
```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 访问 http://localhost:3000
```

#### 3. Vercel Remote Caching
```bash
# 清除 Vercel build cache
vercel --prod --force
```

---

## 生产环境优化建议

### 1. 性能优化

```javascript
// next.config.mjs
const nextConfig = {
  // 启用 React Strict Mode
  reactStrictMode: true,
  
  // 压缩
  compress: true,
  
  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  
  // 实验性性能功能
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
}
```

### 2. 监控和分析

- **Vercel Analytics**：自动启用，查看实时访问数据
- **Vercel Speed Insights**：监控 Core Web Vitals
- **Sentry**（可选）：错误追踪
  ```bash
  npm install @sentry/nextjs
  ```

### 3. 缓存策略

```javascript
// 设置静态资源缓存
// 在 vercel.json
{
  "headers": [
    {
      "source": "/static/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 4. 成本优化

- **Free Plan 限制**：
  - 100 GB 带宽/月
  - 无限部署
  - 1000 次 Serverless Function 调用/天

- **优化建议**：
  - 使用 ISR (Incremental Static Regeneration)
  - 启用 CDN 缓存
  - 减少 API 调用次数

---

## 快速参考命令

```bash
# Vercel CLI 常用命令
vercel                    # 部署到预览环境
vercel --prod            # 部署到生产环境
vercel ls                # 列出所有部署
vercel rm [deployment]   # 删除部署
vercel env ls            # 查看环境变量
vercel logs [url]        # 查看日志
vercel domains           # 管理域名
vercel secrets           # 管理密钥

# 本地开发
npm run dev              # 开发服务器
npm run build            # 生产构建
npm run start            # 启动生产服务器
npm run lint             # 代码检查

# Git 工作流
git add .
git commit -m "message"
git push origin main     # 自动触发 Vercel 部署
```

---

## 附录

### A. 环境变量完整列表

| 变量名 | 必需 | 说明 | 示例值 |
|--------|------|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase项目URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase公开密钥 | `eyJhbGc...` |

### B. 相关资源

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)
- [Supabase 文档](https://supabase.com/docs)
- [Vercel CLI 文档](https://vercel.com/docs/cli)

### C. 支持联系

- **Vercel Support**: [vercel.com/support](https://vercel.com/support)
- **Supabase Support**: [supabase.com/support](https://supabase.com/support)

---

## 更新日志

- **2026-01-30**: 初始版本，完整部署指南

---

**祝部署顺利！🚀**
