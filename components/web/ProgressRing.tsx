"use client"

import { cn } from "@/lib/utils"

interface ProgressRingProps {
  value: number
  max: number
  size?: number
  strokeWidth?: number
  className?: string
  color?: "seal" | "gold" | "jade" | "ink"
}

const colorStyles = {
  seal: "stroke-red-500",
  gold: "stroke-amber-500",
  jade: "stroke-emerald-500",
  ink: "stroke-purple-500",
}

export function ProgressRing({
  value,
  max,
  size = 48,
  strokeWidth = 4,
  className,
  color = "seal",
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const progress = Math.min(value / max, 1)
  const strokeDashoffset = circumference - progress * circumference

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn("transition-all duration-500", colorStyles[color])}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-white">{Math.round(progress * 100)}%</span>
      </div>
    </div>
  )
}
