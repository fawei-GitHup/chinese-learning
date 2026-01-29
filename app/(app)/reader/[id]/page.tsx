"use client"

import React from "react"

import { useState, useCallback, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { readers, mockGrammarPoints, type ReaderToken } from "@/lib/web-mock"
import { usePreferences } from "@/lib/preferences-store"
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Type,
  Plus,
  Check,
  BookOpen,
  Sparkles,
  ChevronRight,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

type FontSize = "small" | "medium" | "large"

const fontSizeClasses: Record<FontSize, string> = {
  small: "text-lg leading-relaxed",
  medium: "text-xl leading-relaxed",
  large: "text-2xl leading-loose",
}

export default function ReaderPage() {
  const params = useParams()
  const router = useRouter()
  const readerId = params.id as string

  const reader = readers.find((r) => r.id === readerId)

  // Use shared preferences store
  const preferences = usePreferences()
  const [showPinyin, setShowPinyin] = useState(preferences.showPinyin)
  const [showTranslation, setShowTranslation] = useState(preferences.showTranslation)
  const [fontSize, setFontSize] = useState<FontSize>(preferences.fontSize)
  
  // Sync local state with preferences store on mount
  useEffect(() => {
    setShowPinyin(preferences.showPinyin)
    setShowTranslation(preferences.showTranslation)
    setFontSize(preferences.fontSize)
  }, [preferences.showPinyin, preferences.showTranslation, preferences.fontSize])
  const [selectedToken, setSelectedToken] = useState<ReaderToken | null>(null)
  const [popoverPosition, setPopoverPosition] = useState<{ x: number; y: number } | null>(null)
  const [addedToSrs, setAddedToSrs] = useState<Set<string>>(new Set())

  const handleTokenClick = useCallback((token: ReaderToken, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect()
    setPopoverPosition({ x: rect.left, y: rect.bottom + 8 })
    setSelectedToken(token)
  }, [])

  const handleClosePopover = useCallback(() => {
    setSelectedToken(null)
    setPopoverPosition(null)
  }, [])

  const handleAddToSrs = useCallback((token: ReaderToken) => {
    setAddedToSrs((prev) => new Set([...prev, token.word]))
    handleClosePopover()
  }, [handleClosePopover])

  const cycleFontSize = () => {
    const sizes: FontSize[] = ["small", "medium", "large"]
    const currentIndex = sizes.indexOf(fontSize)
    setFontSize(sizes[(currentIndex + 1) % sizes.length])
  }

  if (!reader) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <GlassCard className="text-center">
          <p className="text-zinc-400">Reader not found</p>
          <Link href="/path">
            <Button className="mt-4">Back to Path</Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  // Create a lookup map for tokens
  const tokenMap = new Map(reader.tokens.map((t) => [t.word, t]))

  // Function to render text with clickable tokens
  const renderParagraphWithTokens = (text: string, paragraphIndex: number) => {
    const elements: React.ReactNode[] = []
    let lastIndex = 0

    // Sort tokens by length (longest first) to match longer words first
    const sortedTokens = [...reader.tokens].sort((a, b) => b.word.length - a.word.length)

    // Find all token positions in this text
    const matches: { start: number; end: number; token: ReaderToken }[] = []
    for (const token of sortedTokens) {
      let searchIndex = 0
      while (true) {
        const foundIndex = text.indexOf(token.word, searchIndex)
        if (foundIndex === -1) break
        // Check if this position is already covered by a longer match
        const overlaps = matches.some(
          (m) => foundIndex >= m.start && foundIndex < m.end
        )
        if (!overlaps) {
          matches.push({
            start: foundIndex,
            end: foundIndex + token.word.length,
            token,
          })
        }
        searchIndex = foundIndex + 1
      }
    }

    // Sort matches by start position
    matches.sort((a, b) => a.start - b.start)

    // Build elements
    for (const match of matches) {
      // Add text before this match
      if (match.start > lastIndex) {
        elements.push(
          <span key={`text-${paragraphIndex}-${lastIndex}`}>
            {text.slice(lastIndex, match.start)}
          </span>
        )
      }
      // Add the clickable token
      const isSelected = selectedToken?.word === match.token.word
      const isAdded = addedToSrs.has(match.token.word)
      elements.push(
        <span
          key={`token-${paragraphIndex}-${match.start}`}
          onClick={(e) => handleTokenClick(match.token, e)}
          className={cn(
            "cursor-pointer rounded px-0.5 transition-all",
            isSelected
              ? "bg-cyan-500/30 text-cyan-300"
              : isAdded
                ? "bg-emerald-500/20 text-emerald-300"
                : "hover:bg-cyan-500/20 hover:text-cyan-300"
          )}
        >
          {match.token.word}
        </span>
      )
      lastIndex = match.end
    }

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(
        <span key={`text-${paragraphIndex}-end`}>{text.slice(lastIndex)}</span>
      )
    }

    return elements
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-start gap-4">
          <button
            onClick={() => router.back()}
            className="mt-1 rounded-lg p-2 text-zinc-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-rose-500/20 px-2 py-1 text-xs font-medium text-rose-400">
                {reader.level}
              </span>
              <span className="text-sm text-zinc-500">{reader.wordCount} words</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-white">{reader.title}</h1>
            <p className="mt-1 text-zinc-400">{reader.summary}</p>
          </div>
        </div>
      </div>

      {/* Glass Toolbar */}
      <GlassCard className="mb-6 sticky top-4 z-20">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPinyin(!showPinyin)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                showPinyin
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10"
              )}
            >
              {showPinyin ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Pinyin
            </button>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all",
                showTranslation
                  ? "bg-cyan-500/20 text-cyan-400"
                  : "bg-white/5 text-zinc-400 hover:bg-white/10"
              )}
            >
              {showTranslation ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              Translation
            </button>
            <button
              onClick={cycleFontSize}
              className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-zinc-400 hover:bg-white/10 transition-all"
            >
              <Type className="h-4 w-4" />
              {fontSize.charAt(0).toUpperCase() + fontSize.slice(1)}
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Sparkles className="h-4 w-4 text-cyan-400" />
            <span>Click any word to look up</span>
          </div>
        </div>
      </GlassCard>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Reading Area */}
        <div className="lg:col-span-2">
          <GlassCard glowColor="rose" className="relative">
            <div className="space-y-8">
              {reader.paragraphs.map((paragraph, pIdx) => (
                <div key={pIdx} className="group">
                  {/* Chinese text with clickable tokens */}
                  <p className={cn("text-white", fontSizeClasses[fontSize])}>
                    {renderParagraphWithTokens(paragraph.zh, pIdx)}
                  </p>
                  {/* Pinyin */}
                  {showPinyin && paragraph.pinyin && (
                    <p className="mt-2 text-sm text-cyan-400/80">{paragraph.pinyin}</p>
                  )}
                  {/* Translation */}
                  {showTranslation && paragraph.en && (
                    <p className="mt-2 text-sm text-zinc-500">{paragraph.en}</p>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Related Grammar */}
          <div className="mt-6">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <BookOpen className="h-5 w-5 text-amber-400" />
              Related Grammar
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {mockGrammarPoints.slice(0, 4).map((point) => (
                <GlassCard key={point.id} className="group cursor-pointer hover:border-amber-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white group-hover:text-amber-400 transition-colors">
                        {point.title}
                      </p>
                      <p className="text-sm text-zinc-500">{point.category}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-amber-400" />
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Word Card */}
        <div className="space-y-4">
          <GlassCard className="sticky top-32">
            <h3 className="mb-4 font-semibold text-white">Word Card</h3>
            {selectedToken ? (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-4xl font-bold text-white">{selectedToken.word}</p>
                  <p className="mt-2 text-lg text-cyan-400">{selectedToken.pinyin}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-sm text-zinc-500">Meaning</p>
                  <p className="mt-1 text-white">{selectedToken.meaning}</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-sm text-zinc-500">Key Points</p>
                  <ul className="mt-2 space-y-1 text-sm text-zinc-300">
                    <li>• Common in daily conversation</li>
                    <li>• Can be used as noun or verb</li>
                  </ul>
                </div>
                {!addedToSrs.has(selectedToken.word) ? (
                  <Button
                    onClick={() => handleAddToSrs(selectedToken)}
                    className="w-full bg-cyan-500 hover:bg-cyan-600"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add to SRS
                  </Button>
                ) : (
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 py-3 text-emerald-400">
                    <Check className="h-4 w-4" />
                    Added to SRS
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-500">
                <BookOpen className="mx-auto h-12 w-12 text-zinc-700" />
                <p className="mt-4">Click on a word in the text to see its definition</p>
              </div>
            )}
          </GlassCard>

          {/* Progress Stats */}
          <GlassCard>
            <h3 className="mb-4 font-semibold text-white">Reading Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/5 p-3 text-center">
                <p className="text-2xl font-bold text-white">{addedToSrs.size}</p>
                <p className="text-xs text-zinc-500">Words Saved</p>
              </div>
              <div className="rounded-xl bg-white/5 p-3 text-center">
                <p className="text-2xl font-bold text-white">{reader.tokens.length}</p>
                <p className="text-xs text-zinc-500">Key Terms</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Floating Popover for word lookup */}
      {selectedToken && popoverPosition && (
        <div
          className="fixed z-50 w-72 animate-in fade-in slide-in-from-top-2"
          style={{
            left: Math.min(popoverPosition.x, window.innerWidth - 300),
            top: popoverPosition.y,
          }}
        >
          <GlassCard glowColor="cyan" className="relative">
            <button
              onClick={handleClosePopover}
              className="absolute right-2 top-2 rounded-lg p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="pr-6">
              <p className="text-2xl font-bold text-white">{selectedToken.word}</p>
              <p className="text-cyan-400">{selectedToken.pinyin}</p>
              <p className="mt-2 text-sm text-zinc-300">{selectedToken.meaning}</p>
            </div>
            {!addedToSrs.has(selectedToken.word) && (
              <Button
                size="sm"
                onClick={() => handleAddToSrs(selectedToken)}
                className="mt-3 w-full bg-cyan-500 hover:bg-cyan-600"
              >
                <Plus className="mr-1 h-3 w-3" />
                Add to SRS
              </Button>
            )}
          </GlassCard>
        </div>
      )}

      {/* Click outside to close popover */}
      {selectedToken && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClosePopover}
        />
      )}
    </div>
  )
}
