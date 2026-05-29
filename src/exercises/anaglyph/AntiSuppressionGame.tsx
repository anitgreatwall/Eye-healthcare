import { useEffect, useState } from 'react'
import type { ExerciseProps } from '../types'
import ExerciseScaffold from '../ExerciseScaffold'
import { useCountdown, fmtTime } from '../../components/useCountdown'

interface Dot { id: number; x: number; y: number; color: 'red' | 'cyan' }

let uid = 0
function spawn(n: number): Dot[] {
  return Array.from({ length: n }, () => ({
    id: uid++,
    x: 8 + Math.random() * 84,
    y: 8 + Math.random() * 84,
    color: Math.random() < 0.5 ? 'red' : 'cyan',
  }))
}

// 抗抑制：红(右眼)与青(左眼)圆点交替清除，强制双眼都工作
export default function AntiSuppressionGame({ def, level, onFinish }: ExerciseProps) {
  const [started, setStarted] = useState(false)
  const [dots, setDots] = useState<Dot[]>([])
  const [target, setTarget] = useState<'red' | 'cyan'>('red')
  const [rounds, setRounds] = useState(0)
  const duration = def.defaultDurationSec
  const { remaining, start } = useCountdown(duration, () =>
    onFinish({ completed: rounds > 0, metricValue: rounds, durationSec: duration }),
  )

  const begin = () => {
    setDots(spawn(6 + level * 2))
    setStarted(true)
    start()
  }

  useEffect(() => {
    if (!started) return
    if (dots.length > 0 && dots.every((d) => d.color !== target)) {
      // 当前目标色清完 → 换色并补充
      setTarget((t) => (t === 'red' ? 'cyan' : 'red'))
      setRounds((r) => r + 1)
      setDots((prev) => [...prev.filter((d) => d.color !== target).slice(0, 0), ...spawn(6 + level * 2)])
    }
  }, [dots, target, started, level])

  const tap = (d: Dot) => {
    if (d.color === target) setDots((prev) => prev.filter((x) => x.id !== d.id))
  }

  return (
    <ExerciseScaffold def={def} level={level}>
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-2 w-full text-center">
          戴上红青眼镜。两种颜色都要能看见，才说明双眼都在工作。
        </div>
        <p className="text-base font-semibold">
          👉 点掉所有{' '}
          <span className={target === 'red' ? 'text-red-500' : 'text-cyan-500'}>
            {target === 'red' ? '红色' : '青色'}
          </span>{' '}
          圆点
        </p>
        <div className="relative bg-white rounded-2xl border-2 border-slate-200 w-full no-select" style={{ maxWidth: 320, aspectRatio: '1 / 1' }}>
          {started &&
            dots.map((d) => (
              <button
                key={d.id}
                onClick={() => tap(d)}
                className="absolute rounded-full"
                style={{
                  left: `${d.x}%`,
                  top: `${d.y}%`,
                  width: 28,
                  height: 28,
                  transform: 'translate(-50%,-50%)',
                  background: d.color === 'red' ? '#ff2a2a' : '#00c8c8',
                }}
              />
            ))}
        </div>
        {!started ? (
          <button className="btn-primary w-full" onClick={begin}>开始</button>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <span className="text-2xl font-bold tabular-nums text-brand-600">{fmtTime(remaining)}</span>
            <span className="chip bg-grass-500 text-white">完成 {rounds} 轮</span>
            <button className="btn-ghost ml-auto" onClick={() => onFinish({ completed: rounds > 0, metricValue: rounds, durationSec: duration - remaining })}>
              完成
            </button>
          </div>
        )}
      </div>
    </ExerciseScaffold>
  )
}
