// 训练维度，对应医生处方：集合 / 融像 / 调节，外加热身、抗抑制、放松
export type Dimension =
  | 'warmup' // 热身（眼动）
  | 'convergence' // 集合
  | 'fusion' // 融像
  | 'accommodation' // 调节
  | 'antisuppression' // 抗抑制（多需红青眼镜）
  | 'stereo' // 立体视（多需红青眼镜）
  | 'relax' // 放松（20-20-20）

// 练习记录的指标类型
export type MetricType =
  | 'npc_cm' // 集合近点破裂距离（厘米，越小越好）
  | 'separation_deg' // 自由空间融像达成的分离角（度，越大越好）
  | 'facility_cpm' // 调节灵敏度（周期/分钟，越大越好）
  | 'rows_cleared' // 清行数
  | 'completion' // 仅完成度

export interface ExerciseDef {
  id: string
  name: string
  dimension: Dimension
  /** 渲染该练习的组件 key */
  component: string
  /** 是否需要红青(红蓝)立体眼镜 */
  requiresGlasses: boolean
  /** 需要的物理器材说明，无则空 */
  equipment?: string
  /** 默认时长（秒） */
  defaultDurationSec: number
  /** 该练习记录的核心指标 */
  metric: MetricType
  /** 一句话目标 */
  goal: string
  /** 分步图文说明 */
  instructions: string[]
  /** 安全/要点提示 */
  tips?: string[]
  /** 难度级数（1..maxLevel） */
  maxLevel: number
}

export interface Profile {
  name: string
  age: number
  gender: 'male' | 'female'
  /** 基线融合范围（度），来自同视机：-5 ~ +6 */
  baselineFusionMin: number
  baselineFusionMax: number
  /** 斜角（度），同视机 -9 */
  deviationAngle: number
  /** 基线集合近点（厘米），可选 */
  baselineNpcCm?: number
  createdAt: string
}

export interface Settings {
  /** 训练日：0=周日 ... 6=周六；默认每周三天 */
  scheduleDays: number[]
  /** 单次会话目标时长（分钟） */
  sessionMinutes: number
  /** 是否已拥有红青眼镜并解锁双眼分视模块 */
  glassesEnabled: boolean
  /** 是否拥有 ±2.00 反转拍 */
  flipperEnabled: boolean
  /** 家长 PIN（4 位），保护后台与设置 */
  parentPin: string
  /** 屏幕校准：每厘米像素数（0 表示未校准） */
  pxPerCm: number
  /** 各练习难度等级 map: exerciseId -> level */
  difficulty: Record<string, number>
  /** 训练日提醒 */
  reminderEnabled: boolean
  reminderTime: string // "HH:mm"
}

export interface ExerciseResult {
  exerciseId: string
  durationSec: number
  level: number
  metricType: MetricType
  metricValue?: number
  stars: number
  completed: boolean
}

export interface SessionLog {
  id: string
  /** 日期 YYYY-MM-DD（本地） */
  date: string
  startedAt: string
  completedAt: string
  results: ExerciseResult[]
  totalStars: number
  completed: boolean
}

export interface Measurement {
  date: string // YYYY-MM-DD
  type: MetricType
  value: number
}

export interface GameState {
  totalStars: number
  level: number
  streakDays: number
  lastTrainingDate: string | null
  badges: string[]
  /** 已点亮的吉祥物成长阶段 0..3 */
  mascotStage: number
}
