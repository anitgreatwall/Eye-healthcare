// 校准感知尺寸：把厘米/视角换算成屏幕像素
// 校准得到 pxPerCm；标准信用卡宽度 85.6mm 用于校准

export const CREDIT_CARD_WIDTH_MM = 85.6

export function cmToPx(cm: number, pxPerCm: number): number {
  if (!pxPerCm || pxPerCm <= 0) return cm * 38 // 未校准时的粗略回退（约 96dpi）
  return cm * pxPerCm
}

/**
 * 在给定观看距离(cm)下，目标偏移角度(度)对应的屏幕线距离(px)。
 * 用于自由空间融像 / 红青矢量图的 base-out 需求换算。
 */
export function degToPx(angleDeg: number, viewingDistanceCm: number, pxPerCm: number): number {
  const offsetCm = viewingDistanceCm * Math.tan((angleDeg * Math.PI) / 180)
  return cmToPx(offsetCm, pxPerCm)
}

/** 屏幕上两点像素距离反推视角（度） */
export function pxToDeg(px: number, viewingDistanceCm: number, pxPerCm: number): number {
  const cm = pxPerCm > 0 ? px / pxPerCm : px / 38
  return (Math.atan(cm / viewingDistanceCm) * 180) / Math.PI
}
