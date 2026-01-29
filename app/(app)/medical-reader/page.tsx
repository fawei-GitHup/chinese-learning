"use client"

import { useState } from "react"
import Link from "next/link"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { medicalScenarios } from "@/lib/medical-mock"
import {
  Stethoscope,
  ClipboardList,
  MessageSquare,
  TestTube,
  Pill,
  Receipt,
  Search,
  ChevronRight,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const categories = [
  { id: "registration", label: "Registration", icon: ClipboardList, color: "text-blue-400" },
  { id: "triage", label: "Triage", icon: Stethoscope, color: "text-red-400" },
  { id: "consultation", label: "Consultation", icon: MessageSquare, color: "text-teal-400" },
  { id: "tests", label: "Tests", icon: TestTube, color: "text-purple-400" },
  { id: "pharmacy", label: "Pharmacy", icon: Pill, color: "text-green-400" },
  { id: "billing", label: "Billing", icon: Receipt, color: "text-amber-400" },
]

const categoryColors: Record<string, string> = {
  registration: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  triage: "bg-red-500/20 text-red-400 border-red-500/30",
  consultation: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  tests: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  pharmacy: "bg-green-500/20 text-green-400 border-green-500/30",
  billing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
}

const Loading = () => null;

export default function MedicalReaderIndexPage() {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredScenarios = medicalScenarios.filter((scenario) => {
    const matchesCategory = !activeCategory || scenario.category === activeCategory
    const matchesSearch =
      !searchQuery ||
      scenario.title_zh.includes(searchQuery) ||
      scenario.title_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.chief_complaint_zh.includes(searchQuery) ||
      scenario.chief_complaint_en.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Medical Chinese Scenarios</h1>
          <p className="text-zinc-400">
            Practice real-world medical conversations with interactive scenarios
          </p>
        </div>

        {/* Search and Filters */}
        <GlassCard className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-white placeholder:text-zinc-600 focus:border-teal-500/50 focus:outline-none"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveCategory(null)}
                className={`rounded-lg ${
                  !activeCategory
                    ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All
              </Button>
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <Button
                    key={cat.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                    className={`rounded-lg ${
                      activeCategory === cat.id
                        ? categoryColors[cat.id]
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-1.5" />
                    {cat.label}
                  </Button>
                )
              })}
            </div>
          </div>
        </GlassCard>

        {/* Scenarios Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredScenarios.map((scenario) => {
            const categoryStyle = categoryColors[scenario.category] || "bg-zinc-500/20 text-zinc-400"
            const CategoryIcon =
              categories.find((c) => c.id === scenario.category)?.icon || MessageSquare

            return (
              <Link key={scenario.id} href={`/medical-reader/${scenario.id}`}>
                <GlassCard className="p-4 h-full hover:border-teal-500/30 transition-all group cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${categoryStyle}`}>
                      <CategoryIcon className="h-5 w-5" />
                    </div>
                    <div className="flex gap-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${categoryStyle}`}>
                        {scenario.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400 border border-white/[0.08]">
                        {scenario.level}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-teal-300 transition-colors">
                    {scenario.title_zh}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-3">{scenario.title_en}</p>

                  <div className="pt-3 border-t border-white/[0.06]">
                    <p className="text-xs text-zinc-500 mb-1">Chief Complaint</p>
                    <p className="text-sm text-zinc-300">{scenario.chief_complaint_zh}</p>
                    <p className="text-xs text-zinc-500">{scenario.chief_complaint_en}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.06]">
                    <span className="text-xs text-zinc-500">
                      {scenario.conversation.length} exchanges
                    </span>
                    <span className="text-xs text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Start scenario
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </GlassCard>
              </Link>
            )
          })}
        </div>

        {filteredScenarios.length === 0 && (
          <GlassCard className="p-12 text-center">
            <Stethoscope className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No scenarios found</h3>
            <p className="text-sm text-zinc-500">Try adjusting your search or filters</p>
          </GlassCard>
        )}
      </div>
    </Suspense>
  )
}
