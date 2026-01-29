"use client"

import { useState } from "react"
import { GlassCard } from "@/components/web/GlassCard"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { mockConnectedAccounts, mockUser } from "@/lib/web-mock"
import { usePreferences } from "@/lib/preferences-store"
import {
  User,
  Settings,
  Link2,
  Moon,
  Sun,
  Monitor,
  Check,
  Loader2,
} from "lucide-react"

export default function AccountPage() {
  const {
    showPinyin,
    showTranslation,
    script,
    theme,
    dailyGoalMinutes,
    setShowPinyin,
    setShowTranslation,
    setScript,
    setTheme,
    setDailyGoalMinutes,
  } = usePreferences()
  
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Mock save delay - preferences are auto-persisted via zustand
    await new Promise((resolve) => setTimeout(resolve, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-zinc-400">
            Manage your preferences and connected accounts
          </p>
        </div>

        {/* Profile Section */}
        <GlassCard className="mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{mockUser.name}</h2>
              <p className="text-sm text-zinc-400">
                {mockUser.level} · {mockUser.streakDays} day streak
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Preferences Section */}
        <GlassCard className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            Learning Preferences
          </h2>

          <div className="space-y-6">
            {/* Show Pinyin Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Show Pinyin</p>
                <p className="text-sm text-zinc-400">
                  Display pinyin pronunciation above characters
                </p>
              </div>
              <Switch
                checked={showPinyin}
                onCheckedChange={setShowPinyin}
              />
            </div>

            {/* Show Translation Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-medium">Show Translation</p>
                <p className="text-sm text-zinc-400">
                  Display English translations in readers and lessons
                </p>
              </div>
              <Switch
                checked={showTranslation}
                onCheckedChange={setShowTranslation}
              />
            </div>

            {/* Script Selection */}
            <div>
              <p className="text-white font-medium mb-3">Character Script</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setScript("simplified")}
                  className={`flex-1 p-4 rounded-xl border transition-all ${
                    script === "simplified"
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <p className="text-2xl mb-1">简体</p>
                  <p
                    className={`text-sm ${
                      script === "simplified"
                        ? "text-cyan-400"
                        : "text-zinc-400"
                    }`}
                  >
                    Simplified
                  </p>
                </button>
                <button
                  onClick={() => setScript("traditional")}
                  className={`flex-1 p-4 rounded-xl border transition-all ${
                    script === "traditional"
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <p className="text-2xl mb-1">繁體</p>
                  <p
                    className={`text-sm ${
                      script === "traditional"
                        ? "text-cyan-400"
                        : "text-zinc-400"
                    }`}
                  >
                    Traditional
                  </p>
                </button>
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <p className="text-white font-medium mb-3">Theme</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme("dark")}
                  className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center ${
                    theme === "dark"
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Moon
                    className={`h-6 w-6 mb-2 ${
                      theme === "dark" ? "text-cyan-400" : "text-zinc-400"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-cyan-400" : "text-zinc-400"
                    }`}
                  >
                    Dark
                  </p>
                </button>
                <button
                  onClick={() => setTheme("light")}
                  className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center ${
                    theme === "light"
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Sun
                    className={`h-6 w-6 mb-2 ${
                      theme === "light" ? "text-cyan-400" : "text-zinc-400"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      theme === "light" ? "text-cyan-400" : "text-zinc-400"
                    }`}
                  >
                    Light
                  </p>
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`flex-1 p-4 rounded-xl border transition-all flex flex-col items-center ${
                    theme === "system"
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Monitor
                    className={`h-6 w-6 mb-2 ${
                      theme === "system" ? "text-cyan-400" : "text-zinc-400"
                    }`}
                  />
                  <p
                    className={`text-sm ${
                      theme === "system" ? "text-cyan-400" : "text-zinc-400"
                    }`}
                  >
                    System
                  </p>
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Learning Goal Section */}
        <GlassCard className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-6">Daily Learning Goal</h2>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-white">Minutes per day</p>
                <span className="text-2xl font-bold text-cyan-400">
                  {dailyGoalMinutes} min
                </span>
              </div>
              <Slider
                value={[dailyGoalMinutes]}
                onValueChange={(value) => setDailyGoalMinutes(value[0])}
                min={5}
                max={120}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-zinc-500">
                <span>5 min</span>
                <span>30 min</span>
                <span>60 min</span>
                <span>120 min</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
              <p className="text-zinc-400 text-sm">
                {dailyGoalMinutes < 15 && (
                  <>
                    <span className="text-emerald-400 font-medium">Casual learner: </span>
                    Great for maintaining your streak with light daily practice.
                  </>
                )}
                {dailyGoalMinutes >= 15 && dailyGoalMinutes < 45 && (
                  <>
                    <span className="text-cyan-400 font-medium">Steady learner: </span>
                    Perfect balance of progress and sustainability.
                  </>
                )}
                {dailyGoalMinutes >= 45 && dailyGoalMinutes < 90 && (
                  <>
                    <span className="text-amber-400 font-medium">Dedicated learner: </span>
                    You&apos;ll see significant progress with this commitment.
                  </>
                )}
                {dailyGoalMinutes >= 90 && (
                  <>
                    <span className="text-rose-400 font-medium">Intensive learner: </span>
                    Maximum progress mode! Take breaks to avoid burnout.
                  </>
                )}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Connected Accounts Section */}
        <GlassCard className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <Link2 className="h-5 w-5 text-cyan-400" />
            Connected Accounts
          </h2>

          <div className="space-y-4">
            {mockConnectedAccounts.map((account) => (
              <div
                key={account.provider}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    {account.provider === "google" ? (
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium capitalize">
                      {account.provider}
                    </p>
                    {account.connected && account.email && (
                      <p className="text-sm text-zinc-400">{account.email}</p>
                    )}
                  </div>
                </div>
                {account.connected ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium">
                    Connected
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-white/10 hover:bg-white/5 bg-transparent"
                  >
                    Connect
                  </Button>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 px-8"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : saved ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Saved!
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
