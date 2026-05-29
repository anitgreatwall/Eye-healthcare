import type { ExerciseDef } from '../lib/types'

export interface ExerciseFinishResult {
  completed: boolean
  metricValue?: number
  durationSec: number
}

export interface ExerciseProps {
  def: ExerciseDef
  level: number
  /** 屏幕校准：每厘米像素数（0=未校准） */
  pxPerCm: number
  /** 练习结束时调用，进入下一项 */
  onFinish: (r: ExerciseFinishResult) => void
}
