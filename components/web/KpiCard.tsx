import { cn } from "@/lib/utils"
import { GlassCard } from "./GlassCard"
import { Type as type, LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  glowColor?: "seal" | "gold" | "jade" | "ink" | "none"
}

export function KpiCard({ title, value, subtitle, icon: Icon, trend, glowColor = "none" }: KpiCardProps) {
  return (
    <GlassCard glowColor={glowColor} className="p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-zinc-400">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && (
            <p
              className={cn(
                "text-xs",
                trend === "up" && "text-emerald-400",
                trend === "down" && "text-rose-400",
                trend === "neutral" && "text-zinc-500"
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
        <div className="rounded-2xl bg-white/10 p-3">
          <Icon className="h-5 w-5 text-zinc-300" />
        </div>
      </div>
    </GlassCard>
  )
}
