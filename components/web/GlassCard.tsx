import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  glowColor?: "seal" | "gold" | "jade" | "ink" | "none"
  variant?: "default" | "elevated" | "subtle"
}

const glowStyles = {
  seal: "shadow-[0_0_40px_rgba(197,48,48,0.2)] border-red-800/30",
  gold: "shadow-[0_0_30px_rgba(202,138,4,0.15)] border-yellow-700/20",
  jade: "shadow-[0_0_30px_rgba(22,163,74,0.15)] border-green-700/20",
  ink: "shadow-[0_0_30px_rgba(88,28,135,0.15)] border-purple-900/20",
  none: "border-white/[0.08]",
}

const variantStyles = {
  default: "bg-white/[0.03] backdrop-blur-xl",
  elevated: "bg-white/[0.05] backdrop-blur-2xl",
  subtle: "bg-white/[0.02] backdrop-blur-lg",
}

export function GlassCard({ 
  children, 
  className, 
  glowColor = "none",
  variant = "default" 
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border p-6 transition-all duration-300",
        variantStyles[variant],
        glowStyles[glowColor],
        className
      )}
    >
      {children}
    </div>
  )
}
