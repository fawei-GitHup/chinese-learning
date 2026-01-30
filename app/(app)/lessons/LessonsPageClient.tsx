"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GlassCard } from "@/components/web/GlassCard"
import { FilterBarLite } from "@/components/web/FilterBarLite"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/web/EmptyState"
import { ErrorDisplay } from "@/components/web/ErrorDisplay"
import { getContentList, type ContentListResult, type LessonContent } from "@/lib/content"
import { BookOpen, Clock, Star, BookmarkPlus } from "lucide-react"

const levelFilters = [
  { value: "all", label: "All Levels" },
  { value: "HSK1", label: "HSK1" },
  { value: "HSK2", label: "HSK2" },
  { value: "HSK3", label: "HSK3" },
  { value: "HSK4", label: "HSK4" },
  { value: "HSK5", label: "HSK5" },
  { value: "HSK6", label: "HSK6" },
]

export function LessonsPageClient() {
  const [result, setResult] = useState<ContentListResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadLessons = async () => {
      setLoading(true)
      try {
        const filters = {
          level: selectedLevel !== "all" ? selectedLevel : undefined,
          search: searchQuery || undefined,
          page: 1,
          limit: 20,
        }

        const response = await getContentList('lesson', filters)
        setResult(response)
      } catch (error) {
        console.error('Failed to load lessons:', error)
        setResult({
          data: [],
          pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
          error: error instanceof Error ? error : new Error('Unknown error')
        })
      } finally {
        setLoading(false)
      }
    }

    loadLessons()
  }, [selectedLevel, searchQuery])

  const filteredLessons = result?.data || []

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/30">
              <BookOpen className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Lessons</h1>
              <p className="text-zinc-400">Master conversational Chinese through interactive lessons</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBarLite
          searchPlaceholder="Search lessons..."
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
        ) : filteredLessons.length > 0 ? (
          <>
            {/* Results header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-zinc-400">
                {selectedLevel === "all"
                  ? `Showing ${filteredLessons.length} lessons`
                  : `Showing ${filteredLessons.length} ${selectedLevel} lessons`
                }
              </p>
            </div>

            {/* Lessons Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredLessons
                .filter((lesson): lesson is LessonContent => lesson.type === 'lesson')
                .map((lesson) => (
                  <LessonCard key={lesson.id} lesson={lesson} />
                ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={BookOpen}
            title={selectedLevel === "all" ? "No lessons found" : `No ${selectedLevel} lessons`}
            description={
              selectedLevel === "all"
                ? "Lessons will appear here once published."
                : `No lessons found for the ${selectedLevel} level.`
            }
            action={
              selectedLevel !== "all"
                ? {
                    label: "View all lessons",
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
 * Lesson 卡片组件
 */
function LessonCard({ lesson }: { lesson: LessonContent }) {
  return (
    <Link href={`/lesson/${lesson.slug}`}>
      <GlassCard className="p-6 h-full hover:border-amber-500/30 transition-all group cursor-pointer">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-amber-500/30 text-amber-400">
                {lesson.level}
              </Badge>
            </div>
            <div className="flex gap-2">
              <button className="text-zinc-500 hover:text-amber-400 transition-colors">
                <BookmarkPlus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-amber-300 transition-colors mb-1">
              {lesson.title}
            </h3>
            {lesson.description && (
              <p className="text-sm text-zinc-400 line-clamp-2">{lesson.description}</p>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-white/[0.06]">
            {lesson.durationMin && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lesson.durationMin} min
              </span>
            )}
            {lesson.tags && lesson.tags.length > 0 && (
              <span>{lesson.tags[0]}</span>
            )}
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}