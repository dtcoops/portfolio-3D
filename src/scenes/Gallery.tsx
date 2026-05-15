import { Canvas, useFrame } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics, RapierRigidBody } from '@react-three/rapier'
import { Suspense, useState, useRef } from 'react'
import * as THREE from 'three'

import CharacterController from '../components/CharacterController'
import { FollowCamera } from '../components/FollowCamera'
import { GalleryWorld } from './GalleryWorld'

const CONTROLS = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'back',    keys: ['ArrowDown', 'KeyS'] },
  { name: 'left',    keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right',   keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump',    keys: ['Space'] },
  { name: 'run',     keys: ['ShiftLeft', 'ShiftRight'] },
]

function ReadySignal({ onReady }: { onReady: () => void }) {
  const fired = useRef(false)
  useFrame(() => {
    if (!fired.current) {
      fired.current = true
      onReady()
    }
  })
  return null
}

export default function Gallery() {
  const [physicsPaused, setPhysicsPaused] = useState(true)
  const playerBody = useRef<RapierRigidBody>(null)
  const visualGroupRef = useRef<THREE.Group>(null)

  return (
    <KeyboardControls map={CONTROLS}>
      <Canvas shadows camera={{ position: [0, 15, 0], fov: 60 }}>
        <Suspense fallback={null}>
          <Physics interpolate gravity={[0, -20, 0]} paused={physicsPaused}>
            <GalleryWorld playerBody={playerBody}/>
            <CharacterController bodyRef={playerBody} visualGroupRef={visualGroupRef} spawnPosition={[0, 1, 0]} movementMode="follow" />
            <ReadySignal onReady={() => setPhysicsPaused(false)} />
          </Physics>
          <FollowCamera target={visualGroupRef} />
          <ambientLight intensity={0.7} />
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}

