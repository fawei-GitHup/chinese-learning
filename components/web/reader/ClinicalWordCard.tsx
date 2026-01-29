"use client"

import { useState } from "react"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { Plus, Copy, Check, AlertTriangle, XCircle, Sparkles } from "lucide-react"
import type { MedicalLexiconEntry } from "@/lib/medical-mock"

interface ClinicalWordCardProps {
  word: MedicalLexiconEntry | null
  onAddToSrs?: (wordId: string) => void
  addedWords?: Set<string>
}

const categoryColors: Record<string, string> = {
  symptom: "bg-red-500/20 text-red-400 border-red-500/30",
  body: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  department: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  test: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  medicine: "bg-green-500/20 text-green-400 border-green-500/30",
  time: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  insurance: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  history: "bg-orange-500/20 text-orange-400 border-orange-500/30",
}

export function ClinicalWordCard({ word, onAddToSrs, addedWords = new Set() }: ClinicalWordCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (word) {
      navigator.clipboard.writeText(word.word)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!word) {
    return (
      <GlassCard className="p-4">
        <h3 className="text-sm font-medium text-zinc-400 mb-3">Clinical Word Card</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="h-12 w-12 rounded-full bg-white/[0.03] flex items-center justify-center mb-3">
            <Sparkles className="h-6 w-6 text-zinc-600" />
          </div>
          <p className="text-sm text-zinc-500">Select a word from the conversation</p>
          <p className="text-xs text-zinc-600 mt-1">Click any word to see details</p>
        </div>
      </GlassCard>
    )
  }

  const isAdded = addedWords.has(word.id)
  const categoryStyle = categoryColors[word.category] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"

  return (
    <GlassCard className="p-4 overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-zinc-400">Clinical Word Card</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryStyle}`}>
          {word.category}
        </span>
      </div>

      {/* Word Header */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white">{word.word}</span>
          <span className="text-teal-400">{word.pinyin}</span>
        </div>
        <p className="text-sm text-zinc-300 mt-1">{word.meanings_en.join("; ")}</p>
      </div>

      {/* GEO Snippet */}
      <div className="mb-4 p-3 rounded-lg bg-teal-500/10 border border-teal-500/20">
        <p className="text-sm text-zinc-300 leading-relaxed">{word.geo_snippet}</p>
      </div>

      {/* Key Points */}
      <div className="mb-4">
        <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Key Points</h4>
        <ul className="space-y-1.5">
          {word.key_points.slice(0, 4).map((point, i) => (
            <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-500 mt-1.5 shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Collocations */}
      {word.collocations && word.collocations.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Collocations</h4>
          <div className="flex flex-wrap gap-1.5">
            {word.collocations.slice(0, 4).map((col, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded bg-white/[0.05] text-zinc-300 border border-white/[0.08]">
                {col.zh}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Say It Like */}
      {word.say_it_like && word.say_it_like.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-teal-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Check className="h-3 w-3" />
            Say it like this
          </h4>
          <div className="space-y-1.5">
            {word.say_it_like.slice(0, 2).map((item, i) => (
              <div key={i} className="text-xs p-2 rounded bg-teal-500/10 border border-teal-500/20">
                <span className="text-teal-300">{item.zh}</span>
                <span className="text-zinc-500 ml-2">{item.en}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Don't Say */}
      {word.dont_say && word.dont_say.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Avoid saying
          </h4>
          <div className="space-y-1.5">
            {word.dont_say.slice(0, 2).map((item, i) => (
              <div key={i} className="text-xs p-2 rounded bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <XCircle className="h-3 w-3 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-amber-300 line-through">{item.zh}</span>
                    <p className="text-zinc-500 mt-0.5">{item.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-white/[0.06]">
        <Button
          size="sm"
          onClick={() => onAddToSrs?.(word.id)}
          disabled={isAdded}
          className={`flex-1 rounded-lg h-8 text-xs ${
            isAdded
              ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
              : "bg-teal-600 text-white hover:bg-teal-500"
          }`}
        >
          {isAdded ? (
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
          onClick={handleCopy}
          className="rounded-lg h-8 text-xs border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
    </GlassCard>
  )
}
