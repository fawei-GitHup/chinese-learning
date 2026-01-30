/**
 * 搜索结果卡片组件
 * 工单 W3-01: 全站搜索
 * 
 * 根据内容类型渲染不同样式的结果卡片
 */

import Link from 'next/link'
import { GlassCard } from '@/components/web/GlassCard'
import { Badge } from '@/components/ui/badge'
import { highlightText, type SearchResult } from '@/lib/search/unified-search'
import type { AnyContent } from '@/lib/content'
import { BookOpen, FileText, MessageSquare, Stethoscope, Languages } from 'lucide-react'

interface SearchResultCardProps {
  searchResult: SearchResult
  searchQuery: string
}

export function SearchResultCard({ searchResult, searchQuery }: SearchResultCardProps) {
  const { item, matchedFields } = searchResult

  // 根据内容类型渲染不同的卡片
  switch (item.type) {
    case 'medical_term':
      return <MedicalTermCard item={item} searchQuery={searchQuery} matchedFields={matchedFields} />
    case 'lesson':
      return <LessonCard item={item} searchQuery={searchQuery} matchedFields={matchedFields} />
    case 'reading':
      return <ReadingCard item={item} searchQuery={searchQuery} matchedFields={matchedFields} />
    case 'grammar':
      return <GrammarCard item={item} searchQuery={searchQuery} matchedFields={matchedFields} />
    case 'scenario':
      return <ScenarioCard item={item} searchQuery={searchQuery} matchedFields={matchedFields} />
    default:
      return null
  }
}

// ============================================================================
// 医疗词汇卡片
// ============================================================================

