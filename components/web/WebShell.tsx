import React from "react"
import { WebSidebar } from "./WebSidebar"
import { WebTopbar } from "./WebTopbar"

interface WebShellProps {
  children: React.ReactNode
  streakDays?: number
}

export function WebShell({ children, streakDays }: WebShellProps) {
  return (
    <div className="min-h-screen ink-bg-radial">
      <WebSidebar />
      <WebTopbar streakDays={streakDays} />
      <main className="pt-16 lg:pl-64">
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  )
}
