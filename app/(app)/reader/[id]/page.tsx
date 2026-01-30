"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { ReaderVocabularyList } from "@/components/web/reader/ReaderVocabularyList"
import { usePreferences } from "@/lib/preferences-store"
import { getContentBySlug, type ReadingContent } from "@/lib/content"
import { markComplete, getProgress, updateProgress } from "@/lib/progress/api"
import { useToast } from "@/hooks/use-toast"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Type,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

type FontSize = "small" | "medium" | "large"

const fontSizeClasses: Record<FontSize, string> = {
  small: "text-lg leading-relaxed",
  medium: "text-xl leading-relaxed",
  large: "text-2xl leading-loose",
}

export default function ReaderPage() {
  const params = useParams()
  const router = useRouter()
  const readerId = params.id as string
  const { toast } = useToast()
  const contentRef = useRef<HTMLDivElement>(null)

  const [reading, setReading] = useState<ReadingContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use shared preferences store
  const preferences = usePreferences()
  const [showPinyin, setShowPinyin] = useState(preferences.showPinyin)
  const [showTranslation, setShowTranslation] = useState(preferences.showTranslation)
  const [fontSize, setFontSize] = useState<FontSize>("medium")

  const [addedToSrs, setAddedToSrs] = useState<Set<string>>(new Set())
  const [isCompleted, setIsCompleted] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  // Sync local state with preferences store on mount
  useEffect(() => {
    setShowPinyin(preferences.showPinyin)
    setShowTranslation(preferences.showTranslation)
  }, [preferences.showPinyin, preferences.showTranslation])

  // Load reading data and progress
  useEffect(() => {
    const loadReading = async () => {
      try {
        setLoading(true)
        const result = await getContentBySlug('reading', readerId)
        if (result.error) {
          setError(result.error.message)
        } else if (result.data) {
          setReading(result.data as ReadingContent)
          
          // Load progress
          const progress = await getProgress('reading', readerId)
          if (progress) {
            setIsCompleted(progress.completed)
            setReadingProgress(progress.progress_percentage)
            // 恢复阅读位置
            if (progress.last_position?.scrollPosition) {
              setTimeout(() => {
                window.scrollTo(0, progress.last_position.scrollPosition)
              }, 100)
            }
          }
        } else {
          setError('Reading not found')
        }
      } catch (err) {
        setError('Failed to load reading')
        console.error('Error loading reading:', err)
      } finally {
        setLoading(false)
      }
    }

    if (readerId) {
      loadReading()
    }
  }, [readerId])

  // 追踪滚动进度
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || isCompleted) return

      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollPercentage = Math.min(
        100,
        Math.round((scrollTop / (documentHeight - windowHeight)) * 100)
      )

      if (scrollPercentage !== readingProgress && scrollPercentage > readingProgress) {
        setReadingProgress(scrollPercentage)
        
        // 保存进度（防抖，每 5% 保存一次）
        if (scrollPercentage % 5 === 0 || scrollPercentage === 100) {
          updateProgress('reading', readerId, scrollPercentage, {
            scrollPosition: scrollTop,
            timestamp: Date.now(),
          }).catch((error) => {
            console.error('Failed to update reading progress:', error)
          })
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [readerId, readingProgress, isCompleted])

  const handleAddToSrs = (wordId: string) => {
    setAddedToSrs((prev) => new Set([...prev, wordId]))
  }

  const cycleFontSize = () => {
    const sizes: FontSize[] = ["small", "medium", "large"]
    const currentIndex = sizes.indexOf(fontSize)
    setFontSize(sizes[(currentIndex + 1) % sizes.length])
  }

  const handleComplete = async () => {
    setLoadingProgress(true)
    try {
      await markComplete('reading', readerId)
      setIsCompleted(true)
      toast({
        title: "阅读已完成！",
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <GlassCard className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-zinc-400">Loading reading...</p>
        </GlassCard>
      </div>
    )
  }

  if (error || !reading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <GlassCard className="text-center">
          <p className="text-zinc-400">{error || 'Reading not found'}</p>
          <Link href="/path">
            <Button className="mt-4">Back to Path</Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="mt-1 rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-rose-500/20 px-2 py-1 text-xs font-medium text-rose-400">
                {reading.level}
              </span>
              <span className="text-sm text-zinc-500">{reading.wordCount} words</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white">{reading.title}</h1>
            <p className="mt-1 text-zinc-400">{reading.description}</p>
          </div>
        </div>
      </div>

      {/* Glass Toolbar */}
      <GlassCard className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                showPinyin
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10"
              )}
            >
              {showPinyin ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Pinyin
            </button>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                showTranslation
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10"
              )}
            >
              {showTranslation ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Translation
            </button>
            <button
              onClick={cycleFontSize}
              className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-white/10 transition-all"
            >
              <Type className="h-4 w-4" />
              {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Learn by reading</span>
          </div>
        </div>
      </GlassCard>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reading Area */}
        <div className="lg:col-span-2 space-y-4">
          <GlassCard className="relative" ref={contentRef}>
            <div className="space-y-8">
              {reading.content.map((paragraph, pIdx) => (
                <div key={pIdx} className="group">
                  <p className={cn("text-white", fontSizeClasses[fontSize])}>
                    {paragraph}
                  </p>
                  {showPinyin && (
                    <p className="mt-2 text-sm text-cyan-400/80">
                      {/* For demo, we don't have pinyin per paragraph, so just show placeholder */}
                      [Pinyin would go here]
                    </p>
                  )}
                  {showTranslation && (
                    <p className="mt-2 text-sm text-zinc-500">
                      {/* For demo, we don't have translation per paragraph */}
                      [Translation would go here]
                    </p>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* 进度和完成按钮 */}
          <GlassCard>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">阅读进度</span>
                <span className="font-medium text-cyan-400">{readingProgress}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${readingProgress}%` }}
                />
              </div>
              {!isCompleted ? (
                <Button
                  onClick={handleComplete}
                  disabled={loadingProgress}
                  className="w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  {loadingProgress ? (
                    <>加载中...</>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      标记为已完成
                    </>
                  )}
                </Button>
              ) : (
                <div className="rounded-xl bg-emerald-500/20 p-3 text-center">
                  <CheckCircle2 className="mx-auto h-6 w-6 text-emerald-400" />
                  <p className="mt-1 text-sm font-medium text-emerald-400">阅读已完成！</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Right Side - Vocabulary List */}
        <div className="space-y-6">
          <ReaderVocabularyList
            vocabularyList={reading.vocabulary_list}
            onAddToSrs={handleAddToSrs}
            addedWords={addedToSrs}
          />
        </div>
      </div>
    </div>
  )
}
