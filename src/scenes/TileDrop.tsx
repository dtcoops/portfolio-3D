import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics, RigidBody, RapierRigidBody } from '@react-three/rapier'
import React, { Suspense, useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import CharacterController from '../components/CharacterController'

const CONTROLS = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'back',    keys: ['ArrowDown', 'KeyS'] },
  { name: 'left',    keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right',   keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump',    keys: ['Space'] },
  { name: 'run',     keys: ['ShiftLeft', 'ShiftRight'] },
]

export default function TileDrop() {
  const [physicsPaused, setPhysicsPaused] = useState(true)
  const playerBody = useRef<RapierRigidBody>(null)
  const visualGroupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    setTimeout(() => setPhysicsPaused(false), 100)
  }, [])

  return (
    <KeyboardControls map={CONTROLS}>
      <Canvas shadows camera={{ position: [-13, 5, 1.5], fov: 60 }}>
        <Suspense fallback={null}>
          <Physics interpolate gravity={[0, -20, 0]} paused={physicsPaused}>
            <TileDropWorld />
            <CharacterController bodyRef={playerBody} visualGroupRef={visualGroupRef} spawnPosition={[-8, 1.5, 0]} movementMode="flat" />
          </Physics>
          <OverShoulderCamera visualGroupRef={visualGroupRef} />
          <fog attach="fog" args={['#000000', 10, 40]} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 15, 5]} castShadow intensity={1} />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}

function OverShoulderCamera({ visualGroupRef }: { visualGroupRef: React.RefObject<THREE.Group | null> }) {
  const { camera } = useThree()

  useFrame(() => {
    if (!visualGroupRef.current) return
    const pos = visualGroupRef.current.position

    camera.position.set(pos.x - 5, pos.y + 4, pos.z + 1.5)
    camera.lookAt(pos.x + 1, pos.y + 0.5, pos.z)
  })

  return null
}

function TileDropWorld() {
  return (
    <>
      {/* Start platform */}
      <StartPlatform />
      
      {/* Tile grid */}
      <TileGrid />
      
      {/* End platform */}
      <EndPlatform />
    </>
  )
}

function StartPlatform() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow position={[-8, 0, 0]}>
        <boxGeometry args={[4, 0.3, 6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </RigidBody>
  )
}

function EndPlatform() {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow position={[18, 0, 0]}>
        <boxGeometry args={[4, 0.3, 6]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
    </RigidBody>
  )
}

function TileGrid() {
  const cols = 5
  const rows = 2
  const tileSize = 1.8
  const gap = 2
  const step = tileSize + gap

  return (
    <>
      {Array.from({ length: cols }).map((_, col) =>
        Array.from({ length: rows }).map((_, row) => {
          const x = -3 + col * step
          const z = -((rows - 1) * step) / 2 + row * step
          return (
            <Tile key={`${col}-${row}`} position={[x, 0, z]} />
          )
        })
      )}
    </>
  )
}

function Tile({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders="cuboid">
      <mesh receiveShadow position={position}>
        <boxGeometry args={[1.8, 0.3, 1.8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    </RigidBody>
  )
}