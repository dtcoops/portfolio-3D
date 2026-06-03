
import { useRef, useState, useEffect } from 'react'
import { usePlayerCollision } from '../../hooks/usePlayerCollision'
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const INITIAL_LIVES = 2
const TILE_COLORS: Record<number, string> = {
  2: '#9939d1',
  1: '#c47a1e',
}
const TILE_SPEED = 1.5

interface TileProps {
  position: [number, number, number]
  playerBody: React.RefObject<RapierRigidBody | null>
  visualGroupRef?: React.RefObject<THREE.Group | null>
  numLives?: number
  isMovable?: boolean
  patrolPoints?: [number, number, number][]
}

export function Tile({ position, playerBody, visualGroupRef, numLives, isMovable = false, patrolPoints }: TileProps) {
  const [lives, setLives] = useState(numLives ? numLives : INITIAL_LIVES)
  const tileBody = useRef<RapierRigidBody>(null)
  const color = TILE_COLORS[lives] ?? '#cc3b3b'
  // Movement
  const patrolIndex = useRef(0)
  const currentPos = useRef(new THREE.Vector3(...position))
  const prevPos = useRef(new THREE.Vector3(...position))
  const playerOnMovingTile = useRef(false)
  // Collider Logic
  const { onCollisionEnter: onStepEnter, onCollisionExit: onStepExit } = usePlayerCollision(playerBody, {
    onEnter: () => {
      playerOnMovingTile.current = true
      setLives(prev => Math.max(0, prev - 1))
    },
    onExit: () => {
      playerOnMovingTile.current = false
    }
  })

  useFrame((_, delta) => {
    if (!isMovable || !tileBody.current || !patrolPoints?.length) return

    const speed = TILE_SPEED * delta
    const target = new THREE.Vector3(...patrolPoints[patrolIndex.current])
    const direction = target.clone().sub(currentPos.current)

    // move tile
    if (direction.length() < 0.05) {
      patrolIndex.current = (patrolIndex.current + 1) % patrolPoints.length
    } else {
      currentPos.current.addScaledVector(direction.normalize(), speed)
      tileBody.current.setNextKinematicTranslation(currentPos.current)
    }

    // move player
    if (playerBody.current && playerOnMovingTile.current) {
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

  useEffect(() => {
    if (lives > 0) return
    const t = setTimeout(() => {
      tileBody.current?.setBodyType(0, true)
    }, 300)
    return () => clearTimeout(t)
  }, [lives])

  return (
    <RigidBody 
      ref={tileBody} 
      type={isMovable ? "kinematicPosition" : "fixed"} 
      colliders={false}
    >
      {/* friction=0: Rapier kinematic friction would shift the player on top of the explicit setTranslation below, causing double movement */}
      <CuboidCollider args={[0.9, 0.15, 0.9]} position={position} friction={0} />
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
