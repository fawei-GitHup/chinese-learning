/**
 * 统一搜索模块
 * 工单 W3-01: 全站搜索
 * 
 * 提供跨多种内容类型的统一搜索功能
 * 支持中文、拼音、英文搜索
 */

import { getContentList, type ContentFilters, type AnyContent, type ContentType } from '@/lib/content'

// ============================================================================
// 类型定义
// ============================================================================

/** 搜索结果类型 */
export interface SearchResult {
  item: AnyContent
  score: number // 相关性评分 0-100
  matchedFields: string[] // 匹配的字段
}

/** 搜索选项 */
export interface SearchOptions {
  /** 搜索关键词 */
  query: string
  /** 内容类型过滤 (不指定则搜索所有类型) */
  types?: ContentType[]
  /** 难度级别过滤 */
  level?: string
  /** 分类过滤 */
  category?: string
  /** 每种类型的最大结果数 */
  limitPerType?: number
  /** 是否包含搜索历史 */
  saveToHistory?: boolean
}

/** 分组搜索结果 */
export interface GroupedSearchResults {
  query: string
  totalCount: number
  groups: {
    type: ContentType
    label: string
    count: number
    results: SearchResult[]
  }[]
}

// ============================================================================
// 搜索历史管理
// ============================================================================

const SEARCH_HISTORY_KEY = 'search_history'
const MAX_HISTORY_COUNT = 10

/**
 * 保存搜索历史
 */
export function saveSearchHistory(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return
  
  try {
    const history = getSearchHistory()
    // 移除重复项
    const filtered = history.filter(item => item !== query)
    // 添加到开头
    const updated = [query, ...filtered].slice(0, MAX_HISTORY_COUNT)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updated))
  } catch (error) {
    console.error('Failed to save search history:', error)
  }
}

/**
 * 获取搜索历史
 */
export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Failed to get search history:', error)
    return []
  }
}

/**
 * 清除搜索历史
 */
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  } catch (error) {
    console.error('Failed to clear search history:', error)
  }
}

// ============================================================================
// 搜索匹配逻辑
// ============================================================================

/**
 * 计算匹配得分和匹配字段
 */
function calculateMatch(item: AnyContent, queryLower: string): { score: number; fields: string[] } {
  let score = 0
  const matchedFields: string[] = []

  // 标题匹配 (权重最高)
  if (item.title?.toLowerCase().includes(queryLower)) {
    score += 50
    matchedFields.push('title')
  }

  // 描述匹配
  if (item.description?.toLowerCase().includes(queryLower)) {
    score += 30
    matchedFields.push('description')
  }

  // 类型特定字段匹配
  switch (item.type) {
    case 'medical_term':
      // 医疗词汇：word, pinyin, meanings
      const medTerm = item as any
      if (medTerm.word?.toLowerCase().includes(queryLower)) {
        score += 50
        matchedFields.push('word')
      }
      if (medTerm.pinyin?.toLowerCase().includes(queryLower)) {
        score += 40
        matchedFields.push('pinyin')
      }
      if (medTerm.meanings?.some((m: string) => m.toLowerCase().includes(queryLower))) {
        score += 35
        matchedFields.push('meanings')
      }
      break

    case 'lesson':
    case 'reading':
      // 课程和阅读：tags
      const contentItem = item as any
      if (contentItem.tags?.some((t: string) => t.toLowerCase().includes(queryLower))) {
        score += 20
        matchedFields.push('tags')
      }
      break

    case 'grammar':
      // 语法：pattern, explanation
      const grammarItem = item as any
      if (grammarItem.pattern?.toLowerCase().includes(queryLower)) {
        score += 50
        matchedFields.push('pattern')
      }
      if (grammarItem.explanation?.toLowerCase().includes(queryLower)) {
        score += 30
        matchedFields.push('explanation')
      }
      break

    case 'scenario':
      // 场景：chief_complaint
      const scenarioItem = item as any
      if (scenarioItem.chief_complaint_zh?.toLowerCase().includes(queryLower)) {
        score += 40
        matchedFields.push('chief_complaint_zh')
      }
      if (scenarioItem.chief_complaint_en?.toLowerCase().includes(queryLower)) {
        score += 35
        matchedFields.push('chief_complaint_en')
      }
      break
  }

  return { score, fields: matchedFields }
}

