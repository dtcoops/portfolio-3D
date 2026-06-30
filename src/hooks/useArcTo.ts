import { useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import type { RapierRigidBody } from '@react-three/rapier'
import { usePlayerCarry } from './usePlayerCarry'

interface UseArcToProps {
  rb: RefObject<RapierRigidBody | null>
  center: [number, number, number]
  radius: number
  startAngle: number
  endAngle: number
  startY: number
  endY: number
  playerBody?: RefObject<RapierRigidBody | null>
  playerOnMovingTile?: RefObject<boolean>
  options?: { speed?: number; onArrive?: () => void }
}

export function useArcTo({ rb, center, radius, startAngle, endAngle, startY, endY, playerBody, playerOnMovingTile, options }: UseArcToProps) {
  const triggered = useRef(false)
  const arrived = useRef(false)
  const currentAngle = useRef(startAngle)
  const targetAngle = useRef(endAngle)
  const carry = usePlayerCarry(playerBody, playerOnMovingTile, center[0] + radius * Math.cos(startAngle), center[2] + radius * Math.sin(startAngle), startY)

  useFrame((_, delta) => {
    if (!triggered.current || !rb.current || arrived.current) return

    const remaining = targetAngle.current - currentAngle.current
    const dir = Math.sign(remaining)

    if (Math.abs(remaining) < 0.01) {
      currentAngle.current = targetAngle.current
    } else {
      currentAngle.current += dir * (options?.speed ?? 0.5) * delta
      if (Math.sign(targetAngle.current - currentAngle.current) !== dir) {
        currentAngle.current = targetAngle.current
      }
    }

    const progress = (currentAngle.current - startAngle) / (endAngle - startAngle)
    const x = center[0] + radius * Math.cos(currentAngle.current)
    const z = center[2] + radius * Math.sin(currentAngle.current)
    const y = startY + (endY - startY) * progress

    rb.current.setNextKinematicTranslation({ x, y, z })
    carry(x, z, y)

    if (Math.abs(targetAngle.current - currentAngle.current) < 0.01) {
      arrived.current = true
      options?.onArrive?.()
    }
  }, 1)

  return {
    trigger:  () => { targetAngle.current = endAngle;   arrived.current = false; triggered.current = true },
    reverse:  () => { targetAngle.current = startAngle; arrived.current = false; triggered.current = true },
  }
}
