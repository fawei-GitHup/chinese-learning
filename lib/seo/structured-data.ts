/**
 * JSON-LD结构化数据生成函数
 * 遵循Schema.org标准
 */

import {
  BreadcrumbItem,
  ArticleStructuredData,
  FAQItem,
  DefinedTermData,
  HowToData,
  OrganizationData,
  WebSiteData,
} from './types';
import { sanitizeText, truncate, buildUrl, formatDate } from './utils';

/**
 * 生成Breadcrumb结构化数据
 * 优先级：高
 * @param items - 面包屑导航项列表
 * @returns Schema.org BreadcrumbList JSON-LD对象
 * 
 * @example
 * const breadcrumb = generateBreadcrumb([
 *   { name: '首页', url: '/' },
 *   { name: '医疗中文', url: '/medical' },
 *   { name: '词汇表', url: '/medical/vocabulary' }
 * ]);
 */
export function generateBreadcrumb(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: sanitizeText(item.name),
      item: buildUrl(item.url),
    })),
  };
}

/**
 * 生成Article结构化数据
 * 优先级：高
 * 适用于：课程、阅读内容、医疗文章
 * @param data - 文章数据
 * @returns Schema.org Article JSON-LD对象
 * 
 * @example
 * const article = generateArticle({
 *   title: 'HSK 4级词汇学习指南',
 *   description: '全面的HSK 4级词汇学习资源...',
 *   url: '/lessons/hsk4-vocab',
 *   datePublished: new Date('2024-01-01'),
 *   keywords: ['HSK4', '词汇', '学习']
 * });
 */
export function generateArticle(data: ArticleStructuredData): object {
  const {
    title,
    description,
    url,
    imageUrl,
    datePublished,
    dateModified,
    authorName,
    keywords,
  } = data;

  const article: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: sanitizeText(title),
    description: truncate(sanitizeText(description), 200),
    url: buildUrl(url),
    datePublished: formatDate(datePublished),
    dateModified: dateModified 
      ? formatDate(dateModified) 
      : formatDate(datePublished),
    author: {
      '@type': 'Person',
      name: authorName || '医学中文学习平台',
    },
    publisher: {
      '@type': 'Organization',
      name: '医学中文学习平台',
      logo: {
        '@type': 'ImageObject',
        url: buildUrl('/logo.png'),
      },
    },
  };

  // 可选字段
  if (imageUrl) {
    article.image = buildUrl(imageUrl);
  }

  if (keywords && keywords.length > 0) {
    article.keywords = keywords.join(', ');
  }

  return article;
}

/**
 * 生成FAQ结构化数据
 * 优先级：高
 * @param items - FAQ问答项列表
 * @returns Schema.org FAQPage JSON-LD对象
 * 
 * @example
 * const faq = generateFAQ([
 *   { 
 *     question: '如何开始学习医学中文？', 
 *     answer: '建议从基础医疗词汇开始...' 
 *   },
 *   { 
 *     question: 'HSK考试难吗？', 
 *     answer: 'HSK考试分为6个级别...' 
 *   }
 * ]);
 */
export function generateFAQ(items: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: sanitizeText(item.question),
      acceptedAnswer: {
        '@type': 'Answer',
        text: sanitizeText(item.answer),
      },
    })),
  };
}

/**
 * 生成DefinedTerm结构化数据
 * 优先级：高
 * 适用于：医疗词汇、语法点定义
 * @param data - 术语定义数据
 * @returns Schema.org DefinedTerm JSON-LD对象
 * 
 * @example
 * const term = generateDefinedTerm({
 *   term: '血压',
 *   definition: '血液在血管内流动时对血管壁产生的压力',
 *   inDefinedTermSet: '医疗词汇',
 *   termCode: 'MED-001'
 * });
 */
export function generateDefinedTerm(data: DefinedTermData): object {
  const { term, definition, inDefinedTermSet, termCode } = data;

  const definedTerm: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: sanitizeText(term),
    description: sanitizeText(definition),
  };

  // 可选字段
  if (inDefinedTermSet) {
    definedTerm.inDefinedTermSet = inDefinedTermSet;
  }

  if (termCode) {
    definedTerm.termCode = termCode;
  }

  return definedTerm;
}

