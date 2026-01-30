# W9-03 结构化数据工具函数使用指南

## 📋 工单信息

- **工单编号**: W9-03
- **优先级**: P0
- **目标**: 统一生成 JSON-LD（FAQ/Breadcrumb/Article/DefinedTerm）
- **验收标准**: 多个详情页复用同一函数

## 🎯 功能概述

本工具库提供了完整的SEO结构化数据生成方案，包括：

1. **JSON-LD结构化数据生成** - 符合Schema.org标准
2. **Next.js Metadata生成** - 统一的metadata对象
3. **辅助工具函数** - 文本清理、URL构建等

## 📦 安装与导入

```typescript
// 导入所有功能
import {
  // JSON-LD生成函数
  generateBreadcrumb,
  generateArticle,
  generateFAQ,
  generateDefinedTerm,
  generateHowTo,
  generateOrganization,
  generateWebSite,
  
  // Metadata生成函数
  generatePageMetadata,
  generateDetailMetadata,
  generateListMetadata,
  
  // 工具函数
  sanitizeText,
  truncate,
  buildUrl,
  
  // 类型定义
  type BreadcrumbItem,
  type ArticleStructuredData,
  type FAQItem,
  type DefinedTermData,
} from '@/lib/seo';
```

## 🚀 快速开始

### 1. 面包屑导航（Breadcrumb）

**优先级：高** | 适用于：所有详情页

```typescript
// app/(marketing)/medical/dictionary/[word]/page.tsx
import { generateBreadcrumb, renderJsonLd } from '@/lib/seo';

export default function MedicalTermPage({ params }: { params: { word: string } }) {
  const breadcrumbData = generateBreadcrumb([
    { name: '首页', url: '/' },
    { name: '医疗中文', url: '/medical' },
    { name: '词汇表', url: '/medical/dictionary' },
    { name: params.word, url: `/medical/dictionary/${params.word}` }
  ]);

  return (
    <>
      {/* 在head中插入JSON-LD */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbData) }}
      />
      
      {/* 页面内容 */}
      <div>...</div>
    </>
  );
}
```

### 2. 文章/课程（Article）

**优先级：高** | 适用于：课程页、阅读页、医疗文章

```typescript
// app/(app)/lesson/[id]/page.tsx
import { generateArticle, renderJsonLd } from '@/lib/seo';

export default async function LessonPage({ params }: { params: { id: string } }) {
  const lesson = await getLesson(params.id);
  
  const articleData = generateArticle({
    title: lesson.title,
    description: lesson.description,
    url: `/lesson/${params.id}`,
    imageUrl: lesson.coverImage,
    datePublished: lesson.createdAt,
    dateModified: lesson.updatedAt,
    keywords: lesson.tags,
  });

  return (
    <>
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(articleData) }}
      />
      
      <article>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
        {/* 课程内容 */}
      </article>
    </>
  );
}
```

### 3. FAQ问答（FAQ）

**优先级：高** | 适用于：FAQ页面、帮助中心

```typescript
// app/(marketing)/faq/page.tsx
import { generateFAQ, renderJsonLd } from '@/lib/seo';

export default function FAQPage() {
  const faqData = generateFAQ([
    {
      question: '如何开始学习医学中文？',
      answer: '建议从基础医疗词汇开始，然后逐步学习常见场景对话。我们的HSK课程也能帮助你打好中文基础。'
    },
    {
      question: 'HSK考试有几个级别？',
      answer: 'HSK考试分为6个级别，从HSK 1（最基础）到HSK 6（最高级）。医学专业人员建议至少达到HSK 4级别。'
    },
    {
      question: '平台是否提供医疗场景对话练习？',
      answer: '是的，我们提供多种医疗场景对话，包括挂号、问诊、检查、处方等常见场景。'
    }
  ]);

  return (
    <>
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(faqData) }}
      />
      
      <div>
        <h1>常见问题</h1>
        {/* FAQ内容展示 */}
      </div>
    </>
  );
}
```

### 4. 词汇定义（DefinedTerm）

**优先级：高** | 适用于：医疗词汇页、语法点页

```typescript
// app/(marketing)/medical/dictionary/[word]/page.tsx
import { generateDefinedTerm, renderJsonLd } from '@/lib/seo';

export default async function MedicalTermDetailPage({ 
  params 
}: { 
  params: { word: string } 
}) {
  const word = await getMedicalTerm(params.word);
  
  const termData = generateDefinedTerm({
    term: word.chinese,
    definition: word.definition,
    inDefinedTermSet: '医疗词汇',
    termCode: word.id // 可选的编码
  });

  return (
    <>
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(termData) }}
      />
      
      <div>
        <h1>{word.chinese}</h1>
        <p className="pinyin">{word.pinyin}</p>
        <p className="definition">{word.definition}</p>
      </div>
    </>
  );
}
```

### 5. 操作步骤（HowTo）

**优先级：中** | 适用于：场景对话步骤、教程

