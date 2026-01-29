"use client"


import React from "react"
import Head from "next/head"

import { useState } from "react"
import Link from "next/link"
import { GlassCard } from "@/components/web/GlassCard"
import { OAuthButtons } from "@/components/web/auth/OAuthButtons"
import { Button } from "@/components/ui/button"
import { BookOpen, Brain, TrendingUp, ArrowLeft } from "lucide-react"

const benefits = [
  {
    icon: BookOpen,
    title: "2000+ Lessons",
    description: "HSK1 to HSK6 comprehensive curriculum",
  },
  {
    icon: Brain,
    title: "Smart SRS",
    description: "Never forget with spaced repetition",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Detailed analytics and streak tracking",
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Mock login - just simulate delay
    setTimeout(() => {
      setIsLoading(false)
      window.location.href = "/dashboard"
    }, 1000)
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      {/* Background effects - inkwash style */}
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/10" />
      <div className="pointer-events-none fixed top-1/4 left-1/4 h-96 w-96 bg-red-900/10 blur-[120px] rounded-full" />
      
      <div className="relative w-full max-w-5xl grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
        {/* Left: Login Card */}
        <div className="order-2 lg:order-1">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>

          <GlassCard glowColor="seal" className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-red-700 to-red-900 shadow-[0_0_20px_rgba(197,48,48,0.3)]">
                <BookOpen className="h-5 w-5 text-red-100" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Welcome back</h1>
                <p className="text-sm text-zinc-500">Sign in to continue learning</p>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-400 mb-2">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-white placeholder:text-zinc-600 focus:border-red-800/50 focus:outline-none focus:ring-1 focus:ring-red-800/50 transition-all"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-gradient-to-r from-red-700 to-red-800 py-3 h-12 text-white font-semibold hover:from-red-600 hover:to-red-700 disabled:opacity-50 shadow-[0_0_20px_rgba(197,48,48,0.25)]"
              >
                {isLoading ? "Signing in..." : "Continue with Email"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0a0a0f] px-4 text-sm text-zinc-600">or continue with</span>
              </div>
            </div>

            {/* OAuth Buttons */}
            <OAuthButtons />

            {/* Terms */}
            <p className="mt-6 text-center text-xs text-zinc-600">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="text-zinc-500 hover:text-white underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-zinc-500 hover:text-white underline">
                Privacy Policy
              </Link>
            </p>
          </GlassCard>
        </div>

        {/* Right: Product Preview */}
        <div className="order-1 lg:order-2 hidden lg:block">
          <GlassCard className="p-8 border-white/[0.05]">
            <h2 className="text-2xl font-bold text-white mb-2">
              Start learning Chinese today
            </h2>
            <p className="text-zinc-500 mb-8">
              Join 50,000+ learners on their path to fluency
            </p>

            <div className="space-y-6">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] border border-white/[0.06]">
                    <benefit.icon className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{benefit.title}</h3>
                    <p className="text-sm text-zinc-500">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats preview */}
            <div className="mt-8 grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.06]">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">50K+</p>
                <p className="text-xs text-zinc-600">Learners</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">2M+</p>
                <p className="text-xs text-zinc-600">Lessons completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">4.9</p>
                <p className="text-xs text-zinc-600">App rating</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
