import { Button } from "@/components/ui/button"
import Link from "next/link"

interface HeroSectionProps {
  headline: string
  subheadline: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}

export function HeroSection({ headline, subheadline, primaryCta, secondaryCta }: HeroSectionProps) {
  return (
    <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center md:py-32 lg:py-40">
      {/* Ink-wash glow effect behind hero */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] bg-red-950/30 blur-[120px] rounded-full" />
      <div className="pointer-events-none absolute top-1/3 left-1/3 h-[300px] w-[400px] bg-purple-950/20 blur-[100px] rounded-full" />
      
      <h1 className="relative z-10 max-w-4xl text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl text-balance">
        {headline}
      </h1>
      <p className="relative z-10 mt-6 max-w-2xl text-lg text-zinc-500 md:text-xl text-pretty">
        {subheadline}
      </p>
      <div className="relative z-10 mt-10 flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg" className="rounded-lg bg-gradient-to-r from-red-700 to-red-800 px-8 text-white hover:from-red-600 hover:to-red-700 font-semibold shadow-[0_0_30px_rgba(197,48,48,0.3)]">
          <Link href={primaryCta.href}>{primaryCta.label}</Link>
        </Button>
        {secondaryCta && (
          <Button asChild size="lg" variant="outline" className="rounded-lg border-white/[0.08] bg-white/[0.03] px-8 text-white hover:bg-white/[0.06] backdrop-blur-sm">
            <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
          </Button>
        )}
      </div>
    </section>
  )
}
