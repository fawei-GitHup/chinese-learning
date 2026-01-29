"use client"

import React from "react"

import { cn } from "@/lib/utils"
import { GlassCard } from "./GlassCard"

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableLiteProps<T> {
  data: T[]
  columns: Column<T>[]
  onRowClick?: (item: T) => void
  className?: string
}

export function DataTableLite<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  className,
}: DataTableLiteProps<T>) {
  return (
    <GlassCard className={cn("overflow-hidden p-0", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-zinc-500",
                    col.className
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  "transition-colors",
                  onRowClick && "cursor-pointer hover:bg-white/5"
                )}
              >
                {columns.map((col) => (
                  <td
                    key={`${item.id}-${String(col.key)}`}
                    className={cn("px-4 py-3 text-sm text-zinc-300", col.className)}
                  >
                    {col.render
                      ? col.render(item)
                      : String(item[col.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  )
}
