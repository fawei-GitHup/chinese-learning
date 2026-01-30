# 自动化部署指南

本项目包含两个自动化部署脚本，用于简化GitHub推送和Vercel部署流程。

## 📁 脚本文件

- [`git-push.js`](git-push.js) - Git自动提交和推送脚本
- [`deploy-to-vercel.js`](deploy-to-vercel.js) - Vercel自动化部署脚本
- [`.env.local.example`](.env.local.example) - 环境变量模板

## 🚀 快速开始

### 1. 配置环境变量

首先，复制示例文件并填写真实凭据：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填写以下信息：

```env
VERCEL_EMAIL=your-email@example.com
VERCEL_PASSWORD=your-password
PROJECT_NAME=my-project
GITHUB_REPO_URL=https://github.com/username/repo
```

### 2. 推送代码到GitHub

运行Git推送脚本：

```bash
node git-push.js
```

脚本会自动：
- ✅ 检查Git仓库状态
- ✅ 添加所有更改到暂存区
- ✅ 提交更改（可自定义提交消息）
- ✅ 推送到GitHub远程仓库

如果还没有Git仓库，脚本会引导您初始化。

### 3. 部署到Vercel

运行Vercel部署脚本：

```bash
node deploy-to-vercel.js
```

脚本会自动：
- ✅ 检查环境变量配置
- ✅ 执行项目构建（npm run build）
- ✅ 检查Git状态
- ✅ 使用Playwright自动化登录Vercel
- ✅ 导入GitHub仓库
- ✅ 配置项目设置
- ✅ 触发部署
- ✅ 追踪部署进度
- ✅ 输出部署URL

## 📋 前置要求

### 系统要求
- Node.js 16+
- npm 或 pnpm
- Git已安装并配置

### 项目依赖
- `@playwright/test` - 已在项目中安装

### GitHub设置
1. 创建GitHub仓库
2. 配置本地Git：
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your-email@example.com"
   ```
3. 添加远程仓库：
   ```bash
   git remote add origin https://github.com/username/repo.git
   ```

### Vercel账号
1. 注册Vercel账号（https://vercel.com/signup）
2. 记录您的登录邮箱和密码
3. 如果启用了2FA，脚本会暂停等待您手动输入验证码

## 🔧 脚本功能详解

### git-push.js

**功能：**
- 自动检测Git仓库状态
- 交互式初始化Git仓库（如需要）
- 智能处理首次推送
- 自定义提交消息

**使用场景：**
- 快速提交和推送代码变更
- 自动化CI/CD流程的一部分
- 简化团队协作的代码提交流程

**选项：**
- 自动生成时间戳提交消息
- 支持自定义提交消息
- 自动设置上游分支

### deploy-to-vercel.js

**功能：**
- 全自动Vercel部署流程
- 错误处理和重试机制
- 详细的日志输出
- 部署进度实时追踪

**部署流程：**
1. **前置检查** (1-4/7)
   - 验证环境变量
   - 执行项目构建
   - 检查Git状态
   - 验证GitHub仓库

2. **自动化登录** (5/7)
   - 访问Vercel登录页
   - 自动填写邮箱密码
   - 处理2FA验证（如需要）

3. **项目配置** (6/7)
   - 导入GitHub仓库
   - 自动检测Next.js配置
   - 设置项目名称

4. **部署执行** (7/7)
   - 触发部署
   - 追踪部署状态
   - 输出部署URL

**浏览器模式：**
- 默认使用非无头模式（`headless: false`）
- 可以观察整个自动化过程
- 便于调试和问题排查

## ⚙️ 高级配置

### 修改部署脚本行为

编辑 [`deploy-to-vercel.js`](deploy-to-vercel.js)：

```javascript
// 修改浏览器启动选项
const browser = await chromium.launch({ 
  headless: false,  // 改为true启用无头模式
  slowMo: 500       // 调整操作延迟（毫秒）
});

// 修改超时设置
await page.waitForTimeout(2000); // 调整等待时间
```

### 添加更多环境变量

在部署脚本中，您可以扩展环境变量配置逻辑：

```javascript
// 在 deploy-to-vercel.js 中添加
const envSection = page.locator('text=Environment Variables');
await envSection.click();

// 添加自定义环境变量
await page.fill('input[name="key"]', 'MY_VAR');
await page.fill('input[name="value"]', 'my-value');
await page.click('button:has-text("Add")');
```

## 🐛 故障排除

### 常见问题

#### 1. 脚本无法找到Playwright

**错误：** `Cannot find module '@playwright/test'`

**解决：**
```bash
npm install @playwright/test --save-dev
npx playwright install chromium
```

#### 2. .env.local未找到

**错误：** `.env.local 文件不存在`

**解决：**
```bash
cp .env.local.example .env.local
# 编辑 .env.local 填写真实凭据
```

#### 3. Git推送失败

**错误：** `推送失败`

**可能原因：**
- 远程仓库不存在
- 没有推送权限
- 需要先创建GitHub仓库

**解决：**
```bash
# 检查远程仓库
git remote -v

# 重新设置远程仓库
git remote set-url origin https://github.com/username/repo.git

# 首次推送
git push -u origin main
```

#### 4. Vercel登录失败

**错误：** 无法登录Vercel

**可能原因：**
- 邮箱或密码错误
- 需要2FA验证
- Vercel页面结构变化

**解决：**
- 检查.env.local中的凭据
- 手动在浏览器中输入2FA验证码
- 如果页面结构变化，可能需要更新脚本选择器

#### 5. 构建失败

**错误：** `npm run build` 失败

**解决：**
```bash
# 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install

# 检查代码错误
npm run lint

# 重新尝试构建
npm run build
```

## 📝 最佳实践

### 1. 安全性
- ⚠️ **永远不要提交 `.env.local` 到Git**
- 确保 `.env.local` 在 `.gitignore` 中
- 使用强密码和2FA保护Vercel账号

### 2. 版本控制
- 在推送前检查 `git status`
- 编写有意义的提交消息
- 定期同步远程仓库

### 3. 部署流程
- 部署前先本地测试 `npm run build`
- 检查环境变量是否完整
- 验证构建输出没有错误

### 4. 监控和日志
- 查看Vercel控制台的构建日志
- 使用Vercel Analytics监控性能
- 设置部署通知

## 🔄 完整部署工作流

推荐的完整部署流程：

```bash
# 1. 开发完成后，运行本地测试
npm run dev
npm run build

# 2. 提交并推送到GitHub
node git-push.js

# 3. 自动化部署到Vercel
node deploy-to-vercel.js

# 4. 验证部署
# 访问脚本输出的部署URL
```

## 📚 相关资源

- [Vercel文档](https://vercel.com/docs)
- [Playwright文档](https://playwright.dev/)
- [GitHub文档](https://docs.github.com/)
- [Next.js部署指南](https://nextjs.org/docs/deployment)

## 🤝 贡献

如果您发现脚本有问题或想要改进，欢迎：
1. 报告问题
2. 提交Pull Request
3. 分享使用经验

## 📄 许可

这些脚本作为项目的一部分，遵循项目的许可协议。

## ⚡ 快速命令参考

```bash
# Git操作
node git-push.js                    # 自动提交推送

# Vercel部署
node deploy-to-vercel.js            # 自动化部署

# 组合使用
node git-push.js && node deploy-to-vercel.js  # 一键推送并部署
```

---

💡 **提示：** 首次使用这些脚本时，建议在测试项目中先试用，熟悉流程后再用于生产项目。
