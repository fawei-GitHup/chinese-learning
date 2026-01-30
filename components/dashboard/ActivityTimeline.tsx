/**
 * 学习活动时间线组件
 * 
 * 显示最近的学习活动记录
 */

import { GlassCard } from '@/components/web/GlassCard'
import { Brain, BookOpen, BookText, TrendingUp } from 'lucide-react'
import type { Activity } from '@/lib/dashboard/types'

interface ActivityTimelineProps {
  activities: Activity[]
  maxItems?: number
}

const activityTypeIcons = {
  srs_review: Brain,
  lesson: BookOpen,
  reading: BookText,
  grammar: TrendingUp,
}

const activityTypeColors = {
  srs_review: 'text-amber-400',
  lesson: 'text-red-400',
  reading: 'text-emerald-400',
  grammar: 'text-cyan-400',
}

export function ActivityTimeline({ activities, maxItems = 8 }: ActivityTimelineProps) {
  const displayActivities = activities.slice(0, maxItems)

  if (displayActivities.length === 0) {
    return (
      <GlassCard>
        <h2 className="text-lg font-semibold text-white mb-6">最近学习活动</h2>
        <div className="text-center py-8 text-zinc-400">
          <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>还没有学习记录</p>
          <p className="text-sm mt-2">开始复习或学习课程吧！</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <h2 className="text-lg font-semibold text-white mb-6">
        最近学习活动
      </h2>
      
      <div className="space-y-4">
        {displayActivities.map((activity) => {
          const Icon = activityTypeIcons[activity.type]
          const colorClass = activityTypeColors[activity.type]
          const timeAgo = formatTimeAgo(activity.timestamp)

          return (
            <div
              key={activity.id}
              className="flex items-center gap-4 text-sm"
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ${colorClass}`}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white truncate">{activity.title}</p>
                {activity.description && (
                  <p className="text-xs text-zinc-500 truncate">
                    {activity.description}
                  </p>
                )}
                <p className="text-xs text-zinc-500">{timeAgo}</p>
              </div>
              
              {activity.metadata?.result && (
                <span className="text-zinc-400 text-xs whitespace-nowrap">
                  {activity.metadata.result}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}

/**
 * 格式化时间为 "x 分钟前" / "x 小时前" / "x 天前"
 */
function formatTimeAgo(timestamp: string): string {
  const now = new Date().getTime()
  const past = new Date(timestamp).getTime()
  const diff = now - past

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes} 分钟前`
  } else if (hours < 24) {
    return `${hours} 小时前`
  } else if (days < 30) {
    return `${days} 天前`
  } else {
    return new Date(timestamp).toLocaleDateString('zh-CN')
  }
}
