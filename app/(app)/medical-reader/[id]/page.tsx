"use client"

import React from "react"

import { useState, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { ClinicalWordCard } from "@/components/web/reader/ClinicalWordCard"
import { IntentTemplatesPanel } from "@/components/web/reader/IntentTemplatesPanel"
import { DoctorQuestionsChecklist } from "@/components/web/reader/DoctorQuestionsChecklist"
import {
  medicalScenarios,
  medicalLexicon,
  type MedicalScenario,
  type MedicalLexiconEntry,
  type ConversationLine,
} from "@/lib/medical-mock"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Volume2,
  Type,
  Plus,
  Check,
  AlertTriangle,
  AlertCircle,
  Stethoscope,
  User,
  UserCog,
} from "lucide-react"

type FontSize = "small" | "medium" | "large"

const fontSizeClasses: Record<FontSize, string> = {
  small: "text-base",
  medium: "text-lg",
  large: "text-xl",
}

const roleConfig = {
  patient: {
    icon: User,
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    bgColor: "bg-blue-500/5",
  },
  doctor: {
    icon: Stethoscope,
    color: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    bgColor: "bg-teal-500/5",
  },
  nurse: {
    icon: UserCog,
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    bgColor: "bg-purple-500/5",
  },
}

const categoryColors: Record<string, string> = {
  registration: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  triage: "bg-red-500/20 text-red-400 border-red-500/30",
  consultation: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  tests: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  pharmacy: "bg-green-500/20 text-green-400 border-green-500/30",
  billing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
}

