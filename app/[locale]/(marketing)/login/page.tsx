import type { Metadata } from "next"
import { Suspense } from "react"
import { LoginPageClient } from "./LoginPageClient"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginPageClient />
    </Suspense>
  )
}

function LoginPageSkeleton() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-12">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-red-950/20 via-transparent to-purple-950/10" />
      <div className="w-full max-w-5xl grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
        <div className="order-2 lg:order-1">
          <div className="h-[500px] rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
        </div>
        <div className="order-1 lg:order-2 hidden lg:block">
          <div className="h-[400px] rounded-2xl bg-white/[0.02] border border-white/[0.06] animate-pulse" />
        </div>
      </div>
    </div>
  )
}
