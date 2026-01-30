/**
 * 快速操作组件
 * 
 * 提供快速访问常用功能的按钮
 */

import Link from 'next/link'
import { GlassCard } from '@/components/web/GlassCard'
import { Button } from '@/components/ui/button'
import { Brain, BookOpen, BookText, Search, ArrowRight } from 'lucide-react'

interface QuickActionsProps {
  dueCardsCount?: number
}

export function QuickActions({ dueCardsCount = 0 }: QuickActionsProps) {
  return (
    <GlassCard glowColor="jade">
      <h2 className="text-lg font-semibold text-white mb-6">快速访问</h2>
      
      <div className="space-y-3">
        <Link href="/srs" className="block">
          <Button
            className="w-full justify-between rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 h-12 border border-amber-900/20"
            variant="ghost"
          >
            <span className="flex items-center gap-3">
              <Brain className="h-5 w-5" />
              {dueCardsCount > 0 ? `复习 ${dueCardsCount} 张卡片` : '开始复习'}
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>

        <Link href="/lessons" className="block">
          <Button
            className="w-full justify-between rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 h-12 border border-red-900/20"
            variant="ghost"
          >
            <span className="flex items-center gap-3">
              <BookOpen className="h-5 w-5" />
              浏览课程
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>

        <Link href="/medical-reader" className="block">
          <Button
            className="w-full justify-between rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 h-12 border border-emerald-900/20"
            variant="ghost"
          >
            <span className="flex items-center gap-3">
              <BookText className="h-5 w-5" />
              医学阅读
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>

        <Link href="/search" className="block">
          <Button
            className="w-full justify-between rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 h-12 border border-cyan-900/20"
            variant="ghost"
          >
            <span className="flex items-center gap-3">
              <Search className="h-5 w-5" />
              搜索内容
            </span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </GlassCard>
  )
}
