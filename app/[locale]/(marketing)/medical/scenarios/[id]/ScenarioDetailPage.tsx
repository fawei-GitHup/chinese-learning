"use client"

import { useState } from "react"
import Link from "next/link"
import { ScenarioContent } from "@/lib/content"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddToSRSButton } from "@/components/srs/AddToSRSButton"
import {
  ArrowLeft,
  MessageSquare,
  Plus,
  Star,
  Users,
  Clock,
  BookOpen,
  ExternalLink,
  Volume2
} from "lucide-react"

interface ScenarioDetailPageProps {
  scenario: ScenarioContent
}

const categories = [
  { id: "registration", label: "Registration", icon: MessageSquare, color: "text-blue-400", bgColor: "bg-blue-500/20" },
  { id: "triage", label: "Triage", icon: Users, color: "text-red-400", bgColor: "bg-red-500/20" },
  { id: "consultation", label: "Consultation", icon: MessageSquare, color: "text-teal-400", bgColor: "bg-teal-500/20" },
  { id: "tests", label: "Tests", icon: Clock, color: "text-purple-400", bgColor: "bg-purple-500/20" },
  { id: "pharmacy", label: "Pharmacy", icon: BookOpen, color: "text-green-400", bgColor: "bg-green-500/20" },
]

export function ScenarioDetailPage({ scenario }: ScenarioDetailPageProps) {
  const [bookmarked, setBookmarked] = useState(false)

  const categoryData = categories.find(cat => cat.id === scenario.category)
  const Icon = categoryData?.icon || MessageSquare

  // Mock conversation data - in real app, this would come from scenario data
  const conversation = [
    { role: "patient", zh: "医生，我头很疼，发烧了。", en: "Doctor, my head hurts and I have a fever." },
    { role: "doctor", zh: "有多长时间了？", en: "How long has this been going on?" },
    { role: "patient", zh: "昨天晚上开始的。", en: "It started last night." },
    { role: "doctor", zh: "我给你量量体温。", en: "Let me take your temperature." },
    { role: "doctor", zh: "你发烧了，38.5度。", en: "You have a fever, 38.5 degrees." },
  ]

  const keyPhrases = [
    { zh: "头很疼", en: "head hurts", category: "symptom" },
    { zh: "发烧了", en: "have a fever", category: "symptom" },
    { zh: "有多长时间了", en: "how long has this been", category: "question" },
    { zh: "量量体温", en: "take temperature", category: "action" },
  ]

  return (
    <>
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: scenario.title,
            description: scenario.description,
            step: conversation.slice(0, 5).map((msg, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: `Step ${index + 1}`,
              text: msg.zh,
              itemListElement: [{
                "@type": "ListItem",
                position: 1,
                name: msg.en
              }]
            })),
            ...(scenario.category && {
              about: {
                "@type": "MedicalSpecialty",
                name: scenario.category
              }
            }),
            url: `https://learn-chinese.example.com/medical/scenarios/${scenario.slug}`,
            ...(keyPhrases.length > 0 && {
              mainEntityOfPage: {
                "@type": "FAQPage",
                mainEntity: keyPhrases.slice(0, 3).map((phrase) => ({
                  "@type": "Question",
                  name: `What does "${phrase.zh}" mean in medical Chinese?`,
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: `It means "${phrase.en}" in English.`
                  }
                }))
              }
            })
          })
        }}
      />

      <div className="min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-6">
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
              href="/medical/scenarios"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              View All Scenarios
            </Link>
          </div>

          {/* Scenario Header */}
          <GlassCard className="p-8 mb-8">
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${categoryData?.bgColor || 'bg-teal-500/20'} border border-teal-500/30`}>
                      <Icon className="h-6 w-6 text-teal-400" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">{scenario.title}</h1>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="border-teal-500/30 text-teal-400">
                          {scenario.level}
                        </Badge>
                        {scenario.category && (
                          <Badge variant="outline" className="border-zinc-500/30 text-zinc-400">
                            {scenario.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-zinc-300 max-w-2xl">
                    {scenario.description}
                  </p>

                  {scenario.chief_complaint_zh && scenario.chief_complaint_en && (
                    <div className="bg-teal-500/10 border border-teal-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-teal-400" />
                        <span className="text-sm font-medium text-teal-400">Chief Complaint</span>
                      </div>
                      <p className="text-white font-medium">{scenario.chief_complaint_zh}</p>
                      <p className="text-zinc-400 text-sm">{scenario.chief_complaint_en}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 ml-6">
                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`p-3 rounded-lg transition-colors ${
                      bookmarked
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "hover:bg-white/[0.06] text-zinc-500"
                    }`}
                  >
                    <Star className={`h-5 w-5 ${bookmarked ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>

              {/* SRS Integration */}
              <div className="bg-gradient-to-r from-teal-500/10 to-teal-600/10 border border-teal-500/20 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Plus className="h-5 w-5 text-teal-400" />
                      Practice This Scenario
                    </h3>
                    <p className="text-zinc-400">
                      Add this medical conversation to your spaced repetition review
                    </p>
                  </div>
                  <AddToSRSButton
                    contentType="sentence"
                    content={{
                      front: scenario.title,
                      back: scenario.description || '',
                      context: `${scenario.chief_complaint_zh || ''} - ${scenario.chief_complaint_en || ''}`,
                      notes: scenario.category,
                    }}
                    sourceType="lesson"
                    sourceId={scenario.id}
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Conversation */}
            <div className="lg:col-span-2">
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-teal-400" />
                  Conversation
                </h2>

                <div className="space-y-4">
                  {conversation.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-4 p-4 rounded-lg ${
                        message.role === 'doctor'
                          ? 'bg-teal-500/10 border border-teal-500/20 ml-8'
                          : 'bg-white/[0.02] border border-white/[0.06] mr-8'
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.role === 'doctor' ? 'bg-teal-500/20' : 'bg-white/[0.06]'
                      }`}>
                        <span className={`text-xs font-medium ${
                          message.role === 'doctor' ? 'text-teal-400' : 'text-zinc-400'
                        }`}>
                          {message.role === 'doctor' ? '医' : '患'}
                        </span>
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-white font-medium">{message.zh}</p>
                        <p className="text-zinc-400 text-sm">{message.en}</p>
                        <div className="flex items-center gap-2">
                          <button className="text-teal-400 hover:text-teal-300 text-sm flex items-center gap-1">
                            <Volume2 className="h-3 w-3" />
                            Listen
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Key Phrases Sidebar */}
            <div>
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-teal-400" />
                  Key Phrases
                </h3>

                <div className="space-y-3">
                  {keyPhrases.map((phrase, index) => (
                    <div key={index} className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-white font-medium">{phrase.zh}</span>
                        <AddToSRSButton
                          contentType="vocabulary"
                          content={{
                            front: phrase.zh,
                            back: phrase.en,
                          }}
                          sourceType="lesson"
                          sourceId={scenario.id}
                          variant="small"
                        >
                          SRS
                        </AddToSRSButton>
                      </div>
                      <p className="text-zinc-400 text-sm">{phrase.en}</p>
                      <Badge variant="outline" className="mt-2 text-xs border-zinc-500/30 text-zinc-500">
                        {phrase.category}
                      </Badge>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06]">
                  <Button asChild className="w-full bg-teal-600 hover:bg-teal-700">
                    <Link href="/login?redirect=%2Fmedical%2Fscenarios">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Practice in Full App
                    </Link>
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}