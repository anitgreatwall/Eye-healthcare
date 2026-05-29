import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { useProgressStore, hasTrainedToday } from '../store/progressStore'
import { buildSession, isTrainingDay, daysUntilNextTraining } from '../data/trainingPlan'
import { EXERCISE_BY_ID, DIMENSION_META } from '../data/exerciseCatalog'
import { isSameWeek } from '../lib/date'
import ProgressRing from '../components/ProgressRing'
import Mascot from '../components/Mascot'
import SafetyBanner from '../components/SafetyBanner'

export default function Today() {
  const nav = useNavigate()
  const { settings, profile } = useAppStore()
  const { logs, game } = useProgressStore()

  const ids = buildSession(settings)
  const trainedToday = hasTrainedToday(logs)
  const isToday = isTrainingDay(settings)
  const nextIn = daysUntilNextTraining(settings)

  const weeklyDone = new Set(
    logs.filter((l) => l.completed && isSameWeek(l.date)).map((l) => l.date),
  ).size
  const weeklyGoal = settings.scheduleDays.length || 3

  const totalSec = ids.reduce((s, id) => s + EXERCISE_BY_ID[id].defaultDurationSec, 0)

  return (
    <div className="p-4 space-y-4 pb-6">
      {/* 头部 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">你好，</p>
          <h1 className="text-2xl font-bold text-slate-800">{profile?.name || '小朋友'} 👋</h1>
          <p className="text-xs text-slate-400 mt-0.5">等级 Lv.{game.level} · ⭐ {game.totalStars}</p>
        </div>
        <Mascot stage={game.mascotStage} size={72} />
      </div>

      {/* 本周目标 + 连续 */}
      <div className="card flex items-center justify-around">
        <ProgressRing
          value={weeklyGoal ? weeklyDone / weeklyGoal : 0}
          size={104}
          label={`${weeklyDone}/${weeklyGoal}`}
          sub="本周训练"
          color="#0ea5e9"
        />
        <div className="text-center">
          <p className="text-4xl">🔥</p>
          <p className="text-2xl font-bold text-grass-600">{game.streakDays}</p>
          <p className="text-xs text-slate-500">连续天数</p>
        </div>
      </div>

      {/* 今日训练卡 */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-lg">今日训练</h2>
          <span className="text-xs text-slate-400">约 {Math.round(totalSec / 60)} 分钟 · {ids.length} 项</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ids.map((id) => {
            const ex = EXERCISE_BY_ID[id]
            const dim = DIMENSION_META[ex.dimension]
            return (
              <span key={id} className="chip text-white text-[11px]" style={{ background: dim.color }}>
                {dim.emoji} {ex.name.replace(/（.*）/, '')}
              </span>
            )
          })}
        </div>

        {trainedToday ? (
          <div className="rounded-xl bg-grass-50 border border-grass-200 text-grass-700 px-4 py-3 text-center text-sm">
            ✅ 今天已经完成训练，眼睛辛苦啦！可以再做一次，也可以好好休息。
          </div>
        ) : !isToday ? (
          <div className="rounded-xl bg-slate-50 border border-slate-200 text-slate-600 px-4 py-3 text-center text-sm">
            今天不是训练日{nextIn > 0 ? `，还有 ${nextIn} 天到下次训练` : ''}。想加练也可以点下面开始。
          </div>
        ) : (
          <div className="rounded-xl bg-brand-50 border border-brand-200 text-brand-700 px-4 py-3 text-center text-sm">
            今天是训练日，开始吧！🎯
          </div>
        )}

        <button className="btn-primary w-full text-lg py-3" onClick={() => nav('/session')}>
          {trainedToday ? '再练一次' : '开始训练'}
        </button>
      </div>

      {/* 红青眼镜提示 */}
      {!settings.glassesEnabled && (
        <div className="card bg-rose-50 border-rose-100">
          <p className="text-sm text-rose-700">
            🕶️ 购买<strong>红青(红蓝)立体眼镜</strong>（约几元）后，可在「家长」里解锁更强的
            <strong>融像 / 抗抑制 / 立体视</strong>训练——这正是医生处方「融像训练」的家庭升级版。
          </p>
        </div>
      )}

      <SafetyBanner variant="compact" />
    </div>
  )
}
