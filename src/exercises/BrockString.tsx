import { useEffect, useState } from 'react'
import type { ExerciseProps } from './types'
import ExerciseScaffold from './ExerciseScaffold'
import { useCountdown, fmtTime } from '../components/useCountdown'

const BEADS = [
  { name: '近珠', color: '#ef4444', y: 78 },
  { name: '中珠', color: '#22c55e', y: 50 },
  { name: '远珠', color: '#eab308', y: 22 },
]

// Brock 线：用 SVG 模拟绳子与三珠，提示交叉 X，节拍切换注视珠子
export default function BrockString({ def, level, onFinish }: ExerciseProps) {
  const [started, setStarted] = useState(false)
  const [idx, setIdx] = useState(0)
  const duration = def.defaultDurationSec
  const dwell = Math.max(2, 5 - level) // 难度越高停留越短，切换越快
  const { remaining, start } = useCountdown(duration, () =>
    onFinish({ completed: true, durationSec: duration }),
  )

  useEffect(() => {
    if (!started) return
    const t = setInterval(() => setIdx((i) => (i + 1) % 3), dwell * 1000)
    return () => clearInterval(t)
  }, [started, dwell])

  const focus = BEADS[idx]

  return (
    <ExerciseScaffold def={def} level={level}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-full rounded-2xl bg-slate-900 p-3" style={{ maxWidth: 360 }}>
          <svg viewBox="0 0 100 100" className="w-full">
            {/* 双眼到注视珠的两条交叉线（生理性复视） */}
            <line x1="30" y1="98" x2="50" y2={focus.y} stroke="#60a5fa" strokeWidth="0.6" opacity="0.8" />
            <line x1="70" y1="98" x2="50" y2={focus.y} stroke="#60a5fa" strokeWidth="0.6" opacity="0.8" />
            {/* 注视珠之后绳子分叉成 X/V */}
            <line x1="50" y1={focus.y} x2="38" y2="2" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5" />
            <line x1="50" y1={focus.y} x2="62" y2="2" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5" />
            {/* 珠子 */}
            {BEADS.map((b, i) => (
              <g key={i}>
                <circle cx="50" cy={b.y} r={i === idx ? 4.5 : 3} fill={b.color} opacity={i === idx ? 1 : 0.6} />
                {i === idx && <circle cx="50" cy={b.y} r="6.5" fill="none" stroke="#fff" strokeWidth="0.6" />}
              </g>
            ))}
          </svg>
        </div>

        <p className="text-base font-semibold" style={{ color: focus.color }}>
          👁️ 现在注视：{focus.name}
        </p>
        <p className="text-xs text-slate-500 text-center">
          注视的珠子应是单个清晰，绳子在它处交叉成 X；看到两条绳都在说明双眼都在工作。
        </p>

        {!started ? (
          <button
            className="btn-primary w-full"
            onClick={() => {
              setStarted(true)
              start()
            }}
          >
            开始
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <span className="text-2xl font-bold tabular-nums text-brand-600">{fmtTime(remaining)}</span>
            <button className="btn-ghost ml-auto" onClick={() => onFinish({ completed: true, durationSec: duration - remaining })}>
              提前完成
            </button>
          </div>
        )}
      </div>
    </ExerciseScaffold>
  )
}
