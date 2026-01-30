import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getContentBySlug } from "@/lib/content"
import { ScenarioDetailPage } from "./ScenarioDetailPage"

interface PageProps {
  params: Promise<{ id: string }>
}

// 生成元数据用于 SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  try {
    const result = await getContentBySlug('scenario', id)

    if (!result.data) {
      return {
        title: "Not Found | Learn Chinese Medical Scenarios",
        description: "Medical scenario not found.",
      }
    }

    const scenario = result.data

    return {
      title: `${scenario.title} - Medical Chinese Scenario | Learn Chinese`,
      description: `Practice real medical conversation: ${scenario.title}. Master healthcare dialogue in Chinese with interactive scenarios.`,
      keywords: ["medical Chinese", "healthcare dialogue", "medical scenarios", scenario.category].filter((k): k is string => typeof k === 'string'),
      openGraph: {
        title: `${scenario.title} - Medical Chinese Scenario`,
        description: `Practice real medical conversation in Chinese for effective healthcare communication.`,
        type: "article",
      },
      alternates: {
        canonical: `/medical/scenarios/${id}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: "Medical Scenarios | Learn Chinese",
      description: "Practice real medical conversations in Chinese.",
    }
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  const result = await getContentBySlug('scenario', id)

  if (!result.data) {
    notFound()
  }

  return <ScenarioDetailPage scenario={result.data} />
}