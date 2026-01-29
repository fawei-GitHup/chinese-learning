"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { UserPreferences } from "./web-mock"

interface PreferencesStore extends UserPreferences {
  setShowPinyin: (show: boolean) => void
  setShowTranslation: (show: boolean) => void
  setScript: (script: "simplified" | "traditional") => void
  setTheme: (theme: "dark" | "light" | "system") => void
  setDailyGoalMinutes: (minutes: number) => void
  setFontSize: (size: "small" | "medium" | "large") => void
  resetToDefaults: () => void
}

const defaultPreferences: UserPreferences = {
  showPinyin: true,
  showTranslation: true,
  script: "simplified",
  theme: "dark",
  dailyGoalMinutes: 30,
  fontSize: "medium",
}

export const usePreferences = create<PreferencesStore>()(
  persist(
    (set) => ({
      ...defaultPreferences,
      setShowPinyin: (show) => set({ showPinyin: show }),
      setShowTranslation: (show) => set({ showTranslation: show }),
      setScript: (script) => set({ script }),
      setTheme: (theme) => set({ theme }),
      setDailyGoalMinutes: (minutes) => set({ dailyGoalMinutes: minutes }),
      setFontSize: (size) => set({ fontSize: size }),
      resetToDefaults: () => set(defaultPreferences),
    }),
    {
      name: "learnchinese-preferences",
    }
  )
)
