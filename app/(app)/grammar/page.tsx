import { Metadata } from "next"
import { Suspense } from "react"
import { GrammarPageClient } from "./GrammarPageClient"

export const metadata: Metadata = {
  title: "Grammar | Learn Chinese",
  description: "Master Chinese grammar patterns with examples, explanations, and practice. Learn essential grammar structures for effective communication.",
  openGraph: {
    title: "Grammar Guide | Learn Chinese",
    description: "Comprehensive Chinese grammar patterns with practical examples and clear explanations.",
  },
}

export default function GrammarPage() {
  return (
    <Suspense fallback={<GrammarPageSkeleton />}>
      <GrammarPageClient />
    </Suspense>
  )
}

function GrammarPageSkeleton() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-white/[0.08] rounded mb-2" />
          <div className="h-4 w-96 bg-white/[0.06] rounded" />
        </div>

        {/* Filter Skeleton */}
        <div className="mb-6">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-white/[0.06] rounded-full" />
            ))}
          </div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 bg-white/[0.02] border border-white/[0.06] rounded-lg p-6 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}