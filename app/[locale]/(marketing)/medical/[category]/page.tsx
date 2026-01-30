import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
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
  ArrowLeft,
  BookOpen,
  FileText,
  ArrowRight,
} from "lucide-react"

const categories: Record<
  string,
  {
    label: string
    labelZh: string
    icon: typeof Stethoscope
    color: string
    bgColor: string
    borderColor: string
    description: string
    longDescription: string
  }
> = {
  registration: {
    label: "Registration",
    labelZh: "挂号",
    icon: ClipboardList,
    color: "text-blue-400",
    bgColor: "bg-blue-500/20",
    borderColor: "border-blue-500/30",
    description: "Hospital check-in and appointment booking vocabulary",
    longDescription:
      "Master the essential vocabulary and phrases for hospital registration, appointment booking, and initial patient intake. Learn how to navigate the Chinese healthcare system from the moment you arrive.",
  },
  triage: {
    label: "Triage",
    labelZh: "分诊",
    icon: Stethoscope,
    color: "text-red-400",
    bgColor: "bg-red-500/20",
    borderColor: "border-red-500/30",
    description: "Emergency assessment and priority communication",
    longDescription:
      "Learn critical vocabulary for emergency situations, triage assessments, and communicating urgency levels. Essential for healthcare workers and patients in emergency settings.",
  },
  consultation: {
    label: "Consultation",
    labelZh: "问诊",
    icon: MessageSquare,
    color: "text-teal-400",
    bgColor: "bg-teal-500/20",
    borderColor: "border-teal-500/30",
    description: "Doctor-patient dialogue and symptom description",
    longDescription:
      "The core of medical Chinese communication. Learn to describe symptoms, understand doctor questions, and have meaningful consultations in Chinese.",
  },
  tests: {
    label: "Tests",
    labelZh: "检查",
    icon: TestTube,
    color: "text-purple-400",
    bgColor: "bg-purple-500/20",
    borderColor: "border-purple-500/30",
    description: "Lab tests, imaging, and diagnostic procedures",
    longDescription:
      "Understand medical test terminology, from blood tests to imaging procedures. Learn to read basic test results and understand diagnostic explanations.",
  },
  pharmacy: {
    label: "Pharmacy",
    labelZh: "药房",
    icon: Pill,
    color: "text-green-400",
    bgColor: "bg-green-500/20",
    borderColor: "border-green-500/30",
    description: "Medication instructions and prescription pickup",
    longDescription:
      "Navigate Chinese pharmacies with confidence. Learn medication names, dosage instructions, and how to ask about drug interactions and side effects.",
  },
  billing: {
    label: "Billing",
    labelZh: "缴费",
    icon: Receipt,
    color: "text-amber-400",
    bgColor: "bg-amber-500/20",
    borderColor: "border-amber-500/30",
    description: "Insurance, payment, and medical expenses",
    longDescription:
      "Understand medical billing, insurance terminology, and payment procedures in Chinese hospitals. Essential for managing healthcare costs.",
  },
}

interface PageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params
  const cat = categories[category]
  if (!cat) return { title: "Not Found" }

  return {
    title: `${cat.label} (${cat.labelZh}) - Medical Chinese | LearnChinese`,
    description: cat.longDescription,
  }
}

export default async function MedicalCategoryPage({ params }: PageProps) {
  const { category } = await params
  const cat = categories[category]

  if (!cat) {
    notFound()
  }

  const Icon = cat.icon
  const categoryScenarios = medicalScenarios.filter((s) => s.category === category)
  const categoryWords = medicalLexicon.filter((w) => {
    // Match words that appear in scenarios of this category
    const scenarioVocab = categoryScenarios.flatMap((s) => s.vocab_focus || [])
    return scenarioVocab.includes(w.id) || w.category === "symptom" || w.category === "body"
  }).slice(0, 16)
  const categoryGrammar = medicalGrammar.slice(0, 8)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-16 px-6">
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${cat.bgColor.replace("bg-", "from-").replace("/20", "/10")} via-transparent to-transparent`} />

        <div className="relative max-w-7xl mx-auto">
          <Link
            href="/medical"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Medical Chinese
          </Link>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className={`h-20 w-20 rounded-2xl flex items-center justify-center ${cat.bgColor} ${cat.borderColor} border`}>
              <Icon className={`h-10 w-10 ${cat.color}`} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {cat.label} <span className="text-zinc-500">{cat.labelZh}</span>
              </h1>
              <p className="text-lg text-zinc-400 max-w-2xl">{cat.longDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-8 px-6 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-3 gap-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{categoryScenarios.length}</p>
            <p className="text-sm text-zinc-500">Scenarios</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{categoryWords.length}+</p>
            <p className="text-sm text-zinc-500">Vocabulary</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{categoryGrammar.length}+</p>
            <p className="text-sm text-zinc-500">Grammar Patterns</p>
          </div>
        </div>
      </section>

      {/* Scenarios */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Practice Scenarios</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryScenarios.map((scenario) => (
              <Link key={scenario.id} href="/login">
                <GlassCard className="p-4 h-full hover:border-teal-500/30 transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${cat.bgColor} ${cat.color} ${cat.borderColor} border`}>
                      {category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-zinc-400">
                      {scenario.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors">
                    {scenario.title_zh}
                  </h3>
                  <p className="text-sm text-zinc-400 mb-3">{scenario.title_en}</p>
                  <div className="pt-3 border-t border-white/[0.06]">
                    <p className="text-xs text-zinc-500">Chief Complaint:</p>
                    <p className="text-sm text-zinc-300">{scenario.chief_complaint_zh}</p>
                  </div>
                  <div className="flex items-center justify-end mt-3">
                    <span className="text-xs text-teal-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Practice
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Vocabulary */}
      <section className="py-12 px-6 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Key Vocabulary</h2>
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
            >
              <Link href="/login">
                <BookOpen className="h-4 w-4 mr-2" />
                Full Dictionary
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {categoryWords.map((word) => (
              <Link key={word.id} href="/login">
                <GlassCard className="p-3 hover:border-teal-500/30 transition-all group cursor-pointer">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-semibold text-white group-hover:text-teal-300 transition-colors">
                      {word.word}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400">
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

      {/* Grammar */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Relevant Grammar</h2>
            <Button
              asChild
              variant="outline"
              className="rounded-lg border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]"
            >
              <Link href="/login">
                <FileText className="h-4 w-4 mr-2" />
                All Patterns
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {categoryGrammar.map((pattern) => (
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
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <GlassCard className={`p-8 text-center ${cat.borderColor} border`}>
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to master {cat.label} vocabulary?
            </h2>
            <p className="text-zinc-400 mb-6">
              Start learning Medical Chinese with interactive scenarios and smart SRS.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-lg bg-gradient-to-r from-teal-600 to-teal-700 text-white hover:from-teal-500 hover:to-teal-600"
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
