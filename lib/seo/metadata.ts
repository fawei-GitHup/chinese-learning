/**
 * Next.js Metadata生成函数
 */

import type { Metadata } from 'next';
import { MetadataConfig } from './types';
import { sanitizeText, truncate, buildUrl } from './utils';

/**
 * 生成统一的Next.js metadata对象
 * @param config - metadata配置
 * @returns Next.js Metadata对象
 * 
 * @example
 * export async function generateMetadata(): Promise<Metadata> {
 *   return generatePageMetadata({
 *     title: 'HSK 4级词汇',
 *     description: '全面的HSK 4级词汇学习资源',
 *     path: '/lessons/hsk4',
 *     keywords: ['HSK4', '词汇', '学习'],
 *     structuredData: [
 *       generateBreadcrumb(breadcrumbItems),
 *       generateArticle(articleData)
 *     ]
 *   });
 * }
 */
export function generatePageMetadata(config: MetadataConfig): Metadata {
  const {
    title,
    description,
    path,
    imageUrl,
    keywords,
    noindex = false,
    structuredData = [],
  } = config;

  const url = buildUrl(path);
  const siteName = '医学中文学习平台';
  
  // 确保标题包含站点名称（如果尚未包含）
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  
  // 清理并截断描述
  const cleanDescription = truncate(sanitizeText(description), 160);

  // 默认图片URL
  const defaultImage = buildUrl('/og-image.png');
  const finalImageUrl = imageUrl ? buildUrl(imageUrl) : defaultImage;

  const metadata: Metadata = {
    title: fullTitle,
    description: cleanDescription,
    
    // 作者信息
    authors: [{ name: siteName }],
    
    // 搜索引擎设置
    robots: noindex 
      ? { index: false, follow: false }
      : { index: true, follow: true },
    
    // Open Graph（社交媒体分享）
    openGraph: {
      type: 'website',
      url,
      title: fullTitle,
      description: cleanDescription,
      siteName,
      images: [
        {
          url: finalImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'zh_CN',
    },
    
    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: cleanDescription,
      images: [finalImageUrl],
    },
    
    // Canonical URL（规范URL）
    alternates: {
      canonical: url,
    },
  };

  // 添加关键词（如果提供）
  if (keywords && keywords.length > 0) {
    metadata.keywords = keywords.join(', ');
  }

  // 添加结构化数据（通过other字段）
  if (structuredData.length > 0) {
    metadata.other = {
      'application/ld+json': JSON.stringify(structuredData),
    };
  }

  return metadata;
}

/**
 * 为首页生成metadata
 * @returns Next.js Metadata对象
 */
export function generateHomeMetadata(): Metadata {
  return generatePageMetadata({
    title: '医学中文学习平台 - 专业的医学中文在线学习',
    description: '提供HSK课程、医疗词汇、场景对话、语法讲解等全面的医学中文学习资源。适合医护人员、医学生及HSK考生。',
    path: '/',
    keywords: [
      '医学中文',
      'HSK',
      '中文学习',
      '医疗词汇',
      '场景对话',
      '语法学习',
    ],
  });
}

/**
 * 为列表页生成metadata
 * @param config - 列表页配置
 * @returns Next.js Metadata对象
 * 
 * @example
 * export async function generateMetadata(): Promise<Metadata> {
 *   return generateListMetadata({
 *     title: '医疗词汇大全',
 *     description: '涵盖常用医疗术语、症状、诊断、治疗等专业词汇',
 *     path: '/medical/vocabulary',
 *     keywords: ['医疗词汇', '医学术语', '中文医学']
 *   });
 * }
 */
export function generateListMetadata(
  config: Omit<MetadataConfig, 'structuredData'>
): Metadata {
  return generatePageMetadata({
    ...config,
    title: `${config.title} | 医学中文学习平台`,
  });
}

/**
 * 为详情页生成metadata
 * @param config - 详情页配置
 * @returns Next.js Metadata对象
 * 
 * @example
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const word = await getWord(params.word);
 *   return generateDetailMetadata({
 *     title: word.chinese,
 *     description: word.definition,
 *     path: `/medical/dictionary/${params.word}`,
 *     imageUrl: word.imageUrl,
 *     keywords: [word.category, word.pinyin],
 *     structuredData: [
 *       generateDefinedTerm({
 *         term: word.chinese,
 *         definition: word.definition,
 *         inDefinedTermSet: '医疗词汇'
 *       })
 *     ]
 *   });
 * }
 */
export function generateDetailMetadata(config: MetadataConfig): Metadata {
  return generatePageMetadata({
    ...config,
    title: `${config.title} | 医学中文学习平台`,
  });
}

/**
 * 为错误页生成metadata
 * @param errorType - 错误类型（404, 500等）
 * @returns Next.js Metadata对象
 */
export function generateErrorMetadata(errorType: number = 404): Metadata {
  const errorMessages: Record<number, { title: string; description: string }> = {
    404: {
      title: '页面未找到',
      description: '抱歉，您访问的页面不存在。请返回首页或使用搜索功能。',
    },
    500: {
      title: '服务器错误',
      description: '抱歉，服务器遇到了一些问题。我们正在努力修复。',
    },
  };

  const error = errorMessages[errorType] || errorMessages[404];

  return generatePageMetadata({
    title: error.title,
    description: error.description,
    path: '/error',
    noindex: true, // 错误页不应被索引
  });
}

/**
 * 生成动态路由的metadata
 * 常用于[id]、[slug]等动态页面
 * @param params - 路由参数
 * @param fetchData - 获取数据的异步函数
 * @returns Promise<Metadata>
 * 
 * @example
 * export async function generateMetadata({ 
 *   params 
 * }: { 
 *   params: { id: string } 
 * }): Promise<Metadata> {
 *   return generateDynamicMetadata(params, async (p) => {
 *     const lesson = await getLesson(p.id);
 *     return {
 *       title: lesson.title,
 *       description: lesson.description,
 *       path: `/lessons/${p.id}`,
 *       keywords: lesson.tags,
 *       structuredData: [
 *         generateArticle({
 *           title: lesson.title,
 *           description: lesson.description,
 *           url: `/lessons/${p.id}`,
 *           datePublished: lesson.createdAt
 *         })
 *       ]
 *     };
 *   });
 * }
 */
export async function generateDynamicMetadata<T>(
  params: T,
  fetchData: (params: T) => Promise<MetadataConfig>
): Promise<Metadata> {
  try {
    const config = await fetchData(params);
    return generatePageMetadata(config);
  } catch (error) {
    console.error('Failed to generate dynamic metadata:', error);
    // 返回默认metadata
    return generateErrorMetadata(500);
  }
}
