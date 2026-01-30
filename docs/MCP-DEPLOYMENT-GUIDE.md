# 使用 Playwright MCP 部署到 Vercel

本文档指导如何使用 Playwright MCP 工具来自动化部署项目到 Vercel。

## 前置准备

### 1. 配置环境变量

请手动在 `.env.local` 文件中填写以下信息：

```bash
# Vercel 账号配置（使用谷歌邮箱登录）
VERCEL_EMAIL=your-google-email@gmail.com
VERCEL_PASSWORD=your-vercel-password

# Supabase 账号配置（使用GitHub登录）
SUPABASE_GITHUB_USERNAME=your-github-username
SUPABASE_GITHUB_PASSWORD=your-github-password

# GitHub 仓库配置（用于自动部署）
GITHUB_REPO_URL=https://github.com/your-username/learn-chinese-ui-prototype.git
GITHUB_TOKEN=your-github-personal-access-token
```

### 2. 确保已连接

确保你已经：
- ✅ 代码已推送到 GitHub 仓库
- ✅ Vercel 账号已创建（使用 Google 登录）
- ✅ Supabase 生产环境项目已创建（使用 GitHub 登录）

---

## 部署步骤（使用 Playwright MCP）

AI 助手将使用以下步骤来部署你的项目：

### 步骤 1: 打开浏览器并访问 Vercel

```
使用 mcp--playwright--browser_navigate
URL: https://vercel.com/login
```

### 步骤 2: 使用 Google 账号登录

```
1. 点击 "Continue with Google" 按钮
2. 输入 VERCEL_EMAIL
3. 输入 VERCEL_PASSWORD
4. 等待登录成功
```

### 步骤 3: 导入 GitHub 仓库

```
1. 访问 https://vercel.com/new
2. 如需要，授权 GitHub 访问
3. 搜索并选择你的仓库
4. 点击 "Import" 按钮
```

### 步骤 4: 配置项目设置

```
1. 项目名称: learn-chinese-app
2. Framework: Next.js (自动检测)
3. Build Command: npm run build
4. Output Directory: .next
5. Install Command: npm install
```

### 步骤 5: 配置环境变量

添加以下环境变量：

```
NEXT_PUBLIC_SUPABASE_URL = [从 .env.local 读取]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [从 .env.local 读取]
```

### 步骤 6: 部署

```
1. 点击 "Deploy" 按钮
2. 等待构建完成（约 2-5 分钟）
3. 部署成功，获取 URL
```

---

## AI 助手使用的 MCP 命令

以下是 AI 助手将使用的 Playwright MCP 命令序列：

### 1. 访问 Vercel 登录页
```javascript
mcp--playwright--browser_navigate({
  url: "https://vercel.com/login"
})
```

### 2. 获取页面快照
```javascript
mcp--playwright--browser_snapshot()
```

### 3. 点击 Google 登录按钮
```javascript
mcp--playwright--browser_click({
  element: "Google登录按钮",
  ref: "[从快照中获取]"
})
```

### 4. 输入邮箱
```javascript
mcp--playwright--browser_type({
  element: "邮箱输入框",
  ref: "[从快照中获取]",
  text: process.env.VERCEL_EMAIL
})
```

### 5. 输入密码
```javascript
mcp--playwright--browser_type({
  element: "密码输入框",
  ref: "[从快照中获取]",
  text: process.env.VERCEL_PASSWORD
})
```

### 6. 等待登录完成
```javascript
mcp--playwright--browser_wait_for({
  text: "Dashboard" // 或其他登录成功的标志
})
```

### 7. 导航到新项目页
```javascript
mcp--playwright--browser_navigate({
  url: "https://vercel.com/new"
})
```

### 8. 搜索并导入仓库
```javascript
// 获取快照，找到仓库
mcp--playwright--browser_snapshot()

// 点击 Import 按钮
mcp--playwright--browser_click({
  element: "Import按钮",
  ref: "[从快照中获取]"
})
```

### 9. 填写项目名称
```javascript
mcp--playwright--browser_type({
  element: "项目名称输入框",
  ref: "[从快照中获取]",
  text: "learn-chinese-app"
})
```

### 10. 添加环境变量
```javascript
mcp--playwright--browser_fill_form({
  fields: [
    {
      name: "环境变量键",
      type: "textbox",
      ref: "[从快照中获取]",
      value: "NEXT_PUBLIC_SUPABASE_URL"
    },
    {
      name: "环境变量值",
      type: "textbox",
      ref: "[从快照中获取]",
      value: process.env.NEXT_PUBLIC_SUPABASE_URL
    }
  ]
})
```

### 11. 点击部署按钮
```javascript
mcp--playwright--browser_click({
  element: "Deploy按钮",
  ref: "[从快照中获取]"
})
```

