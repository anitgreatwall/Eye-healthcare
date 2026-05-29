import type { Settings } from '../lib/types'
import { EXERCISES, EXERCISE_BY_ID } from './exerciseCatalog'
import { todayKey } from '../lib/date'

// 每次会话的练习顺序：热身 → 集合 → 融像 → 调节 →（解锁后）抗抑制/立体视 → 放松
const SESSION_ORDER = [
  'saccades',
  'pencil_pushup',
  'brock_string',
  'convergence_target',
  'free_fusion',
  'hart_chart',
  'flipper',
  'tranaglyph',
  'anti_suppression',
  'stereogram',
  'distance_gaze',
]

/**
 * 依据设置构建今日会话的练习 id 列表。
 * - 无红青眼镜：跳过 requiresGlasses 的练习
 * - 无反转拍：跳过 flipper
 * - 按目标时长裁剪（保留热身、集合、放松等核心，时长不足时优先精简调节/重复类）
 */
export function buildSession(settings: Settings): string[] {
  let ids = SESSION_ORDER.filter((id) => {
    const ex = EXERCISE_BY_ID[id]
    if (!ex) return false
    if (ex.requiresGlasses && !settings.glassesEnabled) return false
    if (id === 'flipper' && !settings.flipperEnabled) return false
    return true
  })

  // 依据目标时长粗略裁剪：累加默认时长，超出则从「可选」练习里去掉
  const targetSec = settings.sessionMinutes * 60
  const optional = ['brock_string', 'convergence_target', 'hart_chart', 'stereogram']
  let total = ids.reduce(
    (s, id) => s + EXERCISE_BY_ID[id].defaultDurationSec,
    0,
  )
  for (const opt of optional) {
    if (total <= targetSec * 1.15) break
    if (ids.includes(opt)) {
      ids = ids.filter((x) => x !== opt)
      total -= EXERCISE_BY_ID[opt].defaultDurationSec
    }
  }
  return ids
}

export interface DimensionPlan {
  dimension: string
  count: number
}

/** 今日是否为训练日 */
export function isTrainingDay(settings: Settings, d: Date = new Date()): boolean {
  return settings.scheduleDays.includes(d.getDay())
}

/** 距离下一个训练日还有几天（0 表示今天就是） */
export function daysUntilNextTraining(settings: Settings, d: Date = new Date()): number {
  if (settings.scheduleDays.length === 0) return -1
  for (let i = 0; i < 7; i++) {
    const day = (d.getDay() + i) % 7
    if (settings.scheduleDays.includes(day)) return i
  }
  return -1
}

export { todayKey, EXERCISES }
