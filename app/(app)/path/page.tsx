"use client"

import { useState, useMemo, useEffect } from "react"
import useSWR from "swr"
import { GlassCard } from "@/components/web/GlassCard"
import { TabsBar } from "@/components/web/TabsBar"
import { FilterBarLite } from "@/components/web/FilterBarLite"
import { Button } from "@/components/ui/button"
import {
  pathLevels,
  itemsByLevel,
  mockProgress,
  type HSKLevel,
} from "@/lib/web-mock"
import {
  BookOpen,
  FileText,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Target,
  Award,
  Lightbulb,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

const levelTabs = pathLevels.map((l) => ({ id: l.level, label: l.level }))

const tagOptions = [
  { value: "all", label: "All Tags" },
  { value: "basics", label: "Basics" },
  { value: "dialogue", label: "Dialogue" },
  { value: "story", label: "Story" },
  { value: "culture", label: "Culture" },
  { value: "practical", label: "Practical" },
]

export default function PathPage() {
  const [activeLevel, setActiveLevel] = useState<HSKLevel>("HSK2")
  const [searchQuery, setSearchQuery] = useState("")
  const [tagFilter, setTagFilter] = useState("all")
  const [progress] = useState(mockProgress)

  // 获取个性化推荐（基于当前级别）
  const {
    data: recommendations,
    error: recError,
    isLoading: recLoading
  } = useSWR(
    `path-recommendations-${activeLevel}`,
    async () => {
      const { getPathRecommendations } = await import('@/lib/recommendations')
      return getPathRecommendations(activeLevel, 4)
    }
  )

  const currentLevelData = pathLevels.find((l) => l.level === activeLevel)
  const currentItems = itemsByLevel[activeLevel]

  // Filter lessons and readers
  const filteredLessons = useMemo(() => {
    return currentItems.lessons.filter((lesson) => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = tagFilter === "all" || lesson.tags.some((t) => t.toLowerCase() === tagFilter)
      return matchesSearch && matchesTag
    })
  }, [currentItems.lessons, searchQuery, tagFilter])

  const filteredReaders = useMemo(() => {
    return currentItems.readers.filter((reader) => {
      const matchesSearch = reader.title.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = tagFilter === "all" || reader.tags.some((t) => t.toLowerCase() === tagFilter)
      return matchesSearch && matchesTag
    })
  }, [currentItems.readers, searchQuery, tagFilter])

  // Find next unfinished item for "Continue" card
  const nextItem = useMemo(() => {
    const unfinishedLesson = currentItems.lessons.find(
      (l) => !progress.completedLessonIds.includes(l.id)
    )
    if (unfinishedLesson) {
      return { type: "lesson" as const, item: unfinishedLesson }
    }
    const unfinishedReader = currentItems.readers.find(
      (r) => !progress.completedReaderIds.includes(r.id)
    )
    if (unfinishedReader) {
      return { type: "reader" as const, item: unfinishedReader }
    }
    return null
  }, [currentItems, progress])

  const completedMilestones = currentLevelData?.milestones.filter((m) => m.isCompleted).length || 0
  const totalMilestones = currentLevelData?.milestones.length || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Learning Path</h1>
          <p className="text-zinc-400">Progress through structured lessons and readings</p>
        </div>
        <TabsBar tabs={levelTabs} activeTab={activeLevel} onTabChange={(t) => setActiveLevel(t as HSKLevel)} />
      </div>

      {/* Level Overview */}
      <GlassCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-cyan-500/20 px-3 py-1 text-sm font-medium text-cyan-400">
                {activeLevel}
              </span>
              <h2 className="text-xl font-semibold text-white">{currentLevelData?.title}</h2>
            </div>
            <p className="mt-1 text-zinc-400">{currentLevelData?.description}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{filteredLessons.length}</p>
              <p className="text-xs text-zinc-500">Lessons</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{filteredReaders.length}</p>
              <p className="text-xs text-zinc-500">Readers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">{completedMilestones}/{totalMilestones}</p>
              <p className="text-xs text-zinc-500">Milestones</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Continue Card */}
      {nextItem && (
        <GlassCard>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20">
                <Sparkles className="h-6 w-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-zinc-400">Continue where you left off</p>
                <p className="font-semibold text-white">{nextItem.item.title}</p>
              </div>
            </div>
            <Link href={nextItem.type === "lesson" ? `/lesson/${nextItem.item.id}` : `/reader/${nextItem.item.id}`}>
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                Continue
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </GlassCard>
      )}

      {/* 智能推荐区块 */}
      {!recLoading && recommendations && recommendations.length > 0 && (
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <Lightbulb className="h-5 w-5 text-amber-400" />
            智能推荐（基于您的学习进度）
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recommendations.map((rec) => {
              const Icon = rec.content.type === 'lesson' ? BookOpen : FileText
              const colorClass = rec.content.type === 'lesson' ? 'text-amber-400' : 'text-rose-400'
              const bgClass = rec.content.type === 'lesson' ? 'bg-amber-500/20' : 'bg-rose-500/20'
              const href = rec.content.type === 'lesson' ? `/lesson/${rec.content.id}` : `/reader/${rec.content.id}`
              
              return (
                <Link key={rec.content.id} href={href}>
                  <GlassCard className="group h-full cursor-pointer transition-all hover:border-amber-500/30">
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", bgClass)}>
                        <Icon className={cn("h-4 w-4", colorClass)} />
                      </div>
                      <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-400">
                        {rec.score.total.toFixed(0)}分
                      </span>
                    </div>
                    <h4 className="font-medium text-white mb-2 group-hover:text-amber-400 transition-colors line-clamp-1">
                      {rec.content.title}
                    </h4>
                    <p className="text-xs text-zinc-500 mb-2 line-clamp-2">
                      {rec.content.description}
                    </p>
                    <div className="text-xs text-amber-400/80">
                      💡 {rec.reason}
                    </div>
                  </GlassCard>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Milestones */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <Target className="h-5 w-5 text-cyan-400" />
          Milestones
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {currentLevelData?.milestones.map((milestone) => (
            <GlassCard
              key={milestone.id}
              className={cn(
                "transition-all",
                milestone.isCompleted && "border-emerald-500/30"
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-white">{milestone.title}</h4>
                  <p className="mt-1 text-sm text-zinc-400">{milestone.description}</p>
                </div>
                {milestone.isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <Award className="h-5 w-5 shrink-0 text-zinc-600" />
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBarLite
        searchPlaceholder="Search lessons and readers..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        selectOptions={tagOptions}
        selectValue={tagFilter}
        onSelectChange={setTagFilter}
      />

      {/* Lessons Grid */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <BookOpen className="h-5 w-5 text-amber-400" />
          Lessons
        </h3>
        {filteredLessons.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredLessons.map((lesson) => {
              const isCompleted = progress.completedLessonIds.includes(lesson.id)
              return (
                <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                  <GlassCard
                    className={cn(
                      "group h-full cursor-pointer transition-all hover:border-amber-500/30",
                      isCompleted && "border-emerald-500/30"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <span className="rounded-lg bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-400">
                        {lesson.level}
                      </span>
                      {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <h4 className="mt-3 font-medium text-white group-hover:text-amber-400 transition-colors">
                      {lesson.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{lesson.summary}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {lesson.durationMin} min
                      </span>
                      <span>{lesson.tags[0]}</span>
                    </div>
                  </GlassCard>
                </Link>
              )
            })}
          </div>
        ) : (
          <GlassCard className="py-8 text-center text-zinc-500">
            No lessons found for this level yet.
          </GlassCard>
        )}
      </div>

      {/* Readers Grid */}
      <div>
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <FileText className="h-5 w-5 text-rose-400" />
          Readers
        </h3>
        {filteredReaders.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredReaders.map((reader) => {
              const isCompleted = progress.completedReaderIds.includes(reader.id)
              return (
                <Link key={reader.id} href={`/reader/${reader.id}`}>
                  <GlassCard
                    className={cn(
                      "group h-full cursor-pointer transition-all hover:border-rose-500/30",
                      isCompleted && "border-emerald-500/30"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <span className="rounded-lg bg-rose-500/20 px-2 py-1 text-xs font-medium text-rose-400">
                        {reader.level}
                      </span>
                      {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    </div>
                    <h4 className="mt-3 font-medium text-white group-hover:text-rose-400 transition-colors">
                      {reader.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{reader.summary}</p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-zinc-500">
                      <span>{reader.wordCount} words</span>
                      <span>{reader.tags[0]}</span>
                    </div>
                  </GlassCard>
                </Link>
              )
            })}
          </div>
        ) : (
          <GlassCard className="py-8 text-center text-zinc-500">
            No readers found for this level yet.
          </GlassCard>
        )}
      </div>
    </div>
  )
}
