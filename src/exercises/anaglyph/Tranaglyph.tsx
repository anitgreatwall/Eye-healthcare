import { useState } from 'react'
import type { ExerciseProps } from '../types'
import ExerciseScaffold from '../ExerciseScaffold'
import { cmToPx, pxToDeg } from '../../lib/sizing'

const VIEW_DIST_CM = 40

// 红青可变矢量融像：红/青同一图样按 base-out 逐步分离，挑战正融像性集合
export default function Tranaglyph({ def, level, pxPerCm, onFinish }: ExerciseProps) {
  const [step, setStep] = useState(1)
  const [bestDeg, setBestDeg] = useState(0)

  const sepCm = 0.6 + step * 0.7
  const sepPx = cmToPx(sepCm, pxPerCm)
  const demandDeg = pxToDeg(sepPx, VIEW_DIST_CM, pxPerCm)

  const figure = (color: string, dx: number) => (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ transform: `translateX(${dx}px)`, color, mixBlendMode: 'multiply' }}
    >
      <svg width={120} height={120} viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="42" fill="none" stroke={color} strokeWidth="6" />
        <circle cx="60" cy="60" r="22" fill="none" stroke={color} strokeWidth="6" />
        <circle cx="60" cy="60" r="5" fill={color} />
      </svg>
    </div>
  )

  const success = () => {
    setBestDeg((b) => Math.max(b, demandDeg))
    if (step >= def.maxLevel) {
      onFinish({ completed: true, metricValue: Math.max(bestDeg, demandDeg), durationSec: def.defaultDurationSec })
    } else setStep((s) => s + 1)
  }
  const fail = () => onFinish({ completed: bestDeg > 0, metricValue: bestDeg, durationSec: def.defaultDurationSec })

  return (
    <ExerciseScaffold def={def} level={level}>
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-2 w-full text-center">
          请先戴上红青眼镜（红色镜片在左眼）
        </div>
        <div className="relative bg-white rounded-2xl border-2 border-slate-200" style={{ width: 280, height: 200 }}>
          {figure('#ff2a2a', -sepPx / 2)}
          {figure('#00c8c8', sepPx / 2)}
        </div>
        <p className="text-sm text-slate-600 text-center">
          努力把红、青两个圆环<strong>融合成一个清晰的环</strong>；保持住后点「融合成功」加大难度。
        </p>
        <div className="text-center">
          <span className="chip bg-slate-100 text-slate-600">分离级数 {step}/{def.maxLevel}</span>
          <span className="chip bg-brand-100 text-brand-700 ml-2">约 {demandDeg.toFixed(1)}°</span>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full">
          <button className="btn-ghost" onClick={fail}>太难了 / 结束</button>
          <button className="btn-grass" onClick={success}>融合成功 ✓</button>
        </div>
      </div>
    </ExerciseScaffold>
  )
}