### 12. 等待部署完成
```javascript
mcp--playwright--browser_wait_for({
  text: "Congratulations" // 或其他成功标志
})
```

### 13. 获取部署URL
```javascript
mcp--playwright--browser_snapshot()
// 从快照中提取部署URL
```

### 14. 截图保存
```javascript
mcp--playwright--browser_take_screenshot({
  filename: "deployment-success.png",
  fullPage: true
})
```

---

## 部署后验证

部署完成后，AI 助手将访问以下页面验证：

1. **首页**: `https://your-app.vercel.app`
2. **登录页**: `https://your-app.vercel.app/zh-CN/login`
3. **医疗词汇页**: `https://your-app.vercel.app/zh-CN/medical/vocabulary`

验证项：
- ✅ 页面可正常加载
- ✅ 无控制台错误
- ✅ Supabase 连接正常
- ✅ 样式正常显示

---

## 常见问题处理

### 问题1: Google 登录需要验证

如果 Google 需要额外验证（如验证码、手机验证）：

**解决方案**：
- AI 助手将暂停并请求用户手动完成验证
- 验证完成后，AI 助手继续后续步骤

### 问题2: GitHub 授权需要额外确认

如果 Vercel 首次连接 GitHub 需要授权：

**解决方案**：
```javascript
// AI 助手将：
1. 检测授权页面
2. 点击 "Authorize Vercel" 按钮
3. 等待跳转回 Vercel
```

### 问题3: 构建失败

如果部署过程中构建失败：

**解决方案**：
```javascript
// AI 助手将：
1. 截图保存错误信息
2. 查看构建日志（点击 View Build Logs）
3. 提取错误信息反馈给用户
4. 提供修复建议
```

### 问题4: 环境变量配置错误

如果环境变量填写错误：

**解决方案**：
```javascript
// 部署后修改环境变量：
1. 访问项目设置: https://vercel.com/<project>/settings/environment-variables
2. 编辑或删除错误的变量
3. 添加正确的变量
4. 重新部署（Redeploy）
```

---

## 手动部署对比

### 使用 MCP 自动化部署（推荐）

**优点**：
- ✅ 完全自动化，无需手动操作
- ✅ 可重复执行，流程标准化
- ✅ 减少人为错误
- ✅ 自动验证部署结果

**缺点**：
- ❌ 需要提供账号密码（安全风险）
- ❌ 特殊情况（验证码）需要手动介入

### 手动部署

**优点**：
- ✅ 更安全（不需要保存密码）
- ✅ 可以处理各种特殊情况
- ✅ 更直观

**缺点**：
- ❌ 耗时较长
- ❌ 容易出错
- ❌ 不易重复

---

## 安全建议

### 环境变量管理

1. **不要提交到 Git**
   - `.env.local` 已在 `.gitignore` 中
   - 确保 VERCEL_PASSWORD 等敏感信息不泄露

2. **使用完后删除**
   ```bash
   # 部署完成后，建议删除账号密码变量
   # 编辑 .env.local，删除以下行：
   # VERCEL_EMAIL
   # VERCEL_PASSWORD
   # SUPABASE_GITHUB_USERNAME
   # SUPABASE_GITHUB_PASSWORD
   ```

3. **使用 App Password（推荐）**
   - Google: 使用应用专用密码而非主密码
   - GitHub: 使用 Personal Access Token 而非密码

### 获取 Google 应用专用密码

1. 访问 [Google 账号安全设置](https://myaccount.google.com/security)
2. 启用两步验证
3. 生成应用专用密码
4. 使用该密码代替 VERCEL_PASSWORD

### 获取 GitHub Personal Access Token

1. 访问 [GitHub Settings > Developer settings > Personal access tokens](https://github.com/settings/tokens)
2. 点击 "Generate new token (classic)"
3. 选择权限：`repo`, `read:user`
4. 生成并复制 token
5. 使用 token 代替 SUPABASE_GITHUB_PASSWORD

---

## 进阶：持续部署（CI/CD）

部署完成后，Vercel 会自动监听 GitHub 仓库：

### 自动触发部署

```bash
# 每次推送代码都会自动部署
git add .
git commit -m "feat: 新功能"
git push origin main

# Vercel 自动检测并部署
```

### 预览部署

```bash
# 创建功能分支
git checkout -b feature/new-feature

# 提交并推送
git push origin feature/new-feature

# Vercel 自动创建预览部署
# 在 GitHub PR 中会显示预览链接
```

---

## 参考文档

- [Vercel 官方文档](https://vercel.com/docs)
- [Playwright MCP 文档](https://github.com/microsoft/playwright)
- [完整部署指南](./DEPLOYMENT.md)

---

**准备好了吗？请告诉 AI 助手："开始使用 Playwright MCP 部署到 Vercel"**
