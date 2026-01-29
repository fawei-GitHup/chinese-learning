import { cn } from "@/lib/utils"
import { GlassCard } from "./GlassCard"
import { Type as type, LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  glowColor?: "seal" | "gold" | "jade" | "ink" | "none"
  className?: string
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  glowColor = "none",
  className,
}: FeatureCardProps) {
  return (
    <GlassCard glowColor={glowColor} className={cn("group hover:scale-[1.02] transition-transform duration-300", className)}>
      <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3">
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </GlassCard>
  )
}
