import { useEffect, useRef, useState } from 'react'
import type { ExerciseProps } from './types'
import ExerciseScaffold from './ExerciseScaffold'
import { useCountdown, fmtTime } from '../components/useCountdown'

// 集合追踪：屏上目标由远（小）及近（大）脉动，间或远近跳跃
export default function ConvergenceTarget({ def, level, onFinish }: ExerciseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [started, setStarted] = useState(false)
  const duration = def.defaultDurationSec
  const { remaining, start } = useCountdown(duration, () =>
    onFinish({ completed: true, durationSec: duration }),
  )

  useEffect(() => {
    if (!started) return
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let t0 = 0
    const speed = 0.5 + level * 0.2

    const draw = (ts: number) => {
      if (!t0) t0 = ts
      const t = (ts - t0) / 1000
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, w, h)

      // 由远及近的脉动半径
      const base = (Math.sin(t * speed) + 1) / 2 // 0..1
      const r = 8 + base * 60

      // 高难度加入远近跳跃：偶尔出现第二个目标
      const jump = level >= 3 && Math.floor(t / 3) % 2 === 1
      ctx.save()
      ctx.translate(w / 2, h / 2)
      // 同心圆目标
      for (let i = 3; i >= 1; i--) {
        ctx.beginPath()
        ctx.arc(0, 0, (r * i) / 3, 0, Math.PI * 2)
        ctx.strokeStyle = i % 2 ? '#38bdf8' : '#fff'
        ctx.lineWidth = 3
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.arc(0, 0, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#fbbf24'
      ctx.fill()
      ctx.restore()

      if (jump) {
        ctx.beginPath()
        ctx.arc(w / 2 + 90, h / 2 - 50, 10, 0, Math.PI * 2)
        ctx.fillStyle = '#22c55e'
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [started, level])

  return (
    <ExerciseScaffold def={def} level={level}>
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-slate-600 text-center">
          把设备举到约一臂远，双眼盯住中心黄点，保持它<strong>始终是一个</strong>。
          {level >= 3 && '出现绿点时快速看过去再看回中心。'}
        </p>
        <canvas ref={canvasRef} width={320} height={220} className="rounded-2xl w-full no-select" style={{ maxWidth: 360 }} />
        {!started ? (
          <button className="btn-primary w-full" onClick={() => { setStarted(true); start() }}>
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
