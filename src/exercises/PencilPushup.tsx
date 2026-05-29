import { useState } from 'react'
import type { ExerciseProps } from './types'
import ExerciseScaffold from './ExerciseScaffold'

// 笔尖推进：引导多次重复，记录每次破裂点距离（cm），取最小值作为本次 NPC
export default function PencilPushup({ def, level, onFinish }: ExerciseProps) {
  const reps = 3 + level // 难度越高重复越多
  const [done, setDone] = useState<number[]>([])
  const [input, setInput] = useState('')

  const submit = () => {
    const v = parseFloat(input)
    if (!isNaN(v) && v >= 0 && v < 60) {
      setDone((d) => [...d, v])
      setInput('')
    }
  }

  const finish = () => {
    const best = done.length ? Math.min(...done) : undefined
    onFinish({ completed: done.length >= 1, metricValue: best, durationSec: def.defaultDurationSec })
  }

  return (
    <ExerciseScaffold def={def} level={level}>
      <div className="space-y-4">
        <div className="card bg-brand-50 border-brand-100 text-sm text-slate-700 space-y-1">
          <p>把笔举到眼前，盯住笔尖缓慢移近鼻尖。</p>
          <p>看到<strong>笔尖变成两个</strong>时停下，量笔尖到鼻梁的厘米数填入。</p>
          <p>目标：本次目标完成 <strong>{reps}</strong> 次，破裂点越来越近越好。</p>
        </div>

        <div className="flex items-end gap-2">
          <label className="flex-1">
            <span className="text-xs text-slate-500">破裂点距离（厘米）</span>
            <input
              type="number"
              inputMode="decimal"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="如 8"
              className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2.5 text-lg"
            />
          </label>
          <button className="btn-primary" onClick={submit} disabled={!input}>
            记一次
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: reps }).map((_, i) => (
            <span
              key={i}
              className={`chip ${done[i] != null ? 'bg-grass-500 text-white' : 'bg-slate-100 text-slate-400'}`}
            >
              {done[i] != null ? `${done[i]}cm` : `第${i + 1}次`}
            </span>
          ))}
        </div>

        {done.length > 0 && (
          <p className="text-sm text-slate-600">
            本次最佳破裂点：<strong className="text-brand-600">{Math.min(...done)} cm</strong>
          </p>
        )}

        <button className="btn-grass w-full" onClick={finish} disabled={done.length === 0}>
          完成笔尖推进
        </button>
      </div>
    </ExerciseScaffold>
  )
}
