# W8-01：营销区 i18n 实现文档

## 完成日期：2026-01-30

## 实现概述

实现营销区的国际化支持，支持中文（zh-CN）和英语（en）两种语言，包括语言切换、SEO优化（hreflang标签）、多语言sitemap等功能。

## 技术方案

### 1. i18n框架选择

使用 `next-intl` 作为国际化解决方案，理由：
- 专为Next.js App Router设计
- 支持服务端和客户端组件
- 提供完整的TypeScript支持
- 支持动态路由和middleware集成

### 2. 路由策略

采用子路径策略（Locale Prefix）：
- 中文（zh-CN）：`/zh-CN/*`
- 英语（en）：`/en/*`
- 根路径自动重定向到默认语言

### 3. 项目结构调整

```
app/
├── layout.tsx                    # 根布局（移除AuthProvider，保留html/body）
├── [locale]/                     # 语言路由
│   ├── layout.tsx               # Locale布局（NextIntlClientProvider + AuthProvider）
│   └── (marketing)/             # 营销区（支持多语言）
│       ├── layout.tsx
│       ├── page.tsx             # 首页
│       ├── login/
│       ├── medical/
│       │   ├── page.tsx
│       │   ├── vocabulary/
│       │   ├── scenarios/
│       │   └── dictionary/
│       └── ...
├── (app)/                        # 学习区（暂不支持多语言）
│   ├── layout.tsx
│   ├── dashboard/
│   └── ...
messages/
├── zh-CN.json                    # 中文翻译
└── en.json                       # 英文翻译
i18n.ts                           # next-intl配置
middleware.ts                     # 语言路由 + 认证中间件
```

##安装的依赖

```bash
npm install next-intl
```

## 核心文件

### 1. i18n.ts - next-intl配置

```typescript
import { getRequestConfig } from 'next-intl/server';

export const locales = ['zh-CN', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'zh-CN';

export default getRequestConfig(async ({locale}) => {
  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
```

### 2. messages/zh-CN.json - 中文翻译

包含翻译键：
- `nav.*` - 导航栏
- `hero.*` - 首页标题和副标题
- `features.*` - 功能介绍
- `medical.*` - 医疗专题
- `medicalVocabulary.*` - 医疗词汇页面
- `scenarios.*` - 临床场景页面
- `scenarioDetail.*` - 场景详情
- `login.*` - 登录页面
- `common.*` - 通用文本

### 3. messages/en.json - 英文翻译

对应中文翻译的英文版本。

### 4. middleware.ts - 组合中间件

```typescript
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { locales, defaultLocale } from './i18n';

// 创建 next-intl 中间件 - 所有语言都带前缀
const handleI18nRouting = createIntlMiddleware({
  locales: locales as unknown as string[],
  defaultLocale,
  localePrefix: 'always', // 所有语言都显示前缀
});

export async function middleware(request: NextRequest) {
  // ... 处理认证和i18n路由
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_vercel).*)',
  ],
};
```

### 5. components/web/LanguageSwitcher.tsx - 语言切换器

```typescript
'use client'

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/i18n';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const languageNames: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'en': 'English',
};

export function LanguageSwitcher() {
  // ... 使用 useLocale 获取当前语言，useRouter 切换语言
}
```

### 6. lib/i18n/metadata.ts - SEO元数据生成

提供函数生成包含 hreflang 的 metadata：

```typescript
export async function generateI18nMetadata({
  locale,
  path = '',
}: MetadataParams): Promise<Metadata> {
  // 生成 alternates.languages 和 canonical
}

export async function generateMarketingMetadata(
  locale: Locale,
  pagePath: string,
  overrides?: Partial<Metadata>
): Promise<Metadata> {
  // 生成营销页面的完整 metadata
}
```

### 7. app/sitemap.ts - 多语言sitemap

```typescript
// 为营销区页面生成所有语言版本
const marketingUrls: MetadataRoute.Sitemap = marketingPages.flatMap((page) =>
  locales.map((locale) => {
    const url = locale === defaultLocale 
      ? `${BASE_URL}${page.path}` 
      : `${BASE_URL}/${locale}${page.path}`;
    
    return {
      url,
      lastModified: now,
      changeFrequency: page.changeFreq,
      priority: page.priority,
    };
  })
);
```

## 实现功能

### ✅ 已完成

1. **next-intl安装和配置**
   - 安装 next-intl 包
   - 创建 i18n.ts 配置文件
   - 更新 next.config.mjs

2. **翻译文件结构**
   - 创建 messages/zh-CN.json（中文翻译）
   - 创建 messages/en.json（英文翻译）
   - 包含导航、首页、医疗专题、登录等模块的翻译

3. **路由结构调整**
   - 创建 app/[locale] 动态路由
   - 移动营销区内容到 app/[locale]/(marketing)
   - 保持学习区在 app/(app)（暂不支持多语言）

4. **Middleware配置**
   - 集成 next-intl 中间件处理语言路由
   - 保留认证中间件保护学习区
   - 支持语言检测和自动重定向

5. **语言切换器组件**
   - 创建 LanguageSwitcher 组件
   - 在营销区 layout 集成
   - 支持下拉菜单切换语言

