import { useMemo, useRef, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { useAppStore } from '../store/appStore'
import { useProgressStore } from '../store/progressStore'
import { BADGES } from '../lib/achievements'
import { exportElementToPdf } from '../lib/pdfReport'
import type { Measurement, MetricType } from '../lib/types'

function bestByDay(ms: Measurement[], type: MetricType, mode: 'min' | 'max') {
  const map = new Map<string, number>()
  for (const m of ms) {
    if (m.type !== type) continue
    const cur = map.get(m.date)
    if (cur == null) map.set(m.date, m.value)
    else map.set(m.date, mode === 'min' ? Math.min(cur, m.value) : Math.max(cur, m.value))
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, value]) => ({ date: date.slice(5), value: Number(value.toFixed(1)) }))
}

function Chart({ title, data, color, unit }: { title: string; data: { date: string; value: number }[]; color: string; unit: string }) {
  if (data.length === 0) return null
  return (
    <div className="card">
      <p className="font-semibold text-sm mb-2">{title} <span className="text-slate-400 font-normal">（{unit}）</span></p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function Progress() {
  const { profile } = useAppStore()
  const { logs, measurements, game } = useProgressStore()
  const reportRef = useRef<HTMLDivElement>(null)
  const [exporting, setExporting] = useState(false)

  const completedCount = logs.filter((l) => l.completed).length
  const npc = useMemo(() => bestByDay(measurements, 'npc_cm', 'min'), [measurements])
  const sep = useMemo(() => bestByDay(measurements, 'separation_deg', 'max'), [measurements])
  const facility = useMemo(() => bestByDay(measurements, 'facility_cpm', 'max'), [measurements])

  const doExport = async () => {
    if (!reportRef.current) return
    setExporting(true)
    try {
      await exportElementToPdf(reportRef.current, `视功能训练报告_${profile?.name || ''}_${new Date().toISOString().slice(0, 10)}.pdf`)
    } finally {
      setExporting(false)
    }
  }

  const unlocked = new Set(game.badges)

  return (
    <div className="p-4 space-y-4 pb-6">
      <h1 className="text-2xl font-bold text-slate-800">训练进度</h1>

      {/* 可导出的报告区 */}
      <div ref={reportRef} className="space-y-4 bg-brand-50 p-1">
        <div className="card">
          <p className="font-bold text-base mb-1">视功能训练 · 家庭训练记录</p>
          <p className="text-xs text-slate-500 mb-3">
            {profile?.name || '—'} · {profile?.age ?? '—'}岁 · 诊断：间歇性外斜视 + 屈光不正 · 生成日期 {new Date().toISOString().slice(0, 10)}
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-brand-100 py-3">
              <p className="text-2xl font-bold text-brand-700">{completedCount}</p>
              <p className="text-xs text-slate-500">完成训练次数</p>
            </div>
            <div className="rounded-xl bg-grass-50 py-3">
              <p className="text-2xl font-bold text-grass-600">{game.streakDays}</p>
              <p className="text-xs text-slate-500">当前连续天数</p>
            </div>
            <div className="rounded-xl bg-sun-400/20 py-3">
              <p className="text-2xl font-bold text-sun-500">{game.totalStars}</p>
              <p className="text-xs text-slate-500">累计星星</p>
            </div>
          </div>
          {profile && (
            <p className="text-xs text-slate-500 mt-3">
              基线（同视机）：斜角 {profile.deviationAngle}° · 融合范围 {profile.baselineFusionMin}°~{profile.baselineFusionMax}°
            </p>
          )}
        </div>

        <Chart title="集合近点 NPC（越小越好）" data={npc} color="#0ea5e9" unit="厘米" />
        <Chart title="自由空间/红青融像达成分离角（越大越好）" data={sep} color="#22c55e" unit="度" />
        <Chart title="调节灵敏度（越大越好）" data={facility} color="#f59e0b" unit="cpm" />

        {npc.length === 0 && sep.length === 0 && facility.length === 0 && (
          <div className="card text-center text-slate-400 text-sm py-8">
            还没有可绘制的数据，完成几次训练后这里会出现趋势曲线。
          </div>
        )}

        <p className="text-[10px] text-slate-400 px-1">
          说明：本表数值为家庭自测，仅供参考，非临床诊断；请以医生院内检查为准。
        </p>
      </div>

      <button className="btn-primary w-full" onClick={doExport} disabled={exporting}>
        {exporting ? '正在生成…' : '📄 导出训练报告 PDF（给医生复查看）'}
      </button>

      {/* 徽章 */}
      <div className="card">
        <p className="font-semibold mb-3">我的徽章</p>
        <div className="grid grid-cols-3 gap-3">
          {BADGES.map((b) => {
            const on = unlocked.has(b.id)
            return (
              <div key={b.id} className={`flex flex-col items-center text-center p-2 rounded-xl ${on ? 'bg-sun-400/10' : 'bg-slate-50 opacity-50'}`}>
                <span className="text-3xl">{on ? b.icon : '🔒'}</span>
                <span className="text-xs font-medium mt-1">{b.name}</span>
                <span className="text-[10px] text-slate-400">{b.desc}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