```typescript
// app/(marketing)/medical/scenarios/[id]/page.tsx
import { generateHowTo, renderJsonLd } from '@/lib/seo';

export default async function ScenarioDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const scenario = await getScenario(params.id);
  
  const howToData = generateHowTo({
    name: scenario.title,
    description: scenario.description,
    totalTime: 'PT15M', // ISO 8601格式：15分钟
    steps: scenario.dialogues.map((dialogue, index) => ({
      name: `步骤 ${index + 1}`,
      text: `${dialogue.speaker}: ${dialogue.chinese}`,
      url: `/medical/scenarios/${params.id}#step-${index + 1}`
    }))
  });

  return (
    <>
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(howToData) }}
      />
      
      <div>
        <h1>{scenario.title}</h1>
        {/* 步骤内容 */}
      </div>
    </>
  );
}
```

### 6. 组合使用多个JSON-LD

```typescript
import { 
  generateBreadcrumb, 
  generateArticle, 
  generateDefinedTerm,
  renderMultipleJsonLd 
} from '@/lib/seo';

export default function DetailPage({ params }: { params: { word: string } }) {
  const word = getMedicalTerm(params.word);
  
  // 生成多个结构化数据
  const breadcrumb = generateBreadcrumb([...]);
  const article = generateArticle({...});
  const term = generateDefinedTerm({...});
  
  // 合并渲染
  const allStructuredData = renderMultipleJsonLd([
    breadcrumb,
    article,
    term
  ]);

  return (
    <>
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: allStructuredData }}
      />
      
      {/* 页面内容 */}
    </>
  );
}
```

## 🎨 Metadata生成

### 基础使用

```typescript
// app/(marketing)/medical/vocabulary/page.tsx
import type { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: '医疗词汇大全',
    description: '涵盖常用医疗术语、症状、诊断、治疗等专业词汇，帮助医护人员快速掌握医学中文。',
    path: '/medical/vocabulary',
    keywords: ['医疗词汇', '医学术语', '中文医学', '医学中文'],
  });
}

export default function VocabularyPage() {
  return <div>词汇列表</div>;
}
```

### 详情页Metadata（带结构化数据）

```typescript
// app/(marketing)/medical/dictionary/[word]/page.tsx
import type { Metadata } from 'next';
import { 
  generateDetailMetadata, 
  generateDefinedTerm, 
  generateBreadcrumb 
} from '@/lib/seo';

export async function generateMetadata({ 
  params 
}: { 
  params: { word: string } 
}): Promise<Metadata> {
  const word = await getMedicalTerm(params.word);
  
  return generateDetailMetadata({
    title: word.chinese,
    description: `${word.pinyin} - ${word.definition}`,
    path: `/medical/dictionary/${params.word}`,
    imageUrl: word.imageUrl,
    keywords: [word.category, word.pinyin, '医疗词汇'],
    structuredData: [
      generateBreadcrumb([
        { name: '首页', url: '/' },
        { name: '医疗词汇', url: '/medical/vocabulary' },
        { name: word.chinese, url: `/medical/dictionary/${params.word}` }
      ]),
      generateDefinedTerm({
        term: word.chinese,
        definition: word.definition,
        inDefinedTermSet: '医疗词汇'
      })
    ]
  });
}

export default function MedicalTermPage({ params }: { params: { word: string } }) {
  // 页面组件内容...
  return <div>...</div>;
}
```

### 列表页Metadata

```typescript
// app/(app)/lessons/page.tsx
import type { Metadata } from 'next';
import { generateListMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generateListMetadata({
    title: 'HSK课程',
    description: '完整的HSK 1-6级课程体系，系统化学习中文，为医学专业打下坚实基础。',
    path: '/lessons',
    keywords: ['HSK课程', '中文课程', '在线学习', 'HSK 1-6'],
  });
}
```

### 首页Metadata

```typescript
// app/(marketing)/page.tsx
import type { Metadata } from 'next';
import { 
  generateHomeMetadata, 
  generateOrganization, 
  generateWebSite 
} from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return {
    ...generateHomeMetadata(),
    // 可以添加额外的结构化数据
    other: {
      'application/ld+json': JSON.stringify([
        generateOrganization({
          name: '医学中文学习平台',
          url: 'https://learnchinesemedical.com',
          logo: '/logo.png',
          description: '专业的医学中文在线学习平台'
        }),
        generateWebSite({
          name: '医学中文学习平台',
          url: 'https://learnchinesemedical.com',
          description: '提供HSK课程、医疗词汇、场景对话等全面学习资源',
          searchUrl: '/search?q={search_term_string}'
        })
      ])
    }
  };
}
```

## 🛠️ 工具函数

### 文本清理

```typescript
import { sanitizeText } from '@/lib/seo';

const dirty = '<p>血压 <strong>测量</strong></p>';
const clean = sanitizeText(dirty); // "血压 测量"
```

### 文本截断

```typescript
import { truncate } from '@/lib/seo';

