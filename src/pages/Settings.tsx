import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/appStore'
import CalibrationCard from '../components/CalibrationCard'

export default function Settings() {
  const nav = useNavigate()
  const { settings, updateSettings } = useAppStore()
  const [pxPerCm, setPxPerCm] = useState(settings.pxPerCm)
  const [saved, setSaved] = useState(false)

  return (
    <div className="p-4 space-y-4 pb-6">
      <div className="flex items-center gap-2">
        <button className="btn-ghost px-3 py-1.5" onClick={() => nav(-1)}>←</button>
        <h1 className="text-2xl font-bold text-slate-800">屏幕校准</h1>
      </div>

      <div className="card">
        <CalibrationCard pxPerCm={pxPerCm} onChange={setPxPerCm} />
      </div>

      <p className="text-sm text-slate-500">
        校准让「自由空间融像」「红青矢量融像」等练习的分离角度换算更准确，从而记录更可靠的进度。
      </p>

      <button
        className="btn-primary w-full"
        onClick={() => {
          updateSettings({ pxPerCm })
          setSaved(true)
          setTimeout(() => setSaved(false), 1500)
        }}
      >
        {saved ? '已保存 ✓' : '保存校准'}
      </button>
    </div>
  )
}
