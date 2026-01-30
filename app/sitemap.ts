/**
 * W9-01: 自动 Sitemap 生成器
 * W8-01: 支持多语言 (i18n)
 *
 * 自动从数据库获取所有已发布（status='published'）的内容，
 * 生成符合 SEO 最佳实践的 sitemap.xml，包含多语言支持
 *
 * 内容类型：
 * - 医疗词汇（medical_terms）
 * - 医疗场景（medical_scenarios）
 * - 课程（lessons）
 * - 阅读材料（readings）
 * - 语法点（grammar_points）
 *
 * 优先级设置：
 * - 首页、专题页：1.0
 * - 详情页（词汇、场景、课程等）：0.8
 * - 列表页：0.6
 *
 * 更新频率：
 * - 详情页（词汇、场景、课程等）：weekly
 * - 列表页：daily
 * - 首页：daily
 *
 * i18n 支持：
 * - 为每个页面生成所有支持语言的 URL
 * - 默认语言（zh-CN）不带前缀
 * - 其他语言（en）带语言前缀
 */

import { MetadataRoute } from 'next'
import { createReadonlyServerClient } from '@/lib/supabase/server'
import { locales, defaultLocale } from '@/i18n'
import { getAllCitySlugs } from '@/lib/geo-data'

// 网站基础 URL - 从环境变量读取，生产环境需配置
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://learn-chinese.example.com'

/**
 * 数据库内容项类型
 */
interface ContentItem {
  id: string
  slug?: string
  updated_at?: string
  created_at?: string
}

/**
 * 从数据库获取已发布的内容
 */
async function fetchPublishedContent(
  supabase: ReturnType<typeof createReadonlyServerClient>,
  tableName: string
): Promise<ContentItem[]> {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id, slug, updated_at, created_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false })

    if (error) {
      console.warn(`[Sitemap] 查询 ${tableName} 失败:`, error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.warn(`[Sitemap] 获取 ${tableName} 时出错:`, error)
    return []
  }
}

/**
 * Next.js Sitemap 生成函数
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let supabase: ReturnType<typeof createReadonlyServerClient> | null = null

  try {
    supabase = createReadonlyServerClient()
  } catch (error) {
    console.warn('[Sitemap] Supabase 客户端创建失败，仅返回静态页面:', error)
    // 如果 Supabase 未配置，只返回静态页面
    return getStaticPages()
  }

  // 并行获取所有内容类型
  const [lessons, readings, grammarPoints, medicalTerms, medicalScenarios] = await Promise.all([
    fetchPublishedContent(supabase, 'lessons'),
    fetchPublishedContent(supabase, 'readings'),
    fetchPublishedContent(supabase, 'grammar_points'),
    fetchPublishedContent(supabase, 'medical_terms'),
    fetchPublishedContent(supabase, 'medical_scenarios'),
  ])

  console.log(`[Sitemap] 已获取内容数量:`, {
    lessons: lessons.length,
    readings: readings.length,
    grammarPoints: grammarPoints.length,
    medicalTerms: medicalTerms.length,
    medicalScenarios: medicalScenarios.length,
  })

  // 静态页面（营销区，支持多语言）
  const staticPages = getStaticPages()

  // 动态页面 - 课程详情（学习区，暂不支持多语言）
  const lessonUrls: MetadataRoute.Sitemap = lessons.map((lesson) => ({
    url: `${BASE_URL}/lesson/${lesson.slug || lesson.id}`,
    lastModified: new Date(lesson.updated_at || lesson.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 动态页面 - 阅读材料详情（学习区，暂不支持多语言）
  const readingUrls: MetadataRoute.Sitemap = readings.map((reading) => ({
    url: `${BASE_URL}/reader/${reading.slug || reading.id}`,
    lastModified: new Date(reading.updated_at || reading.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 动态页面 - 语法点详情（学习区，暂不支持多语言）
  const grammarUrls: MetadataRoute.Sitemap = grammarPoints.map((grammar) => ({
    url: `${BASE_URL}/grammar/${grammar.slug || grammar.id}`,
    lastModified: new Date(grammar.updated_at || grammar.created_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 动态页面 - 医疗词汇详情（营销区，支持多语言）
  const medicalTermUrls: MetadataRoute.Sitemap = medicalTerms.flatMap((term) =>
    locales.map((locale) => {
      const path = `/medical/dictionary/${term.slug || term.id}`;
      const url = locale === defaultLocale
        ? `${BASE_URL}${path}`
        : `${BASE_URL}/${locale}${path}`;
      
      return {
        url,
        lastModified: new Date(term.updated_at || term.created_at || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    })
  )

  // 动态页面 - 医疗场景详情（营销区，支持多语言）
  const scenarioUrls: MetadataRoute.Sitemap = medicalScenarios.flatMap((scenario) =>
    locales.map((locale) => {
      const path = `/medical/scenarios/${scenario.slug || scenario.id}`;
      const url = locale === defaultLocale
        ? `${BASE_URL}${path}`
        : `${BASE_URL}/${locale}${path}`;
      
      return {
        url,
        lastModified: new Date(scenario.updated_at || scenario.created_at || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      };
    })
  )

  // 动态页面 - 城市专题页（营销区，支持多语言）- W9-04
  const citySlugs = getAllCitySlugs();
  const cityUrls: MetadataRoute.Sitemap = citySlugs.flatMap((citySlug) =>
    locales.map((locale) => {
      const path = `/medical/city/${citySlug}`;
      const url = locale === defaultLocale
        ? `${BASE_URL}${path}`
        : `${BASE_URL}/${locale}${path}`;
      
      return {
        url,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,  // P1优先级，略低于详情页但高于列表页
      };
    })
  );

  // 合并所有 URL
  const allUrls = [
    ...staticPages,
    ...lessonUrls,
    ...readingUrls,
    ...grammarUrls,
    ...medicalTermUrls,
    ...scenarioUrls,
    ...cityUrls, // 添加城市页面
  ]

  console.log(`[Sitemap] 总计 ${allUrls.length} 个 URL (包含 ${locales.length} 种语言)`)

  return allUrls
}

/**
 * 生成静态页面的 sitemap 条目（支持多语言）
 */
function getStaticPages(): MetadataRoute.Sitemap {
  const now = new Date()

  // 营销区静态页面，需要为每种语言生成 URL
  const marketingPages = [
    { path: '', priority: 1.0, changeFreq: 'daily' as const },  // 首页
    { path: '/medical', priority: 1.0, changeFreq: 'daily' as const },  // 医疗专题页
    { path: '/medical/vocabulary', priority: 0.6, changeFreq: 'daily' as const },  // 医疗词汇列表
    { path: '/medical/scenarios', priority: 0.6, changeFreq: 'daily' as const },  // 医疗场景列表
    { path: '/login', priority: 0.3, changeFreq: 'monthly' as const },  // 登录页
  ];

  // 学习区静态页面，暂不支持多语言（单语言）
  const appPages = [
    { path: '/lessons', priority: 0.6, changeFreq: 'daily' as const },
    { path: '/grammar', priority: 0.6, changeFreq: 'daily' as const },
  ];

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

  // 学习区页面只生成一次（暂不支持多语言）
  const appUrls: MetadataRoute.Sitemap = appPages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: now,
    changeFrequency: page.changeFreq,
    priority: page.priority,
  }));

  return [...marketingUrls, ...appUrls];
}
