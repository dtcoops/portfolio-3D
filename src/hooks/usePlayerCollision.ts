import { useRef, useLayoutEffect } from 'react'
import type { RapierRigidBody, CollisionPayload } from '@react-three/rapier'

interface UseBodyCollisionOptions {
  onEnter?: () => void
  onExit?: () => void
}

export function useBodyCollision(
  targetBody: React.RefObject<RapierRigidBody | null>,
  { onEnter, onExit }: UseBodyCollisionOptions = {}
) {
  const isOnObject = useRef(false)

  // Prevent stale callback
  // render → DOM update → useLayoutEffect → paint → useEffect
  const onEnterRef = useRef(onEnter)
  const onExitRef = useRef(onExit)
  useLayoutEffect(() => {
    onEnterRef.current = onEnter
    onExitRef.current = onExit
  })

  const onCollisionEnter = ({ other }: CollisionPayload) => {
    if (!targetBody.current) return
    if (other.rigidBody?.handle !== targetBody.current.handle) return
    if (isOnObject.current) return
    isOnObject.current = true
    onEnterRef.current?.()
  }

  const onCollisionExit = ({ other }: CollisionPayload) => {
    if (!targetBody.current) return
    if (other.rigidBody?.handle !== targetBody.current.handle) return
    isOnObject.current = false
    onExitRef.current?.()
  }

  return { onCollisionEnter, onCollisionExit }
}

export function usePlayerCollision(
  playerBody: React.RefObject<RapierRigidBody | null>,
  options: UseBodyCollisionOptions = {}
) {
  return useBodyCollision(playerBody, options)
}
