import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

interface UseBuddyThrowProps {
  playerBody: RefObject<RapierRigidBody | null>
  buddyPosition: [number, number, number]
  throwTarget: [number, number, number]
  controlDisabledRef: RefObject<boolean>
  options?: {
    holdDelay?: number   // seconds before throw fires (default 0.5)
    throwHeight?: number // arc apex height above launch point (default 5)
    gravity?: number     // must match Rapier scene gravity (default 9.81)
    holdYOffset?: number // how high above buddy center to hold player (default 1.1)
  }
}

function calcLaunchVelocity(
  origin: THREE.Vector3,
  target: THREE.Vector3,
  height: number,
  gravity: number,
) {
  const dy = target.y - origin.y
  const timeUp = Math.sqrt(2 * height / gravity)
  const timeDown = Math.sqrt(2 * Math.max(height - dy, 0) / gravity)
  const flyTime = timeUp + timeDown
  return {
    x: (target.x - origin.x) / flyTime,
    y: Math.sqrt(2 * gravity * height),
    z: (target.z - origin.z) / flyTime,
    flyTime,
  }
}

export function useBuddyThrow({
  playerBody,
  buddyPosition,
  throwTarget,
  controlDisabledRef,
  options,
}: UseBuddyThrowProps) {
  const state = useRef<'idle' | 'held' | 'thrown'>('idle')
  const holdPos = useRef(new THREE.Vector3(
    buddyPosition[0],
    buddyPosition[1] + (options?.holdYOffset ?? 1.1),
    buddyPosition[2],
  ))

  const catchPlayer = () => {
    if (!playerBody.current || state.current !== 'idle') return

    // Only catch if player is falling onto buddy, not just walking into them
    const vel = playerBody.current.linvel()
    if (vel.y > 0.5) return

    state.current = 'held'
    controlDisabledRef.current = true
    playerBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true)

    const gravity = options?.gravity ?? 9.81
    const height = options?.throwHeight ?? 5
    const launch = calcLaunchVelocity(holdPos.current.clone(), new THREE.Vector3(...throwTarget), height, gravity)

    setTimeout(() => {
      if (!playerBody.current || state.current !== 'held') return
      playerBody.current.setLinvel({ x: launch.x, y: launch.y, z: launch.z }, true)
      state.current = 'thrown'

      // Re-enable controller once the calculated arc is complete
      setTimeout(() => {
        controlDisabledRef.current = false
        state.current = 'idle'
      }, launch.flyTime * 1000)
    }, (options?.holdDelay ?? 0.5) * 1000)
  }

  // Lock player in place against buddy during the hold phase
  useFrame(() => {
    if (state.current !== 'held' || !playerBody.current) return
    playerBody.current.setTranslation(holdPos.current, true)
    playerBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
  }, 1)

  return { catchPlayer }
}
