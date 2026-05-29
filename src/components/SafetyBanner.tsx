interface Props {
  variant?: 'full' | 'compact'
}

export default function SafetyBanner({ variant = 'compact' }: Props) {
  if (variant === 'compact') {
    return (
      <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 leading-relaxed">
        ⚠️ 出现<strong>持续复视、头痛、头晕、恶心或眼痛</strong>请立即停止并告诉家长。本应用是家庭辅助，不替代医生院内训练与复查。
      </div>
    )
  }
  return (
    <div className="rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm px-4 py-3 leading-relaxed space-y-1">
      <p className="font-semibold">使用须知与安全提示</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>本应用是<strong>临床训练的家庭辅助</strong>，不能替代医生的院内视功能训练与定期复查。</li>
        <li>应用内自测数值（集合近点、融像分离量等）为家庭参考，<strong>不是临床诊断</strong>。</li>
        <li>训练中出现<strong>持续复视、头痛、头晕、恶心、眼痛</strong>，请立即停止并咨询医生。</li>
        <li>建议家长陪同未成年人使用；保持光线充足、坐姿端正、屏幕与眼同高。</li>
        <li>所有数据仅保存在本机，不上传任何服务器。</li>
        <li>本应用非医疗器械。</li>
      </ul>
    </div>
  )
}
