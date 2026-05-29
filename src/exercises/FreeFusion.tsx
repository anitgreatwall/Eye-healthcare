import { useMemo, useState } from 'react'
import type { ExerciseProps } from './types'
import ExerciseScaffold from './ExerciseScaffold'
import { cmToPx, pxToDeg } from '../lib/sizing'

const VIEW_DIST_CM = 40 // 假定观看距离

// 自由空间融像：两幅并排图，交叉融合成中间第三幅；成功后逐步加大分离扩展集合范围
export default function FreeFusion({ def, level, pxPerCm, onFinish }: ExerciseProps) {
  const [step, setStep] = useState(1) // 当前分离级数 1..maxLevel
  const [bestDeg, setBestDeg] = useState(0)

  // 分离距离随级数增加（cm）
  const sepCm = 1.5 + step * 0.9
  const sepPx = cmToPx(sepCm, pxPerCm)
  // 近似集合需求角（度）
  const demandDeg = useMemo(
    () => pxToDeg(sepPx, VIEW_DIST_CM, pxPerCm),
    [sepPx, pxPerCm],
  )

  const onSuccess = () => {
    setBestDeg((b) => Math.max(b, demandDeg))
    if (step >= def.maxLevel) {
      onFinish({ completed: true, metricValue: Math.max(bestDeg, demandDeg), durationSec: def.defaultDurationSec })
    } else {
      setStep((s) => s + 1)
    }
  }

  const onFail = () => {
    onFinish({ completed: bestDeg > 0, metricValue: bestDeg, durationSec: def.defaultDurationSec })
  }

  const Panel = ({ flip }: { flip?: boolean }) => (
    <svg width={92} height={92} viewBox="0 0 92 92" className="no-select">
      <rect x="3" y="3" width="86" height="86" rx="8" fill="#0f172a" stroke="#334155" />
      {/* 对齐用：外圈 + 中心星 + 一个偏移小标记，融合后会形成立体/对齐线索 */}
      <circle cx="46" cy="46" r="30" fill="none" stroke="#38bdf8" strokeWidth="2" />
      <circle cx="46" cy="46" r="18" fill="none" stroke="#22c55e" strokeWidth="2" />
      <text x="46" y="54" textAnchor="middle" fontSize="26" fill="#fbbf24">★</text>
      {/* 偏移标记，左右图相反，融合时合一 */}
      <circle cx={flip ? 30 : 62} cy="20" r="4" fill="#f472b6" />
    </svg>
  )

  return (
    <ExerciseScaffold def={def} level={level}>
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm text-slate-600 text-center">
          稍微<strong>对眼（看近）</strong>，让左右两幅图重叠成中间第三幅；看到中间图的小圆点合到正中、且清晰，就算成功。
        </p>
        {/* 顶部融合辅助点：两点对眼后会变三点 */}
        <div className="flex items-center justify-center" style={{ gap: sepPx }}>
          <div className="w-3 h-3 rounded-full bg-pink-400" />
          <div className="w-3 h-3 rounded-full bg-pink-400" />
        </div>
        <div className="flex items-center justify-center" style={{ gap: sepPx }}>
          <Panel />
          <Panel flip />
        </div>

        <div className="text-center text-sm">
          <span className="chip bg-slate-100 text-slate-600">分离级数 {step}/{def.maxLevel}</span>
          <span className="chip bg-brand-100 text-brand-700 ml-2">约 {demandDeg.toFixed(1)}° 集合需求</span>
        </div>
        {!pxPerCm && (
          <p className="text-xs text-amber-600">提示：在设置中完成屏幕校准后，分离角度会更准确。</p>
        )}

        <div className="grid grid-cols-2 gap-2 w-full">
          <button className="btn-ghost" onClick={onFail}>太难了 / 结束</button>
          <button className="btn-grass" onClick={onSuccess}>融合成功 ✓</button>
        </div>
        {bestDeg > 0 && (
          <p className="text-xs text-slate-500">本次达到约 {bestDeg.toFixed(1)}° 集合需求</p>
        )}
      </div>
    </ExerciseScaffold>
  )
}
