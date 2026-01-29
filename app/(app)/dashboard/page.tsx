"use client"

import { useState } from "react"
import { KpiCard } from "@/components/web/KpiCard"
import { GlassCard } from "@/components/web/GlassCard"
import { ProgressRing } from "@/components/web/ProgressRing"
import { Button } from "@/components/ui/button"
import {
  mockUser,
  mockKpis,
  mockDailyPlan,
  mockRecentActivity,
  type DailyTask,
} from "@/lib/web-mock"
import {
  Clock,
  BookOpen,
  Brain,
  TrendingUp,
  CheckCircle2,
  Circle,
  BookText,
  ArrowRight,
  Zap,
} from "lucide-react"

const taskTypeIcons = {
  lesson: BookOpen,
  reader: BookText,
  srs: Brain,
}

const taskTypeColors = {
  lesson: "text-red-400",
  reader: "text-emerald-400",
  srs: "text-amber-400",
}

const activityTypeIcons = {
  lesson: BookOpen,
  reader: BookText,
  srs: Brain,
  test: TrendingUp,
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<DailyTask[]>(mockDailyPlan.tasks)

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "done" ? "todo" : "done" }
          : task
      )
    )
  }

  const completedTasks = tasks.filter((t) => t.status === "done").length
  const totalTasks = tasks.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Welcome back, {mockUser.name.split(" ")[0]}!
          </h1>
          <p className="text-zinc-400 mt-1">
            You&apos;re on a {mockUser.streakDays}-day streak. Keep it up!
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400">Daily Goal:</span>
          <ProgressRing
            value={mockKpis.todayMinutes}
            max={mockUser.goalMinutesPerDay}
            size={48}
            color="seal"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Today's Study Time"
          value={`${mockKpis.todayMinutes} min`}
          subtitle={`Goal: ${mockUser.goalMinutesPerDay} min`}
          icon={Clock}
          trend="up"
          glowColor="seal"
        />
        <KpiCard
          title="Words Due"
          value={mockKpis.wordsDue}
          subtitle="Ready for review"
          icon={Brain}
          trend="neutral"
          glowColor="gold"
        />
        <KpiCard
          title="Lessons This Week"
          value={mockKpis.lessonsDoneThisWeek}
          subtitle="+2 from last week"
          icon={BookOpen}
          trend="up"
          glowColor="jade"
        />
        <KpiCard
          title="Reading This Week"
          value={mockKpis.readingDoneThisWeek}
          subtitle="Articles completed"
          icon={BookText}
          trend="up"
          glowColor="ink"
        />
      </section>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard glowColor="seal">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Today&apos;s Tasks</h2>
                <p className="text-sm text-zinc-400">
                  {completedTasks}/{totalTasks} completed
                </p>
              </div>
              <div className="h-2 w-32 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-700 to-red-500 transition-all duration-500"
                  style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-3">
              {tasks.map((task) => {
                const Icon = taskTypeIcons[task.type]
                const isDone = task.status === "done"
                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-4 rounded-xl p-4 transition-all ${
                      isDone
                        ? "bg-white/5 opacity-60"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <button
                      onClick={() => toggleTaskStatus(task.id)}
                      className="shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                      ) : (
                        <Circle className="h-6 w-6 text-zinc-600 hover:text-zinc-400" />
                      )}
                    </button>
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 ${taskTypeColors[task.type]}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium ${
                          isDone ? "text-zinc-500 line-through" : "text-white"
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-zinc-500 capitalize">{task.type}</p>
                    </div>
                    <span className="text-sm text-zinc-500">{task.etaMin} min</span>
                  </div>
                )
              })}
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-6">Recent Activity</h2>
            <div className="space-y-4">
              {mockRecentActivity.slice(0, 8).map((activity) => {
                const Icon = activityTypeIcons[activity.type]
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 text-sm"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5">
                      <Icon className="h-4 w-4 text-zinc-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white truncate">{activity.title}</p>
                      <p className="text-xs text-zinc-500">{activity.time}</p>
                    </div>
                    <span className="text-zinc-400 text-xs whitespace-nowrap">
                      {activity.result}
                    </span>
                  </div>
                )
              })}
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Quick Actions */}
        <div className="space-y-6">
          <GlassCard glowColor="jade">
            <h2 className="text-lg font-semibold text-white mb-6">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                className="w-full justify-between rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 h-12 border border-red-900/20"
                variant="ghost"
              >
                <span className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5" />
                  Start Next Lesson
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                className="w-full justify-between rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 h-12 border border-emerald-900/20"
                variant="ghost"
              >
                <span className="flex items-center gap-3">
                  <BookText className="h-5 w-5" />
                  Open Reader
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                className="w-full justify-between rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 h-12 border border-amber-900/20"
                variant="ghost"
              >
                <span className="flex items-center gap-3">
                  <Brain className="h-5 w-5" />
                  Review {mockKpis.wordsDue} Words
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </GlassCard>

          {/* Level Progress */}
          <GlassCard>
            <h2 className="text-lg font-semibold text-white mb-4">Level Progress</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-red-900 text-xl font-bold text-red-100 shadow-[0_0_20px_rgba(197,48,48,0.3)]">
                {mockUser.level}
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Level 3</p>
                <p className="text-sm text-zinc-400">Intermediate</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Progress to HSK4</span>
                <span className="text-white">62%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div className="h-full w-[62%] bg-gradient-to-r from-red-700 to-red-500" />
              </div>
              <p className="text-xs text-zinc-500">~45 lessons remaining</p>
            </div>
          </GlassCard>

          {/* Streak Card */}
          <GlassCard glowColor="gold">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20">
                <Zap className="h-7 w-7 text-amber-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{mockUser.streakDays}</p>
                <p className="text-sm text-zinc-400">Day Streak</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-400">
              You&apos;re in the top 5% of learners! Keep up the amazing work.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
