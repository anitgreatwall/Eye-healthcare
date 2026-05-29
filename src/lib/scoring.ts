import type { ExerciseResult } from './types'

/** 单个练习完成获得的星数：基础 2 + 难度加成，未完成给 1（鼓励参与） */
export function starsForExercise(completed: boolean, level: number): number {
  if (!completed) return 1
  return 2 + Math.max(0, level - 1)
}

export function totalStars(results: ExerciseResult[]): number {
  return results.reduce((s, r) => s + r.stars, 0)
}

/** 鼓励性评语 */
export function encouragement(completedAll: boolean, stars: number): string {
  if (completedAll && stars >= 12) return '太棒了！今天完成得非常出色 🎉'
  if (completedAll) return '完成全部训练，给你点赞 👍'
  if (stars > 0) return '今天也迈出了一步，明天继续加油 💪'
  return '休息好了再来，眼睛舒服最重要 🌿'
}
