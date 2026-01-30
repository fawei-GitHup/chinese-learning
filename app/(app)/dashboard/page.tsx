"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useDashboard } from "@/lib/cache/client-hooks"
import useSWR from "swr"
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics"
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline"
import { RecommendedContent } from "@/components/dashboard/RecommendedContent"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { ProgressRing } from "@/components/web/ProgressRing"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Loader2, BookOpen, BookText, RefreshCw, Award } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  // 使用 SWR 缓存获取 Dashboard 数据
  const {
    data: dashboardData,
    error: dashboardError,
    isLoading: isDashboardLoading,
    mutate: mutateDashboard
  } = useDashboard(user?.id)
  
  // 使用 SWR 获取完成统计
  const {
    data: completionStats,
    error: statsError,
    isLoading: isStatsLoading,
    mutate: mutateStats
  } = useSWR(
    user ? 'completion-stats' : null,
    async () => {
      const { getCompletionStats } = await import('@/lib/progress/api')
      return getCompletionStats()
    }
  )
  
  const loading = isDashboardLoading || isStatsLoading
  const error = dashboardError || statsError

  // 重定向未登录用户
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])
  
  // 手动刷新所有数据
  const handleRefresh = () => {
    mutateDashboard()
    mutateStats()
  }

  // 加载状态
  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Skeleton className="h-8 w-64 bg-white/10" />
            <Skeleton className="h-4 w-48 mt-2 bg-white/10" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
        </div>

        {/* KPI Skeletons */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 bg-white/10" />
          ))}
        </div>

        {/* Content Skeletons */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 bg-white/10" />
            <Skeleton className="h-96 bg-white/10" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 bg-white/10" />
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </div>
    )
  }

  // 错误状态
  if (error || (!loading && !dashboardData)) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">Dashboard</h1>
          <p className="text-zinc-400 mt-1">学习总览</p>
        </div>
        <div className="rounded-xl border border-rose-900/20 bg-rose-500/10 p-6 text-center">
          <p className="text-rose-400 mb-4">
            {error ? (error instanceof Error ? error.message : '加载失败') : '数据加载失败'}
          </p>
          <Button
            onClick={handleRefresh}
            className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
          >
            重试
          </Button>
        </div>
      </div>
    )
  }

  // 如果没有数据，返回 null（用于初始加载状态）
  if (!dashboardData) return null
  
  // 解构数据
  const { reviewStats, streak, recentActivities, recommendedContent, studyTime } = dashboardData

  // 计算今日目标进度（假设目标30分钟）
  const dailyGoalMinutes = 30
  const goalProgress = Math.min(100, Math.round((studyTime.today / dailyGoalMinutes) * 100))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            欢迎回来！
          </h1>
          <p className="text-zinc-400 mt-1">
            {streak.current > 0
              ? `你已连续学习 ${streak.current} 天，继续保持！`
              : '开始你的学习之旅吧'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-400">今日目标:</span>
            <ProgressRing
              value={studyTime.today}
              max={dailyGoalMinutes}
              size={48}
              color="seal"
            />
            <span className="text-sm text-zinc-400">
              {studyTime.today}/{dailyGoalMinutes} 分钟
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardMetrics reviewStats={reviewStats} streak={streak} />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Activities & Recommended */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <ActivityTimeline activities={recentActivities} maxItems={8} />

          {/* Recommended Content */}
          <RecommendedContent items={recommendedContent} maxItems={6} />
        </div>

        {/* Right Column: Quick Actions */}
        <div className="space-y-6">
          <QuickActions dueCardsCount={reviewStats.cards_due_today} />

          {/* HSK Level Card */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Award className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">我的等级</h3>
            </div>
            <div className="text-center mb-4">
              <div className="inline-block rounded-xl bg-gradient-to-r from-amber-500/20 to-amber-400/20 px-6 py-3 mb-2">
                <span className="text-3xl font-bold text-white">HSK3</span>
              </div>
              <p className="text-sm text-zinc-400">中级水平</p>
            </div>
            <Link href="/app/placement">
              <Button variant="outline" className="w-full border-white/20 hover:bg-white/10">
                重新测试等级
              </Button>
            </Link>
          </div>

          {/* 学习进度统计 */}
          {completionStats && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">学习进度</h3>
              <div className="space-y-4">
                {(completionStats as any).lesson && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-red-400" />
                      <span className="text-sm text-zinc-400">课程</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white font-medium">
                        {(completionStats as any).lesson.completed_items}/{(completionStats as any).lesson.total_items} 已完成
                      </span>
                      <span className="text-zinc-400">
                        {Math.round(((completionStats as any).lesson.completed_items / (completionStats as any).lesson.total_items) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-500"
                        style={{
                          width: `${((completionStats as any).lesson.completed_items / (completionStats as any).lesson.total_items) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
                {(completionStats as any).reading && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <BookText className="h-4 w-4 text-emerald-400" />
                      <span className="text-sm text-zinc-400">阅读</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white font-medium">
                        {(completionStats as any).reading.completed_items}/{(completionStats as any).reading.total_items} 已完成
                      </span>
                      <span className="text-zinc-400">
                        {Math.round(((completionStats as any).reading.completed_items / (completionStats as any).reading.total_items) * 100)}%
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-700 to-emerald-500 transition-all duration-500"
                        style={{
                          width: `${((completionStats as any).reading.completed_items / (completionStats as any).reading.total_items) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Study Time Stats */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">学习时间</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">今日</span>
                  <span className="text-white font-medium">{studyTime.today} 分钟</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-500"
                    style={{ width: `${goalProgress}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-zinc-400">本周</span>
                  <span className="text-white font-medium">{studyTime.thisWeek} 分钟</span>
                </div>
                <div className="text-xs text-zinc-500">
                  平均每天 {Math.round(studyTime.thisWeek / 7)} 分钟
                </div>
              </div>
            </div>
          </div>

          {/* Streak Info */}
          {streak.longest > 0 && (
            <div className="rounded-xl border border-amber-900/20 bg-amber-500/10 p-6">
              <div className="flex items-center gap-4">
                <div className="text-3xl">🔥</div>
                <div>
                  <p className="text-lg font-semibold text-white">
                    最长连续 {streak.longest} 天
                  </p>
                  <p className="text-sm text-zinc-400">
                    {streak.current === streak.longest
                      ? '正在创造新纪录！'
                      : '继续努力打破纪录！'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
