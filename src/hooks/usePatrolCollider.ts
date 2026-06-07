import { useRef } from 'react'
import type { RapierRigidBody } from '@react-three/rapier'
import { usePlayerCollision } from './usePlayerCollision'

interface UsePatrolColliderOptions {
  onEnter?: () => void
  onExit?: () => void
}

export function usePatrolCollider(
  playerBody: React.RefObject<RapierRigidBody | null>,
  { onEnter, onExit }: UsePatrolColliderOptions = {}
) {
  const playerOnMovingTile = useRef(false)

  const { onCollisionEnter: onStepEnter, onCollisionExit: onStepExit } = usePlayerCollision(playerBody, {
    onEnter: () => {
      playerOnMovingTile.current = true
      onEnter?.()
    },
    onExit: () => {
      playerOnMovingTile.current = false
      onExit?.()
    },
  })

  return { onStepEnter, onStepExit, playerOnMovingTile }
}
