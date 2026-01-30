/**
 * Dashboard 核心指标组件
 * 
 * 显示 4 个核心 KPI：
 * - 今日到期卡片数
 * - 今日已复习数
 * - 学习连续天数
 * - 总卡片数
 */

import { KpiCard } from '@/components/web/KpiCard'
import { Brain, CheckCircle2, Zap, BookOpen } from 'lucide-react'
import type { StreakData } from '@/lib/dashboard/types'
import type { ReviewStats } from '@/lib/srs/types'

interface DashboardMetricsProps {
  reviewStats: ReviewStats
  streak: StreakData
}

export function DashboardMetrics({ reviewStats, streak }: DashboardMetricsProps) {
  // 计算今日复习进度百分比
  const reviewProgress =
    reviewStats.cards_due_today > 0
      ? Math.round(
          (reviewStats.reviews_today / reviewStats.cards_due_today) * 100
        )
      : 0

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <KpiCard
        title="今日待复习"
        value={reviewStats.cards_due_today}
        subtitle={reviewStats.cards_due_total > reviewStats.cards_due_today
          ? `总计 ${reviewStats.cards_due_total} 张待复习`
          : '所有卡片已显示'}
        icon={Brain}
        trend="neutral"
        glowColor="gold"
      />
      
      <KpiCard
        title="今日已完成"
        value={reviewStats.reviews_today}
        subtitle={reviewStats.cards_due_today > 0
          ? `进度 ${reviewProgress}%`
          : '今日无复习任务'}
        icon={CheckCircle2}
        trend={reviewStats.reviews_today > 0 ? 'up' : 'neutral'}
        glowColor="jade"
      />
      
      <KpiCard
        title="学习连续天数"
        value={streak.current}
        subtitle={streak.longest > streak.current
          ? `最长 ${streak.longest} 天`
          : streak.current > 0
            ? '保持连续学习！'
            : '今日开始学习吧'}
        icon={Zap}
        trend={streak.current > 0 ? 'up' : 'neutral'}
        glowColor="seal"
      />
      
      <KpiCard
        title="总卡片数"
        value={reviewStats.total_cards}
        subtitle={reviewStats.total_cards > 0
          ? `保持率 ${Math.round(reviewStats.retention_rate * 100)}%`
          : '还未添加卡片'}
        icon={BookOpen}
        trend="neutral"
        glowColor="ink"
      />
    </section>
  )
}
