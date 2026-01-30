# W10-02 错误场景测试清单

## 测试执行指南

本文档提供了手动测试和自动化测试的详细清单，用于验证应用程序的错误边界处理。

## 快速开始

### 运行自动化测试

```bash
# 运行所有错误处理测试
npm run test:e2e tests/e2e/error-handling.spec.ts

# 运行特定测试集
npm run test:e2e tests/e2e/error-handling.spec.ts -g "医疗词汇页面"

# 以 UI 模式运行（推荐用于调试）
npm run test:e2e:ui tests/e2e/error-handling.spec.ts
```

### 手动测试准备

1. **安装浏览器扩展**（可选）:
   - Chrome DevTools 已内置网络控制
   - Firefox Developer Tools 已内置网络控制

2. **准备测试环境**:
   - 确保本地开发服务器运行：`npm run dev`
   - 准备测试数据库（如需要）

## 手动测试清单

### 场景 1: 断网错误处理

#### 医疗词汇列表 `/medical/vocabulary`

- [ ] **初始加载**
  - [ ] 打开浏览器开发者工具 (F12)
  - [ ] 切换到 Network 标签
  - [ ] 勾选 "Disable cache"
  - [ ] 选择 "Offline" 模式
  - [ ] 访问 `/medical/vocabulary`
  - [ ] ✅ 验证显示 ErrorDisplay 组件
  - [ ] ✅ 验证显示友好错误消息
  - [ ] ✅ 验证显示 "重新尝试" 按钮

- [ ] **重试功能**
  - [ ] 取消 "Offline" 模式
  - [ ] 点击 "重新尝试" 按钮
  - [ ] ✅ 验证页面成功加载内容
  - [ ] ✅ 验证错误消息消失

#### 场景列表 `/medical/scenarios`

- [ ] **断网测试**
  - [ ] 启用 "Offline" 模式
  - [ ] 访问页面
  - [ ] ✅ 验证显示 ErrorDisplay
  - [ ] ✅ 验证重试按钮可用

#### Lessons 列表 `/lessons`

- [ ] **断网测试**
  - [ ] 启用 "Offline" 模式
  - [ ] 访问页面
  - [ ] ✅ 验证显示 ErrorDisplay
  - [ ] ✅ 验证重试按钮可用

#### Grammar 列表 `/grammar`

- [ ] **断网测试**
  - [ ] 启用 "Offline" 模式
  - [ ] 访问页面
  - [ ] ✅ 验证显示错误或缓存内容

#### Dashboard `/dashboard`

- [ ] **断网测试**（需要登录）
  - [ ] 启用 "Offline" 模式
  - [ ] 访问页面
  - [ ] ✅ 验证显示错误处理

#### SRS `/srs`

- [ ] **断网测试**（需要登录）
  - [ ] 启用 "Offline" 模式
  - [ ] 访问页面
  - [ ] ✅ 验证显示错误处理

#### Search `/search`

- [ ] **断网搜索**
  - [ ] 访问搜索页面
  - [ ] 启用 "Offline" 模式
  - [ ] 执行搜索
  - [ ] ✅ 验证显示网络错误

### 场景 2: 空数据处理

#### 医疗词汇列表 `/medical/vocabulary`

- [ ] **无搜索结果**
  - [ ] 访问 `/medical/vocabulary?q=nonexistentterm12345xyz`
  - [ ] ✅ 验证显示 EmptyState 组件
  - [ ] ✅ 验证显示 "No results for..." 消息
  - [ ] ✅ 验证显示 "Clear search" 按钮
  - [ ] 点击 "Clear search"
  - [ ] ✅ 验证搜索被清除，显示全部内容

- [ ] **数据库无数据**（仅测试环境）
  - [ ] 清空 medical_terms 表
  - [ ] 访问 `/medical/vocabulary`
  - [ ] ✅ 验证显示 "No medical terms found"
  - [ ] ✅ 验证显示适当的描述信息

#### 场景列表 `/medical/scenarios`

- [ ] **分类无数据**
  - [ ] 访问页面
  - [ ] 点击不同的分类按钮
  - [ ] ✅ 验证空分类显示 EmptyState
  - [ ] ✅ 验证显示 "View all scenarios" 按钮

#### Lessons 列表 `/lessons`

