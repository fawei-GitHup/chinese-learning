"use client"

import { cn } from "@/lib/utils"

interface Tab {
  id: string
  label: string
}

interface TabsBarProps {
  tabs: Tab[]
  activeTab: string
  onTabChange: (tabId: string) => void
  className?: string
}

export function TabsBar({ tabs, activeTab, onTabChange, className }: TabsBarProps) {
  return (
    <div className={cn("flex gap-1 rounded-2xl bg-white/5 p-1 backdrop-blur-sm", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "rounded-xl px-4 py-2 text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-white/10 text-white"
              : "text-zinc-400 hover:text-zinc-200"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
