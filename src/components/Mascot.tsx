interface Props {
  stage?: number // 0..3 成长阶段
  size?: number
  bounce?: boolean
}

// 简单的吉祥物「亮亮」——一只会随训练成长的护眼小猫头鹰
const FACES = ['🐣', '🦉', '🦅', '🦚']
const STAGE_NAME = ['蛋宝宝', '亮亮', '神气亮亮', '闪耀亮亮']

export default function Mascot({ stage = 0, size = 96, bounce = true }: Props) {
  const s = Math.max(0, Math.min(3, stage))
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex items-center justify-center rounded-full bg-brand-100 ${bounce ? 'animate-floaty' : ''}`}
        style={{ width: size, height: size, fontSize: size * 0.55 }}
        aria-label="吉祥物"
      >
        {FACES[s]}
      </div>
      <span className="mt-1 text-xs text-slate-500">{STAGE_NAME[s]}</span>
    </div>
  )
}
