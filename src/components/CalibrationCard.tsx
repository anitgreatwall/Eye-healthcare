import { useState } from 'react'
import { CREDIT_CARD_WIDTH_MM } from '../lib/sizing'

interface Props {
  pxPerCm: number
  onChange: (pxPerCm: number) => void
}

// 屏幕校准：把屏上方块调到与真实银行卡（宽 85.6mm）等宽
export default function CalibrationCard({ pxPerCm, onChange }: Props) {
  const initialWidth = pxPerCm > 0 ? pxPerCm * (CREDIT_CARD_WIDTH_MM / 10) : 320
  const [widthPx, setWidthPx] = useState(initialWidth)

  const apply = (w: number) => {
    setWidthPx(w)
    const ppc = w / (CREDIT_CARD_WIDTH_MM / 10) // px per cm
    onChange(ppc)
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-600">
        拿一张银行卡/身份证贴到屏幕上，拖动滑块让下面的蓝框宽度<strong>正好和卡片一样宽</strong>。
      </p>
      <div className="flex justify-center">
        <div
          className="h-[54px] rounded-lg bg-brand-400 border-2 border-brand-600 flex items-center justify-center text-white text-xs"
          style={{ width: widthPx }}
        >
          ← 对齐银行卡宽度 →
        </div>
      </div>
      <input
        type="range"
        min={150}
        max={520}
        value={widthPx}
        onChange={(e) => apply(Number(e.target.value))}
        className="w-full"
      />
      <p className="text-center text-xs text-slate-500">
        当前校准：每厘米 ≈ {(widthPx / (CREDIT_CARD_WIDTH_MM / 10)).toFixed(1)} 像素
      </p>
    </div>
  )
}
