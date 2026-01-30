"use client"

import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

/**
 * 内容卡片骨架屏组件
 * 用于列表页面的加载状态显示
 */
export function SkeletonCard() {
  return (
    <Card className="p-6 bg-white/[0.02] border-white/[0.06]">
      <div className="space-y-4">
        {/* 标题 */}
        <Skeleton className="h-6 w-3/4 bg-white/[0.08]" />

        {/* 描述 */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full bg-white/[0.06]" />
          <Skeleton className="h-4 w-5/6 bg-white/[0.06]" />
        </div>

        {/* 标签或元信息 */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16 bg-white/[0.05] rounded-full" />
          <Skeleton className="h-5 w-20 bg-white/[0.05] rounded-full" />
        </div>

        {/* 操作按钮区域 */}
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-8 w-20 bg-white/[0.07]" />
          <Skeleton className="h-8 w-24 bg-white/[0.07]" />
        </div>
      </div>
    </Card>
  )
}

/**
 * 内容详情页骨架屏组件
 */
export function SkeletonDetail() {
  return (
    <div className="space-y-8">
      {/* 头部区域 */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-8 w-2/3 bg-white/[0.08]" />
            <Skeleton className="h-5 w-1/3 bg-white/[0.06]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 bg-white/[0.07]" />
            <Skeleton className="h-10 w-28 bg-white/[0.07]" />
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4 bg-white/[0.08]" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-white/[0.06]" />
            <Skeleton className="h-4 w-full bg-white/[0.06]" />
            <Skeleton className="h-4 w-3/4 bg-white/[0.06]" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4 bg-white/[0.08]" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full bg-white/[0.06]" />
            <Skeleton className="h-4 w-full bg-white/[0.06]" />
            <Skeleton className="h-4 w-2/3 bg-white/[0.06]" />
          </div>
        </div>
      </div>

      {/* 底部操作区域 */}
      <div className="flex justify-between items-center pt-6 border-t border-white/[0.06]">
        <Skeleton className="h-10 w-32 bg-white/[0.07]" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-20 bg-white/[0.07]" />
          <Skeleton className="h-10 w-24 bg-white/[0.07]" />
        </div>
      </div>
    </div>
  )
}

/**
 * 内容列表骨架屏组件
 */
export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  )
}