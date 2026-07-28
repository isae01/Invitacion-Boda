import { useEffect, useState } from 'react'

interface CountdownValue {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function diff(target: Date): CountdownValue {
  const totalSeconds = Math.max(0, Math.floor((target.getTime() - Date.now()) / 1000))
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

/** Cuenta regresiva a `target`, actualizada cada segundo (DESIGN.md §8). */
export function useCountdown(target: Date): CountdownValue {
  const [value, setValue] = useState(() => diff(target))

  useEffect(() => {
    const id = setInterval(() => setValue(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return value
}
