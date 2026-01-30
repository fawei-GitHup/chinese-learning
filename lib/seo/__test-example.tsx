/**
 * 此文件仅供测试和参考，不是实际页面
 * 演示如何在Next.js页面中使用SEO工具库
 */

import type { Metadata } from 'next';
import {
  generateBreadcrumb,
  generateArticle,
  generateDefinedTerm,
  generateDetailMetadata,
  renderJsonLd,
} from './index';

// ============ Metadata生成示例 ============
export async function generateMetadata(): Promise<Metadata> {
  return generateDetailMetadata({
    title: '血压 (xuèyā) - 医疗词汇',
    description: '血压是指血液在血管内流动时对血管壁产生的压力。了解血压的测量方法和正常范围。',
    path: '/medical/dictionary/blood-pressure',
    keywords: ['血压', '医疗词汇', '心血管', '测量'],
    structuredData: [
      generateBreadcrumb([
        { name: '首页', url: '/' },
        { name: '医疗词汇', url: '/medical/vocabulary' },
        { name: '血压', url: '/medical/dictionary/blood-pressure' },
      ]),
      generateDefinedTerm({
        term: '血压',
        definition: '血液在血管内流动时对血管壁产生的压力',
        inDefinedTermSet: '医疗词汇',
      }),
    ],
  });
}

// ============ 页面组件示例 ============
export default function ExamplePage() {
  // 生成面包屑结构化数据
  const breadcrumbData = generateBreadcrumb([
    { name: '首页', url: '/' },
    { name: '医疗词汇', url: '/medical/vocabulary' },
    { name: '血压', url: '/medical/dictionary/blood-pressure' },
  ]);

  // 生成文章结构化数据
  const articleData = generateArticle({
    title: '血压测量指南',
    description: '详细介绍血压的测量方法、正常范围和注意事项',
    url: '/medical/dictionary/blood-pressure',
    datePublished: new Date('2024-01-01'),
    keywords: ['血压', '测量', '医疗'],
  });

  // 生成术语定义结构化数据
  const termData = generateDefinedTerm({
    term: '血压',
    definition: '血液在血管内流动时对血管壁产生的压力',
    inDefinedTermSet: '医疗词汇',
  });

  return (
    <>
      {/* 插入结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(articleData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(termData) }}
      />

      {/* 页面内容 */}
      <article className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">血压 (xuèyā)</h1>
        <p className="text-lg text-gray-600 mb-6">
          血液在血管内流动时对血管壁产生的压力
        </p>

        <div className="prose max-w-none">
          <h2>什么是血压？</h2>
          <p>血压是指血液在血管内流动时对血管壁产生的压力...</p>

          <h2>如何测量血压？</h2>
          <p>测量血压需要使用血压计...</p>

          <h2>正常血压范围</h2>
          <p>成年人正常血压范围是...</p>
        </div>
      </article>
    </>
  );
}

// ============ 使用说明 ============
/*
1. 将此示例代码应用到实际页面时：
   - 复制 generateMetadata 函数到页面文件顶部
   - 在页面组件中生成所需的结构化数据
   - 使用 <script type="application/ld+json"> 插入到页面

2. 推荐的结构化数据组合：
   - 列表页: Breadcrumb + FAQ（如有）
   - 详情页: Breadcrumb + Article + DefinedTerm
   - 场景页: Breadcrumb + HowTo
   - 首页: Organization + WebSite

3. 验证步骤：
   - 打开浏览器开发者工具
   - 查看页面源代码中的 <script type="application/ld+json">
   - 使用 Google Rich Results Test 验证
   - 检查 <meta> 标签是否正确生成

4. 注意事项：
   - 确保 NEXT_PUBLIC_SITE_URL 环境变量已设置
   - 所有URL使用相对路径
   - 文本内容需要清理HTML标签
   - 描述文本建议控制在160字符以内
*/
