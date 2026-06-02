import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics, RapierRigidBody } from '@react-three/rapier'
import { Suspense, useState, useRef } from 'react'
import { ToneMapping, EffectComposer, Bloom } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'

import CharacterController from '../../components/CharacterController'
import { AboutHallwayWorld } from './AboutHallwayWorld'
import { SideViewCamera } from '../../components/SideViewCamera'
import { CONTROLS } from '../../constants/controls'

export default function AboutHallway() {
  const [physicsPaused, setPhysicsPaused] = useState(true)
  const playerBody = useRef<RapierRigidBody>(null)
  const visualGroupRef = useRef<THREE.Group>(null)

  return (
    <KeyboardControls map={CONTROLS}>
      <Canvas shadows camera={{ position: [-3.5, 2.5, -13], fov: 60 }}>
        <Suspense fallback={null}>
          <Physics interpolate gravity={[0, -20, 0]} paused={physicsPaused}>
            <AboutHallwayWorld playerBody={playerBody}/>
            <CharacterController bodyRef={playerBody} visualGroupRef={visualGroupRef} spawnPosition={[0, 2, -13]} movementMode="flat" onReady={() => setPhysicsPaused(false)} />
          </Physics>
          <SideViewCamera visualGroupRef={visualGroupRef} />
          <ambientLight intensity={0.2} color="#aaaaff" />

          <EffectComposer>
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
            <Bloom 
              intensity={0.5}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </KeyboardControls>
  )
}

