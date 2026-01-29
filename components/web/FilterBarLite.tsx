"use client"

import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface FilterOption {
  value: string
  label: string
}

interface FilterBarLiteProps {
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  selectOptions?: FilterOption[]
  selectValue?: string
  onSelectChange?: (value: string) => void
  selectPlaceholder?: string
  className?: string
}

export function FilterBarLite({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  selectOptions,
  selectValue,
  onSelectChange,
  selectPlaceholder = "Filter",
  className,
}: FilterBarLiteProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 backdrop-blur-sm"
        />
      </div>
      {selectOptions && onSelectChange && (
        <select
          value={selectValue}
          onChange={(e) => onSelectChange(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 backdrop-blur-sm appearance-none cursor-pointer"
        >
          <option value="" className="bg-zinc-900">{selectPlaceholder}</option>
          {selectOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
