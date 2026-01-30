import { redirect } from "next/navigation"
import { getSession } from "@/lib/supabase/auth"
import { WebShell } from "@/components/web/WebShell"
import { mockUser } from "@/lib/web-mock"
import { FeedbackButton } from "@/components/feedback/FeedbackButton"

/**
 * Layout for the learning area (app routes)
 * 
 * Authentication is primarily handled by middleware.ts at the request level.
 * This server component provides a secondary check as a fallback.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Server-side session check (fallback for middleware)
  const session = await getSession()

  if (!session) {
    // This should rarely execute as middleware handles most cases
    redirect('/login')
  }

  return (
    <>
      <WebShell streakDays={mockUser.streakDays}>{children}</WebShell>
      <FeedbackButton />
    </>
  )
}
