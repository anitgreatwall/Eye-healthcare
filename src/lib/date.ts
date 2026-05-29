// 本地日期工具（统一使用本机时区，YYYY-MM-DD）

export function todayKey(d: Date = new Date()): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function parseKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysBetween(a: string, b: string): number {
  const da = parseKey(a).getTime()
  const db = parseKey(b).getTime()
  return Math.round((db - da) / 86400000)
}

/** 本周一的日期 key（周一为一周起点） */
export function startOfWeekKey(d: Date = new Date()): string {
  const day = d.getDay() // 0=日..6=六
  const diff = day === 0 ? 6 : day - 1
  const monday = new Date(d)
  monday.setDate(d.getDate() - diff)
  return todayKey(monday)
}

export const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']

export function isSameWeek(dateKey: string, ref: Date = new Date()): boolean {
  return startOfWeekKey(parseKey(dateKey)) === startOfWeekKey(ref)
}