function MedicalTermCard({ item, searchQuery, matchedFields }: {
  item: AnyContent
  searchQuery: string
  matchedFields: string[]
}) {
  const term = item as any
  const href = `/medical/dictionary/${item.slug}`

  return (
    <Link href={href}>
      <GlassCard className="p-4 hover:border-blue-500/30 transition-all group cursor-pointer h-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30 flex-shrink-0">
            <Stethoscope className="h-5 w-5 text-blue-400" />
          </div>

          <div className="flex-1 min-w-0">
            {/* 词汇 */}
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors mb-1">
              <HighlightedText text={term.word || item.title} query={searchQuery} />
            </h3>

            {/* 拼音 */}
            {term.pinyin && (
              <p className="text-sm text-blue-400 font-mono mb-2">
                <HighlightedText text={term.pinyin} query={searchQuery} />
              </p>
            )}

            {/* 释义 */}
            {term.meanings && term.meanings.length > 0 && (
              <p className="text-sm text-zinc-300 mb-3 line-clamp-2">
                <HighlightedText 
                  text={term.meanings.join(', ')} 
                  query={searchQuery} 
                />
              </p>
            )}

            {/* 分类标签 */}
            <div className="flex items-center gap-2">
              {term.category && (
                <Badge variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-400">
                  {term.category}
                </Badge>
              )}
              {matchedFields.length > 0 && (
                <span className="text-xs text-zinc-500">
                  匹配: {matchedFields.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}

// ============================================================================
// 课程卡片
// ============================================================================

function LessonCard({ item, searchQuery, matchedFields }: {
  item: AnyContent
  searchQuery: string
  matchedFields: string[]
}) {
  const lesson = item as any
  const href = `/lesson/${item.slug}`

  return (
    <Link href={href}>
      <GlassCard className="p-4 hover:border-green-500/30 transition-all group cursor-pointer h-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20 border border-green-500/30 flex-shrink-0">
            <BookOpen className="h-5 w-5 text-green-400" />
          </div>

          <div className="flex-1 min-w-0">
            {/* 标题 */}
            <h3 className="text-lg font-semibold text-white group-hover:text-green-300 transition-colors mb-1">
              <HighlightedText text={item.title} query={searchQuery} />
            </h3>

            {/* 描述 */}
            {item.description && (
              <p className="text-sm text-zinc-300 mb-3 line-clamp-2">
                <HighlightedText text={item.description} query={searchQuery} />
              </p>
            )}

            {/* 元信息 */}
            <div className="flex items-center gap-2 flex-wrap">
              {lesson.level && (
                <Badge variant="outline" className="text-xs bg-green-500/10 border-green-500/30 text-green-400">
                  {lesson.level}
                </Badge>
              )}
              {lesson.durationMin && (
                <span className="text-xs text-zinc-500">
                  {lesson.durationMin} 分钟
                </span>
              )}
              {lesson.tags && lesson.tags.length > 0 && (
                <span className="text-xs text-zinc-500">
                  {lesson.tags.slice(0, 2).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}

// ============================================================================
// 阅读卡片
// ============================================================================

function ReadingCard({ item, searchQuery, matchedFields }: {
  item: AnyContent
  searchQuery: string
  matchedFields: string[]
}) {
  const reading = item as any
  const href = `/reader/${item.slug}`

  return (
    <Link href={href}>
      <GlassCard className="p-4 hover:border-purple-500/30 transition-all group cursor-pointer h-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 border border-purple-500/30 flex-shrink-0">
            <FileText className="h-5 w-5 text-purple-400" />
          </div>

          <div className="flex-1 min-w-0">
            {/* 标题 */}
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors mb-1">
              <HighlightedText text={item.title} query={searchQuery} />
            </h3>

            {/* 描述 */}
            {item.description && (
              <p className="text-sm text-zinc-300 mb-3 line-clamp-2">
                <HighlightedText text={item.description} query={searchQuery} />
              </p>
            )}

            {/* 元信息 */}
            <div className="flex items-center gap-2 flex-wrap">
              {reading.level && (
                <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-400">
                  {reading.level}
                </Badge>
              )}
              {reading.wordCount && (
                <span className="text-xs text-zinc-500">
                  {reading.wordCount} 字
                </span>
              )}
              {reading.tags && reading.tags.length > 0 && (
                <span className="text-xs text-zinc-500">
                  {reading.tags.slice(0, 2).join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}

// ============================================================================
// 语法卡片
// ============================================================================

function GrammarCard({ item, searchQuery, matchedFields }: {
  item: AnyContent
  searchQuery: string
  matchedFields: string[]
}) {
  const grammar = item as any
  const href = `/grammar/${item.slug}`

  return (
    <Link href={href}>
      <GlassCard className="p-4 hover:border-orange-500/30 transition-all group cursor-pointer h-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20 border border-orange-500/30 flex-shrink-0">
            <Languages className="h-5 w-5 text-orange-400" />
          </div>

          <div className="flex-1 min-w-0">
            {/* 语法模式 */}
            <h3 className="text-lg font-semibold text-white group-hover:text-orange-300 transition-colors mb-1 font-mono">
              <HighlightedText text={grammar.pattern || item.title} query={searchQuery} />
            </h3>

            {/* 说明 */}
            {(grammar.explanation || item.description) && (
              <p className="text-sm text-zinc-300 mb-3 line-clamp-2">
                <HighlightedText 
                  text={grammar.explanation || item.description} 
                  query={searchQuery} 
                />
              </p>
            )}

            {/* 元信息 */}
            <div className="flex items-center gap-2 flex-wrap">
              {grammar.level && (
                <Badge variant="outline" className="text-xs bg-orange-500/10 border-orange-500/30 text-orange-400">
                  {grammar.level}
                </Badge>
              )}
              {matchedFields.length > 0 && (
                <span className="text-xs text-zinc-500">
                  匹配: {matchedFields.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}

// ============================================================================
// 场景卡片
// ============================================================================

function ScenarioCard({ item, searchQuery, matchedFields }: {
  item: AnyContent
  searchQuery: string
  matchedFields: string[]
}) {
  const scenario = item as any
  const href = `/medical/scenarios/${item.slug}`

  return (
    <Link href={href}>
      <GlassCard className="p-4 hover:border-cyan-500/30 transition-all group cursor-pointer h-full">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex-shrink-0">
            <MessageSquare className="h-5 w-5 text-cyan-400" />
          </div>

          <div className="flex-1 min-w-0">
            {/* 标题 */}
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors mb-1">
              <HighlightedText text={item.title} query={searchQuery} />
            </h3>

            {/* 主诉 */}
            {scenario.chief_complaint_zh && (
              <p className="text-sm text-zinc-300 mb-1">
                <HighlightedText text={scenario.chief_complaint_zh} query={searchQuery} />
              </p>
            )}

            {/* 描述 */}
            {item.description && (
              <p className="text-sm text-zinc-400 mb-3 line-clamp-1">
                <HighlightedText text={item.description} query={searchQuery} />
              </p>
            )}

            {/* 元信息 */}
            <div className="flex items-center gap-2 flex-wrap">
              {scenario.category && (
                <Badge variant="outline" className="text-xs bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
                  {scenario.category}
                </Badge>
              )}
              {scenario.level && (
                <Badge variant="outline" className="text-xs bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
                  {scenario.level}
                </Badge>
              )}
              {matchedFields.length > 0 && (
                <span className="text-xs text-zinc-500">
                  匹配: {matchedFields.join(', ')}
                </span>
              )}
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}

// ============================================================================
// 高亮文本组件
// ============================================================================

function HighlightedText({ text, query }: { text: string; query: string }) {
  const parts = highlightText(text, query)

  return (
    <>
      {parts.map((part, index) => (
        part.isHighlight ? (
          <mark 
            key={index} 
            className="bg-yellow-500/30 text-yellow-200 rounded px-0.5"
          >
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        )
      ))}
    </>
  )
}
