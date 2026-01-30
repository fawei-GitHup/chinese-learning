import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getContentBySlug } from "@/lib/content"
import { MedicalTermDetailPage } from "./MedicalTermDetailPage"

interface PageProps {
  params: Promise<{ word: string }>
}

// 生成元数据用于 SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { word } = await params

  try {
    const result = await getContentBySlug('medical_term', word)

    if (!result.data) {
      return {
        title: "Not Found | Learn Chinese Medical Terms",
        description: "Medical term not found.",
      }
    }

    const term = result.data

    return {
      title: `${term.word} - Medical Chinese Vocabulary | Learn Chinese`,
      description: `Learn ${term.word} (${term.pinyin}) - Medical Chinese term. Master healthcare communication in Chinese.`,
      keywords: ["medical Chinese", "healthcare vocabulary"],
      openGraph: {
        title: `${term.word} (${term.pinyin}) - Medical Chinese Term`,
        description: `Learn ${term.word} - ${term.description || term.meanings?.[0] || ''}`,
        type: "article",
      },
      alternates: {
        canonical: `/medical/dictionary/${word}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: "Medical Chinese Dictionary | Learn Chinese",
      description: "Browse medical Chinese vocabulary and healthcare terminology.",
    }
  }
}

export default async function Page({ params }: PageProps) {
  const { word } = await params

  const result = await getContentBySlug('medical_term', word)

  if (!result.data) {
    notFound()
  }

  return <MedicalTermDetailPage term={result.data} />
}