interface Props {
  value: number // 0..1
  size?: number
  stroke?: number
  color?: string
  trackColor?: string
  label?: string
  sub?: string
}

export default function ProgressRing({
  value,
  size = 120,
  stroke = 10,
  color = '#0ea5e9',
  trackColor = '#e2e8f0',
  label,
  sub,
}: Props) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(1, value))
  const offset = c * (1 - clamped)
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <span className="text-xl font-bold text-slate-800">{label}</span>}
        {sub && <span className="text-xs text-slate-500">{sub}</span>}
      </div>
    </div>
  )
}
