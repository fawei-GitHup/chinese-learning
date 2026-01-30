"use client"

import React, { useState, useMemo } from "react"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  allPlacementQuestions,
  calculateTestResult,
  getStudyRecommendation,
  type PlacementQuestion,
  type HSKLevel 
} from "@/lib/placement-test-mock"
import { savePlacementTestResult } from "@/lib/placement-test/api"
import { ArrowRight, CheckCircle2, Sparkles, BookOpen, TrendingUp, Clock, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"

type TestState = "intro" | "testing" | "complete"

export default function PlacementTestClient() {
  const [testState, setTestState] = useState<TestState>("intro")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({})
  const [assessedLevel, setAssessedLevel] = useState<HSKLevel | null>(null)
  const [testScore, setTestScore] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const currentQuestion = allPlacementQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / allPlacementQuestions.length) * 100
  const isAnswered = currentQuestion && userAnswers[currentQuestion.id] !== undefined

  // 开始测试
  const handleStartTest = () => {
    setTestState("testing")
    setStartTime(new Date())
    setUserAnswers({})
    setCurrentQuestionIndex(0)
  }

  // 选择答案
  const handleSelectAnswer = (answerIndex: number) => {
    if (!currentQuestion) return
    
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }))
  }

  // 下一题或完成测试
  const handleNext = async () => {
    if (currentQuestionIndex < allPlacementQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      // 完成测试，计算结果
      await finishTest()
    }
  }

  // 完成测试
  const finishTest = async () => {
    const result = calculateTestResult(userAnswers)
    setAssessedLevel(result.assessedLevel)
    setTestScore(result.score)
    setTestState("complete")

    // 保存结果到数据库
    if (startTime) {
      setIsSaving(true)
      const saveResult = await savePlacementTestResult({
        score: result.score,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        assessedLevel: result.assessedLevel,
        answers: userAnswers,
        startedAt: startTime,
        completedAt: new Date()
      })

      setIsSaving(false)

      if (saveResult.success) {
        toast.success("测试结果已保存！")
      } else {
        toast.error(`保存失败: ${saveResult.error}`)
      }
    }
  }

  // 重新测试
  const handleRetry = () => {
    setTestState("intro")
    setUserAnswers({})
    setCurrentQuestionIndex(0)
    setAssessedLevel(null)
    setTestScore(0)
    setStartTime(null)
  }

  // 介绍页面
  if (testState === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 py-12 px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white md:text-5xl bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              HSK 分级测试
            </h1>
            <p className="mt-4 text-lg text-zinc-400">
              通过简单测试，了解您的中文水平，获得个性化学习建议
            </p>
          </div>

          <GlassCard className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="h-6 w-6 text-cyan-400" />
              <h2 className="text-2xl font-semibold text-white">测试说明</h2>
            </div>

            <div className="space-y-4 text-zinc-300">
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">题库范围</p>
                  <p className="text-sm text-zinc-400">涵盖HSK1-HSK6全部级别，共{allPlacementQuestions.length}道选择题</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">测试时长</p>
                  <p className="text-sm text-zinc-400">约10-15分钟，无时间限制</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">评估结果</p>
                  <p className="text-sm text-zinc-400">基于答题结果，评估您的HSK等级并提供学习建议</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <div className="flex justify-center">
            <Button 
              onClick={handleStartTest}
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 text-white px-8"
            >
              开始测试
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 测试进行中
  if (testState === "testing" && currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 py-12 px-4">
        <div className="mx-auto max-w-3xl">
          {/* 进度条 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-400">
                题目 {currentQuestionIndex + 1} / {allPlacementQuestions.length}
              </span>
              <span className="text-sm text-zinc-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* 题目卡片 */}
          <GlassCard glowColor="jade" className="mb-6">
            <div className="mb-6">
              <div className="mb-2 inline-block rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-medium text-cyan-400">
                {currentQuestion.level}
              </div>
              <h2 className="text-2xl font-semibold text-white mt-4">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={cn(
                    "rounded-xl border px-5 py-4 text-left transition-all duration-200",
                    "hover:scale-[1.02] active:scale-[0.98]",
                    userAnswers[currentQuestion.id] === index
                      ? "border-cyan-500 bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/20"
                      : "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-bold flex-shrink-0",
                      userAnswers[currentQuestion.id] === index
                        ? "border-cyan-400 bg-cyan-400 text-white"
                        : "border-zinc-500 text-zinc-500"
                    )}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="text-base">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>

          {/* 下一题按钮 */}
          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!isAnswered}
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestionIndex < allPlacementQuestions.length - 1 ? "下一题" : "完成测试"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 测试完成
  if (testState === "complete" && assessedLevel) {
    const recommendation = getStudyRecommendation(assessedLevel, testScore)

    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <GlassCard glowColor="jade" className="mb-6">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 shadow-lg shadow-emerald-500/30">
                <Sparkles className="h-12 w-12 text-emerald-400" />
              </div>

              <h2 className="text-3xl font-bold text-white mb-2">测试完成！</h2>
              <p className="text-zinc-400 mb-6">恭喜您完成了HSK分级测试</p>

              <div className="mb-8 inline-block">
                <div className="rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 p-1">
                  <div className="rounded-xl bg-zinc-900 px-8 py-6">
                    <div className="text-sm text-zinc-400 mb-1">您的等级</div>
                    <div className="text-5xl font-bold text-white">{assessedLevel}</div>
                    <div className="text-sm text-zinc-400 mt-2">得分: {testScore}/100</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-6 mb-6 text-left">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  学习建议
                </h3>
                <p className="text-zinc-300 leading-relaxed">{recommendation}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/app/dashboard">
                  <Button className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600">
                    开始学习
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleRetry}
                  className="border-white/20 hover:bg-white/10"
                >
                  重新测试
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    )
  }

  return null
}
