import { useEffect, useRef, useState } from 'react'
import type { ExerciseProps } from '../types'
import ExerciseScaffold from '../ExerciseScaffold'
import { drawRDS, type ShapeKind } from '../engine/rds'

const SHAPES: ShapeKind[] = ['circle', 'square', 'triangle']
const SHAPE_LABEL: Record<ShapeKind, string> = { circle: '⭕ 圆形', square: '⬛ 方形', triangle: '🔺 三角' }

function pick(): ShapeKind {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)]
}

// 随机点立体视：戴红青眼镜找出浮出的隐藏形状，维持/提升立体视
export default function Stereogram({ def, level, onFinish }: ExerciseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [answer, setAnswer] = useState<ShapeKind>(pick())
  const [correct, setCorrect] = useState(0)
  const [rounds, setRounds] = useState(0)
  const [feedback, setFeedback] = useState<string | null>(null)
  const totalRounds = 4 + level

  // 难度越高视差越小，越难浮出
  const disparity = Math.max(4, 16 - level * 2)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')!
    drawRDS(ctx, c.width, c.height, answer, disparity)
  }, [answer, disparity])

  const guess = (s: ShapeKind) => {
    const ok = s === answer
    if (ok) setCorrect((x) => x + 1)
    setFeedback(ok ? '答对了！🎉' : `这次是${SHAPE_LABEL[answer]}`)
    const next = rounds + 1
    setRounds(next)
    setTimeout(() => {
      setFeedback(null)
      if (next >= totalRounds) {
        onFinish({ completed: correct + (ok ? 1 : 0) > 0, metricValue: correct + (ok ? 1 : 0), durationSec: def.defaultDurationSec })
      } else {
        setAnswer(pick())
      }
    }, 900)
  }

  return (
    <ExerciseScaffold def={def} level={level}>
      <div className="flex flex-col items-center gap-3">
        <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-2 w-full text-center">
          戴上红青眼镜，看看杂点中浮出的是什么形状？
        </div>
        <canvas ref={canvasRef} width={280} height={220} className="rounded-2xl border-2 border-slate-200 no-select" />
        <p className="text-sm text-slate-500">第 {Math.min(rounds + 1, totalRounds)} / {totalRounds} 题 · 答对 {correct}</p>
        {feedback ? (
          <p className="text-lg font-bold text-brand-600 h-10">{feedback}</p>
        ) : (
          <div className="grid grid-cols-3 gap-2 w-full">
            {SHAPES.map((s) => (
              <button key={s} className="btn-ghost" onClick={() => guess(s)}>
                {SHAPE_LABEL[s]}
              </button>
            ))}
          </div>
        )}
      </div>
    </ExerciseScaffold>
  )
}
