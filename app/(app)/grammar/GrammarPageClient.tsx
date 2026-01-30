"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GlassCard } from "@/components/web/GlassCard"
import { FilterBarLite } from "@/components/web/FilterBarLite"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/web/EmptyState"
import { ErrorDisplay } from "@/components/web/ErrorDisplay"
import { getContentList, type ContentListResult, type GrammarContent } from "@/lib/content"
import { BookOpen, BookmarkPlus } from "lucide-react"

const levelFilters = [
  { value: "all", label: "All Levels" },
  { value: "HSK1", label: "HSK1" },
  { value: "HSK2", label: "HSK2" },
  { value: "HSK3", label: "HSK3" },
  { value: "HSK4", label: "HSK4" },
  { value: "HSK5", label: "HSK5" },
  { value: "HSK6", label: "HSK6" },
  { value: "Medical", label: "Medical" },
]

export function GrammarPageClient() {
  const [result, setResult] = useState<ContentListResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadGrammar = async () => {
      setLoading(true)
      try {
        const filters = {
          level: selectedLevel !== "all" ? selectedLevel : undefined,
          search: searchQuery || undefined,
          page: 1,
          limit: 20,
        }

        const response = await getContentList('grammar', filters)
        setResult(response)
      } catch (error) {
        console.error('Failed to load grammar:', error)
        setResult({
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
          error: error instanceof Error ? error : new Error('Unknown error')
        })
      } finally {
        setLoading(false)
      }
    }

    loadGrammar()
  }, [selectedLevel, searchQuery])

  const filteredGrammar = result?.data || []

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <BookOpen className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Grammar Guide</h1>
              <p className="text-zinc-400">Master Chinese grammar patterns with examples and practice</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBarLite
          searchPlaceholder="Search grammar patterns..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          selectOptions={levelFilters}
          selectValue={selectedLevel}
          onSelectChange={setSelectedLevel}
        />

        {/* Content */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-48 bg-white/[0.02] border border-white/[0.06] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : result?.error ? (
          <ErrorDisplay
            error={result.error}
            onRetry={() => window.location.reload()}
          />
        ) : filteredGrammar.length > 0 ? (
          <>
            {/* Results header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-zinc-400">
                {selectedLevel === "all"
                  ? `Showing ${filteredGrammar.length} grammar patterns`
                  : `Showing ${filteredGrammar.length} ${selectedLevel} grammar patterns`
                }
              </p>
            </div>

            {/* Grammar Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredGrammar
                .filter((grammar): grammar is GrammarContent => grammar.type === 'grammar')
                .map((grammar) => (
                  <GrammarCard key={grammar.id} grammar={grammar} />
                ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={BookOpen}
            title={selectedLevel === "all" ? "No grammar patterns found" : `No ${selectedLevel} grammar patterns`}
            description={
              selectedLevel === "all"
                ? "Grammar patterns will appear here once published."
                : `No grammar patterns found for the ${selectedLevel} level.`
            }
            action={
              selectedLevel !== "all"
                ? {
                    label: "View all patterns",
                    onClick: () => setSelectedLevel("all"),
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
 * Grammar 卡片组件
 */
function GrammarCard({ grammar }: { grammar: GrammarContent }) {
  return (
    <Link href={`/grammar/${grammar.slug}`}>
      <GlassCard className="p-6 h-full hover:border-cyan-500/30 transition-all group cursor-pointer">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                {grammar.level}
              </Badge>
            </div>
            <div className="flex gap-2">
              <button className="text-zinc-500 hover:text-cyan-400 transition-colors">
                <BookmarkPlus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors mb-1">
              {grammar.pattern}
            </h3>
            {grammar.description && (
              <p className="text-sm text-zinc-400 line-clamp-3">{grammar.description}</p>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}