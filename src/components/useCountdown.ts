import { useCallback, useEffect, useRef, useState } from 'react'

/** 倒计时 hook：返回剩余秒数、运行状态与控制函数 */
export function useCountdown(seconds: number, onDone?: () => void) {
  const [remaining, setRemaining] = useState(seconds)
  const [running, setRunning] = useState(false)
  const onDoneRef = useRef(onDone)
  onDoneRef.current = onDone

  useEffect(() => {
    if (!running) return
    if (remaining <= 0) {
      setRunning(false)
      onDoneRef.current?.()
      return
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(t)
  }, [running, remaining])

  const start = useCallback(() => setRunning(true), [])
  const pause = useCallback(() => setRunning(false), [])
  const reset = useCallback(
    (s?: number) => {
      setRunning(false)
      setRemaining(s ?? seconds)
    },
    [seconds],
  )

  return { remaining, running, start, pause, reset, setRemaining }
}

export function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
