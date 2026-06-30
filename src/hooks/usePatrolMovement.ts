import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { usePlayerCarry } from './usePlayerCarry'

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
  const timeRef = useRef(0)
  const target = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const carry = usePlayerCarry(playerBody, playerOnMovingTile, position[0], position[2], 0, visualGroupRef)

  useFrame((_, delta) => {
    if (!rb.current || !patrolPoints?.length) return

    timeRef.current += delta

    const pt = patrolPoints[patrolIndex.current]
    target.current.set(position[0] + pt[0], position[1] + pt[1], position[2] + pt[2])
    direction.current.copy(target.current).sub(currentPos.current)

    if (direction.current.length() < 0.05) {
      patrolIndex.current = (patrolIndex.current + 1) % patrolPoints.length
    } else {
      currentPos.current.addScaledVector(direction.current.normalize(), speed * delta)
    }

    const floatY = floatAmplitude > 0 ? Math.sin(timeRef.current * floatFrequency) * floatAmplitude : 0
    rb.current.setNextKinematicTranslation({
      x: currentPos.current.x,
      y: currentPos.current.y + floatY,
      z: currentPos.current.z,
    })

    carry(currentPos.current.x, currentPos.current.z)
  }, 1)
}
