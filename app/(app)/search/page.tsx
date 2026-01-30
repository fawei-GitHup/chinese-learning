"use client"

/**
 * 全站搜索页面
 * 工单 W3-01: 全站搜索
 * 
 * 支持多种内容类型的统一搜索
 * - medical_term (医疗词汇)
 * - lesson (课程)
 * - reading (阅读)
 * - grammar (语法)
 * - scenario (场景)
 * 
 * 支持中文、拼音、英文搜索
 */

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/web/EmptyState"
import { ErrorDisplay } from "@/components/web/ErrorDisplay"
import { SkeletonList } from "@/components/web/SkeletonCard"
import { SearchResultCard } from "@/components/search/SearchResultCard"
import { SearchFilters } from "@/components/search/SearchFilters"
import { 
  unifiedSearch, 
  getSearchHistory, 
  clearSearchHistory,
  getContentTypeLabel,
  type GroupedSearchResults 
} from "@/lib/search/unified-search"
import type { ContentType } from "@/lib/content"
import { ArrowLeft, Search, BookOpen, History, X, Sparkles } from "lucide-react"

// 搜索输入防抖延迟（毫秒）
const SEARCH_DEBOUNCE_MS = 300

export default function SearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  // 搜索状态
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)
  const [searchResults, setSearchResults] = useState<GroupedSearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // 过滤器状态
  const [selectedTypes, setSelectedTypes] = useState<ContentType[]>([
    'medical_term',
    'lesson',
    'reading',
    'grammar',
    'scenario',
  ])
  const [selectedLevel, setSelectedLevel] = useState<string | undefined>(undefined)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)

  // 搜索历史
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)

  // 加载搜索历史
  useEffect(() => {
    setSearchHistory(getSearchHistory())
  }, [])

  // 搜索输入防抖
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      clearTimeout(handler)
    }
  }, [searchQuery])

  // 执行搜索
  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const results = await unifiedSearch({
        query,
        types: selectedTypes.length > 0 ? selectedTypes : undefined,
        level: selectedLevel,
        category: selectedCategory,
        limitPerType: 10,
        saveToHistory: true,
      })

      setSearchResults(results)
      // 更新搜索历史显示
      setSearchHistory(getSearchHistory())
    } catch (err) {
      console.error('Search failed:', err)
      setError(err instanceof Error ? err : new Error('搜索失败'))
    } finally {
      setLoading(false)
    }
  }, [selectedTypes, selectedLevel, selectedCategory])

  // 当防抖查询或过滤器变化时执行搜索
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery)
      // 更新 URL
      const params = new URLSearchParams()
      params.set('q', debouncedQuery)
      router.replace(`/search?${params.toString()}`, { scroll: false })
    }
  }, [debouncedQuery, performSearch, router])

  // 处理搜索输入
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setShowHistory(false)
  }

  // 点击历史记录
  const handleHistoryClick = (query: string) => {
    setSearchQuery(query)
    setDebouncedQuery(query)
    setShowHistory(false)
  }

  // 清除历史记录
  const handleClearHistory = () => {
    clearSearchHistory()
    setSearchHistory([])
  }

  // 处理过滤器变化
  const handleTypeToggle = (type: ContentType) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        // 不允许取消所有类型
        return prev.length > 1 ? prev.filter(t => t !== type) : prev
      } else {
        return [...prev, type]
      }
    })
  }

  const handleClearAllFilters = () => {
    setSelectedTypes(['medical_term', 'lesson', 'reading', 'grammar', 'scenario'])
    setSelectedLevel(undefined)
    setSelectedCategory(undefined)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* 头部 */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30">
              <Search className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">全站搜索</h1>
              <p className="text-zinc-400">搜索医疗词汇、课程、阅读、语法和场景</p>
            </div>
          </div>

          {/* 搜索框 */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" />
            <Input
              type="text"
              placeholder="输入中文、拼音或英文搜索..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowHistory(searchHistory.length > 0 && !searchQuery)}
              className="pl-12 pr-12 h-14 text-lg bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-500 focus:border-blue-500/50"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setDebouncedQuery('')
                  setSearchResults(null)
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}

            {/* 搜索历史下拉 */}
            {showHistory && searchHistory.length > 0 && (
              <GlassCard className="absolute top-full mt-2 w-full z-10 p-2">
                <div className="flex items-center justify-between px-2 py-1 mb-1">
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <History className="h-3 w-3" />
                    搜索历史
                  </span>
                  <button
                    onClick={handleClearHistory}
                    className="text-xs text-zinc-500 hover:text-white transition-colors"
                  >
                    清除
                  </button>
                </div>
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(item)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-white/[0.06] text-white text-sm transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </GlassCard>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧边栏：过滤器 */}
          <aside className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-white mb-4">过滤条件</h2>
              <SearchFilters
                selectedTypes={selectedTypes}
                selectedLevel={selectedLevel}
                selectedCategory={selectedCategory}
                onTypeToggle={handleTypeToggle}
                onLevelChange={setSelectedLevel}
                onCategoryChange={setSelectedCategory}
                onClearAll={handleClearAllFilters}
              />
            </GlassCard>
          </aside>

          {/* 主内容区：搜索结果 */}
          <main className="lg:col-span-3">
            {/* 加载状态 */}
            {loading && <SkeletonList count={6} />}

            {/* 错误状态 */}
            {error && !loading && (
              <ErrorDisplay
                error={error}
                onRetry={() => performSearch(debouncedQuery)}
              />
            )}

            {/* 搜索结果 */}
            {!loading && !error && searchResults && (
              <>
                {/* 结果统计 */}
                <div className="mb-6">
                  <p className="text-zinc-400">
                    找到 <span className="text-white font-semibold">{searchResults.totalCount}</span> 条结果
                    {searchResults.query && (
                      <> - 关键词: <span className="text-blue-400">"{searchResults.query}"</span></>
                    )}
                  </p>
                </div>

                {/* 分组结果 */}
                {searchResults.totalCount > 0 ? (
                  <div className="space-y-8">
                    {searchResults.groups.map((group) => (
                      <div key={group.type}>
                        {/* 分组标题 */}
                        <div className="flex items-center gap-3 mb-4">
                          <h2 className="text-2xl font-bold text-white">
                            {group.label}
                          </h2>
                          <span className="text-sm text-zinc-500">
                            ({group.count} 条)
                          </span>
                        </div>

                        {/* 结果列表 */}
                        <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                          {group.results.map((result) => (
                            <SearchResultCard
                              key={result.item.id}
                              searchResult={result}
                              searchQuery={searchResults.query}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Search}
                    title={`没有找到 "${searchResults.query}" 的相关结果`}
                    description="请尝试其他关键词，或调整过滤条件"
                    action={{
                      label: "清除过滤条件",
                      onClick: handleClearAllFilters,
                    }}
                  />
                )}
              </>
            )}

            {/* 初始/空状态 */}
            {!loading && !error && !searchResults && (
              <GlassCard className="p-12 text-center">
                <Sparkles className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  开始搜索
                </h2>
                <p className="text-zinc-400 mb-6">
                  在上方搜索框输入关键词，支持中文、拼音或英文搜索
                </p>

                {/* 搜索建议 */}
                <div className="max-w-md mx-auto">
                  <p className="text-sm text-zinc-500 mb-3">常见搜索：</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['头痛', '发烧', '挂号', '医保', 'HSK3'].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery(suggestion)
                          setDebouncedQuery(suggestion)
                        }}
                        className="border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* 支持的搜索类型 */}
                <div className="mt-8 pt-8 border-t border-white/[0.08]">
                  <p className="text-sm text-zinc-500 mb-4">支持搜索的内容类型：</p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-2xl mx-auto">
                    {[
                      { icon: '🏥', label: '医疗词汇' },
                      { icon: '📚', label: '课程' },
                      { icon: '📖', label: '阅读' },
                      { icon: '📝', label: '语法' },
                      { icon: '💬', label: '场景' },
                    ].map((item) => (
                      <div key={item.label} className="text-center">
                        <div className="text-2xl mb-1">{item.icon}</div>
                        <div className="text-xs text-zinc-400">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
