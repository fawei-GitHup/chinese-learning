import React from "react"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/web/LanguageSwitcher"
import { FeedbackButton } from "@/components/feedback/FeedbackButton"

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen ink-bg-radial">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo with Seal Style */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-red-700 to-red-900 shadow-[0_0_20px_rgba(197,48,48,0.3)] group-hover:shadow-[0_0_30px_rgba(197,48,48,0.4)] transition-shadow">
              <BookOpen className="h-5 w-5 text-red-100" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              <span className="text-red-400">Learn</span>Chinese
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/features"
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/medical"
              className="text-sm text-teal-400 hover:text-teal-300 transition-colors font-medium"
            >
              Medical Chinese
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm text-zinc-500 hover:text-white transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button
              asChild
              variant="ghost"
              className="text-zinc-400 hover:text-white hover:bg-white/5"
            >
              <Link href="/login">Sign In</Link>
            </Button>
            <Button
              asChild
              className="rounded-lg bg-gradient-to-r from-red-700 to-red-800 text-white hover:from-red-600 hover:to-red-700 shadow-[0_0_20px_rgba(197,48,48,0.25)]"
            >
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-16">{children}</main>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-[#08080c]/80">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-700 to-red-900">
                <BookOpen className="h-4 w-4 text-red-100" />
              </div>
              <span className="font-semibold text-white">
                <span className="text-red-400">Learn</span>Chinese
              </span>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-zinc-600 hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-zinc-600 hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-sm text-zinc-600 hover:text-white transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/components-demo"
                className="text-sm text-zinc-600 hover:text-white transition-colors"
              >
                Components
              </Link>
            </nav>

            {/* Copyright */}
            <p className="text-sm text-zinc-700">
              © 2026 LearnChinese. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* 反馈按钮 */}
      <FeedbackButton />
    </div>
  )
}
