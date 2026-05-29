import { useState } from 'react'
import type { ExerciseProps } from './types'
import ExerciseScaffold from './ExerciseScaffold'
import { useCountdown, fmtTime } from '../components/useCountdown'

// 20-20-20 远眺放松，配合呼吸动画
export default function DistanceGaze({ def, level, onFinish }: ExerciseProps) {
  const [started, setStarted] = useState(false)
  const duration = def.defaultDurationSec
  const { remaining, start } = useCountdown(duration, () =>
    onFinish({ completed: true, durationSec: duration }),
  )

  return (
    <ExerciseScaffold def={def} level={level}>
      <div className="flex flex-col items-center gap-4 pt-4">
        <p className="text-sm text-slate-600 text-center">
          走到窗边，看向至少 <strong>6 米外</strong>的远处，跟着圆圈慢慢呼吸，让眼睛休息。
        </p>
        <div
          className={`w-40 h-40 rounded-full bg-grass-400/40 border-4 border-grass-500 flex items-center justify-center transition-all duration-[4000ms] ${
            started ? 'scale-110' : 'scale-90'
          }`}
        >
          <div className="w-24 h-24 rounded-full bg-grass-500/30 flex items-center justify-center text-grass-700 font-semibold">
            {started ? '吸气…呼气…' : '准备'}
          </div>
        </div>
        {!started ? (
          <button className="btn-grass w-full" onClick={() => { setStarted(true); start() }}>
            开始远眺
          </button>
        ) : (
          <span className="text-3xl font-bold tabular-nums text-grass-600">{fmtTime(remaining)}</span>
        )}
      </div>
    </ExerciseScaffold>
  )
}
