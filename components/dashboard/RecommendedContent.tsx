/**
 * 推荐内容组件
 * 
 * 显示基于用户级别的推荐 lessons/readings/grammar
 */

import Link from 'next/link'
import { GlassCard } from '@/components/web/GlassCard'
import { Badge } from '@/components/ui/badge'
import { BookOpen, BookText, TrendingUp, ArrowRight, Clock, FileText } from 'lucide-react'
import type { RecommendedItem } from '@/lib/dashboard/types'

interface RecommendedContentProps {
  items: RecommendedItem[]
  maxItems?: number
}

const contentTypeIcons = {
  lesson: BookOpen,
  reading: BookText,
  grammar: TrendingUp,
}

const contentTypeColors = {
  lesson: 'text-red-400 bg-red-500/10 border-red-900/20',
  reading: 'text-emerald-400 bg-emerald-500/10 border-emerald-900/20',
  grammar: 'text-cyan-400 bg-cyan-500/10 border-cyan-900/20',
}

const contentTypeLabels = {
  lesson: '课程',
  reading: '阅读',
  grammar: '语法',
}

export function RecommendedContent({ items, maxItems = 6 }: RecommendedContentProps) {
  const displayItems = items.slice(0, maxItems)

  if (displayItems.length === 0) {
    return (
      <GlassCard>
        <h2 className="text-lg font-semibold text-white mb-6">推荐内容</h2>
        <div className="text-center py-8 text-zinc-400">
          <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>暂无推荐内容</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard>
      <h2 className="text-lg font-semibold text-white mb-6">推荐内容</h2>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayItems.map((item) => {
          const Icon = contentTypeIcons[item.type]
          const colorClass = contentTypeColors[item.type]
          const label = contentTypeLabels[item.type]
          const href = getContentHref(item)

          return (
            <Link
              key={item.id}
              href={href}
              className="block group"
            >
              <div className={`rounded-xl p-4 border transition-all hover:bg-white/5 ${colorClass}`}>
                {/* 头部：图标 + 类型标签 */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 ${colorClass.split(' ')[0]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Badge variant="outline" className="text-xs">
                      {label}
                    </Badge>
                    <div className="text-xs text-zinc-500 mt-1">{item.level}</div>
                  </div>
                </div>

                {/* 标题 */}
                <h3 className="font-medium text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>

                {/* 描述 */}
                <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                  {item.description}
                </p>

                {/* 底部：元信息 */}
                <div className="flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-3">
                    {item.durationMin && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.durationMin} 分钟
                      </span>
                    )}
                    {item.wordCount && (
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {item.wordCount} 字
                      </span>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>

                {/* 推荐理由（可选） */}
                {item.reason && (
                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-zinc-500">💡 {item.reason}</p>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </GlassCard>
  )
}

/**
 * 根据内容类型生成链接
 */
function getContentHref(item: RecommendedItem): string {
  switch (item.type) {
    case 'lesson':
      return `/lesson/${item.id}`
    case 'reading':
      return `/reader/${item.id}`
    case 'grammar':
      return `/grammar/${item.id}`
    default:
      return '#'
  }
}
