"use client"

import { useState } from "react"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { AddToSRSButton } from "@/components/srs/AddToSRSButton"
import type { VocabWord } from "@/lib/web-mock"

interface ReaderVocabularyListProps {
  vocabularyList: VocabWord[]
  onAddToSrs?: (wordId: string) => void
  addedWords?: Set<string>
}

export function ReaderVocabularyList({
  vocabularyList,
  onAddToSrs,
  addedWords = new Set()
}: ReaderVocabularyListProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (wordId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(wordId)) {
        newSet.delete(wordId)
      } else {
        newSet.add(wordId)
      }
      return newSet
    })
  }

  if (!vocabularyList || vocabularyList.length === 0) {
    return (
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Vocabulary List</h3>
        <div className="text-center py-8">
          <p className="text-zinc-500">No vocabulary items found for this reading.</p>
        </div>
      </GlassCard>
    )
  }

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        Vocabulary List ({vocabularyList.length} words)
      </h3>
      <div className="space-y-3">
        {vocabularyList.map((vocab, index) => {
          const wordId = vocab.word + index // Simple ID for demo
          const isAdded = addedWords.has(wordId)
          const isExpanded = expandedItems.has(wordId)

          return (
            <div
              key={index}
              className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xl font-bold text-white">{vocab.word}</span>
                    <span className="text-cyan-400 text-sm">{vocab.pinyin}</span>
                  </div>
                  <p className="text-sm text-zinc-300 mb-2">{vocab.meaning}</p>
                  {vocab.geo_snippet && (
                    <p className="text-xs text-zinc-500 mb-2">{vocab.geo_snippet}</p>
                  )}
                  {isExpanded && vocab.key_points && vocab.key_points.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-zinc-400 mb-1">Key Points:</p>
                      <ul className="text-xs text-zinc-500 space-y-1">
                        {vocab.key_points.map((point, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="h-1 w-1 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isExpanded && onAddToSrs && (
                    <AddToSRSButton
                      contentType="vocabulary"
                      content={{
                        front: vocab.word,
                        back: vocab.meaning,
                        pinyin: vocab.pinyin,
                        notes: vocab.geo_snippet,
                      }}
                      sourceType="reading"
                      sourceId={wordId}
                      variant="small"
                      onSuccess={() => onAddToSrs(wordId)}
                    >
                      加入 SRS
                    </AddToSRSButton>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleExpanded(wordId)}
                    className="h-8 px-3 text-xs text-zinc-400 hover:text-white"
                  >
                    {isExpanded ? 'Less' : 'More'}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </GlassCard>
  )
}