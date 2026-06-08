import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function useReadySignal(onReady?: () => void) {
  const fired = useRef(false)
  const frameCount = useRef(0)
  const onReadyRef = useRef(onReady)

  useFrame(() => {
    if (fired.current || !onReadyRef.current) return
    frameCount.current++
    if (frameCount.current >= 5) {
      fired.current = true
      onReadyRef.current()
    }
  })
}
