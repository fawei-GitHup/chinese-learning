"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { EmptyState } from "@/components/web/EmptyState"
import { ErrorDisplay } from "@/components/web/ErrorDisplay"
import { SkeletonList } from "@/components/web/SkeletonCard"
import { type MedicalTermContent } from "@/lib/content"
import { useContentList } from "@/lib/cache/client-hooks"
import { ArrowLeft, Search, BookOpen, Plus, Star, RefreshCw } from "lucide-react"

export function VocabularyPageClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"))

  // 使用 SWR 缓存获取数据
  const { data: result, error, isLoading, mutate } = useContentList('medical_term', {
    search: searchQuery || undefined,
    page: currentPage,
    limit: 12,
  })

  // 处理搜索
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
    // 更新 URL 参数
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (currentPage > 1) params.set('page', currentPage.toString())
    const newUrl = params.toString() ? `?${params.toString()}` : ''
    router.replace(`/medical/vocabulary${newUrl}`)
  }

  // 处理分页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    params.set('page', page.toString())
    router.replace(`/medical/vocabulary?${params.toString()}`)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/medical"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Medical Chinese
          </Link>

          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30">
                <BookOpen className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Medical Vocabulary</h1>
                <p className="text-zinc-400">Browse essential medical Chinese terms and terminology</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => mutate()}
              disabled={isLoading}
              className="border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              type="text"
              placeholder="Search medical terms..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 bg-white/[0.03] border-white/[0.08] text-white placeholder:text-zinc-500 focus:border-teal-500/50"
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <SkeletonList count={12} />
        ) : error ? (
          <ErrorDisplay
            error={error}
            onRetry={() => mutate()}
          />
        ) : result?.data && result.data.length > 0 ? (
          <>
            {/* Results header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-zinc-400">
                {searchQuery && `Found ${result.pagination.total} results for "${searchQuery}"`}
                {!searchQuery && `Showing ${result.data.length} of ${result.pagination.total} medical terms`}
              </p>
            </div>

            {/* Vocabulary Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
              {result.data
                .filter((term): term is MedicalTermContent => term.type === 'medical_term')
                .map((term) => (
                  <VocabularyCard key={term.id} term={term} />
                ))}
            </div>

            {/* Pagination */}
            {result.pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage <= 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white disabled:opacity-50"
                >
                  Previous
                </Button>

                {Array.from({ length: Math.min(5, result.pagination.totalPages) }, (_, i) => {
                  const page = Math.max(1, currentPage - 2) + i
                  if (page > result.pagination.totalPages) return null

                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => handlePageChange(page)}
                      className={
                        page === currentPage
                          ? "bg-teal-600 hover:bg-teal-700"
                          : "border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white"
                      }
                    >
                      {page}
                    </Button>
                  )
                })}

                <Button
                  variant="outline"
                  disabled={currentPage >= result.pagination.totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={BookOpen}
            title={searchQuery ? `No results for "${searchQuery}"` : "No medical terms found"}
            description={
              searchQuery
                ? "Try adjusting your search terms or browse all vocabulary."
                : "Medical vocabulary will appear here once published."
            }
            action={
              searchQuery
                ? {
                    label: "Clear search",
                    onClick: () => handleSearch(""),
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  )
}

/**
 * 词汇卡片组件
 */
function VocabularyCard({ term }: { term: MedicalTermContent }) {
  const [saved, setSaved] = useState(false)
  const [addedToSRS, setAddedToSRS] = useState(false)

  return (
    <Link href={`/medical/dictionary/${term.slug}`}>
      <GlassCard className="p-4 h-full hover:border-teal-500/30 transition-all group cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors">
              {term.word}
            </h3>
            <p className="text-sm text-teal-400 font-mono">{term.pinyin}</p>
          </div>

          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.preventDefault()
                setSaved(!saved)
              }}
              className="p-1.5 rounded-md hover:bg-white/[0.06] transition-colors"
            >
              <Star
                className={`h-4 w-4 ${
                  saved ? "text-yellow-400 fill-yellow-400" : "text-zinc-500"
                }`}
              />
            </button>
          </div>
        </div>

        <p className="text-sm text-zinc-300 mb-3 line-clamp-2">
          {term.meanings?.[0] || term.description}
        </p>

        {term.category && (
          <div className="flex items-center justify-between">
            <span className="text-xs px-2 py-1 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
              {term.category}
            </span>

            <button
              onClick={(e) => {
                e.preventDefault()
                setAddedToSRS(!addedToSRS)
              }}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors ${
                addedToSRS
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "hover:bg-white/[0.06] text-zinc-500"
              }`}
            >
              <Plus className="h-3 w-3" />
              {addedToSRS ? "Added" : "Add to SRS"}
            </button>
          </div>
        )}
      </GlassCard>
    </Link>
  )
}