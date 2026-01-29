"use client"

import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { dictionaryEntries, grammarEntries } from "@/lib/web-mock"
import { medicalLexicon, medicalGrammar, medicalScenarios } from "@/lib/medical-mock"
import { ArrowLeft, Volume2, Plus, BookOpen, Link2, FileText, Search, Stethoscope, AlertTriangle, Check, XCircle } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import Loading from "./loading"

export default function DictionaryPage() {
  const params = useParams()
  const router = useRouter()
  const word = decodeURIComponent(params.word as string)

  // Check regular dictionary first, then medical lexicon
  const regularEntry = dictionaryEntries.find(
    (e) => e.word === word || e.id === word
  )
  
  const medicalEntry = medicalLexicon.find(
    (e) => e.word === word || e.id === word
  )
  
  const isMedical = !regularEntry && !!medicalEntry
  const entry = regularEntry || (medicalEntry ? {
    ...medicalEntry,
    meanings: medicalEntry.meanings_en,
    level: medicalEntry.category,
    collocations: medicalEntry.collocations?.map(c => c.zh) || [],
    relatedWords: medicalEntry.relatedWords || [],
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
            <h1 className="text-xl font-semibold text-white mb-2">Word not found</h1>
            <p className="text-zinc-400">
              The word &ldquo;{word}&rdquo; is not in our dictionary yet.
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

  // Find related grammar patterns
  const relatedGrammar = grammarEntries.filter((g) =>
    entry.relatedWords.some((rw) => g.pattern.includes(rw)) ||
    g.examples.some((ex) => ex.cn.includes(entry.word))
  ).slice(0, 3)

  // Find related dictionary entries
  const relatedEntries = dictionaryEntries
    .filter((d) => entry.relatedWords.includes(d.word) && d.id !== entry.id)
    .slice(0, 6)

  // Generate SEO preview
  const seoTitle = `${entry.word} (${entry.pinyin}) - ${entry.meanings[0]} | LearnChinese`
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
            <GlassCard glowColor="cyan" className="mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-5xl font-bold text-white">{entry.word}</h1>
                    {isMedical && (
                      <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium flex items-center gap-1">
                        <Stethoscope className="h-3.5 w-3.5" />
                        Medical
                      </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium">
                      {entry.level}
                    </span>
                  </div>
                  <p className="text-2xl text-cyan-400 mb-2">{entry.pinyin}</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.meanings.map((meaning, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-white/5 text-zinc-300"
                      >
                        {meaning}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-white/10 hover:bg-white/5 bg-transparent"
                  >
                    <Volume2 className="h-5 w-5 text-zinc-400" />
                  </Button>
                  <Button className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400">
                    <Plus className="h-4 w-4 mr-2" />
                    Add to SRS
                  </Button>
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
                        <p className="text-xl text-white mb-1">{example.cn}</p>
                        {example.pinyin && (
                          <p className="text-sm text-cyan-400 mb-2">{example.pinyin}</p>
                        )}
                        <p className="text-zinc-400">{example.en}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Collocations */}
                {entry.collocations && entry.collocations.length > 0 && (
                  <GlassCard>
                    <h2 className="text-lg font-semibold text-white mb-4">
                      Common Collocations
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {entry.collocations.map((collocation, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        >
                          {collocation}
                        </span>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Medical: Say It Like This */}
                {isMedical && medicalEntry?.say_it_like && medicalEntry.say_it_like.length > 0 && (
                  <GlassCard>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Check className="h-5 w-5 text-teal-400" />
                      Say It Like This
                    </h2>
                    <div className="space-y-3">
                      {medicalEntry.say_it_like.map((item, i) => (
                        <div key={i} className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20">
                          <p className="text-white font-medium">{item.zh}</p>
                          <p className="text-sm text-zinc-400">{item.en}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Medical: Don't Say */}
                {isMedical && medicalEntry?.dont_say && medicalEntry.dont_say.length > 0 && (
                  <GlassCard glowColor="rose">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-amber-400" />
                      Avoid Saying
                    </h2>
                    <div className="space-y-3">
                      {medicalEntry.dont_say.map((item, i) => (
                        <div key={i} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                          <p className="text-amber-300 line-through">{item.zh}</p>
                          <p className="text-sm text-zinc-400 mt-1">{item.reason}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Medical: Related Scenarios */}
                {isMedical && (() => {
                  const relatedScenarios = medicalScenarios.filter(s =>
                    s.vocab_focus?.includes(medicalEntry?.id || "") ||
                    s.conversation.some(c => c.zh.includes(entry.word))
                  ).slice(0, 3)
                  return relatedScenarios.length > 0 ? (
                    <GlassCard>
                      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-teal-400" />
                        Related Medical Scenarios
                      </h2>
                      <div className="space-y-3">
                        {relatedScenarios.map((scenario) => (
                          <Link
                            key={scenario.id}
                            href={`/medical-reader/${scenario.id}`}
                            className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30">
                                {scenario.category}
                              </span>
                              <span className="text-xs text-zinc-500">{scenario.level}</span>
                            </div>
                            <p className="font-medium text-white">{scenario.title_zh}</p>
                            <p className="text-sm text-zinc-400">{scenario.title_en}</p>
                          </Link>
                        ))}
                      </div>
                    </GlassCard>
                  ) : null
                })()}

                {/* GEO Block - Key Information for AI */}
                <GlassCard glowColor="emerald">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-400" />
                    Definition & Key Points
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

                {/* Related Grammar Patterns */}
                {relatedGrammar.length > 0 && (
                  <GlassCard>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Link2 className="h-5 w-5 text-amber-400" />
                      Related Grammar
                    </h2>
                    <div className="space-y-3">
                      {relatedGrammar.map((grammar) => (
                        <Link
                          key={grammar.id}
                          href={`/grammar/${encodeURIComponent(grammar.pattern)}`}
                          className="block p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                        >
                          <p className="font-medium text-white">{grammar.pattern}</p>
                          <p className="text-sm text-zinc-400 line-clamp-2">
                            {grammar.explanation.slice(0, 100)}...
                          </p>
                        </Link>
                      ))}
                    </div>
                  </GlassCard>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Related Words */}
                <GlassCard>
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Related Words
                  </h2>
                  <div className="space-y-2">
                    {relatedEntries.length > 0 ? (
                      relatedEntries.map((related) => (
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
                        No related words found. Check back as we add more entries.
                      </p>
                    )}
                    {entry.relatedWords.filter(
                      (rw) => !relatedEntries.find((re) => re.word === rw)
                    ).length > 0 && (
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-xs text-zinc-500 mb-2">Also related:</p>
                        <div className="flex flex-wrap gap-1">
                          {entry.relatedWords
                            .filter((rw) => !relatedEntries.find((re) => re.word === rw))
                            .map((rw, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 rounded bg-white/5 text-xs text-zinc-400"
                              >
                                {rw}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}
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
                      learnchinese.app/dictionary/{entry.word}
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
