# 部署脚本说明

本项目包含自动化部署脚本，简化GitHub推送和Vercel部署流程。

## 📁 文件列表

| 文件 | 说明 |
|------|------|
| [`git-push.js`](git-push.js) | Git自动提交和推送脚本 |
| [`deploy-to-vercel.js`](deploy-to-vercel.js) | Vercel自动化部署脚本 |
| [`.env.local.example`](.env.local.example) | 环境变量模板文件 |
| [`QUICKSTART-DEPLOYMENT.md`](QUICKSTART-DEPLOYMENT.md) | 5分钟快速部署指南 ⭐️ |
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | 完整部署文档 |

## 🚀 快速开始

### 最快部署方式

```bash
# 1. 配置环境变量
cp .env.local.example .env.local
# 编辑 .env.local 填写真实凭据

# 2. 一键部署
npm run deploy:full
```

就这么简单！

## 💻 可用命令

```bash
# Git操作
npm run git:push      # 自动提交并推送到GitHub
node git-push.js      # 同上（直接运行）

# Vercel部署
npm run deploy        # 自动化部署到Vercel
node deploy-to-vercel.js  # 同上（直接运行）

# 完整流程
npm run deploy:full   # Git推送 + Vercel部署
```

## 📖 文档链接

- **新手必读**: [快速部署指南](QUICKSTART-DEPLOYMENT.md) - 5分钟上手
- **详细文档**: [完整部署文档](DEPLOYMENT.md) - 深入了解

## ✨ 特性

### git-push.js
- ✅ 自动检测Git状态
- ✅ 交互式提交消息
- ✅ 智能处理首次推送
- ✅ 自动设置上游分支
- ✅ 彩色日志输出

### deploy-to-vercel.js
- ✅ Playwright自动化
- ✅ 自动登录Vercel
- ✅ GitHub仓库导入
- ✅ 项目配置
- ✅ 部署进度追踪
- ✅ 错误处理和重试
- ✅ 2FA支持

## 🔧 系统要求

- Node.js 16+
- Git已安装
- Playwright浏览器（自动安装）
- Vercel账号
- GitHub账号和仓库

## 📝 .env.local配置

必需配置：

```env
VERCEL_EMAIL=your-email@example.com
VERCEL_PASSWORD=your-password
```

可选配置：

```env
PROJECT_NAME=my-project
GITHUB_REPO_URL=https://github.com/username/repo
```

## 🎯 使用场景

### 场景1: 日常开发提交

```bash
# 修改代码后
npm run git:push
```

### 场景2: 部署新功能

```bash
# 开发完成，准备部署
npm run build           # 本地测试构建
npm run deploy:full     # 推送并部署
```

### 场景3: 仅更新部署配置

```bash
# 只需要重新部署，不推送代码
npm run deploy
```

## 🔒 安全提示

⚠️ **重要**: `.env.local` 包含敏感信息，已在 `.gitignore` 中排除。

**永远不要**:
- ❌ 提交 `.env.local` 到Git
- ❌ 在公开场合分享凭据
- ❌ 使用弱密码

**建议**:
- ✅ 使用强密码
- ✅ 启用2FA
- ✅ 定期更换密码
- ✅ 使用环境变量管理工具

## 🐛 常见问题

### Q: 脚本执行失败怎么办？

A: 按顺序检查：
1. 是否配置了 `.env.local`
2. 是否安装了Playwright: `npx playwright install chromium`
3. 是否有Git远程仓库
4. 查看错误日志定位问题

### Q: 需要2FA验证码怎么办？

A: 脚本会自动暂停并保持浏览器打开，在浏览器中输入2FA验证码，脚本会继续执行。

### Q: 可以在无头模式运行吗？

A: 可以，编辑 [`deploy-to-vercel.js`](deploy-to-vercel.js)：

```javascript
const browser = await chromium.launch({ 
  headless: true,  // 改为true
  slowMo: 100      // 可以加快速度
});
```

### Q: 如何自定义部署配置？

A: 编辑 [`deploy-to-vercel.js`](deploy-to-vercel.js) 中的相关部分，添加您需要的自定义逻辑。

### Q: Windows下如何直接运行脚本？

A: 使用 Node.js 运行：

```bash
node git-push.js
node deploy-to-vercel.js
```

或使用npm脚本（推荐）：

```bash
npm run git:push
npm run deploy
```

## 🔄 工作流程示意

```
本地开发
   ↓
npm run build (测试构建)
   ↓
npm run git:push (推送代码)
   ↓
npm run deploy (部署到Vercel)
   ↓
验证部署URL
   ↓
✅ 完成
```

## 📦 依赖说明

主要依赖：
- `@playwright/test` - 浏览器自动化
- `child_process` - 执行Git命令
- `fs` - 文件系统操作
- `readline` - 交互式输入

这些都是Node.js内置或已安装的依赖，无需额外安装。

## 🎓 学习资源

- [Playwright文档](https://playwright.dev/)
- [Vercel文档](https://vercel.com/docs)
- [GitHub Git指南](https://docs.github.com/en/get-started)

## 🤝 贡献

发现问题或有改进建议？
1. 查看现有issues
2. 创建新issue描述问题
3. 提交Pull Request

## 📄 许可

这些脚本是项目的一部分，遵循项目许可协议。

---

**快速链接**:
- 📖 [5分钟快速部署](QUICKSTART-DEPLOYMENT.md)
- 📚 [完整部署文档](DEPLOYMENT.md)
- 🔧 [Git推送脚本](git-push.js)
- 🚀 [Vercel部署脚本](deploy-to-vercel.js)

---

💡 **提示**: 首次使用建议先阅读 [快速部署指南](QUICKSTART-DEPLOYMENT.md)。
