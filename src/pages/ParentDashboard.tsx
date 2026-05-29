import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import { useProgressStore } from '../store/progressStore'
import { EXERCISES, DIMENSION_META } from '../data/exerciseCatalog'
import { WEEKDAY_LABELS } from '../lib/date'

function PinGate({ onPass }: { onPass: () => void }) {
  const { settings, updateSettings } = useAppStore()
  const hasPin = settings.parentPin.length === 4
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [err, setErr] = useState('')

  if (!hasPin) {
    return (
      <div className="p-5 space-y-3">
        <h1 className="text-xl font-bold">设置家长 PIN</h1>
        <p className="text-sm text-slate-500">用于保护训练设置，请设置 4 位数字密码。</p>
        <input className="w-full rounded-xl border px-3 py-2.5 tracking-widest text-center text-lg" inputMode="numeric" maxLength={4} value={a} onChange={(e) => setA(e.target.value.replace(/\D/g, ''))} placeholder="输入 4 位 PIN" />
        <input className="w-full rounded-xl border px-3 py-2.5 tracking-widest text-center text-lg" inputMode="numeric" maxLength={4} value={b} onChange={(e) => setB(e.target.value.replace(/\D/g, ''))} placeholder="再输一次" />
        {err && <p className="text-sm text-red-500">{err}</p>}
        <button className="btn-primary w-full" onClick={() => {
          if (a.length !== 4) return setErr('请输入 4 位数字')
          if (a !== b) return setErr('两次输入不一致')
          updateSettings({ parentPin: a })
          onPass()
        }}>保存并进入</button>
      </div>
    )
  }

  return (
    <div className="p-5 space-y-3">
      <h1 className="text-xl font-bold">家长入口</h1>
      <p className="text-sm text-slate-500">请输入家长 PIN。</p>
      <input className="w-full rounded-xl border px-3 py-2.5 tracking-widest text-center text-lg" inputMode="numeric" maxLength={4} value={a} onChange={(e) => setA(e.target.value.replace(/\D/g, ''))} placeholder="4 位 PIN" />
      {err && <p className="text-sm text-red-500">{err}</p>}
      <button className="btn-primary w-full" onClick={() => (a === settings.parentPin ? onPass() : setErr('PIN 不正确'))}>进入</button>
    </div>
  )
}

