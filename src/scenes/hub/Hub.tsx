import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Suspense, useRef, useState } from 'react'
import CharacterController from '../../components/player/CharacterController'
import HubRoom from './HubWorld'
import HubCamera from '../../components/cameras/HubCamera'
import { RapierRigidBody } from '@react-three/rapier'
import LoadingScreen from '../../components/ui/LoadingScreen'
import { ToneMapping, EffectComposer, Bloom } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { HalfFloatType } from 'three'
import { CONTROLS } from '../../constants/controls'
import * as THREE from 'three'

export default function Hub() {
  const playerBody = useRef<RapierRigidBody>(null)
  const [ready, setReady] = useState(false)

  return (
    <KeyboardControls map={CONTROLS}>
      {!ready && <LoadingScreen />}
      <Canvas shadows camera={{ position: [-13, 5, 1.5], fov: 60 }} gl={{ 
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.0
            }}>
        <Suspense fallback={null}>
          <Physics interpolate gravity={[0, -20, 0]}>
            <HubRoom playerBody={playerBody}/>
            <CharacterController bodyRef={playerBody} onReady={() => setReady(true)} />
          </Physics>
          <hemisphereLight args={["#aaaaff", "#1a0a00", 0.7]} />
          <EffectComposer frameBufferType={HalfFloatType}>
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC}/>
            <Bloom 
              intensity={0.5}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </Suspense>
        <HubCamera bodyRef={playerBody} />
      </Canvas>
    </KeyboardControls>
  )
}

export { Hub }

