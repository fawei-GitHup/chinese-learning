"use client"

import { useState } from "react"
import Link from "next/link"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/web/EmptyState"
import { ErrorDisplay } from "@/components/web/ErrorDisplay"
import { type ScenarioContent } from "@/lib/content"
import { useContentList } from "@/lib/cache/client-hooks"
import { ArrowLeft, MessageSquare, Clock, Users, Stethoscope, BookOpen, RefreshCw } from "lucide-react"

const categories = [
  { id: "all", label: "All Scenarios", color: "text-white" },
  { id: "registration", label: "Registration", icon: MessageSquare, color: "text-blue-400" },
  { id: "triage", label: "Triage", icon: Stethoscope, color: "text-red-400" },
  { id: "consultation", label: "Consultation", icon: Users, color: "text-teal-400" },
  { id: "tests", label: "Tests", icon: Clock, color: "text-purple-400" },
  { id: "pharmacy", label: "Pharmacy", icon: BookOpen, color: "text-green-400" },
]

export function ScenariosPageClient() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  // 使用 SWR 缓存获取数据
  const { data: result, error, isLoading, mutate } = useContentList('scenario', {
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    page: 1,
    limit: 12,
  })

  const filteredScenarios = result?.data || []

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/medical"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Medical Chinese
          </Link>

          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30">
                <MessageSquare className="h-6 w-6 text-teal-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Medical Scenarios</h1>
                <p className="text-zinc-400">Practice real healthcare conversations in Chinese</p>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => mutate()}
              disabled={isLoading}
              className="border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] text-white disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = selectedCategory === category.id

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive
                      ? "bg-teal-600 text-white shadow-lg"
                      : "bg-white/[0.03] border border-white/[0.08] text-zinc-400 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  {category.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-white/[0.02] border border-white/[0.06] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <ErrorDisplay
            error={error}
            onRetry={() => mutate()}
          />
        ) : filteredScenarios.length > 0 ? (
          <>
            {/* Results header */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-zinc-400">
                {selectedCategory === "all"
                  ? `Showing ${filteredScenarios.length} scenarios`
                  : `Showing ${filteredScenarios.length} ${selectedCategory} scenarios`
                }
              </p>
            </div>

            {/* Scenarios Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredScenarios
                .filter((scenario): scenario is ScenarioContent => scenario.type === 'scenario')
                .map((scenario) => (
                  <ScenarioCard key={scenario.id} scenario={scenario} />
                ))}
            </div>
          </>
        ) : (
          <EmptyState
            icon={MessageSquare}
            title={selectedCategory === "all" ? "No scenarios found" : `No ${selectedCategory} scenarios`}
            description={
              selectedCategory === "all"
                ? "Medical scenarios will appear here once published."
                : `No scenarios found for the ${selectedCategory} category.`
            }
            action={
              selectedCategory !== "all"
                ? {
                    label: "View all scenarios",
                    onClick: () => setSelectedCategory("all"),
                  }
                : undefined
            }
          />
        )}
      </div>
    </div>
  )
}

/**
 * 场景卡片组件
 */
function ScenarioCard({ scenario }: { scenario: ScenarioContent }) {
  const categoryData = categories.find(cat => cat.id === scenario.category)
  const Icon = categoryData?.icon || MessageSquare

  return (
    <Link href={`/medical/scenarios/${scenario.slug}`}>
      <GlassCard className="p-6 h-full hover:border-teal-500/30 transition-all group cursor-pointer">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${categoryData ? 'bg-teal-500/20' : 'bg-white/[0.05]'}`}>
                <Icon className={`h-4 w-4 ${categoryData?.color || 'text-zinc-400'}`} />
              </div>
              <Badge variant="outline" className="border-teal-500/30 text-teal-400 text-xs">
                {scenario.level}
              </Badge>
            </div>
          </div>

          {/* Title */}
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors mb-1">
              {scenario.title}
            </h3>
            {scenario.chief_complaint_zh && (
              <p className="text-sm text-zinc-400">
                Chief Complaint: {scenario.chief_complaint_zh}
              </p>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-white/[0.06]">
            <span>{scenario.category}</span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Interactive
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}