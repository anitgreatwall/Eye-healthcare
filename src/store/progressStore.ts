import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameState, Measurement, SessionLog } from '../lib/types'
import { todayKey } from '../lib/date'
import { evaluateBadges, levelForStars, mascotStageFor } from '../lib/achievements'

interface ProgressState {
  logs: SessionLog[]
  measurements: Measurement[]
  game: GameState
  /** 保存一次完成的会话，返回本次新解锁的徽章 id 列表 */
  saveSession: (log: SessionLog) => string[]
  addMeasurement: (m: Measurement) => void
  clearAll: () => void
}

const INITIAL_GAME: GameState = {
  totalStars: 0,
  level: 1,
  streakDays: 0,
  lastTrainingDate: null,
  badges: [],
  mascotStage: 0,
}

function computeStreak(prev: GameState, dateKey: string): number {
  if (prev.lastTrainingDate === dateKey) return prev.streakDays || 1
  if (!prev.lastTrainingDate) return 1
  // 相邻一天则 +1，否则重置为 1
  const last = new Date(prev.lastTrainingDate).getTime()
  const cur = new Date(dateKey).getTime()
  const diffDays = Math.round((cur - last) / 86400000)
  if (diffDays === 1) return prev.streakDays + 1
  if (diffDays <= 0) return prev.streakDays || 1
  return 1
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      logs: [],
      measurements: [],
      game: INITIAL_GAME,
      saveSession: (log) => {
        const { logs, measurements, game } = get()
        const newLogs = [...logs, log]

        // 把本次会话里有数值的指标记入 measurements（每日每类型取一条）
        const newMeasurements = [...measurements]
        for (const r of log.results) {
          if (r.metricValue != null && r.metricType !== 'completion') {
            newMeasurements.push({
              date: log.date,
              type: r.metricType,
              value: r.metricValue,
            })
          }
        }

        const totalStars = game.totalStars + log.totalStars
        const streakDays = log.completed
          ? computeStreak(game, log.date)
          : game.streakDays
        const completedCount = newLogs.filter((l) => l.completed).length
        const baseGame: GameState = {
          ...game,
          totalStars,
          level: levelForStars(totalStars),
          streakDays,
          lastTrainingDate: log.completed ? log.date : game.lastTrainingDate,
          mascotStage: mascotStageFor(completedCount),
        }
        const allBadges = evaluateBadges({ logs: newLogs, game: baseGame })
        const newlyUnlocked = allBadges.filter((b) => !game.badges.includes(b))
        const newGame: GameState = { ...baseGame, badges: allBadges }

        set({ logs: newLogs, measurements: newMeasurements, game: newGame })
        return newlyUnlocked
      },
      addMeasurement: (m) =>
        set((s) => ({ measurements: [...s.measurements, m] })),
      clearAll: () =>
        set({ logs: [], measurements: [], game: INITIAL_GAME }),
    }),
    { name: 'eye-progress-v1' },
  ),
)

/** 便捷选择器：今日是否已完成训练 */
export function hasTrainedToday(logs: SessionLog[]): boolean {
  const t = todayKey()
  return logs.some((l) => l.date === t && l.completed)
}
