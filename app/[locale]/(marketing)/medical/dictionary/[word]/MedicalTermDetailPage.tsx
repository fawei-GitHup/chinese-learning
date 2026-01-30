"use client"

import { useState } from "react"
import Link from "next/link"
import { MedicalTermContent } from "@/lib/content"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SkeletonDetail } from "@/components/web/SkeletonCard"
import { AddToSRSButton } from "@/components/srs/AddToSRSButton"
import {
  ArrowLeft,
  Plus,
  BookOpen,
  Volume2,
  MessageSquare,
  HelpCircle,
  Heart,
  Bookmark,
  ExternalLink
} from "lucide-react"

interface MedicalTermDetailPageProps {
  term: MedicalTermContent
}

export function MedicalTermDetailPage({ term }: MedicalTermDetailPageProps) {
  const [saved, setSaved] = useState(false)
  const [liked, setLiked] = useState(false)

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: term.word,
            description: term.description,
            inDefinedTermSet: {
              "@type": "DefinedTermSet",
              name: "Medical Chinese Dictionary",
              description: "Medical Chinese vocabulary for healthcare professionals"
            },
            termCode: term.pinyin,
            ...(term.meanings && {
              definedTerm: term.meanings.join(", ")
            }),
            ...(term.category && {
              category: term.category
            }),
            url: `https://learn-chinese.example.com/medical/dictionary/${term.slug}`,
            ...(term.meanings && term.meanings.length > 0 && {
              mainEntityOfPage: {
                "@type": "FAQPage",
                mainEntity: term.meanings.slice(0, 3).map((meaning, index) => ({
                  "@type": "Question",
                  name: `What does ${term.word} mean in medical Chinese?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: meaning
                  }
                }))
              }
            })
          })
        }}
      />

      <div className="min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header Navigation */}
          <div className="mb-8">
            <Link
              href="/medical"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Medical Chinese
            </Link>
            <Link
              href="/medical/vocabulary"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              View All Vocabulary
            </Link>
          </div>

          {/* Main Content Card */}
          <GlassCard className="p-8 mb-8">
            <div className="space-y-6">
              {/* Term Header */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-4xl font-bold text-white">{term.word}</h1>
                      {term.category && (
                        <Badge variant="outline" className="border-teal-500/30 text-teal-400">
                          {term.category}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-xl text-teal-400 font-mono">{term.pinyin}</div>
                      <button className="p-2 hover:bg-white/[0.06] rounded-md transition-colors">
                        <Volume2 className="h-5 w-5 text-zinc-400 hover:text-teal-400" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setSaved(!saved)}
                      className={`p-3 rounded-lg transition-colors ${
                        saved
                          ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                          : "hover:bg-white/[0.06] text-zinc-500"
                      }`}
                    >
                      <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
                    </button>
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`p-3 rounded-lg transition-colors ${
                        liked
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "hover:bg-white/[0.06] text-zinc-500"
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${liked ? "fill-current" : ""}`} />
                    </button>
                  </div>
                </div>
              </div>

              <Separator className="bg-white/[0.06]" />

              {/* Definitions */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-teal-400" />
                  Definitions
                </h2>
                <div className="space-y-3">
                  {term.meanings && term.meanings.length > 0 ? (
                    term.meanings.map((meaning, index) => (
                      <div key={index} className="flex gap-3">
                        <span className="text-teal-400 font-semibold min-w-[24px]">{index + 1}.</span>
                        <p className="text-zinc-300 leading-relaxed">{meaning}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-400 italic">
                      {term.description || "No detailed definition available."}
                    </p>
                  )}
                </div>
              </div>

              {/* SRS Integration */}
              <div className="bg-gradient-to-r from-teal-500/10 to-teal-600/10 border border-teal-500/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Plus className="h-5 w-5 text-teal-400" />
                      Add to SRS Review
                    </h3>
                    <p className="text-zinc-400">
                      Memorize this medical term with spaced repetition learning
                    </p>
                  </div>
                  <AddToSRSButton
                    contentType="medical_term"
                    content={{
                      front: term.word || '',
                      back: term.meanings?.[0] || term.description || '',
                      pinyin: term.pinyin || '',
                      notes: term.meanings?.slice(1).join('; '),
                    }}
                    sourceType="medical_term"
                    sourceId={term.id}
                  />
                </div>
              </div>

              {/* Related Information */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Usage Examples */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-teal-400" />
                    Usage Context
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
                      <p className="text-sm text-zinc-400 mb-2">Example in sentence:</p>
                      <p className="text-zinc-200 italic">
                        "医生检查了病人的<span className="text-teal-400 font-semibold">{term.word}</span>。"
                      </p>
                      <p className="text-sm text-zinc-500 mt-2">
                        "The doctor examined the patient's {term.word}."
                      </p>
                    </div>
                  </div>
                </div>

                {/* FAQ Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-teal-400" />
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-3">
                    <details className="group">
                      <summary className="cursor-pointer text-zinc-300 hover:text-white transition-colors flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                        <span>How to pronounce {term.word}?</span>
                        <Plus className="h-4 w-4 text-zinc-500 group-open:rotate-45 transition-transform" />
                      </summary>
                      <div className="mt-3 p-3 bg-white/[0.01] rounded-md">
                        <p className="text-zinc-400">
                          Pronounced as <strong className="text-teal-400">{term.pinyin}</strong> in Mandarin Chinese.
                        </p>
                      </div>
                    </details>

                    {term.category && (
                      <details className="group">
                        <summary className="cursor-pointer text-zinc-300 hover:text-white transition-colors flex items-center justify-between p-3 bg-white/[0.02] border border-white/[0.06] rounded-lg">
                          <span>What category does {term.word} belong to?</span>
                          <Plus className="h-4 w-4 text-zinc-500 group-open:rotate-45 transition-transform" />
                        </summary>
                        <div className="mt-3 p-3 bg-white/[0.01] rounded-md">
                          <p className="text-zinc-400">
                            This term belongs to the <strong className="text-teal-400">{term.category}</strong> category in medical terminology.
                          </p>
                        </div>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline" className="border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]">
              <Link href="/medical/vocabulary">
                <BookOpen className="h-4 w-4 mr-2" />
                Browse More Terms
              </Link>
            </Button>
            <Button asChild className="bg-teal-600 hover:bg-teal-700">
              <Link href="/login?redirect=%2Fmedical%2Fvocabulary">
                <ExternalLink className="h-4 w-4 mr-2" />
                Practice in Full App
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}