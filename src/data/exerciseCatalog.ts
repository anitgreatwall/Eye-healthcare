import type { Dimension, ExerciseDef } from '../lib/types'

// 训练维度元信息
export const DIMENSION_META: Record<
  Dimension,
  { label: string; color: string; emoji: string }
> = {
  warmup: { label: '热身', color: '#a78bfa', emoji: '🤸' },
  convergence: { label: '集合', color: '#0ea5e9', emoji: '🎯' },
  fusion: { label: '融像', color: '#22c55e', emoji: '🔗' },
  accommodation: { label: '调节', color: '#f59e0b', emoji: '🔭' },
  antisuppression: { label: '抗抑制', color: '#ef4444', emoji: '👁️' },
  stereo: { label: '立体视', color: '#ec4899', emoji: '🧊' },
  relax: { label: '放松', color: '#14b8a6', emoji: '🌿' },
}

// 临床练习库——严格对应处方：集合 / 融像 / 调节 + 抗抑制 + 立体视 + 放松
// 设计依据：扩大正融像性集合范围、改善集合近点、训练调节灵敏度、消除抑制、维持立体视
export const EXERCISES: ExerciseDef[] = [
  // —— 热身 ——
  {
    id: 'saccades',
    name: '眼球热身（扫视与追随）',
    dimension: 'warmup',
    component: 'SaccadesPursuit',
    requiresGlasses: false,
    defaultDurationSec: 90,
    metric: 'completion',
    goal: '唤醒眼外肌，为后续集合/融像训练做准备',
    instructions: [
      '头部保持不动，只用眼睛跟随屏幕上的小球。',
      '先做「追随」：眼睛平滑地跟着慢慢移动的小球。',
      '再做「扫视」：小球在两侧跳动，眼睛迅速准确地看过去。',
      '全程保持呼吸自然，不要眯眼。',
    ],
    tips: ['头不要转动，只动眼睛', '看不清或头晕就暂停'],
    maxLevel: 3,
  },

  // —— 集合 ——
  {
    id: 'pencil_pushup',
    name: '笔尖推进（集合近点）',
    dimension: 'convergence',
    component: 'PencilPushup',
    requiresGlasses: false,
    equipment: '一支笔（或筷子，顶端贴个小贴纸更好）',
    defaultDurationSec: 180,
    metric: 'npc_cm',
    goal: '改善集合近点(NPC)，训练双眼向内集合的能力',
    instructions: [
      '把笔竖直举在眼前约一臂远，盯住笔尖的小字/贴纸。',
      '保持单个清晰的像，缓慢把笔向鼻尖方向移近。',
      '当笔尖「变成两个」时停下，这就是你的破裂点。',
      '量一下笔尖到鼻梁的距离（厘米），填进 App，再移回重复。',
    ],
    tips: ['目标：破裂点距离越来越近（越小越好）', '出现持续复视、酸胀就休息'],
    maxLevel: 3,
  },
  {
    id: 'brock_string',
    name: 'Brock 线（布洛克线）',
    dimension: 'convergence',
    component: 'BrockString',
    requiresGlasses: false,
    equipment: '一根约 1.5 米的绳子，串 3 颗不同颜色的珠子',
    defaultDurationSec: 180,
    metric: 'completion',
    goal: '建立正确集合定位，利用生理性复视消除抑制',
    instructions: [
      '把绳子一端固定，另一端贴在鼻尖下方。',
      '看最近的珠子：应看到珠子单个清晰，绳子在它后方分成「X / V」两条。',
      '依次看中间、最远的珠子，每颗停留几秒。',
      '跟随屏幕节拍，在三颗珠子之间来回切换注视。',
    ],
    tips: ['两条绳子在所看珠子处交叉，说明双眼都在工作', '若有一条绳消失，提示该眼被抑制，眨眼放松再看'],
    maxLevel: 3,
  },
  {
    id: 'convergence_target',
    name: '集合追踪（由远及近）',
    dimension: 'convergence',
    component: 'ConvergenceTarget',
    requiresGlasses: false,
    defaultDurationSec: 150,
    metric: 'completion',
    goal: '在屏幕上训练集合与远近跳跃注视',
    instructions: [
      '把设备举到约一臂远，正对眼睛。',
      '目标会由远（小）变近（大），用双眼持续盯住它保持单一清晰。',
      '出现「远—近跳跃」时，迅速在两个目标间切换并看清。',
      '尽量让目标始终是「一个」而不是「两个」。',
    ],
    tips: ['坐姿端正，屏幕与眼睛同高', '感到吃力可在家长后台调低难度'],
    maxLevel: 4,
  },

  // —— 融像（免眼镜：自由空间融像）——
  {
    id: 'free_fusion',
    name: '自由空间融像（扩展集合范围）',
    dimension: 'fusion',
    component: 'FreeFusion',
    requiresGlasses: false,
    defaultDurationSec: 210,
    metric: 'separation_deg',
    goal: '用交叉/平行融合扩大正融像性集合范围（直击 −5°~+6° 偏窄）',
    instructions: [
      '屏幕上有两幅几乎相同的图，中间有一个对齐点。',
      '「交叉法」：稍微对眼（看近），让两幅图重叠成中间第三幅。',
      '重叠后图中会出现立体/对齐的细节，保持住几秒。',
      '成功后两幅图分离会逐步加大，挑战更大的集合需求。',
    ],
    tips: ['重叠成功并能看清细节才算达成，App 会记录达到的分离角', '看不出第三幅图很正常，慢慢练；不适即停'],
    maxLevel: 6,
  },

  // —— 调节 ——
  {
    id: 'hart_chart',
    name: 'Hart 表（远近字母表）',
    dimension: 'accommodation',
    component: 'HartChart',
    requiresGlasses: false,
    equipment: '可选：把远表打印贴到 3 米外的墙上效果更好',
    defaultDurationSec: 180,
    metric: 'rows_cleared',
    goal: '训练调节的灵敏度与远近切换能力',
    instructions: [
      '近表拿在约 40 厘米处，远表看 3 米外（或屏幕上的远表）。',
      '先读近表第一行的字母，再抬头读远表同一行。',
      '近—远交替，一行一行往下读，读对一行算清一行。',
      '在限定时间内尽量多清几行。',
    ],
    tips: ['每次切换都要把字「看清楚」再读', '读得越来越快说明调节更灵活了'],
    maxLevel: 3,
  },
  {
    id: 'flipper',
    name: '反转拍计时（调节灵敏度）',
    dimension: 'accommodation',
    component: 'FlipperTimer',
    requiresGlasses: false,
    equipment: '±2.00D 反转拍（翻转镜），需另行购买',
    defaultDurationSec: 120,
    metric: 'facility_cpm',
    goal: '提升调节灵敏度（每分钟看清的翻转周期数 cpm）',
    instructions: [
      '把一段小字放在约 40 厘米处。',
      '先用「+」镜片看，看清后翻到「−」镜片再看清，这算 1 个周期。',
      '跟随屏幕节拍尽快交替翻转，每看清一次点一下计数。',
      '一分钟后 App 会算出你的 cpm（周期/分钟）。',
    ],
    tips: ['必须真正看清才翻转，不要硬翻', '没有反转拍可先跳过，在设置里关闭'],
    maxLevel: 3,
  },

  // —— 放松 ——
  {
    id: 'distance_gaze',
    name: '20-20-20 远眺放松',
    dimension: 'relax',
    component: 'DistanceGaze',
    requiresGlasses: false,
    defaultDurationSec: 60,
    metric: 'completion',
    goal: '放松睫状肌，呼应医生「每 20 分钟看 6 米外 20 秒」的告知',
    instructions: [
      '走到窗边，看向至少 6 米外的远处（树、楼、天空）。',
      '跟随屏幕倒计时，持续远眺并放松。',
      '配合慢呼吸，眨眨眼，让眼睛休息。',
    ],
    tips: ['白天尽量到户外远眺，每天户外≥2 小时更好'],
    maxLevel: 1,
  },

  // —— 红青/双眼分视（默认锁定，买到红青眼镜后解锁）——
  {
    id: 'tranaglyph',
    name: '红青可变矢量融像',
    dimension: 'fusion',
    component: 'Tranaglyph',
    requiresGlasses: true,
    equipment: '红青(红蓝)立体眼镜',
    defaultDurationSec: 180,
    metric: 'separation_deg',
    goal: '用红青分视逐步加大 base-out 需求，强力扩展正融像性集合',
    instructions: [
      '戴上红青眼镜（红色镜片在左眼）。',
      '屏幕上红、青两幅图会逐渐分开，努力把它们融合成一幅清晰的图。',
      '保持融合，App 会一点点加大分离，挑战更大的集合范围。',
      '若图「裂开」成两个，稍微对眼把它们重新合上。',
    ],
    tips: ['这是医生处方「融像训练」最对应的家庭练习', '持续复视/头痛立即停止'],
    maxLevel: 8,
  },
  {
    id: 'anti_suppression',
    name: '抗抑制小游戏',
    dimension: 'antisuppression',
    component: 'AntiSuppressionGame',
    requiresGlasses: true,
    equipment: '红青(红蓝)立体眼镜',
    defaultDurationSec: 150,
    metric: 'completion',
    goal: '让双眼同时工作，打破斜视眼被抑制的状态',
    instructions: [
      '戴上红青眼镜。',
      '屏幕上有的图案只有左眼能看到（红），有的只有右眼能看到（青）。',
      '完成任务需要同时用到两只眼看到的信息（如把红色小球放进青色框）。',
      '如果某种颜色「看不见」，提示该眼被抑制，眨眼放松再试。',
    ],
    tips: ['两种颜色都要能看见才说明双眼同时在用'],
    maxLevel: 4,
  },
  {
    id: 'stereogram',
    name: '随机点立体视',
    dimension: 'stereo',
    component: 'Stereogram',
    requiresGlasses: true,
    equipment: '红青(红蓝)立体眼镜',
    defaultDurationSec: 150,
    metric: 'completion',
    goal: '维持并提升立体视（病历显示立体视存在，要保护好）',
    instructions: [
      '戴上红青眼镜。',
      '画面看似杂乱的点，戴镜后会「浮出」一个隐藏的形状。',
      '找出并点选浮出的图形，找对得分。',
      '难度提高时浮出的深度变浅，更需要精细立体视。',
    ],
    tips: ['找不到先放松眼睛，别用力眯眼'],
    maxLevel: 4,
  },
]

export const EXERCISE_BY_ID: Record<string, ExerciseDef> = Object.fromEntries(
  EXERCISES.map((e) => [e.id, e]),
)
