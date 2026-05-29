import { useState, type ReactNode } from 'react'
import type { ExerciseDef } from '../lib/types'
import { DIMENSION_META } from '../data/exerciseCatalog'
import SafetyBanner from '../components/SafetyBanner'

interface Props {
  def: ExerciseDef
  level: number
  children: ReactNode
  /** 底部操作区 */
  footer?: ReactNode
}

export default function ExerciseScaffold({ def, level, children, footer }: Props) {
  const [showHelp, setShowHelp] = useState(false)
  const dim = DIMENSION_META[def.dimension]
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="chip text-white"
              style={{ backgroundColor: dim.color }}
            >
              {dim.emoji} {dim.label}
            </span>
            <span className="chip bg-slate-100 text-slate-600">难度 {level}/{def.maxLevel}</span>
          </div>
          <h2 className="text-lg font-bold mt-1 text-slate-800">{def.name}</h2>
          <p className="text-sm text-slate-500">{def.goal}</p>
        </div>
        <button className="btn-ghost text-sm shrink-0" onClick={() => setShowHelp(true)}>
          说明
        </button>
      </div>

      <div className="flex-1 min-h-0">{children}</div>

      {footer && <div className="mt-3">{footer}</div>}

      {showHelp && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-end sm:items-center justify-center p-4" onClick={() => setShowHelp(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-5 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-lg mb-2">{def.name} · 怎么做</h3>
            {def.equipment && (
              <p className="text-sm text-brand-700 bg-brand-50 rounded-lg px-3 py-2 mb-3">
                需要器材：{def.equipment}
              </p>
            )}
            <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-700">
              {def.instructions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
            {def.tips && def.tips.length > 0 && (
              <div className="mt-3 text-sm text-slate-600">
                <p className="font-semibold mb-1">小贴士</p>
                <ul className="list-disc pl-5 space-y-1">
                  {def.tips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-3">
              <SafetyBanner variant="compact" />
            </div>
            <button className="btn-primary w-full mt-4" onClick={() => setShowHelp(false)}>
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
