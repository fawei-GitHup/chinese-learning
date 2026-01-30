# 🚀 快速部署指南

一步步指导您快速将项目部署到Vercel。

## ⚡ 5分钟快速部署

### 步骤1: 配置环境变量（2分钟）

```bash
# 复制环境变量模板
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填写以下信息：

```env
# 必填：Vercel登录凭据
VERCEL_EMAIL=your-real-email@example.com
VERCEL_PASSWORD=your-real-password

# 可选：项目配置
PROJECT_NAME=my-chinese-learning-app
```

### 步骤2: 推送代码到GitHub（1分钟）

```bash
# 使用npm脚本
npm run git:push

# 或直接运行
node git-push.js
```

脚本会自动：
- ✅ 添加所有更改
- ✅ 提交（可自定义消息）
- ✅ 推送到GitHub

### 步骤3: 部署到Vercel（2分钟）

```bash
# 使用npm脚本
npm run deploy

# 或直接运行
node deploy-to-vercel.js
```

脚本会自动：
- ✅ 检查构建
- ✅ 登录Vercel
- ✅ 导入GitHub仓库
- ✅ 部署项目
- ✅ 输出部署URL

### 🎉 完成！

部署完成后，您会看到类似这样的输出：

```
============================================================
部署URL: https://your-project.vercel.app
============================================================
```

## 💡 一键部署（推荐）

如果您想一次性完成Git推送和Vercel部署：

```bash
npm run deploy:full
```

或

```bash
node git-push.js && node deploy-to-vercel.js
```

## 📋 npm脚本快捷命令

在 [`package.json`](package.json) 中已配置以下脚本：

```json
{
  "scripts": {
    "git:push": "node git-push.js",           // 仅Git推送
    "deploy": "node deploy-to-vercel.js",     // 仅Vercel部署
    "deploy:full": "npm run git:push && npm run deploy"  // 完整流程
  }
}
```

使用方式：

```bash
npm run git:push      # Git推送
npm run deploy        # Vercel部署
npm run deploy:full   # 一键完成所有操作
```

## ⚙️ 首次使用配置

### 1. 确保已安装Playwright浏览器

```bash
npx playwright install chromium
```

### 2. 检查Git配置

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 3. 创建GitHub仓库（如果还没有）

访问 https://github.com/new 创建新仓库，然后：

```bash
git remote add origin https://github.com/username/repo.git
```

## 🔍 验证部署

部署完成后，访问输出的URL验证：

1. ✅ 网站可以正常访问
2. ✅ 页面加载正确
3. ✅ 功能正常工作

## 🛠️ 故障排除

### 问题1: 找不到.env.local

**解决方案：**
```bash
cp .env.local.example .env.local
# 然后编辑 .env.local 填写真实凭据
```

### 问题2: Playwright未安装

**解决方案：**
```bash
npm install @playwright/test --save-dev
npx playwright install chromium
```

### 问题3: Git推送失败

**解决方案：**
```bash
# 检查远程仓库
git remote -v

# 如果没有，添加远程仓库
git remote add origin https://github.com/username/repo.git
```

### 问题4: 构建失败

**解决方案：**
```bash
# 清理并重新安装依赖
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### 问题5: Vercel需要2FA验证

**操作：**
- 脚本会自动暂停
- 在打开的浏览器中输入2FA验证码
- 脚本会继续执行

## 📚 详细文档

需要更多信息？查看完整文档：

- 📖 [完整部署指南](DEPLOYMENT.md)
- 📁 [`git-push.js`](git-push.js) - Git推送脚本源码
- 📁 [`deploy-to-vercel.js`](deploy-to-vercel.js) - Vercel部署脚本源码

## 💬 提示

### 开发环境部署流程

```bash
# 1. 修改代码后，本地测试
npm run dev

# 2. 确认无误后，构建测试
npm run build

# 3. 一键部署
npm run deploy:full
```

### 生产环境建议

1. **环境变量管理**
   - 本地开发：使用 `.env.local`
   - Vercel生产：在Vercel控制台配置环境变量

2. **版本控制**
   - 使用有意义的提交消息
   - 定期推送到GitHub
   - 保持代码库整洁

3. **部署策略**
   - 主要功能完成后部署
   - 重大更新前先在预览环境测试
   - 使用Vercel的预览部署功能

## 🎯 下一步

部署成功后，您可能需要：

1. **配置自定义域名**
   - 在Vercel控制台添加域名
   - 配置DNS记录

2. **设置环境变量**
   - 在Vercel项目设置中添加生产环境变量
   - 如Supabase URL、API Keys等

3. **启用Analytics**
   - Vercel Analytics已集成
   - 在Vercel控制台查看访问数据

4. **配置持续部署**
   - GitHub推送自动触发部署
   - 配置部署通知

---

🎊 **恭喜！** 您已成功完成自动化部署设置。

有问题？查看 [故障排除](#-故障排除) 或阅读 [完整文档](DEPLOYMENT.md)。