const long = '这是一段很长的描述文本...';
const short = truncate(long, 50); // 限制50个字符
```

### URL构建

```typescript
import { buildUrl } from '@/lib/seo';

// 自动从环境变量读取baseUrl
const url1 = buildUrl('/medical/vocabulary'); 
// => "https://learnchinesemedical.com/medical/vocabulary"

// 自定义baseUrl
const url2 = buildUrl('/medical/vocabulary', 'https://example.com');
// => "https://example.com/medical/vocabulary"
```

### 日期格式化

```typescript
import { formatDate } from '@/lib/seo';

const date = new Date('2024-01-01');
const iso = formatDate(date); // "2024-01-01T00:00:00.000Z"
```

## 📊 验收示例

### 验收步骤1：检查生成的JSON-LD

1. 打开浏览器开发者工具
2. 访问任意详情页（如 `/medical/dictionary/血压`）
3. 在Elements标签中查找 `<script type="application/ld+json">`
4. 验证JSON格式正确且包含必要字段

### 验收步骤2：使用Google富媒体测试工具

1. 访问 [Google Rich Results Test](https://search.google.com/test/rich-results)
2. 输入页面URL
3. 验证结构化数据是否正确识别
4. 查看预览效果

### 验收步骤3：验证Metadata

```bash
# 在浏览器中查看源代码（右键 → 查看网页源代码）
# 查找以下标签：
<meta name="description" content="...">
<meta property="og:title" content="...">
<meta property="og:description" content="...">
<meta name="twitter:card" content="...">
<link rel="canonical" href="...">
```

### 验收步骤4：检查TypeScript类型

```bash
# 在VSCode中测试代码提示
import { generateBreadcrumb } from '@/lib/seo';

// 应该有完整的类型提示
const data = generateBreadcrumb([
  // 输入时应该提示 name 和 url 字段
]);
```

## 📝 最佳实践

### 1. 始终提供面包屑导航

所有详情页都应该包含面包屑结构化数据，帮助搜索引擎理解页面层级。

### 2. 关键词选择

- 选择3-5个最相关的关键词
- 包含主要术语和变体
- 避免关键词堆砌

### 3. 描述文本

- 长度控制在150-160个字符
- 包含主要关键词
- 清晰描述页面内容

### 4. 结构化数据组合

推荐的组合方案：
- **列表页**: Breadcrumb + FAQ（如有）
- **详情页**: Breadcrumb + Article + DefinedTerm
- **场景页**: Breadcrumb + HowTo
- **首页**: Organization + WebSite

### 5. 环境变量配置

在 `.env.local` 中配置：

```env
NEXT_PUBLIC_SITE_URL=https://learnchinesemedical.com
```

## 🔍 调试技巧

### 1. 验证JSON-LD格式

```typescript
// 开发环境下打印生成的数据
if (process.env.NODE_ENV === 'development') {
  console.log('Structured Data:', JSON.stringify(breadcrumbData, null, 2));
}
```

### 2. Schema.org验证器

使用在线工具验证：
- [Schema.org Validator](https://validator.schema.org/)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

### 3. 检查控制台错误

```typescript
// 使用try-catch包裹数据生成
try {
  const data = generateArticle(articleData);
  console.log('✅ Article structured data generated');
} catch (error) {
  console.error('❌ Failed to generate structured data:', error);
}
```

## 🎯 下一步工作

1. **应用到现有页面**：
   - ✅ 医疗词汇详情页
   - ✅ 场景对话详情页
   - ✅ 课程详情页
   - ✅ 语法点详情页

2. **监控效果**：
   - 使用Google Search Console监控富媒体结果
   - 跟踪搜索展示和点击率

3. **持续优化**：
   - 根据搜索表现调整关键词
   - 优化描述文本
   - 补充更多结构化数据类型

## 📚 参考资源

- [Schema.org Documentation](https://schema.org/)
- [Google Search Central - Structured Data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)

## 💡 常见问题

### Q: 为什么我的结构化数据没有在搜索结果中显示？

A: Google需要时间索引和验证结构化数据。通常需要几天到几周时间。确保：
- JSON-LD格式正确
- 页面已被Google索引
- 结构化数据符合Google指南

### Q: 可以在一个页面使用多个Article结构化数据吗？

A: 不推荐。每个页面应该有一个主要的Article。如果有多篇文章，考虑使用列表页。

### Q: DefinedTerm适合所有词汇页面吗？

A: 是的，DefinedTerm特别适合词汇、术语、概念定义等内容。

### Q: 如何测试本地环境的结构化数据？

A: 使用相对路径生成JSON-LD，然后在上线前使用staging环境测试。或使用[Schema Markup Validator](https://validator.schema.org/)直接粘贴HTML代码测试。

---

**工单状态**: ✅ 已完成  
**创建时间**: 2026-01-29  
**最后更新**: 2026-01-29
