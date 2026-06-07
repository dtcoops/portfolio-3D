
import { useRef, useState } from 'react'
import { usePatrolCollider } from '../../hooks/usePatrolCollider'
import { usePatrolMovement } from '../../hooks/usePatrolMovement'
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'

const INITIAL_LIVES = 1
const TILE_COLORS: Record<number, string> = {
  2: '#9939d1',
  1: '#c47a1e',
}

interface TileProps {
  position: [number, number, number]
  playerBody: React.RefObject<RapierRigidBody | null>
  visualGroupRef?: React.RefObject<THREE.Group | null>
  numLives?: number
  isMovable?: boolean
  patrolPoints?: [number, number, number][]
}

export function Tile({ position, playerBody, visualGroupRef, numLives, isMovable = false, patrolPoints }: TileProps) {
  const livesRef = useRef(numLives ?? INITIAL_LIVES)
  const [lives, setLives] = useState(numLives ?? INITIAL_LIVES)
  const tileBody = useRef<RapierRigidBody>(null)
  const color = TILE_COLORS[lives] ?? '#cc3b3b'

  const { onStepEnter, onStepExit, playerOnMovingTile } = usePatrolCollider(playerBody, {
    onEnter: () => {
      livesRef.current = Math.max(0, livesRef.current - 1)
      setLives(livesRef.current)
    },
    onExit: () => {
      if (livesRef.current <= 0) setTimeout(() => tileBody.current?.setBodyType(0, true), 300)
    },
  })

  usePatrolMovement(tileBody, position, patrolPoints, playerBody, playerOnMovingTile, visualGroupRef)

  return (
    <RigidBody
      ref={tileBody}
      position={position}
      type={isMovable ? "kinematicPosition" : "fixed"}
      colliders={false}
      userData={{ type: 'tile' }}
    >
      {/* friction=0: Rapier kinematic friction would shift the player on top of the explicit setTranslation below, causing double movement */}
      <CuboidCollider args={[0.9, 0.15, 0.9]} friction={0} />
      {/* Sensor above tile surface — fires on overlap, no contact force needed */}
      <CuboidCollider
        args={[0.85, 0.2, 0.85]}
        sensor
        onIntersectionEnter={onStepEnter}
        onIntersectionExit={onStepExit}
      />
      <mesh receiveShadow>
        <boxGeometry args={[1.8, 0.3, 1.8]} />
        <meshStandardMaterial color={color} roughness={0.85} dithering/>
      </mesh>
    </RigidBody>
  )
}
