import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Profile, Settings } from '../lib/types'

interface AppState {
  onboarded: boolean
  agreedSafety: boolean
  profile: Profile | null
  settings: Settings
  setProfile: (p: Profile) => void
  updateSettings: (patch: Partial<Settings>) => void
  setDifficulty: (exerciseId: string, level: number) => void
  agreeSafety: () => void
  completeOnboarding: () => void
  resetAll: () => void
}

export const DEFAULT_SETTINGS: Settings = {
  scheduleDays: [1, 3, 5], // 周一、三、五
  sessionMinutes: 20,
  glassesEnabled: false,
  flipperEnabled: false,
  parentPin: '',
  pxPerCm: 0,
  difficulty: {},
  reminderEnabled: false,
  reminderTime: '19:30',
}

// 依据病历预填的基线（家长可在设置中修改）
export const DEFAULT_PROFILE: Profile = {
  name: '',
  age: 11,
  gender: 'male',
  baselineFusionMin: -5,
  baselineFusionMax: 6,
  deviationAngle: -9,
  baselineNpcCm: undefined,
  createdAt: '',
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      onboarded: false,
      agreedSafety: false,
      profile: null,
      settings: DEFAULT_SETTINGS,
      setProfile: (p) => set({ profile: p }),
      updateSettings: (patch) =>
        set((s) => ({ settings: { ...s.settings, ...patch } })),
      setDifficulty: (exerciseId, level) =>
        set((s) => ({
          settings: {
            ...s.settings,
            difficulty: { ...s.settings.difficulty, [exerciseId]: level },
          },
        })),
      agreeSafety: () => set({ agreedSafety: true }),
      completeOnboarding: () => set({ onboarded: true }),
      resetAll: () =>
        set({
          onboarded: false,
          agreedSafety: false,
          profile: null,
          settings: DEFAULT_SETTINGS,
        }),
    }),
    { name: 'eye-app-v1' },
  ),
)
