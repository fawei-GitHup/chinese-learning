/**
 * Web 内容查询层
 * 工单 W1-01: 建立 Web 内容查询层
 *
 * 提供统一的内容查询接口：
 * - getContentList(type, filters) - 获取内容列表
 * - getContentBySlug(type, slug) - 获取单条内容
 */

import createBrowserClient from '@/lib/supabase/client'
import {
  lessons,
  readers,
  grammarEntries,
  type Lesson,
  type Reader,
  type GrammarEntry,
} from '@/lib/web-mock'
import {
  medicalScenarios,
  medicalLexicon,
  type MedicalScenario,
  type MedicalWord,
} from '@/lib/medical-mock'

// ============================================================================
// 类型定义
// ============================================================================

/** 内容类型枚举 */
export type ContentType =
  | 'lesson'
  | 'reading'
  | 'grammar'
  | 'medical_term'
  | 'scenario'

/** 内容过滤条件 */
export interface ContentFilters {
  /** 分页 - 页码（从 1 开始） */
  page?: number
  /** 分页 - 每页数量 */
  limit?: number
  /** 搜索关键词 */
  search?: string
  /** 难度级别 */
  level?: string
  /** 分类/类别 */
  category?: string
  /** 标签 */
  tags?: string[]
  /** 排序字段 */
  sortBy?: string
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc'
}

/** 统一的内容项基础类型 */
export interface ContentItem {
  id: string
  slug: string
  title: string
  description?: string
  type: ContentType
  createdAt?: string
  updatedAt?: string
  [key: string]: unknown
}

/** 课程内容类型 */
export interface LessonContent extends ContentItem {
  type: 'lesson'
  level: string
  durationMin?: number
  tags?: string[]
}

/** 对话行类型 */
export interface DialogueLine {
  speaker: string
  zh: string
  pinyin: string
  en: string
}

/** 词汇单词类型 */
export interface VocabWord {
  word: string
  pinyin: string
  meaning: string
  geo_snippet: string
  key_points: string[]
  faq?: string[]
}

/** 完整课程内容类型 */
export interface FullLessonContent extends LessonContent {
  script?: 'simplified' | 'traditional'
  dialogue: DialogueLine[]
  vocab: VocabWord[]
}

/** 阅读内容类型 */
export interface ReadingContent extends ContentItem {
  type: 'reading'
  level: string
  wordCount?: number
  tags?: string[]
  content: string[]
  vocabulary_list: VocabWord[]
}

/** 语法内容类型 */
export interface GrammarContent extends ContentItem {
  type: 'grammar'
  level: string
  pattern?: string
  explanation?: string
}

/** 医疗术语内容类型 */
export interface MedicalTermContent extends ContentItem {
  type: 'medical_term'
  word?: string
  pinyin?: string
  meanings?: string[]
  category?: string
}

/** 医疗场景内容类型 */
export interface ScenarioContent extends ContentItem {
  type: 'scenario'
  category?: string
  level?: string
  chief_complaint_zh?: string
  chief_complaint_en?: string
}

/** 所有内容类型的联合类型 */
export type AnyContent =
  | LessonContent
  | ReadingContent
  | GrammarContent
  | MedicalTermContent
  | ScenarioContent

/** 分页信息 */
export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

/** 列表返回结果类型 */
export interface ContentListResult<T = AnyContent> {
  data: T[]
  pagination: PaginationInfo
  error: Error | null
}

/** 详情返回结果类型 */
export interface ContentDetailResult<T = AnyContent> {
  data: T | null
  error: Error | null
}

// ============================================================================
// 数据库表名映射
// ============================================================================

const TABLE_MAP: Record<ContentType, string> = {
  lesson: 'lessons',
  reading: 'readings',
  grammar: 'grammar_points',
  medical_term: 'medical_terms',
  scenario: 'medical_scenarios',
}

// ============================================================================
// Mock 数据转换器
// ============================================================================

/**
 * 将 Lesson 转换为 LessonContent
 */
function transformLesson(lesson: Lesson): LessonContent {
  return {
    id: lesson.id,
    slug: lesson.id,
    title: lesson.title,
    description: lesson.summary,
    type: 'lesson',
    level: lesson.level,
    durationMin: lesson.durationMin,
    tags: lesson.tags,
  }
}

/**
 * 将 Reader 转换为 ReadingContent
 */
function transformReading(reader: Reader): ReadingContent {
  return {
    id: reader.id,
    slug: reader.id,
    title: reader.title,
    description: reader.summary,
    type: 'reading',
    level: reader.level,
    wordCount: reader.wordCount,
    tags: reader.tags,
    content: reader.paragraphs.map(p => p.zh),
    vocabulary_list: reader.tokens.map(token => ({
      word: token.word,
      pinyin: token.pinyin,
      meaning: token.meaning,
      geo_snippet: '',
      key_points: [],
      faq: [],
    })),
  }
}

