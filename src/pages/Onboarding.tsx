import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore, DEFAULT_PROFILE } from '../store/appStore'
import { todayKey } from '../lib/date'
import SafetyBanner from '../components/SafetyBanner'
import CalibrationCard from '../components/CalibrationCard'
import Mascot from '../components/Mascot'
import type { Profile } from '../lib/types'

export default function Onboarding() {
  const nav = useNavigate()
  const { setProfile, updateSettings, agreeSafety, completeOnboarding, settings } = useAppStore()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Profile>({ ...DEFAULT_PROFILE })
  const [agreed, setAgreed] = useState(false)
  const [pxPerCm, setPxPerCm] = useState(settings.pxPerCm)

  const finish = () => {
    setProfile({ ...form, createdAt: todayKey() })
    updateSettings({ pxPerCm })
    agreeSafety()
    completeOnboarding()
    nav('/')
  }

  return (
    <div className="p-5 min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col">
        {step === 0 && (
          <div className="flex flex-col items-center justify-center flex-1 text-center gap-4">
            <Mascot stage={1} size={120} />
            <h1 className="text-2xl font-bold text-slate-800">欢迎来到亮眸训练营</h1>
            <p className="text-slate-600 leading-relaxed">
              这是一个帮助你在家配合医生做<strong>视功能训练</strong>的小伙伴。
              我们一起练习<strong>集合、融像、调节</strong>，让双眼配合得更好、外斜更少出现。
            </p>
            <p className="text-sm text-slate-400">每周按医生建议训练 3 次，每次约 15–25 分钟。</p>
            <button className="btn-primary w-full" onClick={() => setStep(1)}>开始设置</button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4 flex-1">
            <h2 className="text-xl font-bold">使用须知</h2>
            <SafetyBanner variant="full" />
            <label className="flex items-start gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
              <span>我已阅读并理解上述须知，并将在家长陪同/监督下使用，遵医嘱坚持院内训练与复查。</span>
            </label>
            <div className="mt-auto grid grid-cols-2 gap-2">
              <button className="btn-ghost" onClick={() => setStep(0)}>上一步</button>
              <button className="btn-primary" disabled={!agreed} onClick={() => setStep(2)}>同意并继续</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-3 flex-1">
            <h2 className="text-xl font-bold">建立小档案</h2>
            <p className="text-xs text-slate-500">以下基线已按病历预填，家长可调整（用于进度对比和给医生的报告）。</p>
            <label className="block">
              <span className="text-xs text-slate-500">名字 / 昵称</span>
              <input
                className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2.5"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="如 宾宾"
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs text-slate-500">年龄</span>
                <input
                  type="number"
                  className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2.5"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">斜角(度)</span>
                <input
                  type="number"
                  className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2.5"
                  value={form.deviationAngle}
                  onChange={(e) => setForm({ ...form, deviationAngle: Number(e.target.value) })}
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="block">
                <span className="text-xs text-slate-500">融合范围最小(度)</span>
                <input
                  type="number"
                  className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2.5"
                  value={form.baselineFusionMin}
                  onChange={(e) => setForm({ ...form, baselineFusionMin: Number(e.target.value) })}
                />
              </label>
              <label className="block">
                <span className="text-xs text-slate-500">融合范围最大(度)</span>
                <input
                  type="number"
                  className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2.5"
                  value={form.baselineFusionMax}
                  onChange={(e) => setForm({ ...form, baselineFusionMax: Number(e.target.value) })}
                />
              </label>
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2">
              <button className="btn-ghost" onClick={() => setStep(1)}>上一步</button>
              <button className="btn-primary" onClick={() => setStep(3)}>下一步</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4 flex-1">
            <h2 className="text-xl font-bold">屏幕校准</h2>
            <p className="text-xs text-slate-500">校准后，融像/集合练习的角度更准确（也可稍后在设置里做）。</p>
            <div className="card">
              <CalibrationCard pxPerCm={pxPerCm} onChange={setPxPerCm} />
            </div>
            <div className="mt-auto grid grid-cols-2 gap-2">
              <button className="btn-ghost" onClick={() => setStep(2)}>上一步</button>
              <button className="btn-primary" onClick={finish}>完成，开始训练</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