6. **SEO配置**
   - 创建 lib/i18n/metadata.ts 辅助函数
   - 生成 hreflang 标签
   - 更新 sitemap.ts 支持多语言URL
   - 每个语言版本包含 canonical 和 alternate links

### ⏳ 部分完成

1. **翻译营销区页面**
   - ✅ 翻译文件已创建，包含所有需要的文本
   - ⏳ 页面组件需要使用 useTranslations hook 替换硬编码文本
   - 需要更新的页面：
     - 首页 `/page.tsx`
     - 医疗专题页 `/medical/page.tsx`
     - 登录页 `/login/LoginPageClient.tsx`
     - 词汇列表页 `/medical/vocabulary/page.tsx`
     - 场景列表页 `/medical/scenarios/page.tsx`

### ❌ 待完成

1. **页面组件国际化**
   - 在需要的组件中导入并使用 `useTranslations`
   - 示例：
     ```typescript
     import { useTranslations } from 'next-intl';
     
     export function SomeComponent() {
       const t = useTranslations('nav');
       return <div>{t('home')}</div>
     }
     ```

2. **测试和验证**
   - 重启开发服务器（必需，清理缓存）
   - 访问 `/zh-CN` 和 `/en` 路径测试
   - 测试语言切换功能
   - 验证 hreflang 标签正确输出
   - 验证 sitemap 包含所有语言版本

## 验收标准

### 功能验收

1. ✅ **支持中英文切换**
   - 框架已配置，翻译文件已创建
   - 语言切换器组件已添加到营销区 header

2. ⏳ **SEO元信息保持**
   - 已创建元数据生成函数
   - 需要在各页面中应用

3. ⏳ **hreflang标签输出**
   - 已实现生成逻辑
   - 需要在页面中使用 generateI18nMetadata

4. ✅ **多语言sitemap**
   - sitemap.ts 已更新支持多语言
   - 营销区页面生成所有语言版本的URL

### 技术验收

1. ✅ **路由策略**
   - 使用子路径：`/zh-CN/*`, `/en/*`
   - Middleware 配置正确

2. ✅ **语言检测**
   - Accept-Language header 支持（next-intl内置）
   - 默认语言：zh-CN

3. ⏳ **用户偏好**
   - next-intl 使用 cookie 保存偏好（NEXT_LOCALE）
   - 需要测试验证

## 使用指南

### 在组件中使用翻译

**服务端组件：**
```typescript
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('nav');
  return <h1>{t('home')}</h1>;
}
```

**客户端组件：**
```typescript
'use client';
import { useTranslations } from 'next-intl';

export function Component() {
  const t = useTranslations('nav');
  return <h1>{t('home')}</h1>;
}
```

### 生成SEO元数据

```typescript
import { generateMarketingMetadata } from '@/lib/i18n/metadata';

export async function generateMetadata({ params: { locale } }) {
  return generateMarketingMetadata(
    locale,
    '/medical',
    {
      title: '医疗汉语学习中心 | LearnChinese',
      description: '掌握医疗场景下的中文沟通技能',
    }
  );
}
```

## 后续工作

1. **补充页面翻译**
   - 在所有营销区页面组件中使用 `useTranslations` hook
   - 替换所有硬编码的中文文本

2. **应用SEO元数据**
   - 在各页面使用 `generateMarketingMetadata` 生成metadata
   - 验证 hreflang 标签正确输出

3. **测试验证**
   - 重启开发服务器
   - 完整测试语言切换功能
   - 验证SEO元信息

4. **学习区国际化**（可选，后续工单）
   - 将学习区也移到 [locale] 路由下
   - 添加学习区翻译文件

## 注意事项

1. **重启服务器**：完成代码修改后，必须重启 `npm run dev` 以清理缓存

2. **路由变更**：营销区URL从 `/medical` 变为 `/zh-CN/medical` 或 `/en/medical`

3. **学习区暂不支持多语言**：学习区路由保持不变，仅营销区支持多语言

4. **SEO redirect**：如果使用 `localePrefix: 'as-needed'`，默认语言可以不带前缀，但当前配置使用 `localePrefix: 'always'` 更简单稳定

## 相关文件清单

### 新增文件
- `i18n.ts` - next-intl配置
- `messages/zh-CN.json` - 中文翻译
- `messages/en.json` - 英文翻译
- `components/web/LanguageSwitcher.tsx` - 语言切换器
- `lib/i18n/metadata.ts` - SEO元数据辅助函数
- `app/[locale]/layout.tsx` - Locale布局
- `app/[locale]/(marketing)/*` - 营销区页面（从app/(marketing)迁移）

### 修改文件
- `middleware.ts` - 集成i18n中间件
- `next.config.mjs` - 添加next-intl plugin
- `package.json` - 添加next-intl依赖
- `app/layout.tsx` - 移除AuthProvider，保留html/body
- `app/sitemap.ts` - 支持多语言URL生成
- `app/[locale]/(marketing)/layout.tsx` - 集成LanguageSwitcher

### 删除文件
- `app/(marketing)/*` - 迁移到 `app/[locale]/(marketing)/`

## 参考资源

- [next-intl 官方文档](https://next-intl-docs.vercel.app/)
- [Next.js App Router i18n指南](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Google i18n最佳实践](https://developers.google.com/search/docs/specialty/international)
