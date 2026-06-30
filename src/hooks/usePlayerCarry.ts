import { useRef, type RefObject } from 'react'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

export function usePlayerCarry(
  playerBody?: RefObject<RapierRigidBody | null>,
  playerOnMovingTile?: RefObject<boolean>,
  initialX = 0,
  initialZ = 0,
  initialY = 0,
  visualGroupRef?: RefObject<THREE.Group | null>,
) {
  const prevX = useRef(initialX)
  const prevZ = useRef(initialZ)
  const prevY = useRef(initialY)

  return (x: number, z: number, y?: number) => {
    const dx = x - prevX.current
    const dz = z - prevZ.current
    const dy = y !== undefined ? y - prevY.current : 0

    if (playerBody?.current && playerOnMovingTile?.current) {
      const p = playerBody.current.translation()
      playerBody.current.setTranslation({ x: p.x + dx, y: p.y + dy, z: p.z + dz }, true)
      if (visualGroupRef?.current) {
        visualGroupRef.current.position.x += dx
        visualGroupRef.current.position.z += dz
      }
    }

    prevX.current = x
    prevZ.current = z
    if (y !== undefined) prevY.current = y
  }
}
