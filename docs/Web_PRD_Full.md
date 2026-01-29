# PRD（用户端 Web）全量版：中文学习网站（Learn Chinese Web）

> 适用工程：`learn-chinese-ui-prototype`  
> 目标：把当前 **UI 原型（大量 mock）** 升级为可上线的 **真实可用产品**：能登录、能学、能搜、能复习、能按发布内容展示，并具备 SEO/GEO 与增长闭环。

---

## 0. 定义与原则

### 0.1 关键原则（必须）
1. **发布态是唯一真相源**：Web 只读取 `status='published'` 的内容  
2. **内容契约统一**：Web 不直接依赖 Admin 内部字段；只消费 Supabase 的统一 schema（见第 6 章）
3. **SEO/GEO 不是附录**：所有营销页、内容详情页都必须内置 SEO/GEO（元信息 + 结构化数据 + sitemap + hreflang）
4. **体验优先**：学习路径要“可持续”，SRS 与进度必须可见、可复盘

---

## 1. 目标用户与场景

### 1.1 目标用户
- 初学者：需要基础拼音/词汇/常用句型
- 进阶学习者：需要阅读、语法点、长文理解与复习系统
- 生活/工作场景学习者：尤其是 **医疗中文场景**（问诊/药物/症状等）

### 1.2 核心使用场景
- 场景 A：用户从 Google 搜到“医疗中文短句/词典/对话” → 进入详情页 → 注册/登录 → 保存/加入复习
- 场景 B：用户通过课程学习（lesson）→ 词汇加入 SRS → 每日复习打卡
- 场景 C：用户通过阅读（reader）→ 生词划词查词 → 收藏 → 生成复习卡

---

## 2. 信息架构（IA）与路由（建议）

> 以你当前 Next.js App Router 为基础。

### 2.1 公共/营销区（SEO 重点）
- `/` 首页（价值主张 + 入口）
- `/pricing` 订阅/定价（若启用）
- `/medical` 医疗中文专题入口（SEO/GEO 重点）
- `/medical/phrases` `/medical/vocabulary` `/medical/scenarios` 等专题集合页（可按你现有 marketing 路由）
- `/login` 登录页（noindex）
- `/privacy` `/terms` 合规页

### 2.2 学习区（需登录）
- `/app/dashboard` 学习总览
- `/app/lessons` `/app/lesson/[slug]`
- `/app/reader` `/app/reader/[slug]`
- `/app/grammar` `/app/grammar/[slug]`
- `/app/dictionary` `/app/dictionary/[term]`
- `/app/srs` 复习系统（卡片/队列/统计）
- `/app/medical/*` 医疗学习区（可复用内容但交互不同）
- `/app/profile` 用户设置（语言、学习目标、订阅、导出等）
- `/app/placement` 分级测试（可选，强推荐）

---

## 3. 功能规格（全量）

> 每个模块都按：功能点 / 数据来源 / 关键交互 / 验收 来定义。  
> P0：必须上线；P1：增强体验；P2：增长/高级。

### 3.1 账户与会话（P0）
- OAuth 登录（Google/GitHub）
- 登出、会话保持、受保护路由（学习区）
- 用户 Profile：昵称/头像/语言偏好

**验收**
- 未登录访问学习区跳转 `/login?redirect=...`
- 登录成功后回跳，刷新不丢 session

### 3.2 内容消费：Lesson（P0）
- 列表：筛选（等级/主题/时长/标签）
- 详情：对话/讲解/词汇表/练习（可先简化为阅读 + 词汇）
- 收藏/加入学习计划（P1）
- 练习题（P1）

**数据来源**
- `content_items`（type=lesson）或独立 `lessons` 表（见第 6 章）

### 3.3 内容消费：Reading（P0）
- 列表：等级/话题/长度/标签
- 详情：段落/拼音/英文释义（按你现有 UI）
- 划词查词：弹出词典卡片（P1）
- 重点句收藏（P1）

### 3.4 语法库 Grammar（P0）
- 语法点列表（按 pattern/主题/等级）
- 详情：解释 + 例句 + 常见错误
- 关联：相关词汇/阅读/场景（P1）

### 3.5 词典 Dictionary（P0）
- 搜索：term/pinyin/英文
- 详情：释义、用法、搭配、例句
- 保存到收藏/加入 SRS（P0）

### 3.6 SRS 复习系统（P0）
- 卡片类型：
  - 词汇卡（term/pinyin/meaning）
  - 句子卡（句子/意图/场景）
