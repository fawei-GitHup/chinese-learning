import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Grammar Guide | LearnChinese",
  description: "Chinese grammar patterns explained with examples and common mistakes to avoid.",
  alternates: {
    canonical: "/grammar",
  },
}

export default function GrammarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
