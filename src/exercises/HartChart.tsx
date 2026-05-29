import { useMemo, useState } from 'react'
import type { ExerciseProps } from './types'
import ExerciseScaffold from './ExerciseScaffold'
import { useCountdown, fmtTime } from '../components/useCountdown'

const LETTERS = 'ABCDEFHKNPRSVZ'

function makeChart(rows: number, cols: number): string[][] {
  // 注意：避免 Math.random 在某些环境受限，这里用简单可重复的伪随机
  let seed = 7
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => LETTERS[Math.floor(rnd() * LETTERS.length)]),
  )
}

// Hart 表：近—远交替读字母，逐行清除，记录清行数
export default function HartChart({ def, level, onFinish }: ExerciseProps) {
  const cols = 4 + level // 难度增加列数
  const rows = 8
  const chart = useMemo(() => makeChart(rows, cols), [cols])
  const [cleared, setCleared] = useState(0)
  const [started, setStarted] = useState(false)
  const [lookFar, setLookFar] = useState(false)
  const duration = def.defaultDurationSec
  const { remaining, start } = useCountdown(duration, () =>
    onFinish({ completed: cleared > 0, metricValue: cleared, durationSec: duration }),
  )

  const clearRow = () => {
    setLookFar((f) => !f) // 提示下一次看另一处
    setCleared((c) => Math.min(rows, c + 1))
  }

  return (
    <ExerciseScaffold def={def} level={level}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-full rounded-2xl bg-white border-2 border-slate-200 p-3" style={{ maxWidth: 360 }}>
          {chart.map((row, i) => (
            <div
              key={i}
              className={`flex justify-between font-mono tracking-widest text-lg sm:text-xl py-0.5 ${
                i < cleared ? 'opacity-25 line-through' : i === cleared ? 'bg-yellow-100 rounded' : ''
              }`}
            >
              {row.map((ch, j) => (
                <span key={j}>{ch}</span>
              ))}
            </div>
          ))}
        </div>

        <p className="text-sm font-semibold text-slate-700">
          {lookFar ? '🔭 现在抬头读 3 米外的远表同一行' : '📖 现在读近表（约 40cm）当前行'}
        </p>

        {!started ? (
          <button className="btn-primary w-full" onClick={() => { setStarted(true); start() }}>
            开始
          </button>
        ) : (
          <>
            <div className="flex items-center gap-3 w-full">
              <span className="text-2xl font-bold tabular-nums text-brand-600">{fmtTime(remaining)}</span>
              <span className="chip bg-grass-500 text-white ml-auto">已清 {cleared} 行</span>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full">
              <button className="btn-grass" onClick={clearRow} disabled={cleared >= rows}>读对了，清一行 ✓</button>
              <button className="btn-ghost" onClick={() => onFinish({ completed: cleared > 0, metricValue: cleared, durationSec: duration - remaining })}>
                完成
              </button>
            </div>
          </>
        )}
      </div>
    </ExerciseScaffold>
  )
}