export default function ParentDashboard() {
  const nav = useNavigate()
  const { settings, updateSettings, setDifficulty, profile, setProfile, resetAll } = useAppStore()
  const { logs, clearAll } = useProgressStore()
  const [unlocked, setUnlocked] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  if (!unlocked) return <PinGate onPass={() => setUnlocked(true)} />

  const toggleDay = (d: number) => {
    const has = settings.scheduleDays.includes(d)
    updateSettings({
      scheduleDays: has ? settings.scheduleDays.filter((x) => x !== d) : [...settings.scheduleDays, d].sort(),
    })
  }

  return (
    <div className="p-4 space-y-4 pb-6">
      <h1 className="text-2xl font-bold text-slate-800">家长后台</h1>

      {/* 训练计划 */}
      <div className="card space-y-3">
        <p className="font-semibold">训练计划</p>
        <div>
          <p className="text-xs text-slate-500 mb-1">训练日（医生建议每周 3 次）</p>
          <div className="flex gap-1.5">
            {WEEKDAY_LABELS.map((lbl, d) => (
              <button key={d} onClick={() => toggleDay(d)} className={`flex-1 py-2 rounded-lg text-sm ${settings.scheduleDays.includes(d) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {lbl}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center justify-between">
          <span className="text-sm">单次目标时长</span>
          <select className="rounded-lg border px-2 py-1.5 text-sm" value={settings.sessionMinutes} onChange={(e) => updateSettings({ sessionMinutes: Number(e.target.value) })}>
            {[10, 15, 20, 25, 30].map((m) => <option key={m} value={m}>{m} 分钟</option>)}
          </select>
        </label>
      </div>

      {/* 模块开关 */}
      <div className="card space-y-3">
        <p className="font-semibold">器材与模块</p>
        <label className="flex items-center justify-between text-sm">
          <span>已有红青(红蓝)眼镜 → 解锁双眼分视训练</span>
          <input type="checkbox" className="w-5 h-5" checked={settings.glassesEnabled} onChange={(e) => updateSettings({ glassesEnabled: e.target.checked })} />
        </label>
        <label className="flex items-center justify-between text-sm">
          <span>已有 ±2.00 反转拍 → 加入调节灵敏度训练</span>
          <input type="checkbox" className="w-5 h-5" checked={settings.flipperEnabled} onChange={(e) => updateSettings({ flipperEnabled: e.target.checked })} />
        </label>
      </div>

      {/* 难度 */}
      <div className="card space-y-3">
        <p className="font-semibold">各练习难度</p>
        {EXERCISES.filter((e) => !e.requiresGlasses || settings.glassesEnabled).map((e) => {
          const lvl = settings.difficulty[e.id] ?? 1
          const dim = DIMENSION_META[e.dimension]
          return (
            <div key={e.id} className="flex items-center gap-2">
              <span className="chip text-white text-[10px] shrink-0" style={{ background: dim.color }}>{dim.label}</span>
              <span className="text-sm flex-1 truncate">{e.name.replace(/（.*）/, '')}</span>
              <input type="range" min={1} max={e.maxLevel} value={lvl} onChange={(ev) => setDifficulty(e.id, Number(ev.target.value))} className="w-24" />
              <span className="text-xs text-slate-500 w-8 text-right">{lvl}/{e.maxLevel}</span>
            </div>
          )
        })}
      </div>

      {/* 提醒 */}
      <div className="card space-y-3">
        <p className="font-semibold">训练提醒</p>
        <label className="flex items-center justify-between text-sm">
          <span>训练日提醒</span>
          <input type="checkbox" className="w-5 h-5" checked={settings.reminderEnabled} onChange={(e) => updateSettings({ reminderEnabled: e.target.checked })} />
        </label>
        {settings.reminderEnabled && (
          <label className="flex items-center justify-between text-sm">
            <span>提醒时间</span>
            <input type="time" className="rounded-lg border px-2 py-1.5" value={settings.reminderTime} onChange={(e) => updateSettings({ reminderTime: e.target.value })} />
          </label>
        )}
        <p className="text-[11px] text-slate-400">提示：网页提醒依赖浏览器/系统通知权限，安装为应用后更稳定；建议家长同时口头督促。</p>
      </div>

      {/* 基线编辑 */}
      {profile && (
        <div className="card space-y-2">
          <p className="font-semibold">基线数据</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <label className="block">
              <span className="text-xs text-slate-500">斜角(度)</span>
              <input type="number" className="w-full mt-1 rounded-lg border px-2 py-1.5" value={profile.deviationAngle} onChange={(e) => setProfile({ ...profile, deviationAngle: Number(e.target.value) })} />
            </label>
            <label className="block">
              <span className="text-xs text-slate-500">基线 NPC(cm)</span>
              <input type="number" className="w-full mt-1 rounded-lg border px-2 py-1.5" value={profile.baselineNpcCm ?? ''} onChange={(e) => setProfile({ ...profile, baselineNpcCm: e.target.value ? Number(e.target.value) : undefined })} />
            </label>
          </div>
        </div>
      )}

      {/* 记录 */}
      <div className="card">
        <p className="font-semibold mb-2">最近训练记录（{logs.length} 次）</p>
        <div className="max-h-48 overflow-auto divide-y divide-slate-100">
          {logs.slice().reverse().slice(0, 20).map((l) => (
            <div key={l.id} className="flex items-center justify-between py-1.5 text-sm">
              <span>{l.date} {l.completed ? '✅' : '⏸'}</span>
              <span className="text-slate-400">{l.results.filter((r) => r.completed).length} 项 · ⭐{l.totalStars}</span>
            </div>
          ))}
          {logs.length === 0 && <p className="text-sm text-slate-400 py-2">暂无记录</p>}
        </div>
      </div>

      <button className="btn-ghost w-full" onClick={() => nav('/settings')}>🛠 屏幕校准</button>

      <button className="btn-ghost w-full text-red-500" onClick={() => setConfirmReset(true)}>清除所有数据</button>

      {confirmReset && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full">
            <p className="font-semibold mb-1">确定清除所有数据？</p>
            <p className="text-sm text-slate-500 mb-4">将删除档案、设置与全部训练记录，且不可恢复。</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="btn-ghost" onClick={() => setConfirmReset(false)}>取消</button>
              <button className="btn-primary bg-red-500 hover:bg-red-600" onClick={() => { clearAll(); resetAll(); nav('/onboarding') }}>确定清除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
