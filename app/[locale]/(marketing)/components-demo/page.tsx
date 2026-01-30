"use client"

import { useState } from "react"
import { GlassCard } from "@/components/web/GlassCard"
import { KpiCard } from "@/components/web/KpiCard"
import { ProgressRing } from "@/components/web/ProgressRing"
import { FeatureCard } from "@/components/web/FeatureCard"
import { DataTableLite } from "@/components/web/DataTableLite"
import { TabsBar } from "@/components/web/TabsBar"
import { FilterBarLite } from "@/components/web/FilterBarLite"
import { ModalSheet } from "@/components/web/ModalSheet"
import { ConfirmDialog } from "@/components/web/ConfirmDialog"
import { EmptyState } from "@/components/web/EmptyState"
import { Button } from "@/components/ui/button"
import {
  mockFeaturedLessons,
  mockDictionaryEntries,
} from "@/lib/web-mock"
import {
  Clock,
  BookOpen,
  Brain,
  Sparkles,
  Search,
  Inbox,
} from "lucide-react"

export default function ComponentsDemoPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchValue, setSearchValue] = useState("")
  const [selectValue, setSelectValue] = useState("")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="min-h-screen py-24">
      <div className="mx-auto max-w-6xl px-6 space-y-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Component Library
          </h1>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            A showcase of all reusable components built for the LearnChinese web app.
          </p>
        </div>

        {/* Glass Card Variants */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">GlassCard</h2>
          <div className="grid gap-4 md:grid-cols-4">
            <GlassCard>
              <p className="text-white">Default (no glow)</p>
            </GlassCard>
            <GlassCard glowColor="seal">
              <p className="text-white">Seal Red Glow</p>
            </GlassCard>
            <GlassCard glowColor="gold">
              <p className="text-white">Gold Glow</p>
            </GlassCard>
            <GlassCard glowColor="jade">
              <p className="text-white">Jade Glow</p>
            </GlassCard>
          </div>
        </section>

        {/* KPI Cards */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">KpiCard</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Study Time"
              value="45 min"
              subtitle="+15% from yesterday"
              icon={Clock}
              trend="up"
              glowColor="seal"
            />
            <KpiCard
              title="Words Learned"
              value={128}
              subtitle="This week"
              icon={BookOpen}
              trend="up"
              glowColor="jade"
            />
            <KpiCard
              title="Review Due"
              value={24}
              subtitle="Ready now"
              icon={Brain}
              trend="neutral"
              glowColor="gold"
            />
            <KpiCard
              title="Accuracy"
              value="89%"
              subtitle="-2% from average"
              icon={Sparkles}
              trend="down"
              glowColor="ink"
            />
          </div>
        </section>

        {/* Progress Ring */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">ProgressRing</h2>
          <GlassCard>
            <div className="flex items-center gap-8 flex-wrap">
              <div className="flex items-center gap-4">
                <ProgressRing value={25} max={100} color="seal" />
                <span className="text-zinc-400 text-sm">25%</span>
              </div>
              <div className="flex items-center gap-4">
                <ProgressRing value={50} max={100} color="jade" />
                <span className="text-zinc-400 text-sm">50%</span>
              </div>
              <div className="flex items-center gap-4">
                <ProgressRing value={75} max={100} color="gold" />
                <span className="text-zinc-400 text-sm">75%</span>
              </div>
              <div className="flex items-center gap-4">
                <ProgressRing value={100} max={100} color="ink" size={64} strokeWidth={6} />
                <span className="text-zinc-400 text-sm">100% (larger)</span>
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Feature Card */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">FeatureCard</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              title="Smart Lessons"
              description="AI-powered lessons that adapt to your learning pace and style."
              icon={Sparkles}
              glowColor="seal"
            />
            <FeatureCard
              title="Spaced Repetition"
              description="Never forget what you learn with our intelligent review system."
              icon={Brain}
              glowColor="jade"
            />
            <FeatureCard
              title="Reading Practice"
              description="Immersive reading with instant definitions and audio support."
              icon={BookOpen}
              glowColor="gold"
            />
          </div>
        </section>

        {/* Tabs Bar */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">TabsBar</h2>
          <GlassCard>
            <TabsBar
              tabs={[
                { id: "all", label: "All" },
                { id: "lessons", label: "Lessons" },
                { id: "readers", label: "Readers" },
                { id: "srs", label: "SRS" },
              ]}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
            <p className="mt-4 text-zinc-400 text-sm">
              Active tab: <span className="text-white">{activeTab}</span>
            </p>
          </GlassCard>
        </section>

        {/* Filter Bar */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">FilterBarLite</h2>
          <GlassCard>
            <FilterBarLite
              searchPlaceholder="Search lessons..."
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              selectOptions={[
                { value: "hsk1", label: "HSK1" },
                { value: "hsk2", label: "HSK2" },
                { value: "hsk3", label: "HSK3" },
              ]}
              selectValue={selectValue}
              onSelectChange={setSelectValue}
              selectPlaceholder="All Levels"
            />
            <p className="mt-4 text-zinc-400 text-sm">
              Search: &quot;{searchValue}&quot; | Filter: &quot;{selectValue || "none"}&quot;
            </p>
          </GlassCard>
        </section>

        {/* Data Table */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">DataTableLite</h2>
          <DataTableLite
            data={mockFeaturedLessons.slice(0, 5)}
            columns={[
              { key: "title", header: "Title" },
              { key: "level", header: "Level" },
              { key: "durationMin", header: "Duration", render: (item) => `${item.durationMin} min` },
              {
                key: "tags",
                header: "Tags",
                render: (item) => (
                  <div className="flex gap-1 flex-wrap">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-zinc-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                ),
              },
            ]}
            onRowClick={(item) => alert(`Clicked: ${item.title}`)}
          />
        </section>

        {/* Dictionary Table */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">DataTableLite (Dictionary)</h2>
          <DataTableLite
            data={mockDictionaryEntries.map((e, i) => ({ ...e, id: `d${i}` }))}
            columns={[
              { key: "hanzi", header: "Hanzi", className: "text-xl" },
              { key: "pinyin", header: "Pinyin" },
              { key: "meaning", header: "Meaning" },
              {
                key: "level",
                header: "Level",
                render: (item) => (
                  <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                    {item.level}
                  </span>
                ),
              },
            ]}
          />
        </section>

        {/* Modal Sheet & Confirm Dialog */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">ModalSheet & ConfirmDialog</h2>
          <GlassCard>
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={() => setIsSheetOpen(true)}
                className="rounded-lg bg-gradient-to-r from-red-700 to-red-800 text-white hover:from-red-600 hover:to-red-700 shadow-[0_0_20px_rgba(197,48,48,0.25)]"
              >
                Open Sheet
              </Button>
              <Button
                onClick={() => setIsDialogOpen(true)}
                variant="outline"
                className="rounded-lg border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]"
              >
                Open Confirm Dialog
              </Button>
            </div>
          </GlassCard>

          <ModalSheet
            open={isSheetOpen}
            onClose={() => setIsSheetOpen(false)}
            title="Lesson Details"
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Shopping Vocabulary</h3>
              <p className="text-zinc-400">
                Learn essential vocabulary for shopping in China. This lesson covers
                common phrases, numbers, and bargaining techniques.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-zinc-500">Duration</p>
                  <p className="text-lg font-semibold text-white">25 min</p>
                </div>
                <div className="rounded-xl bg-white/5 p-4">
                  <p className="text-xs text-zinc-500">Level</p>
                  <p className="text-lg font-semibold text-white">HSK2</p>
                </div>
              </div>
              <Button className="w-full rounded-lg bg-gradient-to-r from-red-700 to-red-800 text-white hover:from-red-600 hover:to-red-700">
                Start Lesson
              </Button>
            </div>
          </ModalSheet>

          <ConfirmDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onConfirm={() => console.log("Confirmed!")}
            title="Reset Progress?"
            description="This will reset all your progress for this lesson. This action cannot be undone."
            confirmText="Reset"
            cancelText="Cancel"
            variant="destructive"
          />
        </section>

        {/* Empty State */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">EmptyState</h2>
          <GlassCard>
            <EmptyState
              icon={Inbox}
              title="No reviews due"
              description="Great job! You've completed all your reviews for today. Check back later for more."
              action={{
                label: "Browse Lessons",
                onClick: () => console.log("Browse clicked"),
              }}
            />
          </GlassCard>
          <GlassCard className="mt-4">
            <EmptyState
              icon={Search}
              title="No results found"
              description="Try adjusting your search or filter criteria."
            />
          </GlassCard>
        </section>
      </div>
    </div>
  )
}
