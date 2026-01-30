"use client"

import { useState, useEffect } from "react"
import { GlassCard } from "@/components/web/GlassCard"
import { EmptyState } from "@/components/web/EmptyState"
import { Button } from "@/components/ui/button"
import { getDueCards, recordReview, getReviewStats } from "@/lib/srs/api"
import type { SRSCard, ReviewQuality } from "@/lib/srs/types"
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
  Loader2,
  BarChart3,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"

interface SessionStats {
  again: number      // Again (0)
  hard: number       // Hard (2)
  good: number       // Good (3)
  easy: number       // Easy (5)
  total: number
}

export default function SrsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  const [queue, setQueue] = useState<SRSCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [stats, setStats] = useState<SessionStats>({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
    total: 0,
  })
  const [isComplete, setIsComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isReviewing, setIsReviewing] = useState(false)

  // 加载今日到期卡片
  useEffect(() => {
    if (authLoading) return
    
    if (!user) {
      router.push('/login')
      return
    }

    loadDueCards()
  }, [user, authLoading, router])

  async function loadDueCards() {
    try {
      setIsLoading(true)
      setError(null)
      const cards = await getDueCards(50) // 一次加载最多50张
      setQueue(cards)
      setStats(prev => ({ ...prev, total: cards.length }))
      setIsComplete(cards.length === 0)
    } catch (err) {
      console.error('加载卡片失败:', err)
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setIsLoading(false)
    }
  }

  const currentCard = queue[currentIndex]
  const progress = queue.length > 0 ? Math.round(((currentIndex) / queue.length) * 100) : 0

  const handleReveal = () => {
    setShowAnswer(true)
  }

  const handleAnswer = async (quality: ReviewQuality) => {
    if (!currentCard || isReviewing) return

    try {
      setIsReviewing(true)
      
      // 记录复习到数据库
      await recordReview({
        card_id: currentCard.id,
        quality,
      })

      // 更新统计
      setStats((prev) => {
        const updated = { ...prev }
        if (quality === 0) updated.again += 1
        else if (quality === 2) updated.hard += 1
        else if (quality === 3) updated.good += 1
        else if (quality === 5) updated.easy += 1
        return updated
      })

      // 移动到下一张卡片或完成
      if (currentIndex < queue.length - 1) {
        setCurrentIndex((prev) => prev + 1)
        setShowAnswer(false)
      } else {
        setIsComplete(true)
      }
    } catch (err) {
      console.error('记录复习失败:', err)
      setError(err instanceof Error ? err.message : '记录失败')
    } finally {
      setIsReviewing(false)
    }
  }

  const handleRestart = () => {
    loadDueCards()
    setCurrentIndex(0)
    setShowAnswer(false)
    setStats({
      again: 0,
      hard: 0,
      good: 0,
      easy: 0,
      total: queue.length,
    })
    setIsComplete(false)
  }

  // 计算即将复习的卡片数
  const upcomingToday = queue.length - currentIndex - (isComplete ? 0 : 1)

  // 加载状态
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-zinc-400">加载中...</p>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">间隔复习</h1>
          <p className="text-zinc-400">复习您保存的词汇</p>
        </div>
        <GlassCard>
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-rose-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">加载失败</h3>
            <p className="text-zinc-400 mb-4">{error}</p>
            <Button onClick={loadDueCards}>重试</Button>
          </div>
        </GlassCard>
      </div>
    )
  }

  // 无卡片状态
  if (queue.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">间隔复习</h1>
          <p className="text-zinc-400">复习您保存的词汇</p>
        </div>
        <EmptyState
          icon={CheckCircle2}
          title="今日已完成！"
          description="您今天没有需要复习的卡片。继续保持学习的好习惯！"
          action={{
            label: "浏览学习路径",
            href: "/path",
          }}
        />
        <GlassCard>
          <h3 className="mb-4 font-semibold text-white">即将到期</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-white/5 p-4 text-center">
              <p className="text-3xl font-bold text-white">0</p>
              <p className="text-sm text-zinc-500">今日待复习</p>
            </div>
            <div className="rounded-xl bg-white/5 p-4 text-center">
              <p className="text-3xl font-bold text-amber-400">-</p>
              <p className="text-sm text-zinc-500">明日待复习</p>
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
          <h1 className="text-2xl font-bold text-white">间隔复习</h1>
          <p className="text-zinc-400">复习您保存的词汇</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/srs/stats')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            查看统计
          </Button>
          {!isComplete && (
            <div className="text-right">
              <p className="text-2xl font-bold text-white">
                {currentIndex + 1}/{queue.length}
              </p>
              <p className="text-sm text-zinc-500">张卡片</p>
            </div>
          )}
        </div>
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
            <GlassCard glowColor="jade" className="min-h-[400px] flex flex-col">
              {/* Card Front/Back */}
              <div className="flex-1 flex flex-col items-center justify-center py-8">
                {!showAnswer ? (
                  // Front of card - show question
                  <div className="text-center">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/20">
                      <Brain className="h-8 w-8 text-cyan-400" />
                    </div>
                    <p className="text-5xl font-bold text-white mb-2">
                      {currentCard.content.front}
                    </p>
                    <p className="text-sm text-zinc-500">
                      这个词/句是什么意思？
                    </p>
                  </div>
                ) : (
                  // Back of card - show answer
                  <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <p className="text-5xl font-bold text-white mb-2">
                      {currentCard.content.front}
                    </p>
                    {currentCard.content.pinyin && (
                      <p className="text-2xl text-cyan-400 mb-1">
                        {currentCard.content.pinyin}
                      </p>
                    )}
                    <p className="text-xl text-zinc-300">
                      {currentCard.content.back}
                    </p>
                    {currentCard.content.example && (
                      <p className="text-sm text-zinc-500 mt-4 italic">
                        例句：{currentCard.content.example}
                      </p>
                    )}
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
                    显示答案
                  </Button>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {/* Again (0) */}
                    <button
                      onClick={() => handleAnswer(0)}
                      disabled={isReviewing}
                      className="flex flex-col items-center gap-2 rounded-2xl bg-rose-500/10 py-4 text-rose-400 hover:bg-rose-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="h-6 w-6" />
                      <span className="text-xs font-medium">不认识</span>
                      <span className="text-xs text-rose-400/60">&lt;1天</span>
                    </button>

                    {/* Hard (2) */}
                    <button
                      onClick={() => handleAnswer(2)}
                      disabled={isReviewing}
                      className="flex flex-col items-center gap-2 rounded-2xl bg-amber-500/10 py-4 text-amber-400 hover:bg-amber-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <AlertCircle className="h-6 w-6" />
                      <span className="text-xs font-medium">模糊</span>
                      <span className="text-xs text-amber-400/60">
                        {currentCard.difficulty === 0 ? "1天" : 
                         currentCard.difficulty === 1 ? "1天" : 
                         `${Math.round(currentCard.interval * 1.2)}天`}
                      </span>
                    </button>

                    {/* Good (3) */}
                    <button
                      onClick={() => handleAnswer(3)}
                      disabled={isReviewing}
                      className="flex flex-col items-center gap-2 rounded-2xl bg-emerald-500/10 py-4 text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckCircle2 className="h-6 w-6" />
                      <span className="text-xs font-medium">认识</span>
                      <span className="text-xs text-emerald-400/60">
                        {currentCard.difficulty === 0 ? "1天" : 
                         currentCard.difficulty === 1 ? "6天" : 
                         `${Math.round(currentCard.interval * currentCard.ease_factor)}天`}
                      </span>
                    </button>

                    {/* Easy (5) */}
                    <button
                      onClick={() => handleAnswer(5)}
                      disabled={isReviewing}
                      className="flex flex-col items-center gap-2 rounded-2xl bg-cyan-500/10 py-4 text-cyan-400 hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Sparkles className="h-6 w-6" />
                      <span className="text-xs font-medium">简单</span>
                      <span className="text-xs text-cyan-400/60">
                        {currentCard.difficulty === 0 ? "6天" : 
                         currentCard.difficulty === 1 ? "10天" : 
                         `${Math.round(currentCard.interval * currentCard.ease_factor * 1.3)}天`}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          ) : (
            // Completion Screen
            <GlassCard glowColor="jade" className="text-center py-12">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-emerald-500/20">
                <Trophy className="h-12 w-12 text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                复习完成！
              </h2>
              <p className="text-zinc-400 mb-8">
                您已完成今日所有复习卡片
              </p>

              {/* Stats Summary */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="rounded-2xl bg-rose-500/10 p-4">
                  <p className="text-3xl font-bold text-rose-400">
                    {stats.again}
                  </p>
                  <p className="text-sm text-zinc-500">不认识</p>
                </div>
                <div className="rounded-2xl bg-amber-500/10 p-4">
                  <p className="text-3xl font-bold text-amber-400">
                    {stats.hard}
                  </p>
                  <p className="text-sm text-zinc-500">模糊</p>
                </div>
                <div className="rounded-2xl bg-emerald-500/10 p-4">
                  <p className="text-3xl font-bold text-emerald-400">
                    {stats.good}
                  </p>
                  <p className="text-sm text-zinc-500">认识</p>
                </div>
                <div className="rounded-2xl bg-cyan-500/10 p-4">
                  <p className="text-3xl font-bold text-cyan-400">
                    {stats.easy}
                  </p>
                  <p className="text-sm text-zinc-500">简单</p>
                </div>
              </div>

              {/* Accuracy */}
              <div className="mb-8 rounded-2xl bg-white/5 p-6">
                <p className="text-sm text-zinc-500 mb-2">正确率</p>
                <p className="text-4xl font-bold text-white">
                  {stats.total > 0
                    ? Math.round(((stats.good + stats.easy) / stats.total) * 100)
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
                重新加载
              </Button>
            </GlassCard>
          )}
        </div>

        {/* Stats Panel */}
        <div className="space-y-4">
          <GlassCard>
            <h3 className="mb-4 font-semibold text-white">本次统计</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                  <XCircle className="h-4 w-4 text-rose-400" />
                  不认识
                </div>
                <span className="font-medium text-rose-400">
                  {stats.again}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                  <AlertCircle className="h-4 w-4 text-amber-400" />
                  模糊
                </div>
                <span className="font-medium text-amber-400">
                  {stats.hard}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  认识
                </div>
                <span className="font-medium text-emerald-400">
                  {stats.good}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Sparkles className="h-4 w-4 text-cyan-400" />
                  简单
                </div>
                <span className="font-medium text-cyan-400">
                  {stats.easy}
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="mb-4 font-semibold text-white">进度</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  <span className="text-sm text-zinc-300">今日剩余</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {upcomingToday}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-white/5 p-3">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm text-zinc-300">已完成</span>
                </div>
                <span className="text-sm font-medium text-white">
                  {currentIndex + (isComplete ? 0 : 0)}
                </span>
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="mb-4 font-semibold text-white">复习技巧</h3>
            <div className="space-y-3 text-sm text-zinc-400">
              <div className="flex items-start gap-2">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <p>先尝试回忆答案，再点击显示</p>
              </div>
              <div className="flex items-start gap-2">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                <p>诚实评分，算法会优化复习间隔</p>
              </div>
              <div className="flex items-start gap-2">
                <Brain className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <p>在句子中使用词汇，加强记忆</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
