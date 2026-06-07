import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

const DEFAULT_SPEED = 1.5

export function usePatrolMovement(
  rb: React.RefObject<RapierRigidBody | null>,
  position: [number, number, number],
  patrolPoints: [number, number, number][] | undefined,
  playerBody: React.RefObject<RapierRigidBody | null>,
  playerOnMovingTile?: React.RefObject<boolean>,
  visualGroupRef?: React.RefObject<THREE.Group | null>,
  speed = DEFAULT_SPEED,
  floatAmplitude = 0,
  floatFrequency = 1.5,
) {
  const patrolIndex = useRef(0)
  const currentPos = useRef(new THREE.Vector3(...position))
  const prevPos = useRef(new THREE.Vector3(...position))
  const timeRef = useRef(0)

  useFrame((_, delta) => {
    if (!rb.current || !patrolPoints?.length) return

    timeRef.current += delta

    const pt = patrolPoints[patrolIndex.current]
    const target = new THREE.Vector3(position[0] + pt[0], position[1] + pt[1], position[2] + pt[2])
    const direction = target.clone().sub(currentPos.current)

    if (direction.length() < 0.05) {
      patrolIndex.current = (patrolIndex.current + 1) % patrolPoints.length
    } else {
      currentPos.current.addScaledVector(direction.normalize(), speed * delta)
    }

    const floatY = floatAmplitude > 0 ? Math.sin(timeRef.current * floatFrequency) * floatAmplitude : 0
    rb.current.setNextKinematicTranslation({
      x: currentPos.current.x,
      y: currentPos.current.y + floatY,
      z: currentPos.current.z,
    })

    if (playerBody.current && playerOnMovingTile?.current) {
      const dx = currentPos.current.x - prevPos.current.x
      const dz = currentPos.current.z - prevPos.current.z
      const playerPos = playerBody.current.translation()
      playerBody.current.setTranslation({ x: playerPos.x + dx, y: playerPos.y, z: playerPos.z + dz }, true)
      if (visualGroupRef?.current) {
        visualGroupRef.current.position.x += dx
        visualGroupRef.current.position.z += dz
      }
    }

    prevPos.current.copy(currentPos.current)
  }, 1)
}
