import { Metadata } from "next"
import { hskHubs, lessons, readers, type HSKLevel } from "@/lib/web-mock"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  GraduationCap,
  Library,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

interface Props {
  params: Promise<{ level: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { level } = await params
  const hub = hskHubs[level.toUpperCase() as HSKLevel]

  if (!hub) {
    return {
      title: "HSK Level Not Found | LearnChinese",
      description: "The requested HSK level page was not found.",
    }
  }

  return {
    title: `${hub.title} | LearnChinese`,
    description: hub.description,
    alternates: {
      canonical: `https://learnchinese.app/hsk/${level.toLowerCase()}`,
    },
  }
}

export default async function HSKHubPage({ params }: Props) {
  const { level } = await params
  const levelKey = level.toUpperCase() as HSKLevel
  const hub = hskHubs[levelKey]

  if (!hub) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <GlassCard className="text-center py-12 px-8">
          <h1 className="text-2xl font-bold text-white mb-4">Level Not Found</h1>
          <p className="text-zinc-400 mb-6">
            The HSK level &ldquo;{level}&rdquo; is not available.
          </p>
          <Link href="/">
            <Button className="bg-cyan-500 text-black hover:bg-cyan-400">
              Go Home
            </Button>
          </Link>
        </GlassCard>
      </div>
    )
  }

  // Get featured lessons and readers
  const featuredLessonData = lessons.filter((l) =>
    hub.featuredLessons.includes(l.id)
  )
  const featuredReaderData = readers.filter((r) =>
    hub.featuredReaders.includes(r.id)
  )

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: hub.title,
    description: hub.description,
    provider: {
      "@type": "Organization",
      name: "LearnChinese",
      url: "https://learnchinese.app",
    },
    educationalLevel: levelKey,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-6">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent" />
          <div className="relative max-w-6xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-400 text-sm font-medium mb-6">
              Chinese Proficiency Level
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
              {hub.title}
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-8 text-pretty">
              {hub.description}
            </p>
            <div className="flex items-center justify-center gap-8 text-zinc-400 mb-8">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-400" />
                <span>{hub.wordCount} words</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-emerald-400" />
                <span>{hub.grammarCount} grammar points</span>
              </div>
            </div>
            <Link href="/placement">
              <Button
                size="lg"
                className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 px-8"
              >
                Start Learning {levelKey}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Recommended Path */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Recommended Learning Path
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hub.recommendedPath.map((step) => (
                <GlassCard key={step.step} className="relative">
                  <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-cyan-500 text-black font-bold flex items-center justify-center">
                    {step.step}
                  </div>
                  <div className="pt-4">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-zinc-400 text-sm">{step.description}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Top Words */}
        <section className="py-16 px-6 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Essential {levelKey} Vocabulary
              </h2>
              <Link
                href={`/path?level=${levelKey}`}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {hub.topWords.map((word, i) => (
                <Link
                  key={i}
                  href={`/dictionary/${encodeURIComponent(word.word)}`}
                  className="group"
                >
                  <GlassCard className="hover:bg-white/10 transition-colors h-full">
                    <p className="text-2xl text-white mb-1 group-hover:text-cyan-400 transition-colors">
                      {word.word}
                    </p>
                    <p className="text-cyan-400 text-sm mb-1">{word.pinyin}</p>
                    <p className="text-zinc-500 text-sm">{word.meaning}</p>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Top Grammar */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Key {levelKey} Grammar Patterns
              </h2>
              <Link
                href={`/path?level=${levelKey}`}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                View all <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hub.topGrammar.map((grammar, i) => (
                <Link
                  key={i}
                  href={`/grammar/${encodeURIComponent(grammar.pattern)}`}
                  className="group"
                >
                  <GlassCard className="hover:bg-white/10 transition-colors flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-lg text-white font-medium group-hover:text-amber-400 transition-colors">
                        {grammar.pattern}
                      </p>
                      <p className="text-zinc-400 text-sm">{grammar.description}</p>
                    </div>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Content */}
        {(featuredLessonData.length > 0 || featuredReaderData.length > 0) && (
          <section className="py-16 px-6 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                Featured {levelKey} Content
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lessons */}
                {featuredLessonData.map((lesson) => (
                  <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                    <GlassCard
                      glowColor="cyan"
                      className="hover:bg-white/10 transition-colors h-full"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                          <GraduationCap className="h-6 w-6 text-cyan-400" />
                        </div>
                        <div>
                          <span className="text-xs text-cyan-400 font-medium">
                            LESSON
                          </span>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {lesson.title}
                          </h3>
                          <p className="text-zinc-400 text-sm mb-2">
                            {lesson.summary}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-zinc-500">
                            <span>{lesson.durationMin} min</span>
                            <span>
                              {lesson.tags.join(" · ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                ))}

                {/* Readers */}
                {featuredReaderData.map((reader) => (
                  <Link key={reader.id} href={`/reader/${reader.id}`}>
                    <GlassCard
                      glowColor="emerald"
                      className="hover:bg-white/10 transition-colors h-full"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                          <Library className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                          <span className="text-xs text-emerald-400 font-medium">
                            READER
                          </span>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {reader.title}
                          </h3>
                          <p className="text-zinc-400 text-sm mb-2">
                            {reader.summary}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-zinc-500">
                            <span>{reader.wordCount} words</span>
                            <span>
                              {reader.tags.join(" · ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Other Levels */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-6">
              Explore Other Levels
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {(["HSK1", "HSK2", "HSK3", "HSK4", "HSK5", "HSK6"] as HSKLevel[])
                .filter((l) => l !== levelKey)
                .map((l) => (
                  <Link key={l} href={`/hsk/${l.toLowerCase()}`}>
                    <Button
                      variant="outline"
                      className="rounded-xl border-white/10 hover:bg-white/5 bg-transparent"
                    >
                      {l}
                    </Button>
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <GlassCard glowColor="cyan" className="text-center py-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Master {levelKey}?
              </h2>
              <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                Start your personalized learning journey today with interactive
                lessons, graded readers, and intelligent spaced repetition.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/placement">
                  <Button
                    size="lg"
                    className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 px-8"
                  >
                    Take Placement Test
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-xl border-white/20 hover:bg-white/5 bg-transparent"
                  >
                    Sign Up Free
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </section>
      </div>
    </>
  )
}
