"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Route,
  BookOpen,
  BookText,
  Brain,
  Search,
  FileText,
  User,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/path", label: "Path", icon: Route },
  { href: "/lessons", label: "Lessons", icon: BookOpen },
  { href: "/reader", label: "Reader", icon: BookText },
  { href: "/srs", label: "SRS", icon: Brain },
  { href: "/dictionary", label: "Dictionary", icon: Search },
  { href: "/grammar", label: "Grammar", icon: FileText },
  { href: "/account", label: "Account", icon: User },
]

interface WebSidebarProps {
  className?: string
}

export function WebSidebar({ className }: WebSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-white/[0.06] bg-[#0a0a0f]/90 backdrop-blur-xl lg:flex",
        className
      )}
    >
      {/* Logo with Seal Style */}
      <div className="flex h-16 items-center gap-3 border-b border-white/[0.06] px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-700 to-red-900 shadow-[0_0_15px_rgba(197,48,48,0.3)]">
          <BookOpen className="h-5 w-5 text-red-100" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">
          <span className="text-red-400">Learn</span>Chinese
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-white/[0.08] text-white shadow-[0_0_20px_rgba(197,48,48,0.15)] border border-red-900/30"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "text-red-400")} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer - Level Progress */}
      <div className="border-t border-white/[0.06] p-4">
        <div className="rounded-lg bg-white/[0.03] p-4 border border-white/[0.06]">
          <p className="text-xs text-zinc-600">Current Level</p>
          <p className="mt-1 text-lg font-semibold text-white">HSK3</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-white/[0.08]">
            <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-red-700 to-red-500 shadow-[0_0_10px_rgba(197,48,48,0.4)]" />
          </div>
        </div>
      </div>
    </aside>
  )
}
