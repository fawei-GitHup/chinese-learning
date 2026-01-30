"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddToSRSButton } from "@/components/srs/AddToSRSButton"
import { getContentBySlug, type ContentDetailResult } from "@/lib/content"
import { ArrowLeft, AlertTriangle, BookOpen, FileText, Link2, Search, BookmarkPlus } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import Loading from "./loading"

// Grammar content interface based on database structure
interface GrammarData {
  id: string
  slug: string
  title: string
  description?: string
  type: 'grammar'
  level: string
  pattern?: string
  explanation?: string
  examples?: Array<{ cn: string; en: string }>
  common_mistakes?: string[]
  key_points?: string[]
  faq?: string[]
  geo_snippet?: string
  relatedPatterns?: string[]
  [key: string]: any
}

export default function GrammarPage() {
  const params = useParams()
  const router = useRouter()
  const pattern = decodeURIComponent(params.pattern as string)

  const [result, setResult] = useState<ContentDetailResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [bookmarked, setBookmarked] = useState(false)
  const [addedToSRS, setAddedToSRS] = useState<Set<number>>(new Set())

  useEffect(() => {
    const loadGrammar = async () => {
      setLoading(true)
      try {
        const response = await getContentBySlug('grammar', pattern)
        setResult(response)
      } catch (error) {
        console.error('Failed to load grammar:', error)
        setResult({
          data: null,
          error: error instanceof Error ? error : new Error('Unknown error')
        })
      } finally {
        setLoading(false)
      }
    }

    loadGrammar()
  }, [pattern])

  const handleToggleSRS = (index: number) => {
    setAddedToSRS(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  if (loading) {
    return <Loading />
  }

  if (result?.error || !result?.data) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 text-zinc-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <GlassCard className="text-center py-12">
            <Search className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-white mb-2">Grammar pattern not found</h1>
            <p className="text-zinc-400">
              The pattern &ldquo;{pattern}&rdquo; is not in our grammar guide yet.
            </p>
            <Button
              onClick={() => router.push("/grammar")}
              className="mt-4 bg-cyan-500 text-black hover:bg-cyan-400"
            >
              Browse Grammar Guide
            </Button>
          </GlassCard>
        </div>
      </div>
    )
  }

  const entry = result.data as GrammarData
  const isMedical = entry.level === 'Medical'

  // Generate SEO preview
  const seoTitle = `${entry.pattern || entry.title} - Chinese Grammar Pattern | LearnChinese`
  const seoDescription = entry.geo_snippet || entry.description || entry.explanation || ''

  return (
    <>
      {/* JSON-LD for SEO */}
      {entry.faq && entry.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              name: seoTitle,
              description: seoDescription,
              mainEntity: entry.faq
                .filter((_, i) => i % 2 === 0)
                .map((q, i) => ({
                  "@type": "Question",
                  name: q,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: entry.faq?.[i * 2 + 1] || "",
                  },
                })),
            }),
          }}
        />
      )}

      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {/* Bookmark Button */}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                bookmarked
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "text-zinc-500 hover:text-yellow-400"
              )}
              title={bookmarked ? "Remove bookmark" : "Bookmark this pattern"}
            >
              <BookmarkPlus className={cn("h-5 w-5", bookmarked && "fill-current")} />
            </button>
          </div>

          {/* Header Section */}
          <GlassCard className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold text-white">{entry.pattern || entry.title}</h1>
                  <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
                    {entry.level}
                  </Badge>
                </div>
                <p className="text-zinc-400 max-w-2xl">{entry.explanation || entry.description}</p>
              </div>
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Examples Section */}
              {entry.examples && entry.examples.length > 0 && (
                <GlassCard>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-cyan-400" />
                    Example Sentences
                  </h2>
                  <div className="space-y-4">
                    {entry.examples.map((example, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl bg-white/5 border border-white/5"
                      >
                        <p className="text-xl text-white mb-2">{example.cn}</p>
                        <p className="text-zinc-400 mb-3">{example.en}</p>
                        
                        {/* SRS Button for Sentence */}
                        <AddToSRSButton
                          contentType="sentence"
                          content={{
                            front: example.cn,
                            back: example.en,
                            context: entry.pattern || entry.title,
                          }}
                          sourceType="grammar"
                          sourceId={entry.id}
                          variant="small"
                          onSuccess={() => handleToggleSRS(i)}
                        />
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Common Mistakes */}
              {entry.common_mistakes && entry.common_mistakes.length > 0 && (
                <GlassCard>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-rose-400" />
                    Common Mistakes to Avoid
                  </h2>
                  <ul className="space-y-3">
                    {entry.common_mistakes.map((mistake, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20"
                      >
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 text-sm flex items-center justify-center">
                          !
                        </span>
                        <span className="text-zinc-300">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              )}

              {/* GEO Block - Key Information for AI */}
              {(entry.geo_snippet || entry.key_points || entry.faq) && (
                <GlassCard>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    Grammar Summary & Key Points
                  </h2>
                  
                  {/* Geo Snippet */}
                  {entry.geo_snippet && (
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                      <p className="text-zinc-200 leading-relaxed">{entry.geo_snippet}</p>
                    </div>
                  )}

                  {/* Key Points */}
                  {entry.key_points && entry.key_points.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
                        Key Points
                      </h3>
                      <ul className="space-y-2">
                        {entry.key_points.map((point, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-sm flex items-center justify-center">
                              {i + 1}
                            </span>
                            <span className="text-zinc-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* FAQ Section */}
                  {entry.faq && entry.faq.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
                        Frequently Asked Questions
                      </h3>
                      <div className="space-y-3">
                        {entry.faq
                          .filter((_, i) => i % 2 === 0)
                          .map((question, i) => (
                            <div
                              key={i}
                              className="p-4 rounded-xl bg-white/5 border border-white/5"
                            >
                              <p className="font-medium text-white mb-2">{question}</p>
                              <p className="text-zinc-400">{entry.faq?.[i * 2 + 1]}</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </GlassCard>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* SEO Preview Card */}
              <GlassCard>
                <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
                  SEO Preview
                </h2>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <p className="text-blue-400 text-sm mb-1 truncate">{seoTitle}</p>
                  <p className="text-emerald-400 text-xs mb-2">
                    learnchinese.app/grammar/{encodeURIComponent(entry.pattern || entry.slug)}
                  </p>
                  <p className="text-zinc-400 text-sm line-clamp-2">{seoDescription}</p>
                </div>
              </GlassCard>

              {/* Stats Card */}
              {addedToSRS.size > 0 && (
                <GlassCard>
                  <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
                    Learning Progress
                  </h2>
                  <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <p className="text-sm text-zinc-400 mb-1">Sentences in SRS</p>
                    <p className="text-2xl font-bold text-cyan-400">{addedToSRS.size}</p>
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
