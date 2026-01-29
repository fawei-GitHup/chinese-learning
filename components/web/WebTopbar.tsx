"use client"

import { cn } from "@/lib/utils"
import { Search, Flame, Moon, Sun, Menu, X, BookOpen, ChevronDown, LogOut, User } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Route,
  BookText,
  Brain,
  FileText,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"

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

interface WebTopbarProps {
  streakDays?: number
  className?: string
}

export function WebTopbar({ streakDays = 42, className }: WebTopbarProps) {
  const [isDark, setIsDark] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { session, signOut } = useAuth()

  return (
    <>
      <header
        className={cn(
          "fixed top-0 right-0 z-30 h-16 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl lg:left-64",
          className
        )}
      >
        <div className="flex h-full items-center justify-between px-4 lg:px-6">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-lg p-2 text-zinc-500 hover:bg-white/[0.06] hover:text-white lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-700 to-red-900">
              <BookOpen className="h-4 w-4 text-red-100" />
            </div>
            <span className="font-bold text-white">
              <span className="text-red-400">Learn</span>Chinese
            </span>
          </div>

          {/* Search */}
          <div className="hidden flex-1 max-w-md lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                placeholder="Search lessons, words, grammar..."
                className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-red-800/50 focus:outline-none focus:ring-1 focus:ring-red-800/50 transition-all"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Streak indicator */}
            <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-1.5 border border-amber-600/20">
              <Flame className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-400">{streakDays}</span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-lg p-2.5 text-zinc-500 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 h-9 rounded-lg bg-gradient-to-br from-red-700 to-red-900 px-3 text-sm font-medium text-red-100 shadow-[0_0_15px_rgba(197,48,48,0.25)]">
                  AC
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{session?.user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-[#0a0a0f]/95 backdrop-blur-xl border-r border-white/[0.06] animate-in slide-in-from-left">
            <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-700 to-red-900">
                  <BookOpen className="h-5 w-5 text-red-100" />
                </div>
                <span className="text-lg font-bold text-white">
                  <span className="text-red-400">Learn</span>Chinese
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg p-2 text-zinc-500 hover:bg-white/[0.06] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="space-y-1 p-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                      isActive
                        ? "bg-white/[0.08] text-white border border-red-900/30"
                        : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive && "text-red-400")} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}
