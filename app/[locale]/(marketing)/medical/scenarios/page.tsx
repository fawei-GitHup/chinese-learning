import { Metadata } from "next"
import { Suspense } from "react"
import { ScenariosPageClient } from "./ScenariosPageClient"

export const metadata: Metadata = {
  title: "Medical Scenarios | Learn Chinese",
  description: "Practice real medical conversations in Chinese. Master healthcare dialogue with interactive scenarios and key phrases.",
  openGraph: {
    title: "Medical Scenarios | Learn Chinese",
    description: "Practice real medical conversations in Chinese for effective healthcare communication.",
  },
}

export default function ScenariosPage() {
  return (
    <Suspense fallback={<ScenariosPageSkeleton />}>
      <ScenariosPageClient />
    </Suspense>
  )
}

function ScenariosPageSkeleton() {
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 bg-white/[0.02] border border-white/[0.06] rounded-lg p-6" />
          ))}
        </div>
      </div>
    </div>
  )
}