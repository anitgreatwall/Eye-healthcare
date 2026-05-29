import SafetyBanner from '../components/SafetyBanner'
import { DIMENSION_META } from '../data/exerciseCatalog'

export default function About() {
  return (
    <div className="p-4 space-y-4 pb-6">
      <h1 className="text-2xl font-bold text-slate-800">关于亮眸训练营</h1>

      <div className="card space-y-2 text-sm text-slate-700 leading-relaxed">
        <p>
          本应用面向<strong>间歇性外斜视</strong>儿童，作为医生院内视功能训练的<strong>家庭辅助</strong>，
          训练内容对应处方的三大方向并补充抗抑制与立体视维持：
        </p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(DIMENSION_META).map(([k, v]) => (
            <span key={k} className="chip text-white" style={{ background: v.color }}>{v.emoji} {v.label}</span>
          ))}
        </div>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>集合</strong>：笔尖推进改善集合近点、Brock 线、集合追踪</li>
          <li><strong>融像</strong>：自由空间融像、（解锁后）红青可变矢量图，逐步扩大正融像性集合范围</li>
          <li><strong>调节</strong>：Hart 远近字母表、反转拍灵敏度</li>
          <li><strong>抗抑制 / 立体视</strong>：红青分视游戏、随机点立体图（需红青眼镜）</li>
          <li><strong>放松</strong>：20-20-20 远眺，呼应医生护眼告知</li>
        </ul>
      </div>

      <div className="card text-sm text-slate-600 space-y-1">
        <p className="font-semibold text-slate-700">设计依据（循证）</p>
        <p className="text-xs leading-relaxed">
          间歇性外斜视的训练核心：消除抑制、扩大融合性集合范围、改善集合近点、训练调节灵敏度、维持立体视。参考：
          Vision therapy for intermittent exotropia: A case series（Journal of Optometry / PMC8258130）；
          Effect of vision therapy on fusional vergences in intermittent exotropia（MedCrave AOVS）；
          Intermittent Exotropia（EyeWiki）；应用同视机检查评估间歇性外斜视儿童双眼视功能（解放军总医院学报）。
        </p>
      </div>

      <SafetyBanner variant="full" />

      <p className="text-center text-xs text-slate-400">数据仅存于本机 · 非医疗器械 · v1.0</p>
    </div>
  )
}
