
import { useRef, useState, useEffect } from 'react'
import { usePlayerCollision } from '../../hooks/usePlayerCollision'
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier'

const INITIAL_LIVES = 2
const TILE_COLORS: Record<number, string> = {
  2: '#9939d1',
  1: '#c47a1e',
}

interface TileProps {
  position: [number, number, number]
  playerBody: React.RefObject<RapierRigidBody | null>
  numLives?: number
}

export function Tile({ position, playerBody, numLives }: TileProps) {
  const [lives, setLives] = useState(numLives ? numLives : INITIAL_LIVES)
  const tileBody = useRef<RapierRigidBody>(null)
  const color = TILE_COLORS[lives] ?? '#cc3b3b'

  const { onCollisionEnter: onStepEnter, onCollisionExit: onStepExit } = usePlayerCollision(playerBody, {
    onEnter: () => setLives(prev => Math.max(0, prev - 1)),
  })

  useEffect(() => {
    if (lives > 0) return
    const t = setTimeout(() => {
      tileBody.current?.setBodyType(0, true)
    }, 300)
    return () => clearTimeout(t)
  }, [lives])

  return (
    <RigidBody ref={tileBody} type="fixed" colliders={false}>
      {/* Solid physics — player stands on this */}
      <CuboidCollider args={[0.9, 0.15, 0.9]} position={position} />
      {/* Sensor above tile surface — fires on overlap, no contact force needed */}
      <CuboidCollider
        args={[0.85, 0.2, 0.85]}
        position={[position[0], position[1], position[2]]}
        sensor
        onIntersectionEnter={onStepEnter}
        onIntersectionExit={onStepExit}
      />
      <mesh receiveShadow position={position}>
        <boxGeometry args={[1.8, 0.3, 1.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}
