import { useEffect, useRef, useState } from 'react'
import type { ExerciseProps } from './types'
import ExerciseScaffold from './ExerciseScaffold'
import { useCountdown, fmtTime } from '../components/useCountdown'

// 热身：平滑追随（小球缓慢移动）与扫视（小球两侧跳动）
export default function SaccadesPursuit({ def, level, onFinish }: ExerciseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'pursuit' | 'saccade'>('pursuit')
  const [started, setStarted] = useState(false)
  const duration = def.defaultDurationSec
  const { remaining, start } = useCountdown(duration, () =>
    onFinish({ completed: true, durationSec: duration }),
  )

  useEffect(() => {
    if (!started) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let t0 = 0
    const speed = 0.6 + level * 0.25

    const draw = (ts: number) => {
      if (!t0) t0 = ts
      const t = (ts - t0) / 1000
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(0, 0, w, h)

      let x: number
      const y = h / 2
      const margin = 40
      const range = w - margin * 2
      if (phase === 'pursuit') {
        // 正弦平滑往返
        x = margin + ((Math.sin(t * speed) + 1) / 2) * range
      } else {
        // 离散跳动（扫视）
        const period = Math.max(0.5, 1.2 - level * 0.15)
        const step = Math.floor(t / period)
        x = step % 2 === 0 ? margin : w - margin
      }

      // 目标球
      ctx.beginPath()
      ctx.arc(x, y, 18, 0, Math.PI * 2)
      ctx.fillStyle = '#38bdf8'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [started, phase, level])

  // 前半段追随，后半段扫视
  useEffect(() => {
    if (!started) return
    if (remaining <= duration / 2 && phase === 'pursuit') setPhase('saccade')
  }, [remaining, started, phase, duration])

  return (
    <ExerciseScaffold def={def} level={level}>
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-slate-600">
          {phase === 'pursuit' ? '👀 平滑追随：眼睛跟着小球，头不要动' : '⚡ 快速扫视：迅速看向跳动的小球'}
        </p>
        <canvas
          ref={canvasRef}
          width={320}
          height={200}
          className="rounded-2xl w-full no-select"
          style={{ maxWidth: 360 }}
        />
        {!started ? (
          <button
            className="btn-primary w-full"
            onClick={() => {
              setStarted(true)
              start()
            }}
          >
            开始热身
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <span className="text-2xl font-bold tabular-nums text-brand-600">{fmtTime(remaining)}</span>
            <button
              className="btn-ghost ml-auto"
              onClick={() => onFinish({ completed: true, durationSec: duration - remaining })}
            >
              提前完成
            </button>
          </div>
        )}
      </div>
    </ExerciseScaffold>
  )
}
