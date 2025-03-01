import { useCallback, useState } from 'react'

export function useDebounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)

  return useCallback((...args: Parameters<T>) => {
    if (timer) {
      clearTimeout(timer)
    }
    setTimer(
      setTimeout(() => {
        fn(...args)
      }, delay),
    )
  }, [fn, delay, timer])
}
