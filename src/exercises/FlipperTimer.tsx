import { useEffect, useState } from 'react'
import type { ExerciseProps } from './types'
import ExerciseScaffold from './ExerciseScaffold'
import { useCountdown, fmtTime } from '../components/useCountdown'

// 反转拍：60 秒内交替 +/− 看清，每看清一次点一下，计算 cpm（周期/分钟）
export default function FlipperTimer({ def, level, onFinish }: ExerciseProps) {
  const [started, setStarted] = useState(false)
  const [side, setSide] = useState<'plus' | 'minus'>('plus')
  const [count, setCount] = useState(0) // 看清次数
  const duration = 60
  const { remaining, start } = useCountdown(duration, () => finish())

  const finish = () => {
    const cpm = Math.round(count / 2) // 一个周期=+与−各一次
    onFinish({ completed: count > 0, metricValue: cpm, durationSec: duration - remaining })
  }

  // 简单滴答提示（视觉脉冲），不依赖音频
  const [pulse, setPulse] = useState(false)
  useEffect(() => {
    if (!started) return
    const period = Math.max(700, 1600 - level * 300)
    const t = setInterval(() => setPulse((p) => !p), period)
    return () => clearInterval(t)
  }, [started, level])

  const tap = () => {
    setCount((c) => c + 1)
    setSide((s) => (s === 'plus' ? 'minus' : 'plus'))
  }

  return (
    <ExerciseScaffold def={def} level={level}>
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-slate-600 text-center">
          看清小字后翻到另一片镜片，再看清。每<strong>看清一次</strong>就点中间大圆一下。
        </p>
        <button
          onClick={tap}
          disabled={!started}
          className={`w-40 h-40 rounded-full text-white text-3xl font-bold shadow-lg transition ${
            side === 'plus' ? 'bg-grass-500' : 'bg-brand-500'
          } ${pulse ? 'scale-105' : 'scale-100'}`}
        >
          {side === 'plus' ? '＋ 看清' : '－ 看清'}
        </button>
        <p className="text-sm text-slate-500">已看清 {count} 次</p>

        {!started ? (
          <button className="btn-primary w-full" onClick={() => { setStarted(true); start() }}>
            开始 60 秒
          </button>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <span className="text-2xl font-bold tabular-nums text-brand-600">{fmtTime(remaining)}</span>
            <button className="btn-ghost ml-auto" onClick={finish}>提前完成</button>
          </div>
        )}
      </div>
    </ExerciseScaffold>
  )
}
