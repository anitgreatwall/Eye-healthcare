// 随机点立体图（红青 anaglyph）渲染器
// 红色点 → 青色滤镜眼(右)可见；青色点 → 红色滤镜眼(左)可见
// 隐藏形状区域在两眼图之间存在水平视差，戴镜后浮出

export type ShapeKind = 'circle' | 'square' | 'triangle'

function inShape(kind: ShapeKind, x: number, y: number, cx: number, cy: number, r: number): boolean {
  const dx = x - cx
  const dy = y - cy
  switch (kind) {
    case 'circle':
      return dx * dx + dy * dy <= r * r
    case 'square':
      return Math.abs(dx) <= r * 0.8 && Math.abs(dy) <= r * 0.8
    case 'triangle': {
      // 简单等腰三角
      if (dy > r * 0.7) return false
      const halfW = ((y - (cy - r)) / (2 * r)) * r
      return dy >= -r && Math.abs(dx) <= halfW
    }
  }
}

export function drawRDS(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  kind: ShapeKind,
  disparityPx: number,
  cell = 4,
) {
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)

  const cols = Math.ceil(w / cell)
  const rows = Math.ceil(h / cell)
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) * 0.28

  // 基础随机点：true 表示有点
  const base: boolean[][] = []
  for (let j = 0; j < rows; j++) {
    base[j] = []
    for (let i = 0; i < cols; i++) base[j][i] = Math.random() < 0.5
  }

  const dispCells = Math.round(disparityPx / cell)

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const px = i * cell
      const py = j * cell
      const shape = inShape(kind, px, py, cx, cy, r)

      // 左眼(青)图：原始
      const leftDot = base[j][i]
      // 右眼(红)图：形状内整体平移 dispCells
      let rightDot: boolean
      if (shape) {
        const si = i - dispCells
        rightDot = si >= 0 && si < cols ? base[j][si] : Math.random() < 0.5
      } else {
        rightDot = base[j][i]
      }

      if (leftDot && rightDot) {
        ctx.fillStyle = '#111111' // 两眼都有 → 黑
      } else if (leftDot) {
        ctx.fillStyle = '#00d8d8' // 仅左眼 → 青
      } else if (rightDot) {
        ctx.fillStyle = '#ff2a2a' // 仅右眼 → 红
      } else {
        continue
      }
      ctx.fillRect(px, py, cell, cell)
    }
  }
}
