"use client"

import { useState, useMemo } from "react"
import { GlassCard } from "@/components/web/GlassCard"
import { EmptyState } from "@/components/web/EmptyState"
import { Button } from "@/components/ui/button"
import { srsQueue, type SrsCard } from "@/lib/web-mock"
import {
  Brain,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RotateCcw,
  Sparkles,
  Trophy,
  Zap,
  Clock,
  Target,
} from "lucide-react"
import { cn } from "@/lib/utils"

type ReviewResult = "remember" | "hard" | "forget"

interface ReviewStats {
  remembered: number
  hard: number
  forgot: number
  total: number
}

export default function SrsPage() {
  const [queue, setQueue] = useState(() =>
    srsQueue.filter((card) => card.due === "today")
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [stats, setStats] = useState<ReviewStats>({
    remembered: 0,
    hard: 0,
    forgot: 0,
    total: queue.length,
  })
  const [isComplete, setIsComplete] = useState(false)

  const currentCard = queue[currentIndex]
  const progress = Math.round(((currentIndex) / queue.length) * 100)

  const handleReveal = () => {
    setShowAnswer(true)
  }

  const handleAnswer = (result: ReviewResult) => {
    // Update stats
    setStats((prev) => ({
      ...prev,
      remembered: result === "remember" ? prev.remembered + 1 : prev.remembered,
      hard: result === "hard" ? prev.hard + 1 : prev.hard,
      forgot: result === "forget" ? prev.forgot + 1 : prev.forgot,
    }))

    // Move to next card or complete
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setShowAnswer(false)
    } else {
      setIsComplete(true)
    }
  }

  const handleRestart = () => {
    setQueue(srsQueue.filter((card) => card.due === "today"))
    setCurrentIndex(0)
    setShowAnswer(false)
    setStats({
      remembered: 0,
      hard: 0,
      forgot: 0,
      total: queue.length,
    })
    setIsComplete(false)
  }

  // Calculate upcoming cards
  const upcomingToday = queue.length - currentIndex - (isComplete ? 0 : 1)
  const upcomingTomorrow = srsQueue.filter((c) => c.due === "tomorrow").length

  if (queue.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Spaced Repetition</h1>
          <p className="text-zinc-400">Review your saved vocabulary</p>
        </div>
        <EmptyState
          icon={CheckCircle2}
          title="All caught up!"
          description="You have no cards due for review today. Great job staying on top of your studies!"
          action={{
            label: "Browse Learning Path",
            href: "/path",
          }}
        />
        <GlassCard>
          <h3 className="mb-4 font-semibold text-white">Upcoming Reviews</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white/5 p-4 text-center">
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-zinc-500">Due Today</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4 text-center">
              <p className="text-3xl font-bold text-amber-400">{upcomingTomorrow}</p>
              <p className="text-sm text-zinc-500">Due Tomorrow</p>
            </div>
          </div>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Spaced Repetition</h1>
          <p className="text-zinc-400">Review your saved vocabulary</p>
        </div>
        {!isComplete && (
          <div className="text-right">
            <p className="text-2xl font-bold text-white">
              {currentIndex + 1}/{queue.length}
            </p>
            <p className="text-sm text-zinc-500">cards remaining</p>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {!isComplete && (
        <div className="h-2 overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Card Stack */}
        <div className="lg:col-span-2">
          {!isComplete ? (
            <GlassCard glowColor="cyan" className="min-h-[400px] flex flex-col">
              {/* Card Front/Back */}
              <div className="flex-1 flex flex-col items-center justify-center py-8">
                {!showAnswer ? (
                  // Front of card - show word
                  <div className="text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20">
                      <Brain className="h-8 w-8 text-cyan-400" />
                    </div>
                    <p className="text-5xl font-bold text-white mb-2">
                      {currentCard.word}
                    </p>
                    <p className="text-sm text-zinc-500">
                      What does this word mean?
                    </p>
                  </div>
                ) : (
                  // Back of card - show answer
                  <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <p className="text-5xl font-bold text-white mb-2">
                      {currentCard.word}
                    </p>
                    <p className="text-2xl text-cyan-400 mb-1">
                      {currentCard.pinyin}
                    </p>
                    <p className="text-xl text-zinc-300">
                      {currentCard.meaning}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-white/10 pt-6">
                {!showAnswer ? (
                  <Button
                    onClick={handleReveal}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 py-6 text-lg"
                  >
                    Reveal Answer
                  </Button>
                ) : (
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleAnswer("forget")}
                      className="flex flex-col items-center gap-2 rounded-2xl bg-rose-500/10 py-4 text-rose-400 hover:bg-rose-500/20 transition-colors"
                    >
                      <XCircle className="h-8 w-8" />
                      <span className="text-sm font-medium">Forgot</span>
                      <span className="text-xs text-rose-400/60">Review again</span>
                    </button>
                    <button
                      onClick={() => handleAnswer("hard")}
                      className="flex flex-col items-center gap-2 rounded-2xl bg-amber-500/10 py-4 text-amber-400 hover:bg-amber-500/20 transition-colors"
                    >
                      <AlertCircle className="h-8 w-8" />
                      <span className="text-sm font-medium">Hard</span>
                      <span className="text-xs text-amber-400/60">1 day</span>
                    </button>
                    <button
                      onClick={() => handleAnswer("remember")}
                      className="flex flex-col items-center gap-2 rounded-2xl bg-emerald-500/10 py-4 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    >
                      <CheckCircle2 className="h-8 w-8" />
                      <span className="text-sm font-medium">Good</span>
                      <span className="text-xs text-emerald-400/60">{currentCard.interval * 2} days</span>
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          ) : (
            // Completion Screen
            <GlassCard glowColor="emerald" className="text-center py-12">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/20">
                <Trophy className="h-12 w-12 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Session Complete!
              </h2>
              <p className="text-zinc-400 mb-8">
                You've reviewed all your cards for today
              </p>

              {/* Stats Summary */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="rounded-2xl bg-emerald-500/10 p-4">
                  <p className="text-3xl font-bold text-emerald-400">
                    {stats.remembered}
                  </p>
                  <p className="text-sm text-zinc-500">Remembered</p>
                </div>
                <div className="rounded-2xl bg-amber-500/10 p-4">
                  <p className="text-3xl font-bold text-amber-400">
                    {stats.hard}
                  </p>
                  <p className="text-sm text-zinc-500">Hard</p>
                </div>
                <div className="rounded-2xl bg-rose-500/10 p-4">
                  <p className="text-3xl font-bold text-rose-400">
                    {stats.forgot}
                  </p>
                  <p className="text-sm text-zinc-500">Forgot</p>
                </div>
              </div>

              {/* Accuracy */}
              <div className="mb-8 rounded-2xl bg-white/5 p-6">
                <p className="text-sm text-zinc-500 mb-2">Accuracy</p>
                <p className="text-4xl font-bold text-white">
                  {stats.total > 0
                    ? Math.round((stats.remembered / stats.total) * 100)
                    : 0}
                  %
                </p>
              </div>

              <Button
                onClick={handleRestart}
                variant="outline"
                className="bg-transparent"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Review Again
              </Button>
            </GlassCard>
          )}
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          <GlassCard>
            <h3 className="mb-4 font-semibold text-white">Session Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Remembered
                </div>
                <span className="font-medium text-emerald-400">
                  {stats.remembered}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  Hard
                </div>
                <span className="font-medium text-amber-400">
                  {stats.hard}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                  <XCircle className="h-4 w-4 text-rose-400" />
                  Forgot
                </div>
                <span className="font-medium text-rose-400">
                  {stats.forgot}
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="mb-4 font-semibold text-white">Upcoming</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm text-zinc-300">Today</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {upcomingToday} left
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-zinc-300">Tomorrow</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {upcomingTomorrow}
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="mb-4 font-semibold text-white">Tips</h3>
            <div className="space-y-3 text-sm text-zinc-400">
              <div className="flex items-start gap-2">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <p>Try to recall the meaning before revealing the answer</p>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <p>Be honest with your ratings for better scheduling</p>
              </div>
              <div className="flex items-start gap-2">
                <Brain className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p>Visualize the word in a sentence for better retention</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
