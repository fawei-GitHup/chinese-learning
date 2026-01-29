"use client"

import { useState } from "react"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { Copy, Check, BookmarkPlus, MessageSquare } from "lucide-react"
import { medicalPhraseTemplates } from "@/lib/medical-mock"

interface IntentTemplatesPanelProps {
  scenarioCategory?: string
}

export function IntentTemplatesPanel({ scenarioCategory }: IntentTemplatesPanelProps) {
  const [activeIntent, setActiveIntent] = useState(medicalPhraseTemplates.intents[0]?.intent || "")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [savedIndex, setSavedIndex] = useState<Set<number>>(new Set())

  const activeIntentData = medicalPhraseTemplates.intents.find((i) => i.intent === activeIntent)

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleSave = (index: number) => {
    setSavedIndex((prev) => new Set(prev).add(index))
  }

  // Highlight slots in template
  const renderTemplate = (zh: string) => {
    return zh.split(/(\[[^\]]+\])/).map((part, i) => {
      if (part.startsWith("[") && part.endsWith("]")) {
        return (
          <span key={i} className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 text-xs mx-0.5">
            {part}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="h-4 w-4 text-teal-400" />
        <h3 className="text-sm font-medium text-zinc-400">Intent Templates</h3>
      </div>

      {/* Intent Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4 pb-3 border-b border-white/[0.06]">
        {medicalPhraseTemplates.intents.slice(0, 6).map((intent) => (
          <button
            key={intent.intent}
            onClick={() => setActiveIntent(intent.intent)}
            className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
              activeIntent === intent.intent
                ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                : "bg-white/[0.03] text-zinc-500 border border-white/[0.06] hover:bg-white/[0.06] hover:text-zinc-300"
            }`}
          >
            {intent.title}
          </button>
        ))}
      </div>

      {/* Templates List */}
      {activeIntentData && (
        <div className="space-y-3">
          {activeIntentData.templates.slice(0, 4).map((template, i) => (
            <div
              key={i}
              className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.1] transition-colors"
            >
              <div className="text-sm text-white mb-1">{renderTemplate(template.zh)}</div>
              <div className="text-xs text-teal-400 mb-1">{template.pinyin}</div>
              <div className="text-xs text-zinc-500 mb-2">{template.en}</div>
              <div className="flex gap-1.5">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(template.zh, i)}
                  className="h-6 px-2 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                >
                  {copiedIndex === i ? (
                    <Check className="h-3 w-3 mr-1 text-teal-400" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  {copiedIndex === i ? "Copied" : "Copy"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleSave(i)}
                  disabled={savedIndex.has(i)}
                  className="h-6 px-2 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                >
                  {savedIndex.has(i) ? (
                    <Check className="h-3 w-3 mr-1 text-teal-400" />
                  ) : (
                    <BookmarkPlus className="h-3 w-3 mr-1" />
                  )}
                  {savedIndex.has(i) ? "Saved" : "Save as drill"}
                </Button>
              </div>
            </div>
          ))}

          {/* Tips */}
          {activeIntentData.tips && activeIntentData.tips.length > 0 && (
            <div className="mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-xs font-medium text-amber-400 mb-1">Tips</p>
              {activeIntentData.tips.slice(0, 2).map((tip, i) => (
                <p key={i} className="text-xs text-zinc-400">
                  {tip.en}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </GlassCard>
  )
}
