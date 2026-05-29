import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { useProgressStore } from '../store/progressStore'
import { buildSession } from '../data/trainingPlan'
import { EXERCISE_BY_ID, DIMENSION_META } from '../data/exerciseCatalog'
import { EXERCISE_COMPONENTS } from '../exercises/registry'
import type { ExerciseFinishResult } from '../exercises/types'
import type { ExerciseResult, SessionLog } from '../lib/types'
import { starsForExercise, totalStars as sumStars, encouragement } from '../lib/scoring'
import { BADGES } from '../lib/achievements'
import { todayKey } from '../lib/date'
import SafetyBanner from '../components/SafetyBanner'
import Mascot from '../components/Mascot'

export default function SessionRunner() {
  const nav = useNavigate()
  const settings = useAppStore((s) => s.settings)
  const saveSession = useProgressStore((s) => s.saveSession)
  const game = useProgressStore((s) => s.game)

  const ids = useMemo(() => buildSession(settings), [settings])
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState<ExerciseResult[]>([])
  const [startedAt] = useState(() => new Date().toISOString())
  const [summary, setSummary] = useState<{ log: SessionLog; newBadges: string[] } | null>(null)
  const [confirmAbort, setConfirmAbort] = useState(false)

  if (ids.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        当前没有可用练习，请到设置中开启相应模块。
        <button className="btn-primary w-full mt-4" onClick={() => nav('/')}>返回</button>
      </div>
    )
  }

  const finalize = (allResults: ExerciseResult[], completed: boolean) => {
    const log: SessionLog = {
      id: `${todayKey()}-${Date.now()}`,
      date: todayKey(),
      startedAt,
      completedAt: new Date().toISOString(),
      results: allResults,
      totalStars: sumStars(allResults),
      completed,
    }
    const newBadges = saveSession(log)
    setSummary({ log, newBadges })
  }

  const handleFinish = (r: ExerciseFinishResult) => {
    const def = EXERCISE_BY_ID[ids[index]]
    const level = settings.difficulty[def.id] ?? 1
    const result: ExerciseResult = {
      exerciseId: def.id,
      durationSec: Math.round(r.durationSec),
      level,
      metricType: def.metric,
      metricValue: r.metricValue,
      stars: starsForExercise(r.completed, level),
      completed: r.completed,
    }
    const next = [...results, result]
    setResults(next)
    if (index >= ids.length - 1) {
      finalize(next, true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  // —— 总结页 ——
  if (summary) {
    const { log, newBadges } = summary
    const completedAll = log.completed
    return (
      <div className="p-5 flex flex-col items-center gap-4 min-h-screen justify-center">
        <Mascot stage={game.mascotStage} />
        <h1 className="text-2xl font-bold text-slate-800">训练完成！</h1>
        <p className="text-slate-600">{encouragement(completedAll, log.totalStars)}</p>
        <div className="card w-full flex items-center justify-around">
          <div className="text-center">
            <p className="text-3xl font-bold text-sun-500">⭐ {log.totalStars}</p>
            <p className="text-xs text-slate-500">获得星星</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-brand-600">{log.results.filter((r) => r.completed).length}</p>
            <p className="text-xs text-slate-500">完成项目</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-grass-600">🔥 {game.streakDays}</p>
            <p className="text-xs text-slate-500">连续天数</p>
          </div>
        </div>
        {newBadges.length > 0 && (
          <div className="card w-full">
            <p className="font-semibold mb-2">🎉 新徽章解锁</p>
            <div className="flex flex-wrap gap-2">
              {newBadges.map((id) => {
                const b = BADGES.find((x) => x.id === id)!
                return (
                  <span key={id} className="chip bg-sun-400 text-white animate-pop">
                    {b.icon} {b.name}
                  </span>
                )
              })}
            </div>
          </div>
        )}
        <SafetyBanner variant="compact" />
        <button className="btn-primary w-full" onClick={() => nav('/')}>回到首页</button>
        <button className="btn-ghost w-full" onClick={() => nav('/progress')}>查看进度</button>
      </div>
    )
  }

  // —— 练习进行中 ——
  const def = EXERCISE_BY_ID[ids[index]]
  const level = settings.difficulty[def.id] ?? 1
  const Comp = EXERCISE_COMPONENTS[def.component]

  return (
    <div className="flex flex-col min-h-screen">
      {/* 顶部进度条 */}
      <div className="sticky top-0 z-20 bg-brand-50/95 backdrop-blur px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <button className="btn-ghost px-3 py-1.5 text-sm" onClick={() => setConfirmAbort(true)}>
            ✕ 结束
          </button>
          <div className="flex-1 flex gap-1">
            {ids.map((id, i) => {
              const c = DIMENSION_META[EXERCISE_BY_ID[id].dimension].color
              return (
                <div
                  key={id}
                  className="h-2 flex-1 rounded-full"
                  style={{ background: i < index ? c : i === index ? c : '#e2e8f0', opacity: i <= index ? 1 : 0.4 }}
                />
              )
            })}
          </div>
          <span className="text-xs text-slate-500 tabular-nums">{index + 1}/{ids.length}</span>
        </div>
      </div>

      <div className="flex-1 p-4">
        <Comp key={def.id} def={def} level={level} pxPerCm={settings.pxPerCm} onFinish={handleFinish} />
      </div>

      {confirmAbort && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full">
            <p className="font-semibold mb-1">结束本次训练？</p>
            <p className="text-sm text-slate-500 mb-4">已完成的部分会被记录。眼睛不舒服时随时可以停。</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-ghost" onClick={() => setConfirmAbort(false)}>继续训练</button>
              <button
                className="btn-primary"
                onClick={() => {
                  if (results.length > 0) finalize(results, false)
                  else nav('/')
                }}
              >
                结束
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
