"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Check, Loader2, Star } from "lucide-react"
import { createSRSCard } from "@/lib/srs/api"
import type { SRSCard, CardType, CardSourceType, SRSCardContent } from "@/lib/srs/types"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export interface AddToSRSButtonProps {
  /**
   * 卡片类型
   */
  contentType: CardType // 'vocabulary' | 'sentence' | 'grammar' | 'medical_term' | 'custom'
  
  /**
   * 卡片内容
   * front: 中文（问题）
   * back: 英文翻译（答案）
   * pinyin: 拼音（可选）
   * example: 例句（可选）
   * notes: 备注（可选）
   */
  content: SRSCardContent
  
  /**
   * 来源类型（可选）
   */
  sourceType?: CardSourceType
  
  /**
   * 来源 ID（可选）
   */
  sourceId?: string
  
  /**
   * 按钮样式变体
   * - default: 标准按钮
   * - small: 小按钮
   * - icon: 仅图标按钮
   */
  variant?: 'default' | 'small' | 'icon'
  
  /**
   * 成功回调
   */
  onSuccess?: (card: SRSCard) => void
  
  /**
   * 自定义 className
   */
  className?: string
  
  /**
   * 自定义子元素（仅用于 default 和 small 变体）
   */
  children?: React.ReactNode
}

/**
 * 统一的 SRS 加入按钮组件
 * 
 * 功能：
 * - 支持多种内容类型（vocabulary/sentence/grammar/medical_term）
 * - 集成 W4-01 的 createSRSCard API
 * - 状态管理：未加入、加载中、已加入
 * - Toast 通知反馈
 * - 错误处理
 * - 三种样式变体
 * 
 * @example
 * ```tsx
 * // 词汇卡片
 * <AddToSRSButton
 *   contentType="vocabulary"
 *   content={{
 *     front: "你好",
 *     back: "hello",
 *     pinyin: "nǐ hǎo"
 *   }}
 *   sourceType="lesson"
 *   sourceId="lesson-1"
 * />
 * 
 * // 句子卡片
 * <AddToSRSButton
 *   contentType="sentence"
 *   content={{
 *     front: "我喜欢学习中文。",
 *     back: "I like learning Chinese.",
 *     pinyin: "wǒ xǐ huān xué xí zhōng wén"
 *   }}
 *   variant="small"
 * />
 * 
 * // 图标按钮（用于列表项）
 * <AddToSRSButton
 *   contentType="vocabulary"
 *   content={{ front: "医生", back: "doctor", pinyin: "yī shēng" }}
 *   variant="icon"
 * />
 * ```
 */
export function AddToSRSButton({
  contentType,
  content,
  sourceType,
  sourceId,
  variant = 'default',
  onSuccess,
  className,
  children,
}: AddToSRSButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToSRS = async () => {
    if (isAdded || isLoading) return

    setIsLoading(true)
    try {
      const card = await createSRSCard({
        card_type: contentType,
        content,
        source_type: sourceType,
        source_id: sourceId,
      })
      
      setIsAdded(true)
      toast.success('已加入 SRS 复习', {
        description: content.front,
      })
      
      onSuccess?.(card)
    } catch (error) {
      console.error('Failed to add to SRS:', error)
      toast.error('加入 SRS 失败', {
        description: error instanceof Error ? error.message : '请稍后重试',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Icon variant - 仅图标按钮（用于紧凑布局）
  if (variant === 'icon') {
    return (
      <button
        onClick={handleAddToSRS}
        disabled={isAdded || isLoading}
        className={cn(
          "rounded-lg p-1.5 transition-colors disabled:cursor-not-allowed",
          isAdded
            ? "bg-emerald-500/20 text-emerald-400"
            : "bg-white/5 text-zinc-400 hover:bg-cyan-500/20 hover:text-cyan-400 disabled:opacity-50",
          className
        )}
        title={isAdded ? "已加入 SRS" : "加入 SRS 复习"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isAdded ? (
          <Check className="h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </button>
    )
  }

  // Small variant - 小按钮（用于卡片内部）
  if (variant === 'small') {
    return (
      <button
        onClick={handleAddToSRS}
        disabled={isAdded || isLoading}
        className={cn(
          "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors disabled:cursor-not-allowed",
          isAdded
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-white/5 text-zinc-400 border border-white/10 hover:bg-white/10 hover:text-cyan-400 disabled:opacity-50",
          className
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            加入中...
          </>
        ) : isAdded ? (
          <>
            <Star className="h-3.5 w-3.5 fill-current" />
            已加入 SRS
          </>
        ) : (
          <>
            <Plus className="h-3.5 w-3.5" />
            {children || '加入 SRS'}
          </>
        )}
      </button>
    )
  }

  // Default variant - 标准按钮（用于主要 CTA）
  return (
    <Button
      onClick={handleAddToSRS}
      disabled={isAdded || isLoading}
      className={cn(
        "transition-colors",
        isAdded
          ? "bg-green-600 hover:bg-green-700"
          : "bg-teal-600 hover:bg-teal-700",
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          加入中...
        </>
      ) : isAdded ? (
        <>
          <Star className="h-4 w-4 mr-2" />
          {children || '已加入 SRS'}
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-2" />
          {children || '加入 SRS'}
        </>
      )}
    </Button>
  )
}
