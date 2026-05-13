import { useFrame, useThree } from '@react-three/fiber'

import * as THREE from 'three'

export function SideViewCamera({ visualGroupRef }: { visualGroupRef: React.RefObject<THREE.Group | null> }) {
  const { camera } = useThree()

  useFrame(() => {
    if (!visualGroupRef.current) return
    const pos = visualGroupRef.current.position

    camera.position.set(-3.5, 2.5, pos.z)
    camera.lookAt(0, 2, pos.z)
  })

  return null
}