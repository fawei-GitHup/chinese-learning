import { Metadata } from "next"
import Link from "next/link"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import {
  medicalScenarios,
  medicalLexicon,
  medicalGrammar,
} from "@/lib/medical-mock"
import {
  Stethoscope,
  ClipboardList,
  MessageSquare,
  TestTube,
  Pill,
  Receipt,
  ChevronRight,
  BookOpen,
  FileText,
  Users,
  Award,
  ArrowRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Medical Chinese | LearnChinese",
  description:
    "Learn Medical Chinese for healthcare communication. Master medical terminology, patient-doctor conversations, and clinical vocabulary.",
  openGraph: {
    title: "Medical Chinese | LearnChinese",
    description: "Master Medical Chinese for healthcare professionals and patients.",
  },
}

const categories = [
  {
    id: "registration",
    label: "Registration",
    labelZh: "挂号",
    icon: ClipboardList,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
    description: "Hospital check-in and appointment booking vocabulary",
  },
  {
    id: "triage",
    label: "Triage",
    labelZh: "分诊",
    icon: Stethoscope,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
    description: "Emergency assessment and priority communication",
  },
  {
    id: "consultation",
    label: "Consultation",
    labelZh: "问诊",
    icon: MessageSquare,
    color: "text-teal-400",
    bgColor: "bg-teal-500/20",
    borderColor: "border-teal-500/30",
    description: "Doctor-patient dialogue and symptom description",
  },
  {
    id: "tests",
    label: "Tests",
    labelZh: "检查",
    icon: TestTube,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/30",
    description: "Lab tests, imaging, and diagnostic procedures",
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    labelZh: "药房",
    icon: Pill,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
    description: "Medication instructions and prescription pickup",
  },
  {
    id: "billing",
    label: "Billing",
    labelZh: "缴费",
    icon: Receipt,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    borderColor: "border-amber-500/30",
    description: "Insurance, payment, and medical expenses",
  },
]

// Get top words and patterns
const topWords = medicalLexicon.slice(0, 12)
const topGrammar = medicalGrammar.slice(0, 8)
const featuredScenarios = medicalScenarios.slice(0, 6)

export default function MedicalHubPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-teal-950/20 via-transparent to-transparent" />
        <div className="pointer-events-none absolute top-1/3 left-1/4 h-[400px] w-[600px] bg-teal-900/20 blur-[120px] rounded-full" />

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm mb-6">
            <Stethoscope className="h-4 w-4" />
            Medical Chinese Program
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 text-balance">
            Master Medical Chinese
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8 text-pretty">
            Essential vocabulary and conversation skills for healthcare communication in Chinese-speaking environments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-500 hover:to-teal-600 shadow-[0_0_30px_rgba(20,184,166,0.3)]"
            >
              <Link href="/login">
                Start Learning
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-lg border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.06]"
            >
              <Link href="#scenarios">View Scenarios</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{medicalScenarios.length}+</p>
            <p className="text-sm text-zinc-500">Medical Scenarios</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{medicalLexicon.length}+</p>
            <p className="text-sm text-zinc-500">Medical Terms</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">{medicalGrammar.length}+</p>
            <p className="text-sm text-zinc-500">Grammar Patterns</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white">6</p>
            <p className="text-sm text-zinc-500">Clinical Categories</p>
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-16 px-6" id="categories">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Clinical Categories</h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              Learn medical Chinese organized by real hospital departments and situations
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const Icon = cat.icon
              const scenarioCount = medicalScenarios.filter((s) => s.category === cat.id).length

              return (
                <Link key={cat.id} href={`/medical/${cat.id}`}>
                  <GlassCard className="p-6 h-full hover:border-teal-500/30 transition-all group cursor-pointer">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${cat.bgColor} ${cat.borderColor} border mb-4`}>
                      <Icon className={`h-6 w-6 ${cat.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-teal-300 transition-colors">
                      {cat.label}
                    </h3>
                    <p className="text-lg text-zinc-500 mb-2">{cat.labelZh}</p>
                    <p className="text-sm text-zinc-400 mb-4">{cat.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                      <span className="text-xs text-zinc-500">{scenarioCount} scenarios</span>
                      <span className="text-xs text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Explore
                        <ChevronRight className="h-3 w-3" />
                      </span>
                    </div>
                  </GlassCard>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Scenarios */}
      <section className="py-16 px-6 bg-white/[0.01]" id="scenarios">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Featured Scenarios</h2>
              <p className="text-zinc-400">Practice real-world medical conversations</p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hidden sm:flex"
            >
              <Link href="/login">
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredScenarios.map((scenario) => {
              const cat = categories.find((c) => c.id === scenario.category)
              const Icon = cat?.icon || MessageSquare

              return (
                <Link key={scenario.id} href="/login">
                  <GlassCard className="p-4 h-full hover:border-teal-500/30 transition-all group cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${cat?.bgColor} ${cat?.borderColor} border`}>
                        <Icon className={`h-4 w-4 ${cat?.color}`} />
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400">
                        {scenario.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-white group-hover:text-teal-300 transition-colors">
                      {scenario.title_zh}
                    </h3>
                    <p className="text-sm text-zinc-400">{scenario.title_en}</p>
                  </GlassCard>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Top Medical Words */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Essential Medical Vocabulary</h2>
              <p className="text-zinc-400">Core words for healthcare communication</p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hidden sm:flex"
            >
              <Link href="/login">
                <BookOpen className="h-4 w-4 mr-2" />
                Full Dictionary
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {topWords.map((word) => (
              <Link key={word.id} href="/login">
                <GlassCard className="p-3 hover:border-teal-500/30 transition-all group cursor-pointer">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors">
                      {word.word}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 border border-teal-500/30">
                      {word.category}
                    </span>
                  </div>
                  <p className="text-sm text-teal-400">{word.pinyin}</p>
                  <p className="text-sm text-zinc-400 line-clamp-1">{word.meanings_en[0]}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Grammar Patterns */}
      <section className="py-16 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Key Grammar Patterns</h2>
              <p className="text-zinc-400">Essential structures for medical communication</p>
            </div>
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hidden sm:flex"
            >
              <Link href="/login">
                <FileText className="h-4 w-4 mr-2" />
                All Patterns
              </Link>
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {topGrammar.map((pattern) => (
              <Link key={pattern.id} href="/login">
                <GlassCard className="p-4 hover:border-teal-500/30 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors">
                      {pattern.pattern}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400">
                      {pattern.level}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2">{pattern.explanation_en}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard glowColor="seal" className="p-12 text-center">
            <Award className="h-12 w-12 text-teal-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to master Medical Chinese?
            </h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Join healthcare professionals and students learning Medical Chinese with our comprehensive program.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-500 hover:to-teal-600 shadow-[0_0_25px_rgba(20,184,166,0.3)]"
            >
              <Link href="/login">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </GlassCard>
        </div>
      </section>
    </div>
  )
}