/**
 * 将 GrammarEntry 转换为 GrammarContent
 */
function transformGrammar(grammar: GrammarEntry): GrammarContent {
  return {
    id: grammar.id,
    slug: grammar.id,
    title: grammar.pattern,
    description: grammar.explanation,
    type: 'grammar',
    level: grammar.level,
    pattern: grammar.pattern,
    explanation: grammar.explanation,
  }
}

/**
 * 将 MedicalWord 转换为 MedicalTermContent
 */
function transformMedicalTerm(term: MedicalWord): MedicalTermContent {
  return {
    id: term.id,
    slug: term.id,
    title: term.word,
    description: term.meanings_en.join(', '),
    type: 'medical_term',
    word: term.word,
    pinyin: term.pinyin,
    meanings: term.meanings_en,
    category: term.category,
  }
}

/**
 * 将 MedicalScenario 转换为 ScenarioContent
 */
function transformScenario(scenario: MedicalScenario): ScenarioContent {
  return {
    id: scenario.id,
    slug: scenario.id,
    title: scenario.title_en,
    description: scenario.title_zh,
    type: 'scenario',
    category: scenario.category,
    level: scenario.level,
    chief_complaint_zh: scenario.chief_complaint_zh,
    chief_complaint_en: scenario.chief_complaint_en,
  }
}

// ============================================================================
// Mock 数据获取器
// ============================================================================

/**
 * 获取 Mock 数据列表
 */
function getMockList(
  type: ContentType,
  filters: ContentFilters
): ContentListResult {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 10

  let items: AnyContent[] = []

  switch (type) {
    case 'lesson':
      items = lessons.map(transformLesson)
      break
    case 'reading':
      items = readers.map(transformReading)
      break
    case 'grammar':
      items = grammarEntries.map(transformGrammar)
      break
    case 'medical_term':
      items = medicalLexicon.map(transformMedicalTerm)
      break
    case 'scenario':
      items = medicalScenarios.map(transformScenario)
      break
    default:
      items = []
  }

  // 搜索过滤
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower)
    )
  }

  // 级别过滤
  if (filters.level && items.length > 0 && 'level' in items[0]) {
    items = items.filter(
      (item) => (item as { level?: string }).level === filters.level
    )
  }

  // 分类过滤
  if (filters.category && items.length > 0 && 'category' in items[0]) {
    items = items.filter(
      (item) => (item as { category?: string }).category === filters.category
    )
  }

  // 计算分页
  const total = items.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const paginatedItems = items.slice(startIndex, startIndex + limit)

  return {
    data: paginatedItems,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    error: null,
  }
}

/**
 * 根据 slug 获取 Mock 数据
 */
function getMockBySlug(type: ContentType, slug: string): ContentDetailResult {
  let item: AnyContent | null = null

  switch (type) {
    case 'lesson': {
      const lesson = lessons.find((l) => l.id === slug)
      item = lesson ? transformLesson(lesson) : null
      break
    }
    case 'reading': {
      const reader = readers.find((r) => r.id === slug)
      item = reader ? transformReading(reader) : null
      break
    }
    case 'grammar': {
      const grammar = grammarEntries.find((g) => g.id === slug)
      item = grammar ? transformGrammar(grammar) : null
      break
    }
    case 'medical_term': {
      const term = medicalLexicon.find((t) => t.id === slug)
      item = term ? transformMedicalTerm(term) : null
      break
    }
    case 'scenario': {
      const scenario = medicalScenarios.find((s) => s.id === slug)
      item = scenario ? transformScenario(scenario) : null
      break
    }
    default:
      item = null
  }

  return {
    data: item,
    error: null,
  }
}

// ============================================================================
// 公共 API
// ============================================================================

/**
 * 获取内容列表
 *
 * @param type - 内容类型：'lesson' | 'reading' | 'grammar' | 'medical_term' | 'scenario'
 * @param filters - 过滤条件（可选）
 * @returns ContentListResult - 包含 data 数组、pagination 分页信息和 error 错误对象
 *
 * @example
 * ```ts
 * // 获取课程列表
 * const result = await getContentList('lesson', { page: 1, limit: 10 })
 * if (result.error) {
 *   console.error(result.error)
 * } else {
 *   console.log(result.data)
 * }
 *
 * // 搜索语法点
 * const grammarResult = await getContentList('grammar', { search: '把' })
 * ```
 */
