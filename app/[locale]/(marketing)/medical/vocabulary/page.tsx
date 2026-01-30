import { Metadata } from "next"
import { Suspense } from "react"
import { VocabularyPageClient } from "./VocabularyPageClient"

export const metadata: Metadata = {
  title: "Medical Vocabulary | Learn Chinese",
  description: "Browse medical Chinese vocabulary and terminology for healthcare communication.",
  openGraph: {
    title: "Medical Vocabulary | Learn Chinese",
    description: "Master medical Chinese vocabulary for effective healthcare communication.",
  },
}

export default function VocabularyPage() {
  return (
    <Suspense fallback={<VocabularyPageSkeleton />}>
      <VocabularyPageClient />
    </Suspense>
  )
}

function VocabularyPageSkeleton() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-white/[0.08] rounded mb-2" />
          <div className="h-4 w-96 bg-white/[0.06] rounded" />
        </div>

        {/* Search Bar Skeleton */}
        <div className="mb-6">
          <div className="h-12 w-full bg-white/[0.03] border border-white/[0.08] rounded-lg" />
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-32 bg-white/[0.02] border border-white/[0.06] rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  )
}