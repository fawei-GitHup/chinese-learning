import dynamic from 'next/dynamic';
import { HeroSection } from "@/components/web/HeroSection"
import { FeatureCard } from "@/components/web/FeatureCard"
import { GlassCard } from "@/components/web/GlassCard"
import { mockReaderPreview } from "@/lib/web-mock"
import { Route, BookText, Brain, ArrowRight, Sparkles, Target, TrendingUp, Award } from "lucide-react"

const features = [
  {
    title: "Personalized Path",
    description:
      "AI-powered learning path adapts to your level and goals. From HSK1 to HSK6, progress at your own pace.",
    icon: Route,
    glowColor: "seal" as const,
  },
  {
    title: "Immersive Reader",
    description:
      "Read authentic Chinese content with instant definitions, pinyin, and audio. Build vocabulary naturally.",
    icon: BookText,
    glowColor: "jade" as const,
  },
  {
    title: "Smart SRS",
    description:
      "Spaced repetition optimized for Chinese. Never forget what you learn with our intelligent review system.",
    icon: Brain,
    glowColor: "gold" as const,
  },
]

const steps = [
  {
    step: "01",
    title: "Take Placement",
    description: "5-minute test to find your level",
    icon: Target,
  },
  {
    step: "02",
    title: "Learn Lessons",
    description: "Interactive grammar and vocabulary",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Read Content",
    description: "Apply skills with graded readers",
    icon: BookText,
  },
  {
    step: "04",
    title: "Master with SRS",
    description: "Retain everything long-term",
    icon: TrendingUp,
  },
]

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950" />
      
      {/* Hero Section */}
      <HeroSection
        headline="Master Chinese with AI-Powered Learning"
        subheadline="The most effective way to learn Mandarin. Personalized lessons, immersive reading, and intelligent review — all in one beautiful app."
        primaryCta={{ label: "Start Placement Test", href: "/login" }}
        secondaryCta={{ label: "Try the Reader", href: "/reader" }}
      />

      {/* Features Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Everything you need to become fluent
          </h2>
          <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
            Our platform combines proven learning methods with modern AI to accelerate your Chinese journey.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              glowColor={feature.glowColor}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-zinc-400">
            Your path to Chinese fluency in 4 simple steps
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              <GlassCard className="text-center h-full">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-900/30 to-red-800/20 text-red-400 text-lg font-bold border border-red-900/20">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-500">{step.description}</p>
              </GlassCard>
              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-zinc-700 z-10" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Reader Preview Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-1.5 text-sm text-red-400 mb-6 border border-red-900/20">
              <Sparkles className="h-4 w-4" />
              Interactive Reader
            </div>
            <h2 className="text-3xl font-bold text-white md:text-4xl mb-6">
              Read Chinese like never before
            </h2>
            <p className="text-zinc-400 mb-8 leading-relaxed">
              Hover over any word for instant definitions, pinyin, and audio. Our smart reader adapts to your level, highlighting words you&apos;re learning while building your vocabulary naturally.
            </p>
            <ul className="space-y-3">
              {[
                "Instant word definitions on hover",
                "HSK-level word highlighting",
                "Built-in pronunciation audio",
                "Auto-save new vocabulary to SRS",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-zinc-400">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <GlassCard glowColor="seal" className="p-8">
            <p className="text-xs text-zinc-600 mb-4 uppercase tracking-wider">
              {mockReaderPreview.title}
            </p>
            <div className="text-2xl leading-loose">
              {mockReaderPreview.content.map((token, index) => (
                <span
                  key={index}
                  className={`inline-block group relative ${
                    token.isHighlighted
                      ? "text-red-400 border-b border-red-500/50 cursor-help"
                      : "text-white"
                  }`}
                >
                  {token.text}
                  {token.pinyin && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">
                      {token.pinyin}
                    </span>
                  )}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-zinc-600 italic">
              Hover over highlighted words to see pinyin
            </p>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <GlassCard glowColor="seal" className="text-center p-12 md:p-16">
          <Award className="h-12 w-12 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white md:text-4xl mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-zinc-500 mb-8 max-w-xl mx-auto">
            Join thousands of learners achieving their Chinese language goals. Start with a free placement test today.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-700 to-red-800 px-8 py-3 font-semibold text-white hover:from-red-600 hover:to-red-700 transition-all shadow-[0_0_25px_rgba(197,48,48,0.3)]"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </a>
        </GlassCard>
      </section>
    </div>
  )
}