export async function getContentList(
  type: ContentType,
  filters: ContentFilters = {}
): Promise<ContentListResult> {
  const tableName = TABLE_MAP[type]

  if (!tableName) {
    return {
      data: [],
      pagination: {
        page: filters.page ?? 1,
        limit: filters.limit ?? 10,
        total: 0,
        totalPages: 0,
      },
      error: new Error(`Unknown content type: ${type}`),
    }
  }

  try {
    // 尝试使用 Supabase
    const supabase = createBrowserClient()

    const page = filters.page ?? 1
    const limit = filters.limit ?? 10
    const offset = (page - 1) * limit

    // 构建查询 - 只查询已发布的内容
    let query = supabase.from(tableName).select('*', { count: 'exact' }).eq('status', 'published')

    // 应用搜索过滤
    if (filters.search) {
      if (type === 'medical_term') {
        // For medical terms, search in title (word), pinyin, and description (meanings)
        query = query.or(
          `title.ilike.%${filters.search}%,pinyin.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      } else {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        )
      }
    }

    // 应用级别过滤
    if (filters.level) {
      query = query.eq('level', filters.level)
    }

    // 应用分类过滤
    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    // 应用排序
    if (filters.sortBy) {
      query = query.order(filters.sortBy, {
        ascending: filters.sortOrder !== 'desc',
      })
    }

    // 应用分页
    query = query.range(offset, offset + limit - 1)

    const { data, count, error } = await query

    if (error) {
      // Supabase 错误，回退到 Mock 数据
      console.warn(`Supabase query failed for ${type}, using mock data:`, error)
      return getMockList(type, filters)
    }

    // 数据库返回空，返回空数组（不抛异常）
    if (!data || data.length === 0) {
      // 尝试从 mock 数据获取
      console.info(`No data in database for ${type}, using mock data`)
      return getMockList(type, filters)
    }

    return {
      data: data as AnyContent[],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
      error: null,
    }
  } catch (err) {
    // Supabase 未配置或其他错误，回退到 Mock 数据
    console.warn(`Failed to fetch ${type} from database, using mock data:`, err)
    return getMockList(type, filters)
  }
}

/**
 * 根据 slug 获取单条内容
 *
 * @param type - 内容类型：'lesson' | 'reading' | 'grammar' | 'medical_term' | 'scenario'
 * @param slug - 内容的唯一标识符
 * @returns ContentDetailResult - 包含 data 对象和 error 错误对象
 *
 * @example
 * ```ts
 * // 获取课程详情
 * const result = await getContentBySlug('lesson', 'lesson-1')
 * if (result.error) {
 *   console.error(result.error)
 * } else if (result.data) {
 *   console.log(result.data.title)
 * }
 * ```
 */
export async function getContentBySlug(
  type: ContentType,
  slug: string
): Promise<ContentDetailResult> {
  const tableName = TABLE_MAP[type]

  if (!tableName) {
    return {
      data: null,
      error: new Error(`Unknown content type: ${type}`),
    }
  }

  if (!slug) {
    return {
      data: null,
      error: new Error('Slug is required'),
    }
  }

  try {
    // 尝试使用 Supabase
    const supabase = createBrowserClient()

    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .eq('status', 'published')
      .or(`slug.eq.${slug},id.eq.${slug}`)
      .single()

    if (error) {
      // Supabase 错误，回退到 Mock 数据
      console.warn(
        `Supabase query failed for ${type}/${slug}, using mock data:`,
        error
      )
      return getMockBySlug(type, slug)
    }

    if (!data) {
      // 数据库返回空，尝试从 mock 获取
      console.info(`No data in database for ${type}/${slug}, using mock data`)
      return getMockBySlug(type, slug)
    }

    return {
      data: data as AnyContent,
      error: null,
    }
  } catch (err) {
    // Supabase 未配置或其他错误，回退到 Mock 数据
    console.warn(
      `Failed to fetch ${type}/${slug} from database, using mock data:`,
      err
    )
    return getMockBySlug(type, slug)
  }
}

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 检查 Supabase 是否可用
 */
export async function isSupabaseAvailable(): Promise<boolean> {
  try {
    const supabase = createBrowserClient()
    const { error } = await supabase.from('lessons').select('id').limit(1)
    return !error
  } catch {
    return false
  }
}

/**
 * 获取所有支持的内容类型
 */
export function getSupportedContentTypes(): ContentType[] {
  return ['lesson', 'reading', 'grammar', 'medical_term', 'scenario']
}

/**
 * 检查内容类型是否有效
 */
export function isValidContentType(type: string): type is ContentType {
  return getSupportedContentTypes().includes(type as ContentType)
}