- [ ] **无搜索结果**
  - [ ] 在搜索框输入 "nonexistentlesson12345xyz"
  - [ ] ✅ 验证显示 EmptyState
  - [ ] ✅ 验证显示适当的空状态消息

- [ ] **级别过滤无结果**
  - [ ] 选择不同的 HSK 级别
  - [ ] ✅ 验证空级别显示 EmptyState
  - [ ] ✅ 验证显示 "View all lessons" 按钮

#### Grammar 列表 `/grammar`

- [ ] **无数据**
  - [ ] 访问页面
  - [ ] ✅ 验证空数据时显示 EmptyState

#### SRS `/srs`

- [ ] **无复习卡片**（需要登录）
  - [ ] 访问页面
  - [ ] ✅ 验证无卡片时显示 EmptyState
  - [ ] ✅ 验证显示添加卡片的提示

#### Search `/search`

- [ ] **无搜索结果**
  - [ ] 搜索 "nonexistentsearchterm12345xyz"
  - [ ] ✅ 验证显示 "No results" EmptyState
  - [ ] ✅ 验证显示搜索建议

### 场景 3: 内容被下架处理

#### 医疗词汇详情 `/medical/dictionary/[word]`

- [ ] **访问未发布内容**
  - [ ] 在数据库中将某个词条的 status 设为 'draft'
  - [ ] 尝试通过 URL 访问该词条
  - [ ] ✅ 验证显示 404 或 "内容不可用" 消息
  - [ ] ✅ 验证不显示敏感信息

- [ ] **列表中过滤**
  - [ ] 在列表页面查看
  - [ ] ✅ 验证未发布内容不出现在列表中

#### 场景详情 `/medical/scenarios/[id]`

- [ ] **访问未发布场景**
  - [ ] 将场景 status 设为 'archived'
  - [ ] 尝试访问
  - [ ] ✅ 验证显示 404 或友好提示

#### Lesson 详情 `/lesson/[id]`

- [ ] **访问未发布课程**
  - [ ] 将课程 status 设为 'draft'
  - [ ] 尝试访问
  - [ ] ✅ 验证显示适当的错误消息

#### Reading 详情 `/reader/[id]`

- [ ] **访问未发布阅读**
  - [ ] 将阅读 status 设为 'archived'
  - [ ] 尝试访问
  - [ ] ✅ 验证显示 404 或友好提示

#### Grammar 详情 `/grammar/[pattern]`

- [ ] **访问未发布语法**
  - [ ] 将语法点 status 设为 'draft'
  - [ ] 尝试访问
  - [ ] ✅ 验证显示适当的错误消息

### 场景 4: 加载状态

#### 通用加载测试

- [ ] **网络限速**
  - [ ] 打开 Chrome DevTools
  - [ ] Network 标签选择 "Slow 3G"
  - [ ] 访问各个页面

#### 医疗词汇列表 `/medical/vocabulary`

- [ ] **骨架屏显示**
  - [ ] 启用 "Slow 3G"
  - [ ] 访问页面
  - [ ] ✅ 验证在加载期间显示 SkeletonList
  - [ ] ✅ 验证骨架屏数量适当（12个）
  - [ ] ✅ 验证骨架屏布局与实际内容一致
  - [ ] ✅ 验证加载完成后平滑过渡

#### 场景列表 `/medical/scenarios`

- [ ] **骨架屏显示**
  - [ ] 启用 "Slow 3G"
  - [ ] 访问页面
  - [ ] ⚠️ 当前使用简单的 animate-pulse
  - [ ] 📝 建议：改用 SkeletonCard 组件

#### Lessons 列表 `/lessons`

- [ ] **骨架屏显示**
  - [ ] 启用 "Slow 3G"
  - [ ] 访问页面
  - [ ] ⚠️ 当前使用简单的 animate-pulse
  - [ ] 📝 建议：改用 SkeletonCard 组件

#### 详情页面

- [ ] **加载状态**
  - [ ] 启用 "Slow 3G"
  - [ ] 访问任意详情页面
  - [ ] ✅ 验证显示 loading.tsx 或 SkeletonDetail
  - [ ] ✅ 验证布局不跳动

## 自动化测试验证清单

### 运行测试并记录结果

```bash
# 生成测试报告
npm run test:e2e tests/e2e/error-handling.spec.ts -- --reporter=html
```

### 测试覆盖率检查