/**
 * 过滤和评分单个内容类型的结果
 */
async function searchContentType(
  type: ContentType,
  query: string,
  filters?: { level?: string; category?: string },
  limit?: number
): Promise<SearchResult[]> {
  const queryLower = query.toLowerCase().trim()
  if (!queryLower) return []

  // 构建过滤条件
  const contentFilters: ContentFilters = {
    ...filters,
    page: 1,
    limit: 100, // 先获取较多结果，然后在客户端过滤和排序
  }

  // 获取内容
  const result = await getContentList(type, contentFilters)
  if (result.error || !result.data) return []

  // 过滤和评分
  const scored: SearchResult[] = []
  for (const item of result.data) {
    const { score, fields } = calculateMatch(item, queryLower)
    if (score > 0) {
      scored.push({
        item,
        score,
        matchedFields: fields,
      })
    }
  }

  // 按得分排序
  scored.sort((a, b) => b.score - a.score)

  // 限制结果数量
  return limit ? scored.slice(0, limit) : scored
}

// ============================================================================
// 统一搜索接口
// ============================================================================

/**
 * 统一搜索功能
 * 
 * @param options 搜索选项
 * @returns 分组搜索结果
 */
export async function unifiedSearch(options: SearchOptions): Promise<GroupedSearchResults> {
  const { query, types, level, category, limitPerType = 10, saveToHistory = true } = options

  // 保存搜索历史
  if (saveToHistory && query.trim()) {
    saveSearchHistory(query.trim())
  }

  // 确定要搜索的内容类型
  const searchTypes: ContentType[] = types || [
    'medical_term',
    'lesson',
    'reading',
    'grammar',
    'scenario',
  ]

  // 并行搜索所有类型
  const searchPromises = searchTypes.map(type =>
    searchContentType(type, query, { level, category }, limitPerType)
  )

  const allResults = await Promise.all(searchPromises)

  // 构建分组结果
  const groups = searchTypes.map((type, index) => ({
    type,
    label: getContentTypeLabel(type),
    count: allResults[index].length,
    results: allResults[index],
  })).filter(group => group.count > 0) // 只保留有结果的组

  // 计算总数
  const totalCount = groups.reduce((sum, group) => sum + group.count, 0)

  return {
    query,
    totalCount,
    groups,
  }
}

/**
 * 获取内容类型的显示标签
 */
export function getContentTypeLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    medical_term: '医疗词汇',
    lesson: '课程',
    reading: '阅读',
    grammar: '语法',
    scenario: '场景',
  }
  return labels[type] || type
}

// ============================================================================
// 文本高亮辅助函数
// ============================================================================

/**
 * 高亮文本中的匹配部分
 * 
 * @param text 原始文本
 * @param query 搜索关键词
 * @returns 包含高亮标记的文本片段数组
 */
export function highlightText(text: string, query: string): { text: string; isHighlight: boolean }[] {
  if (!query.trim() || !text) {
    return [{ text, isHighlight: false }]
  }

  const queryLower = query.toLowerCase()
  const textLower = text.toLowerCase()
  const parts: { text: string; isHighlight: boolean }[] = []

  let lastIndex = 0
  let index = textLower.indexOf(queryLower)

  while (index !== -1) {
    // 添加匹配前的文本
    if (index > lastIndex) {
      parts.push({
        text: text.substring(lastIndex, index),
        isHighlight: false,
      })
    }

    // 添加匹配的文本
    parts.push({
      text: text.substring(index, index + query.length),
      isHighlight: true,
    })

    lastIndex = index + query.length
    index = textLower.indexOf(queryLower, lastIndex)
  }

  // 添加剩余文本
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      isHighlight: false,
    })
  }

  return parts
}

// ============================================================================
// 快速搜索建议
// ============================================================================

/**
 * 获取搜索建议（基于搜索历史和常见搜索）
 */
export function getSearchSuggestions(limit: number = 5): string[] {
  const history = getSearchHistory()
  const commonQueries = [
    '头痛',
    '发烧',
    '咳嗽',
    '挂号',
    '医保',
  ]

  // 合并历史和常见搜索，去重
  const suggestions = [...history, ...commonQueries]
    .filter((item, index, self) => self.indexOf(item) === index)
    .slice(0, limit)

  return suggestions
}
