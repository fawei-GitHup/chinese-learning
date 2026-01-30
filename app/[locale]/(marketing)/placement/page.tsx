"use client"

import React from "react"

import { useState, useMemo } from "react"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { placementQuestions, type HSKLevel } from "@/lib/web-mock"
import { ArrowRight, CheckCircle2, Circle, Sparkles, BookOpen, Brain, FileText } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

type Step = "vocab" | "grammar" | "reading"

const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "vocab", label: "Vocabulary", icon: <BookOpen className="h-4 w-4" /> },
  { id: "grammar", label: "Grammar", icon: <Brain className="h-4 w-4" /> },
  { id: "reading", label: "Reading", icon: <FileText className="h-4 w-4" /> },
]

function calculateLevel(answers: Record<string, number>, questions: typeof placementQuestions): HSKLevel {
  let score = 0
  for (const q of questions) {
    if (answers[q.id] === q.answerIndex) {
      const levelNum = parseInt(q.levelHint.replace("HSK", ""))
      score += levelNum
    }
  }
  const avgScore = score / questions.length
  if (avgScore < 1.5) return "HSK1"
  if (avgScore < 2.5) return "HSK2"
  if (avgScore < 3.5) return "HSK3"
  if (avgScore < 4.5) return "HSK4"
  if (avgScore < 5.5) return "HSK5"
  return "HSK6"
}

export default function PlacementPage() {
  const [currentStep, setCurrentStep] = useState<Step>("vocab")
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isComplete, setIsComplete] = useState(false)

  const questionsByStep = useMemo(() => {
    return {
      vocab: placementQuestions.filter((q) => q.type === "vocab"),
      grammar: placementQuestions.filter((q) => q.type === "grammar"),
      reading: placementQuestions.filter((q) => q.type === "reading"),
    }
  }, [])

  const currentQuestions = questionsByStep[currentStep]
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep)

  const stepProgress = useMemo(() => {
    return steps.map((step) => {
      const stepQuestions = questionsByStep[step.id]
      const answered = stepQuestions.filter((q) => answers[q.id] !== undefined).length
      return { ...step, answered, total: stepQuestions.length, complete: answered === stepQuestions.length }
    })
  }, [answers, questionsByStep])

  const totalAnswered = Object.keys(answers).length
  const totalQuestions = placementQuestions.length
  const overallProgress = Math.round((totalAnswered / totalQuestions) * 100)

  const recommendedLevel = useMemo(() => {
    if (!isComplete) return null
    return calculateLevel(answers, placementQuestions)
  }, [isComplete, answers])

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleNextStep = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id)
    } else {
      setIsComplete(true)
    }
  }

  const canProceed = currentQuestions.every((q) => answers[q.id] !== undefined)

  return (
    <div className="min-h-screen bg-zinc-950 py-12">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white md:text-4xl">Placement Test</h1>
          <p className="mt-2 text-zinc-400">Find your starting level in just a few minutes</p>
        </div>

        {/* Progress Indicator */}
        <GlassCard className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {stepProgress.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2">
                  {idx > 0 && <div className="h-px w-8 bg-zinc-700" />}
                  <button
                    onClick={() => !isComplete && setCurrentStep(step.id)}
                    disabled={isComplete}
                    className={cn(
                      "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                      currentStep === step.id && !isComplete
                        ? "bg-cyan-500/20 text-cyan-400"
                        : step.complete
                          ? "text-emerald-400"
                          : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {step.complete ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">{step.label}</span>
                    {step.icon}
                  </button>
                </div>
              ))}
            </div>
            <div className="text-sm text-zinc-400">
              {totalAnswered}/{totalQuestions} answered
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </GlassCard>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Questions Panel */}
          <div className="lg:col-span-2">
            {!isComplete ? (
              <GlassCard glowColor="cyan">
                <div className="mb-6 flex items-center gap-3">
                  {steps.find((s) => s.id === currentStep)?.icon}
                  <h2 className="text-xl font-semibold text-white">
                    {steps.find((s) => s.id === currentStep)?.label} Questions
                  </h2>
                </div>

                <div className="space-y-6">
                  {currentQuestions.map((question, qIdx) => (
                    <div key={question.id} className="rounded-2xl bg-white/5 p-4">
                      <p className="mb-4 text-white">
                        <span className="mr-2 text-cyan-400">{qIdx + 1}.</span>
                        {question.question}
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {question.options.map((option, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswer(question.id, oIdx)}
                            className={cn(
                              "rounded-xl border px-4 py-3 text-left text-sm transition-all",
                              answers[question.id] === oIdx
                                ? "border-cyan-500 bg-cyan-500/20 text-white"
                                : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10"
                            )}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={handleNextStep}
                    disabled={!canProceed}
                    className="bg-cyan-500 hover:bg-cyan-600"
                  >
                    {currentStepIndex < steps.length - 1 ? "Next Section" : "See Results"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </GlassCard>
            ) : (
              <GlassCard glowColor="emerald">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20">
                    <Sparkles className="h-10 w-10 text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Test Complete!</h2>
                  <p className="mt-2 text-zinc-400">
                    Based on your answers, we recommend starting at:
                  </p>
                  <div className="my-6">
                    <span className="inline-block rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 px-8 py-4 text-4xl font-bold text-white">
                      {recommendedLevel}
                    </span>
                  </div>
                  <p className="mb-6 text-sm text-zinc-400">
                    This level will challenge you appropriately while building on what you already know.
                  </p>
                  <Link href="/path">
                    <Button className="bg-emerald-500 hover:bg-emerald-600">
                      Start Learning Path
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            )}
          </div>

          {/* Sidebar - Result Preview */}
          <div className="space-y-4">
            <GlassCard>
              <h3 className="mb-4 font-semibold text-white">Your Progress</h3>
              <div className="space-y-3">
                {stepProgress.map((step) => (
                  <div key={step.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      {step.icon}
                      <span className={step.complete ? "text-emerald-400" : "text-zinc-400"}>
                        {step.label}
                      </span>
                    </div>
                    <span className="text-sm text-zinc-500">
                      {step.answered}/{step.total}
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="mb-4 font-semibold text-white">Estimated Level</h3>
              <div className="flex items-center justify-center">
                <div className={cn(
                  "rounded-xl px-6 py-3 text-center",
                  isComplete ? "bg-emerald-500/20" : "bg-white/5"
                )}>
                  <p className="text-2xl font-bold text-white">
                    {isComplete ? recommendedLevel : "—"}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {isComplete ? "Recommended" : "Complete test to see"}
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="mb-3 font-semibold text-white">HSK Levels</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>HSK1-2</span>
                  <span>Beginner</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>HSK3-4</span>
                  <span>Intermediate</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>HSK5-6</span>
                  <span>Advanced</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