- [ ] **医疗词汇页面**
  - [ ] ✅ 断网测试通过
  - [ ] ✅ 空数据测试通过
  - [ ] ✅ 加载状态测试通过
  - [ ] ⚠️ 404 测试通过

- [ ] **场景页面**
  - [ ] ✅ 断网测试通过
  - [ ] ✅ 空数据测试通过
  - [ ] ✅ 加载状态测试通过

- [ ] **Lessons 页面**
  - [ ] ✅ 断网测试通过
  - [ ] ✅ 空数据测试通过
  - [ ] ✅ 加载状态测试通过

- [ ] **Grammar 页面**
  - [ ] ⚠️ 断网测试通过
  - [ ] ⚠️ 404 测试通过

- [ ] **Dashboard**
  - [ ] ⚠️ 断网测试（需登录）
  - [ ] ⚠️ 加载状态测试

- [ ] **SRS**
  - [ ] ⚠️ 断网测试（需登录）
  - [ ] ⚠️ 空数据测试

- [ ] **Search**
  - [ ] ⚠️ 空结果测试
  - [ ] ⚠️ 断网测试

- [ ] **Reading**
  - [ ] ⚠️ 404 测试
  - [ ] ⚠️ 断网测试

## 已知问题和改进建议

### 高优先级 (P0)

1. **部分页面缺少 ErrorDisplay 实现**
   - 详情页面（医疗词汇、场景、课程等）需要添加错误处理
   - Grammar、Dashboard、SRS、Search 页面需要完善错误处理

2. **status 过滤未实现**
   - 需要在 API/数据库层添加 status 过滤
   - 详情页面需要验证 status 字段

### 中优先级 (P1)

3. **骨架屏优化**
   - 场景列表应使用 SkeletonCard 替代 animate-pulse
   - Lessons 列表应使用 SkeletonCard 替代 animate-pulse
   - 详情页面应使用 SkeletonDetail

4. **错误消息优化**
   - 根据错误类型显示不同消息
   - 提供更具体的解决建议

### 低优先级 (P2)

5. **离线体验优化**
   - 考虑使用 Service Worker
   - 缓存关键静态资源

6. **性能优化**
   - 使用 React.Suspense
   - 实现 Error Boundary 组件

## 验收标准

### 必须满足 (P0)

- [x] ErrorDisplay 组件已实现并可用
- [x] EmptyState 组件已实现并可用
- [x] SkeletonCard/SkeletonList 组件已实现并可用
- [x] 至少 3 个主要列表页面完整实现错误处理（词汇、场景、课程）
- [ ] 自动化测试覆盖主要错误场景
- [ ] 所有测试通过率 > 80%

### 应该满足 (P1)

- [ ] 所有列表页面实现完整错误处理
- [ ] 所有详情页面实现 status 验证
- [ ] 统一的骨架屏使用
- [ ] 测试通过率 > 90%

### 可以满足 (P2)

- [ ] 离线体验优化
- [ ] React Error Boundary
- [ ] 测试通过率 = 100%

## 测试执行记录

### 执行日期: ___________

### 执行人: ___________

### 测试环境:
- 浏览器: ___________
- 操作系统: ___________
- Node 版本: ___________

### 测试结果汇总:

| 测试类型 | 通过 | 失败 | 跳过 | 通过率 |
|---------|------|------|------|-------|
| 断网测试 |      |      |      |       |
| 空数据测试 |    |      |      |       |
| 下架测试 |      |      |      |       |
| 加载测试 |      |      |      |       |
| **总计** |      |      |      |       |

### 注意事项:
1. 某些测试需要登录状态（Dashboard、SRS）
2. 某些测试需要修改数据库（status 测试）
3. 建议在测试环境而非生产环境执行

### 测试截图:
（可选）附加关键测试场景的截图

---

## 下一步行动

完成测试后：

1. [ ] 更新 [`docs/project-status.md`](../docs/project-status.md) 标记 W10-02 完成
2. [ ] 创建 issues 跟踪发现的问题
3. [ ] 开始执行 W10-03：性能监控整合
4. [ ] 将测试脚本整合到 CI/CD 流程

## 相关文档

- [错误边界测试文档](./W10-02-error-boundary-test.md)
- [Playwright 测试脚本](../tests/e2e/error-handling.spec.ts)
- [项目状态](./project-status.md)
