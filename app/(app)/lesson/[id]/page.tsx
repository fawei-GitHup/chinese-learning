"use client"

import React from "react"

import { useState, useMemo, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { ErrorDisplay } from "@/components/web/ErrorDisplay"
import { AddToSRSButton } from "@/components/srs/AddToSRSButton"
import { getContentBySlug, type FullLessonContent, type ContentDetailResult } from "@/lib/content"
import { usePreferences } from "@/lib/preferences-store"
import { markComplete, getProgress, updateProgress } from "@/lib/progress/api"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Headphones,
  PenTool,
  CheckCircle2,
  Eye,
  EyeOff,
  Volume2,
  Check,
  ChevronRight,
  BookmarkPlus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

type LessonStep = "preview" | "listen" | "practice" | "review"

const stepConfig: { id: LessonStep; label: string; icon: React.ReactNode }[] = [
  { id: "preview", label: "Preview", icon: <Eye className="h-4 w-4" /> },
  { id: "listen", label: "Listen", icon: <Headphones className="h-4 w-4" /> },
  { id: "practice", label: "Practice", icon: <PenTool className="h-4 w-4" /> },
  { id: "review", label: "Review", icon: <CheckCircle2 className="h-4 w-4" /> },
]

export default function LessonPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.id as string
  const { toast } = useToast()

  const [result, setResult] = useState<ContentDetailResult | null>(null)
  const [loading, setLoading] = useState(true)

  // Use shared preferences store
  const preferences = usePreferences()

  const [currentStep, setCurrentStep] = useState<LessonStep>("preview")
  const [showPinyin, setShowPinyin] = useState(preferences.showPinyin)
  const [showTranslation, setShowTranslation] = useState(preferences.showTranslation)
  const [addedToSrs, setAddedToSrs] = useState<Set<string>>(new Set())
  const [markedKnown, setMarkedKnown] = useState<Set<string>>(new Set())
  const [isCompleted, setIsCompleted] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(false)

  // Load lesson data and progress
  useEffect(() => {
    const loadLesson = async () => {
      setLoading(true)
      try {
        const response = await getContentBySlug('lesson', lessonId)
        setResult(response)
        
        // Load progress
        const progress = await getProgress('lesson', lessonId)
        if (progress) {
          setIsCompleted(progress.completed)
        }
      } catch (error) {
        console.error('Failed to load lesson:', error)
        setResult({
          data: null,
          error: error instanceof Error ? error : new Error('Unknown error')
        })
      } finally {
        setLoading(false)
      }
    }

    loadLesson()
  }, [lessonId])

  // Sync local state with preferences store on mount
  useEffect(() => {
    setShowPinyin(preferences.showPinyin)
    setShowTranslation(preferences.showTranslation)
  }, [preferences.showPinyin, preferences.showTranslation])

  const lesson = result?.data as FullLessonContent | null

  const currentStepIndex = stepConfig.findIndex((s) => s.id === currentStep)

  const handleAddToSrs = (word: any) => {
    setAddedToSrs((prev) => new Set([...prev, word.word]))
  }

  const handleMarkKnown = (word: any) => {
    setMarkedKnown((prev) => new Set([...prev, word.word]))
  }

  const handleNextStep = async () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < stepConfig.length) {
      setCurrentStep(stepConfig[nextIndex].id)
      // 更新进度百分比
      const percentage = ((nextIndex + 1) / stepConfig.length) * 100
      try {
        await updateProgress('lesson', lessonId, Math.round(percentage))
      } catch (error) {
        console.error('Failed to update progress:', error)
      }
    }
  }

  const handleComplete = async () => {
    setLoadingProgress(true)
    try {
      await markComplete('lesson', lessonId)
      setIsCompleted(true)
      toast({
        title: "课程已完成！",
        description: "您的学习进度已保存。",
      })
    } catch (error) {
      console.error('Failed to mark complete:', error)
      toast({
        title: "保存失败",
        description: "无法保存您的进度，请稍后重试。",
        variant: "destructive",
      })
    } finally {
      setLoadingProgress(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/[0.08] rounded w-1/4" />
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-32 bg-white/[0.04] rounded-lg" />
                <div className="h-64 bg-white/[0.04] rounded-lg" />
              </div>
              <div className="h-96 bg-white/[0.04] rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (result?.error || !lesson) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        {result?.error ? (
          <ErrorDisplay
            error={result.error}
            onRetry={() => window.location.reload()}
          />
        ) : (
          <GlassCard className="text-center">
            <p className="text-zinc-400">Lesson not found</p>
            <div className="flex gap-4 mt-4">
              <button onClick={() => router.back()} className="text-sm text-zinc-400 hover:text-white">
                ← Back
              </button>
              <Link href="/lessons">
                <Button>Browse Lessons</Button>
              </Link>
            </div>
          </GlassCard>
        )}
      </div>
    )
  }

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": lesson.title,
            "description": lesson.description || '',
            "author": {
              "@type": "Organization",
              "name": "Learn Chinese"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Learn Chinese",
              "url": "https://learn-chinese.example.com"
            },
            "datePublished": lesson.createdAt || new Date().toISOString(),
            "dateModified": lesson.updatedAt || new Date().toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://learn-chinese.example.com/lesson/${lesson.slug}`
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://learn-chinese.example.com"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Lessons",
                  "item": "https://learn-chinese.example.com/lessons"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": lesson.title,
                  "item": `https://learn-chinese.example.com/lesson/${lesson.slug}`
                }
              ]
            }
          })
        }}
      />

      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="mt-1 rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-amber-500/20 px-2 py-1 text-xs font-medium text-amber-400">
                {lesson.level}
              </span>
              <span className="flex items-center gap-1 text-sm text-zinc-500">
                <Clock className="h-3 w-3" />
                {lesson.durationMin} min
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white">{lesson.title}</h1>
            <p className="mt-1 text-zinc-400">{String(lesson.description || '')}</p>
            {lesson.tags && (
              <div className="mt-2 flex flex-wrap gap-2">
                {lesson.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className={cn(
              "p-2 rounded-lg transition-colors",
              bookmarked
                ? "bg-yellow-500/20 text-yellow-400"
                : "text-zinc-500 hover:bg-white/[0.06] hover:text-yellow-400"
            )}
            title={bookmarked ? "Remove bookmark" : "Bookmark this lesson"}
          >
            <BookmarkPlus className={cn("h-5 w-5", bookmarked && "fill-current")} />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Content Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Toggles */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                showPinyin ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-zinc-400"
              )}
            >
              {showPinyin ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Pinyin
            </button>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                showTranslation ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-zinc-400"
              )}
            >
              {showTranslation ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Translation
            </button>
          </div>

          {/* Dialogue Cards */}
          <GlassCard glowColor="gold">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <BookOpen className="h-5 w-5 text-yellow-400" />
              Dialogue
            </h3>
            <div className="space-y-4">
              {lesson.dialogue.map((line, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-xl p-4 transition-all",
                    idx % 2 === 0 ? "bg-white/5" : "bg-cyan-500/5"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                        {line.speaker}
                      </span>
                    </div>
                    <button className="rounded-lg p-1 text-zinc-500 hover:bg-white/10 hover:text-white">
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-2 text-xl text-white">{line.zh}</p>
                  {showPinyin && (
                    <p className="mt-1 text-sm text-cyan-400">{line.pinyin}</p>
                  )}
                  {showTranslation && (
                    <p className="mt-1 text-sm text-zinc-400">{line.en}</p>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Practice Section (shown on practice step) */}
          {currentStep === "practice" && (
            <GlassCard>
              <h3 className="mb-4 text-lg font-semibold text-white">Practice Exercise</h3>
              <p className="text-zinc-400">
                Try to recall the dialogue from memory. Cover the translations and test yourself!
              </p>
              <div className="mt-4 rounded-xl bg-white/5 p-4">
                <p className="text-sm text-zinc-500 mb-2">Fill in the blank:</p>
                <p className="text-lg text-white">
                  A: 你好！你叫 _____ 名字？
                </p>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10">
                    什么
                  </button>
                  <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10">
                    哪里
                  </button>
                  <button className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 hover:bg-white/10">
                    怎么
                  </button>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Review Section (shown on review step) */}
          {currentStep === "review" && (
            <GlassCard glowColor="jade">
              <h3 className="mb-4 text-lg font-semibold text-white">Lesson Summary</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-sm text-zinc-500">Words Learned</p>
                  <p className="text-2xl font-bold text-white">{lesson.vocab.length}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-sm text-zinc-500">Added to SRS</p>
                  <p className="text-2xl font-bold text-emerald-400">{addedToSrs.size}</p>
                </div>
              </div>
              {!isCompleted ? (
                <Button
                  onClick={handleComplete}
                  disabled={loadingProgress}
                  className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  {loadingProgress ? (
                    <>加载中...</>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      标记课程为完成
                    </>
                  )}
                </Button>
              ) : (
                <div className="mt-4 rounded-xl bg-emerald-500/20 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
                  <p className="mt-2 font-medium text-emerald-400">课程已完成！</p>
                  <Link href="/dashboard">
                    <Button variant="outline" className="mt-3 bg-transparent">
                      返回学习面板
                    </Button>
                  </Link>
                </div>
              )}
            </GlassCard>
          )}
        </div>

        {/* Right Rail */}
        <div className="space-y-4">
          {/* Step Navigation */}
          <GlassCard>
            <h3 className="mb-4 font-semibold text-white">Learning Steps</h3>
            <div className="space-y-2">
              {stepConfig.map((step, idx) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all",
                    currentStep === step.id
                      ? "bg-cyan-500/20 text-cyan-400"
                      : idx < currentStepIndex
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-white/5 text-zinc-400 hover:bg-white/10"
                  )}
                >
                  <span className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                    currentStep === step.id
                      ? "bg-cyan-500 text-white"
                      : idx < currentStepIndex
                        ? "bg-emerald-500 text-white"
                        : "bg-white/10"
                  )}>
                    {idx < currentStepIndex ? <Check className="h-3 w-3" /> : idx + 1}
                  </span>
                  <span className="flex-1">{step.label}</span>
                  {step.icon}
                </button>
              ))}
            </div>
            {currentStepIndex < stepConfig.length - 1 && (
              <Button onClick={handleNextStep} className="mt-4 w-full">
                Next: {stepConfig[currentStepIndex + 1]?.label}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </GlassCard>

          {/* Vocabulary Panel */}
          <GlassCard>
            <h3 className="mb-4 font-semibold text-white">Vocabulary</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {lesson.vocab.map((word) => {
                const isAdded = addedToSrs.has(word.word)
                const isKnown = markedKnown.has(word.word)
                return (
                  <div
                    key={word.word}
                    className={cn(
                      "rounded-xl bg-white/5 p-3 transition-all",
                      isKnown && "opacity-50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-lg font-medium text-white">{word.word}</p>
                        <p className="text-sm text-cyan-400">{word.pinyin}</p>
                        <p className="text-sm text-zinc-400">{word.meaning}</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <AddToSRSButton
                          contentType="vocabulary"
                          content={{
                            front: word.word,
                            back: word.meaning,
                            pinyin: word.pinyin,
                            example: word.key_points?.[0],
                          }}
                          sourceType="lesson"
                          sourceId={lesson.id}
                          variant="icon"
                          onSuccess={() => handleAddToSrs(word)}
                        />
                        <button
                          onClick={() => handleMarkKnown(word)}
                          disabled={isKnown}
                          className={cn(
                            "rounded-lg p-1.5 transition-colors",
                            isKnown
                              ? "bg-zinc-500/20 text-zinc-500"
                              : "bg-white/5 text-zinc-400 hover:bg-white/10"
                          )}
                          title="Mark as known"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    {word.key_points.length > 0 && (
                      <div className="mt-2 text-xs text-zinc-500">
                        {word.key_points[0]}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
    </>
  )
}
