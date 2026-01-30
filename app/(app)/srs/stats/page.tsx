"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { getReviewStats, getDailyReviewData, getSRSCards } from "@/lib/srs/api"
import { getUserStreak } from "@/lib/dashboard/api"
import type { ReviewStats, DailyReviewData } from "@/lib/srs/types"
import type { StreakData } from "@/lib/dashboard/types"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  Target,
  BookOpen,
  Calendar,
  CheckCircle2,
  BarChart3,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

interface CardTypeStats {
  type: string
  count: number
  color: string
}

export default function SrsStatsPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<ReviewStats | null>(null)
  const [streak, setStreak] = useState<StreakData | null>(null)
  const [dailyData, setDailyData] = useState<DailyReviewData[]>([])
  const [cardTypeStats, setCardTypeStats] = useState<CardTypeStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    if (!user) {
      router.push("/login")
      return
    }

    loadStatsData()
  }, [user, authLoading, router])

  async function loadStatsData() {
    try {
      setIsLoading(true)
      setError(null)

      // 并行加载所有统计数据
      const [reviewStats, streakData, dailyReviews, allCards] =
        await Promise.all([
          getReviewStats(),
          getUserStreak(),
          getDailyReviewData(7), // 最近7天
          getSRSCards(),
        ])

      setStats(reviewStats)
      setStreak(streakData)
      setDailyData(dailyReviews)

      // 统计各类型卡片数量
      const typeCount = allCards.reduce((acc, card) => {
        const type = card.card_type
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      const typeColors: Record<string, string> = {
        vocabulary: "#06b6d4", // cyan
        sentence: "#10b981", // emerald
        grammar: "#f59e0b", // amber
        medical_term: "#8b5cf6", // violet
        custom: "#ec4899", // pink
      }

      const typeNames: Record<string, string> = {
        vocabulary: "词汇",
        sentence: "句子",
        grammar: "语法",
        medical_term: "医学术语",
        custom: "自定义",
      }

      const cardStats: CardTypeStats[] = Object.entries(typeCount).map(
        ([type, count]) => ({
          type: typeNames[type] || type,
          count,
          color: typeColors[type] || "#6b7280",
        })
      )

      setCardTypeStats(cardStats)
    } catch (err) {
      console.error("加载统计数据失败:", err)
      setError(err instanceof Error ? err.message : "加载失败")
    } finally {
      setIsLoading(false)
    }
  }

  // 加载状态
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-zinc-400">加载统计数据...</p>
        </div>
      </div>
    )
  }

  // 错误状态
  if (error || !stats || !streak) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/srs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回复习
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">学习统计</h1>
            <p className="text-zinc-400">查看您的学习进度和成效</p>
          </div>
        </div>
        <GlassCard>
          <div className="text-center py-8">
            <p className="text-rose-400 mb-4">{error || "加载失败"}</p>
            <Button onClick={loadStatsData}>重试</Button>
          </div>
        </GlassCard>
      </div>
    )
  }

  // 计算正确率
  const accuracyRate =
    stats.total_reviews > 0
      ? Math.round((stats.retention_rate * 100))
      : 0

  // 准备7天趋势数据
  const trendData = dailyData.map((day) => ({
    date: new Date(day.date).toLocaleDateString("zh-CN", {
      month: "numeric",
      day: "numeric",
    }),
    复习次数: day.review_count,
    平均质量: Math.round(day.average_quality * 20), // 转换为百分比
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/srs">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回复习
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">学习统计</h1>
          <p className="text-zinc-400">查看您的学习进度和成效</p>
        </div>
      </div>

      {/* 核心统计卡片 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* 学习连续天数 */}
        <GlassCard glowColor="jade">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">学习连续天数</p>
              <p className="text-3xl font-bold text-white mt-2">
                {streak.current}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                最长 {streak.longest} 天
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </GlassCard>

        {/* 总复习次数 */}
        <GlassCard glowColor="seal">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">总复习次数</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.total_reviews}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                今日 {stats.reviews_today} 次
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/20 flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-cyan-400" />
            </div>
          </div>
        </GlassCard>

        {/* 总卡片数 */}
        <GlassCard glowColor="ink">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">总卡片数</p>
              <p className="text-3xl font-bold text-white mt-2">
                {stats.total_cards}
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                今日待复习 {stats.cards_due_today}
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </GlassCard>

        {/* 正确率 */}
        <GlassCard glowColor="gold">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-400">正确率</p>
              <p className="text-3xl font-bold text-white mt-2">
                {accuracyRate}%
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                记忆保持率
              </p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center">
              <Target className="h-6 w-6 text-amber-400" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 图表区域 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 最近7天复习趋势 */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
            最近7天复习趋势
          </h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", color: "#9ca3af" }}
                />
                <Line
                  type="monotone"
                  dataKey="复习次数"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: "#06b6d4", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-zinc-500">
              <p>暂无复习数据</p>
            </div>
          )}
        </GlassCard>

        {/* 按卡片类型统计 */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-400" />
            按卡片类型统计
          </h3>
          {cardTypeStats.length > 0 ? (
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={cardTypeStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percent }) =>
                      `${type} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {cardTypeStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-zinc-500">
              <p>暂无卡片数据</p>
            </div>
          )}
        </GlassCard>
      </div>

      {/* 详细统计 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 每日复习详情 */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">
            每日复习详情
          </h3>
          {dailyData.length > 0 ? (
            <div className="space-y-3">
              {dailyData.slice().reverse().map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {new Date(day.date).toLocaleDateString("zh-CN", {
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-xs text-zinc-500">
                      平均质量:{" "}
                      {Math.round(day.average_quality * 20)}%
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-lg font-semibold text-white">
                      {day.review_count}
                    </span>
                    <span className="text-sm text-zinc-500">次</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12 text-zinc-500">
              <p>暂无最近复习记录</p>
            </div>
          )}
        </GlassCard>

        {/* 学习建议 */}
        <GlassCard>
          <h3 className="text-lg font-semibold text-white mb-4">
            学习建议
          </h3>
          <div className="space-y-4">
            {stats.cards_due_today > 0 && (
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-sm font-medium text-cyan-400 mb-1">
                  今日任务
                </p>
                <p className="text-zinc-300">
                  您还有 {stats.cards_due_today} 张卡片需要复习，继续保持！
                </p>
              </div>
            )}

            {streak.current >= 7 && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-sm font-medium text-emerald-400 mb-1">
                  连续学习
                </p>
                <p className="text-zinc-300">
                  您已连续学习 {streak.current} 天，太棒了！继续保持这个好习惯。
                </p>
              </div>
            )}

            {accuracyRate >= 80 && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm font-medium text-amber-400 mb-1">
                  学习效果
                </p>
                <p className="text-zinc-300">
                  正确率达到 {accuracyRate}%，学习效果很好！
                </p>
              </div>
            )}

            {stats.total_cards === 0 && (
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm font-medium text-purple-400 mb-1">
                  开始学习
                </p>
                <p className="text-zinc-300">
                  您还没有添加任何卡片，去学习区添加您感兴趣的内容吧！
                </p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* 快速操作 */}
      <GlassCard>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">继续学习</h3>
            <p className="text-sm text-zinc-400 mt-1">
              选择您想要的学习方式
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/srs">
              <Button className="bg-cyan-500 hover:bg-cyan-600">
                开始复习
              </Button>
            </Link>
            <Link href="/lessons">
              <Button variant="outline">浏览课程</Button>
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}
