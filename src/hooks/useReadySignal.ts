import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'

export function useReadySignal(onReady?: () => void) {
  const fired = useRef(false)
  const onReadyRef = useRef(onReady)

  useFrame(() => {
    if (!fired.current && onReadyRef.current) {
      fired.current = true
      onReadyRef.current()
    }
  })
}
