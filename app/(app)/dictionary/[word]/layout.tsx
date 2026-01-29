import React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dictionary | LearnChinese",
  description: "Comprehensive Chinese-English dictionary with pinyin, examples, and key learning points.",
  alternates: {
    canonical: "/dictionary",
  },
}

export default function DictionaryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
