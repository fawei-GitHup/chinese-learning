'use client';

import { cn } from "@/lib/utils"
import { Type as type, LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick?: () => void
    href?: string
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="rounded-2xl bg-white/5 p-4 mb-4">
        <Icon className="h-8 w-8 text-zinc-500" />
      </div>
      <h3 className="text-lg font-medium text-white">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-zinc-400 max-w-sm">{description}</p>
      )}
      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button
              className="mt-4 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400"
            >
              {action.label}
            </Button>
          </Link>
        ) : (
          <Button
            onClick={action.onClick}
            className="mt-4 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400"
          >
            {action.label}
          </Button>
        )
      )}
    </div>
  )
}