- 复习队列：今日到期、难度分布
- 操作：认识/模糊/不认识 → 更新间隔
- 统计：连续天数、总复习量、正确率（P1）

**数据来源**
- 用户数据表（`user_srs_cards`, `user_reviews`）+ RLS（见第 6 章）

### 3.7 医疗中文模块（P0，增长核心）
- 专题集合页（SEO）：词汇/问诊场景/对话/语法
- 详情页：结构化信息（FAQ、HowTo、词条 schema）
- 学习区：加入收藏与 SRS（与普通词典/语法复用）

### 3.8 分级测试 Placement（P1，强推荐）
- 简化版：20-30 题（词汇/语法/阅读理解）
- 输出：推荐等级、推荐学习路径（dashboard 显示）

### 3.9 多语言 i18n（P1）
- UI 语言：中文/英文切换（至少营销区）
- 内容语言：`locale` 字段驱动

### 3.10 订阅与会员（P1/P2）
- 免费：部分内容 + 每日复习上限
- 会员：全部内容 + 高级统计 + 导出
- 接入 Stripe（P2，若你确定要做）

### 3.11 分析与增长（P1）
- 事件埋点：注册、登录、开始学习、完成 lesson、加入 SRS、复习完成
- SEO 指标：站点地图、收录、CTR（外部工具）

---

## 4. UI/交互要求（统一规范）
- 统一深色玻璃拟态风格（按你现有）
- 统一组件：
  - 列表页：筛选 + 表格/卡片
  - 详情页：面包屑、标签、目录/锚点、收藏按钮
  - 空状态：明确引导
  - Loading/Error：骨架屏 + 可重试
- 可访问性：按钮可聚焦、表单有 label、对比度合格

---

## 5. SEO / GEO 规格（Web 必须内置）

### 5.1 基础 SEO（P0）
- 每个营销页与内容详情页必须输出：
  - `title`, `description`, `canonical`
  - OG/Twitter card
- 内容详情页必须支持：
  - 结构化数据（JSON-LD）
  - 面包屑 schema（BreadcrumbList）

### 5.2 GEO（P0/P1）
- 城市/地区落地页（如果你要做“广州/北京/上海”类似）：
  - `/city/[city]/medical` 或 `/geo/[country]/[city]/...`
- `geo_json` 驱动内容在不同地区的展示/免责声明（例如医疗内容的合规提示）

### 5.3 sitemap & robots（P0）
- 自动 sitemap：按 `published` 内容生成
- robots.txt：屏蔽 `/login`、学习区可按策略 noindex

### 5.4 hreflang（P1）
- 多语言内容的 hreflang 输出

---

## 6. 数据契约（与 Admin 对齐的关键）

> 你可以用“统一表 content_items”或“分表 lessons/readings/…”两种方案。  
> 建议 A（统一表）更易扩展与统一 SEO/GEO。

### 6.1 方案 A：统一表 `content_items`（推荐）
字段（P0）：
- `id uuid`
- `type text`（lesson/reading/grammar/lexicon/medical_scenario/medical_dialog…）
- `slug text unique`
- `locale text`（en/zh…）
- `status text`（draft/review/published/archived）
- `content_json jsonb`（内容主体）
- `seo_json jsonb`（title/description/faq/schema…）
- `geo_json jsonb`（地区规则/免责声明/城市绑定…）
- `updated_at timestamptz`

Web 读取规则（P0）：
- 列表与详情查询：`status='published' AND locale=currentLocale`

### 6.2 用户数据表（SRS/收藏/进度）
- `user_saved_items`（收藏）
- `user_srs_cards`
- `user_srs_reviews`
- `user_progress`（lesson/reading 完成度）
全部必须开启 RLS，用户只能访问自己的数据。

---

## 7. 质量与发布
- 性能：列表页分页/无限滚动；详情页缓存（Next.js fetch cache 或 SWR）
- 安全：所有用户数据表 RLS；不在前端暴露 service role
- 发布：Vercel/自部署均可；环境变量区分 dev/prod

---

## 8. 里程碑（建议）
- M0（P0）：登录 + published 内容读取（至少 medical lexicon + scenario）+ 收藏 + SRS 基础
- M1（P1）：lesson/reading/grammar 全接入 + sitemap + hreflang + placement
- M2（P2）：会员/付费 + 高级统计 + 运营增长