export default function MedicalReaderPage() {
  const params = useParams()
  const router = useRouter()
  const scenarioId = params.id as string

  const scenario = medicalScenarios.find((s) => s.id === scenarioId)

  const [showPinyin, setShowPinyin] = useState(true)
  const [showTranslation, setShowTranslation] = useState(false)
  const [fontSize, setFontSize] = useState<FontSize>("medium")
  const [selectedWord, setSelectedWord] = useState<MedicalLexiconEntry | null>(null)
  const [addedToSrs, setAddedToSrs] = useState<Set<string>>(new Set())
  const [popoverWord, setPopoverWord] = useState<{ word: MedicalLexiconEntry; position: { x: number; y: number } } | null>(null)

  // Build word lookup map
  const wordLookup = useMemo(() => {
    const map = new Map<string, MedicalLexiconEntry>()
    for (const entry of medicalLexicon) {
      map.set(entry.word, entry)
    }
    return map
  }, [])

  const handleWordClick = useCallback(
    (word: string, event: React.MouseEvent) => {
      const entry = wordLookup.get(word)
      if (entry) {
        setSelectedWord(entry)
        const rect = (event.target as HTMLElement).getBoundingClientRect()
        setPopoverWord({
          word: entry,
          position: { x: rect.left, y: rect.bottom + 8 },
        })
      }
    },
    [wordLookup]
  )

  const handleAddToSrs = useCallback((wordId: string) => {
    setAddedToSrs((prev) => new Set(prev).add(wordId))
  }, [])

  const closePopover = useCallback(() => {
    setPopoverWord(null)
  }, [])

  // Tokenize Chinese text into characters/words
  const tokenizeText = (text: string): string[] => {
    // Simple character-based tokenization for Chinese
    // In production, use a proper segmenter
    const tokens: string[] = []
    let i = 0
    while (i < text.length) {
      // Try 4-char, 3-char, 2-char, then 1-char matches
      let matched = false
      for (let len = 4; len >= 1; len--) {
        const substr = text.slice(i, i + len)
        if (wordLookup.has(substr)) {
          tokens.push(substr)
          i += len
          matched = true
          break
        }
      }
      if (!matched) {
        tokens.push(text[i])
        i++
      }
    }
    return tokens
  }

  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Scenario not found</h1>
        <Button onClick={() => router.push("/medical-reader")} variant="outline" className="rounded-lg">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to scenarios
        </Button>
      </div>
    )
  }

  const categoryStyle = categoryColors[scenario.category] || "bg-zinc-500/20 text-zinc-400"

  return (
    <div className="min-h-screen" onClick={closePopover}>
      {/* Header */}
      <div className="mb-6">
        <Button
          onClick={() => router.push("/path")}
          variant="ghost"
          className="text-zinc-400 hover:text-white mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <GlassCard glowColor="seal" className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs px-2.5 py-1 rounded-full border ${categoryStyle}`}>
                  {scenario.category}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                  {scenario.level}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white">{scenario.title_zh}</h1>
              <p className="text-zinc-400 mt-1">{scenario.title_en}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-zinc-500 mb-1">Chief Complaint</p>
              <p className="text-sm text-white">{scenario.chief_complaint_zh}</p>
              <p className="text-xs text-zinc-500">{scenario.chief_complaint_en}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Main Layout - 3 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Conversation Transcript */}
        <div className="lg:col-span-2 space-y-4">
          {/* Toolbar */}
          <GlassCard className="p-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPinyin(!showPinyin)}
                className={`rounded-lg h-8 ${showPinyin ? "bg-teal-500/20 text-teal-400" : "text-zinc-400"}`}
              >
                {showPinyin ? <Eye className="h-4 w-4 mr-1.5" /> : <EyeOff className="h-4 w-4 mr-1.5" />}
                Pinyin
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTranslation(!showTranslation)}
                className={`rounded-lg h-8 ${showTranslation ? "bg-teal-500/20 text-teal-400" : "text-zinc-400"}`}
              >
                {showTranslation ? <Eye className="h-4 w-4 mr-1.5" /> : <EyeOff className="h-4 w-4 mr-1.5" />}
                Translation
              </Button>
              <div className="flex items-center gap-1 ml-auto">
                <Type className="h-4 w-4 text-zinc-500" />
                {(["small", "medium", "large"] as FontSize[]).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-2 py-1 text-xs rounded ${
                      fontSize === size
                        ? "bg-white/[0.1] text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    }`}
                  >
                    {size === "small" ? "A" : size === "medium" ? "A" : "A"}
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>

          {/* Conversation */}
          <GlassCard className="p-4">
            <div className="space-y-4">
              {scenario.conversation.map((line, idx) => {
                const config = roleConfig[line.role]
                const Icon = config.icon
                const tokens = tokenizeText(line.zh)

                return (
                  <div key={idx} className={`p-4 rounded-xl ${config.bgColor} border border-white/[0.06]`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center ${config.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.color}`}>
                        {line.role}
                      </span>
                    </div>

                    {/* Chinese with clickable words */}
                    <div className={`${fontSizeClasses[fontSize]} leading-relaxed mb-1`}>
                      {tokens.map((token, i) => {
                        const isLookupable = wordLookup.has(token)
                        return (
                          <span
                            key={i}
                            onClick={(e) => {
                              if (isLookupable) {
                                e.stopPropagation()
                                handleWordClick(token, e)
                              }
                            }}
                            className={`inline ${
                              isLookupable
                                ? "cursor-pointer hover:bg-teal-500/20 hover:text-teal-300 rounded px-0.5 transition-colors"
                                : ""
                            } ${selectedWord?.word === token ? "bg-teal-500/30 text-teal-300 rounded px-0.5" : "text-white"}`}
                          >
                            {token}
                          </span>
                        )
                      })}
                    </div>

                    {/* Pinyin */}
                    {showPinyin && (
                      <p className="text-sm text-teal-400 mb-1">{line.pinyin}</p>
                    )}

                    {/* Translation */}
                    {showTranslation && (
                      <p className="text-sm text-zinc-500">{line.en}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </GlassCard>

          {/* Key Phrases */}
          {scenario.key_phrases && scenario.key_phrases.length > 0 && (
            <GlassCard className="p-4">
              <h3 className="text-sm font-medium text-zinc-400 mb-3">Key Phrases</h3>
              <div className="flex flex-wrap gap-2">
                {scenario.key_phrases.map((phrase, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-teal-500/30 transition-colors cursor-pointer"
                    onClick={(e) => {
                      const entry = wordLookup.get(phrase.zh)
                      if (entry) {
                        e.stopPropagation()
                        setSelectedWord(entry)
                      }
                    }}
                  >
                    <p className="text-sm text-white">{phrase.zh}</p>
                    <p className="text-xs text-teal-400">{phrase.pinyin}</p>
                    <p className="text-xs text-zinc-500">{phrase.en}</p>
                    {phrase.intentTag && (
                      <span className="text-xs px-1.5 py-0.5 mt-1 inline-block rounded bg-teal-500/20 text-teal-400">
                        {phrase.intentTag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Warnings Card */}
          {scenario.warnings && scenario.warnings.length > 0 && (
            <GlassCard className="p-4 border-amber-500/30">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-medium text-amber-400">Warnings & Safe Language Notes</h3>
              </div>
              <div className="space-y-2">
                {scenario.warnings.map((warning, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg flex items-start gap-2 ${
                      warning.type === "urgent_language"
                        ? "bg-red-500/10 border border-red-500/20"
                        : "bg-amber-500/10 border border-amber-500/20"
                    }`}
                  >
                    <AlertCircle
                      className={`h-4 w-4 mt-0.5 shrink-0 ${
                        warning.type === "urgent_language" ? "text-red-400" : "text-amber-400"
                      }`}
                    />
                    <div>
                      <p className="text-sm text-white">{warning.zh}</p>
                      <p className="text-xs text-zinc-500">{warning.en}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-3 italic">
                Language learning only. Not medical advice.
              </p>
            </GlassCard>
          )}
        </div>

        {/* RIGHT: Stacked Panels */}
        <div className="space-y-4">
          {/* Panel 1: Clinical Word Card */}
          <ClinicalWordCard
            word={selectedWord}
            onAddToSrs={handleAddToSrs}
            addedWords={addedToSrs}
          />

          {/* Panel 2: Intent Templates */}
          <IntentTemplatesPanel scenarioCategory={scenario.category} />

          {/* Panel 3: Doctor Questions Checklist */}
          <DoctorQuestionsChecklist />
        </div>
      </div>

      {/* Word Popover */}
      {popoverWord && (
        <div
          className="fixed z-50 w-72 animate-in fade-in-0 zoom-in-95"
          style={{
            left: Math.min(popoverWord.position.x, window.innerWidth - 300),
            top: popoverWord.position.y,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <GlassCard className="p-3 shadow-xl border-teal-500/20">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-lg font-bold text-white">{popoverWord.word.word}</span>
              <span className="text-sm text-teal-400">{popoverWord.word.pinyin}</span>
            </div>
            <p className="text-sm text-zinc-300 mb-3">{popoverWord.word.meanings_en.join("; ")}</p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  handleAddToSrs(popoverWord.word.id)
                  closePopover()
                }}
                disabled={addedToSrs.has(popoverWord.word.id)}
                className={`flex-1 rounded-lg h-7 text-xs ${
                  addedToSrs.has(popoverWord.word.id)
                    ? "bg-teal-500/20 text-teal-400"
                    : "bg-teal-600 text-white hover:bg-teal-500"
                }`}
              >
                {addedToSrs.has(popoverWord.word.id) ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Added
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3 mr-1" />
                    Add to SRS
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg h-7 text-xs border-white/[0.08] bg-white/[0.03]"
                onClick={closePopover}
              >
                Close
              </Button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  )
}
