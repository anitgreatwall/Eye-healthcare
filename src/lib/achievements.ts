import type { GameState, SessionLog } from './types'

export interface BadgeDef {
  id: string
  name: string
  icon: string
  desc: string
  /** 是否达成 */
  check: (ctx: { logs: SessionLog[]; game: GameState }) => boolean
}

const completedLogs = (logs: SessionLog[]) => logs.filter((l) => l.completed)

export const BADGES: BadgeDef[] = [
  {
    id: 'first_session',
    name: '启程之星',
    icon: '🌟',
    desc: '完成第一次训练',
    check: ({ logs }) => completedLogs(logs).length >= 1,
  },
  {
    id: 'streak_3',
    name: '坚持三天',
    icon: '🔥',
    desc: '连续训练 3 天',
    check: ({ game }) => game.streakDays >= 3,
  },
  {
    id: 'streak_7',
    name: '一周不断',
    icon: '🏅',
    desc: '连续训练 7 天',
    check: ({ game }) => game.streakDays >= 7,
  },
  {
    id: 'sessions_10',
    name: '十全十美',
    icon: '🎯',
    desc: '累计完成 10 次训练',
    check: ({ logs }) => completedLogs(logs).length >= 10,
  },
  {
    id: 'sessions_40',
    name: '四十里程碑',
    icon: '👑',
    desc: '累计完成 40 次训练（对应院内疗程数）',
    check: ({ logs }) => completedLogs(logs).length >= 40,
  },
  {
    id: 'stars_200',
    name: '集星达人',
    icon: '✨',
    desc: '累计获得 200 颗星',
    check: ({ game }) => game.totalStars >= 200,
  },
]

export function evaluateBadges(ctx: { logs: SessionLog[]; game: GameState }): string[] {
  return BADGES.filter((b) => b.check(ctx)).map((b) => b.id)
}

/** 等级：每 100 星升一级 */
export function levelForStars(stars: number): number {
  return Math.floor(stars / 100) + 1
}

/** 吉祥物成长阶段 0..3，依据累计完成次数 */
export function mascotStageFor(completedCount: number): number {
  if (completedCount >= 30) return 3
  if (completedCount >= 15) return 2
  if (completedCount >= 5) return 1
  return 0
}
