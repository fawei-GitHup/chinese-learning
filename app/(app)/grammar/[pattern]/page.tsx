"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { grammarEntries, dictionaryEntries } from "@/lib/web-mock"
import { medicalGrammar, medicalLexicon, medicalScenarios } from "@/lib/medical-mock"
import { ArrowLeft, AlertTriangle, BookOpen, FileText, Link2, Search, Stethoscope, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import Loading from "./loading"

export default function GrammarPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const pattern = decodeURIComponent(params.pattern as string)

  // Check regular grammar first, then medical grammar
  const regularEntry = grammarEntries.find(
    (e) => e.pattern === pattern || e.id === pattern
  )
  
  const medEntry = medicalGrammar.find(
    (e) => e.pattern === pattern || e.id === pattern
  )
  
  const isMedical = !regularEntry && !!medEntry
  const entry = regularEntry || (medEntry ? {
    ...medEntry,
    explanation: medEntry.explanation_en,
    relatedPatterns: [],
  } : null)

  if (!entry) {
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
              onClick={() => router.push("/path")}
              className="mt-4 bg-cyan-500 text-black hover:bg-cyan-400"
            >
              Browse Lessons
            </Button>
          </GlassCard>
        </div>
      </div>
    )
  }

  // Find related dictionary entries
  const relatedDictionary = dictionaryEntries
    .filter((d) =>
      entry.relatedPatterns.some((rp) => d.word.includes(rp.replace(/[^一-龯]/g, ""))) ||
      entry.examples.some((ex) => ex.cn.includes(d.word))
    )
    .slice(0, 6)

  // Generate SEO preview
  const seoTitle = `${entry.pattern} - Chinese Grammar Pattern | LearnChinese`
  const seoDescription = entry.geo_snippet

  return (
    <Suspense fallback={<Loading />}>
      <>
        {/* JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": entry.faq ? "FAQPage" : "WebPage",
              name: seoTitle,
              description: seoDescription,
              ...(entry.faq && {
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
            }),
          }}
        />

        <div className="min-h-screen p-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-6 text-zinc-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            {/* Header Section */}
            <GlassCard glowColor="amber" className="mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-white">{entry.pattern}</h1>
                    {isMedical && (
                      <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium flex items-center gap-1">
                        <Stethoscope className="h-3.5 w-3.5" />
                        Medical
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium">
                      {entry.level}
                    </span>
                  </div>
                  <p className="text-zinc-400 max-w-2xl">{entry.explanation}</p>
                </div>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Examples Section */}
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
                        <p className="text-zinc-400">{example.en}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Common Mistakes */}
                {entry.common_mistakes && entry.common_mistakes.length > 0 && (
                  <GlassCard glowColor="rose">
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

                {/* Medical: Clinic Templates */}
                {isMedical && medEntry?.clinic_templates && medEntry.clinic_templates.length > 0 && (
                  <GlassCard>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-teal-400" />
                      Clinical Use Templates
                    </h2>
                    <div className="space-y-3">
                      {medEntry.clinic_templates.map((template, i) => (
                        <div key={i} className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30 mb-2 inline-block">
                            {template.intent.replace(/_/g, " ")}
                          </span>
                          <p className="text-lg text-white mt-2">{template.zh}</p>
                          <p className="text-sm text-zinc-400">{template.en}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* GEO Block - Key Information for AI */}
                <GlassCard glowColor="emerald">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    Grammar Summary & Key Points
                  </h2>
                  
                  {/* Geo Snippet */}
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                    <p className="text-zinc-200 leading-relaxed">{entry.geo_snippet}</p>
                  </div>

                  {/* Key Points */}
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
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Related Dictionary Words */}
                <GlassCard>
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-cyan-400" />
                    Related Vocabulary
                  </h2>
                  <div className="space-y-2">
                    {relatedDictionary.length > 0 ? (
                      relatedDictionary.map((related) => (
                        <Link
                          key={related.id}
                          href={`/dictionary/${encodeURIComponent(related.word)}`}
                          className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div>
                            <span className="text-white font-medium">{related.word}</span>
                            <span className="text-zinc-500 ml-2">{related.pinyin}</span>
                          </div>
                          <span className="text-xs text-zinc-500">{related.level}</span>
                        </Link>
                      ))
                    ) : (
                      <p className="text-zinc-500 text-sm">
                        Browse vocabulary to find related words.
                      </p>
                    )}
                  </div>
                </GlassCard>

                {/* Related Patterns */}
                <GlassCard>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Related Patterns
                  </h2>
                  <div className="space-y-2">
                    {entry.relatedPatterns.map((rp, i) => {
                      const relatedEntry = grammarEntries.find((g) => g.pattern.includes(rp))
                      return relatedEntry ? (
                        <Link
                          key={i}
                          href={`/grammar/${encodeURIComponent(relatedEntry.pattern)}`}
                          className="block p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <span className="text-white">{relatedEntry.pattern}</span>
                        </Link>
                      ) : (
                        <span
                          key={i}
                          className="block p-3 rounded-xl bg-white/5 text-zinc-400"
                        >
                          {rp}
                        </span>
                      )
                    })}
                  </div>
                </GlassCard>

                {/* SEO Preview Card */}
                <GlassCard>
                  <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-3">
                    SEO Preview
                  </h2>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-blue-400 text-sm mb-1 truncate">{seoTitle}</p>
                    <p className="text-emerald-400 text-xs mb-2">
                      learnchinese.app/grammar/{encodeURIComponent(entry.pattern)}
                    </p>
                    <p className="text-zinc-400 text-sm line-clamp-2">{seoDescription}</p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </>
    </Suspense>
  )
}