/**
 * 生成HowTo结构化数据
 * 优先级：中
 * 适用于：场景对话步骤、操作教程
 * @param data - HowTo数据
 * @returns Schema.org HowTo JSON-LD对象
 * 
 * @example
 * const howTo = generateHowTo({
 *   name: '如何在医院挂号',
 *   description: '详细的医院挂号流程说明',
 *   totalTime: 'PT15M',
 *   steps: [
 *     { name: '第一步', text: '找到挂号窗口' },
 *     { name: '第二步', text: '提供身份证件' },
 *     { name: '第三步', text: '选择科室和医生' }
 *   ]
 * });
 */
export function generateHowTo(data: HowToData): object {
  const { name, description, steps, totalTime } = data;

  const howTo: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: sanitizeText(name),
    description: sanitizeText(description),
    step: steps.map((step, index) => {
      const howToStep: Record<string, any> = {
        '@type': 'HowToStep',
        position: index + 1,
        name: sanitizeText(step.name),
        text: sanitizeText(step.text),
      };

      // 可选字段
      if (step.url) {
        howToStep.url = buildUrl(step.url);
      }

      if (step.image) {
        howToStep.image = buildUrl(step.image);
      }

      return howToStep;
    }),
  };

  // 可选字段
  if (totalTime) {
    howTo.totalTime = totalTime;
  }

  return howTo;
}

/**
 * 生成Organization结构化数据
 * 优先级：低
 * 适用于：首页组织信息
 * @param data - 组织数据
 * @returns Schema.org Organization JSON-LD对象
 * 
 * @example
 * const org = generateOrganization({
 *   name: '医学中文学习平台',
 *   url: 'https://learnchinesemedical.com',
 *   logo: '/logo.png',
 *   description: '专业的医学中文学习平台',
 *   sameAs: [
 *     'https://twitter.com/example',
 *     'https://facebook.com/example'
 *   ]
 * });
 */
export function generateOrganization(data: OrganizationData): object {
  const { name, url, logo, description, sameAs } = data;

  const organization: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: sanitizeText(name),
    url: buildUrl(url),
  };

  // 可选字段
  if (logo) {
    organization.logo = {
      '@type': 'ImageObject',
      url: buildUrl(logo),
    };
  }

  if (description) {
    organization.description = sanitizeText(description);
  }

  if (sameAs && sameAs.length > 0) {
    organization.sameAs = sameAs;
  }

  return organization;
}

/**
 * 生成WebSite结构化数据
 * 优先级：低
 * 适用于：首页网站信息
 * @param data - 网站数据
 * @returns Schema.org WebSite JSON-LD对象
 * 
 * @example
 * const website = generateWebSite({
 *   name: '医学中文学习平台',
 *   url: 'https://learnchinesemedical.com',
 *   description: '专业的医学中文在线学习平台',
 *   searchUrl: '/search?q={search_term_string}'
 * });
 */
export function generateWebSite(data: WebSiteData): object {
  const { name, url, description, searchUrl } = data;

  const website: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: sanitizeText(name),
    url: buildUrl(url),
  };

  // 可选字段
  if (description) {
    website.description = sanitizeText(description);
  }

  if (searchUrl) {
    website.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: buildUrl(searchUrl),
      },
      'query-input': 'required name=search_term_string',
    };
  }

  return website;
}

/**
 * 将JSON-LD对象转换为script标签字符串
 * 可直接在React组件中使用dangerouslySetInnerHTML
 * @param jsonLd - JSON-LD对象
 * @returns JSON字符串
 * 
 * @example
 * <script 
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumb) }}
 * />
 */
export function renderJsonLd(jsonLd: object): string {
  return JSON.stringify(jsonLd);
}

/**
 * 批量生成多个JSON-LD对象
 * @param jsonLdArray - JSON-LD对象数组
 * @returns 合并后的JSON字符串（包含多个script标签）
 * 
 * @example
 * const allStructuredData = renderMultipleJsonLd([
 *   generateBreadcrumb(breadcrumbItems),
 *   generateArticle(articleData),
 *   generateFAQ(faqItems)
 * ]);
 */
export function renderMultipleJsonLd(jsonLdArray: object[]): string {
  return jsonLdArray
    .map(jsonLd => JSON.stringify(jsonLd))
    .join('\n');
}
