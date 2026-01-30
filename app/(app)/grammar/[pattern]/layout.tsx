import React from "react"
import type { Metadata } from "next"
import { getContentBySlug } from "@/lib/content"

interface Props {
  params: { pattern: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const pattern = decodeURIComponent(params.pattern)
  
  // Fetch grammar content for SEO
  const result = await getContentBySlug('grammar', pattern)
  
  if (!result.data || result.error) {
    return {
      title: "Grammar Pattern | Learn Chinese",
      description: "Chinese grammar patterns explained with examples.",
    }
  }

  const entry = result.data as any
  const title = `${entry.pattern || entry.title} - ${entry.level} | Learn Chinese`
  const description = entry.geo_snippet || entry.description || entry.explanation || `Learn the ${entry.pattern || entry.title} grammar pattern with examples and practice.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    alternates: {
      canonical: `/grammar/${encodeURIComponent(pattern)}`,
    },
  }
}

export default function GrammarLayout({ children }: Props) {
  return children
}
