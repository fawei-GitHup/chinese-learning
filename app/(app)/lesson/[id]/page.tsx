"use client"

import React from "react"

import { useState, useMemo, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { lessons, srsQueue, type VocabWord, type SrsCard } from "@/lib/web-mock"
import { usePreferences } from "@/lib/preferences-store"
import {
  ArrowLeft,
  Clock,
  BookOpen,
  Headphones,
  PenTool,
  CheckCircle2,
  Plus,
  Eye,
  EyeOff,
  Volume2,
  Check,
  ChevronRight,
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

  const lesson = lessons.find((l) => l.id === lessonId)

  // Use shared preferences store
  const preferences = usePreferences()
  
  const [currentStep, setCurrentStep] = useState<LessonStep>("preview")
  const [showPinyin, setShowPinyin] = useState(preferences.showPinyin)
  const [showTranslation, setShowTranslation] = useState(preferences.showTranslation)
  const [addedToSrs, setAddedToSrs] = useState<Set<string>>(new Set())
  
  // Sync local state with preferences store on mount
  useEffect(() => {
    setShowPinyin(preferences.showPinyin)
    setShowTranslation(preferences.showTranslation)
  }, [preferences.showPinyin, preferences.showTranslation])
  const [markedKnown, setMarkedKnown] = useState<Set<string>>(new Set())
  const [isCompleted, setIsCompleted] = useState(false)

  const currentStepIndex = stepConfig.findIndex((s) => s.id === currentStep)

  const handleAddToSrs = (word: VocabWord) => {
    setAddedToSrs((prev) => new Set([...prev, word.word]))
  }

  const handleMarkKnown = (word: VocabWord) => {
    setMarkedKnown((prev) => new Set([...prev, word.word]))
  }

  const handleNextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < stepConfig.length) {
      setCurrentStep(stepConfig[nextIndex].id)
    }
  }

  const handleComplete = () => {
    setIsCompleted(true)
  }

  if (!lesson) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <GlassCard className="text-center">
          <p className="text-zinc-400">Lesson not found</p>
          <Link href="/path">
            <Button className="mt-4">Back to Path</Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
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
            <p className="mt-1 text-zinc-400">{lesson.summary}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {lesson.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
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
          <GlassCard glowColor="amber">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <BookOpen className="h-5 w-5 text-amber-400" />
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
            <GlassCard glowColor="emerald">
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
                  className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Mark Lesson Complete
                </Button>
              ) : (
                <div className="mt-4 rounded-xl bg-emerald-500/20 p-4 text-center">
                  <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-400" />
                  <p className="mt-2 font-medium text-emerald-400">Lesson Completed!</p>
                  <Link href="/path">
                    <Button variant="outline" className="mt-3 bg-transparent">
                      Back to Path
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
                        <button
                          onClick={() => handleAddToSrs(word)}
                          disabled={isAdded || isKnown}
                          className={cn(
                            "rounded-lg p-1.5 transition-colors",
                            isAdded
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-white/5 text-zinc-400 hover:bg-cyan-500/20 hover:text-cyan-400"
                          )}
                          title="Add to SRS"
                        >
                          {isAdded ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </button>
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
  )
}
