import { Canvas, useFrame } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Suspense, useRef, useState } from 'react'
import CharacterController from '../components/CharacterController'
import HubRoom from './HubWorld'
import HubCamera from '../components/HubCamera'
import { RapierRigidBody } from '@react-three/rapier'
import LoadingScreen from '../components/LoadingScreen'
import { ToneMapping, EffectComposer, Bloom } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'

function ReadySignal({ onReady }: { onReady: () => void }) {
  const onReadyRef = useRef(onReady)
  const fired = useRef(false)

  useFrame(() => {
    if (!fired.current) {
      fired.current = true
      onReadyRef.current()
    }
  })

  return null
}

const CONTROLS = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'back',    keys: ['ArrowDown', 'KeyS'] },
  { name: 'left',    keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right',   keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump',    keys: ['Space'] },
  { name: 'run',     keys: ['ShiftLeft', 'ShiftRight'] },
]

export default function Hub() {
  const playerBody = useRef<RapierRigidBody>(null)
  const [ready, setReady] = useState(false)

  return (
    <KeyboardControls map={CONTROLS}>
      {!ready && <LoadingScreen />}
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ powerPreference: 'high-performance' }}
        camera={{ position: [0, 4, 5], fov: 45 }}
      >
        <Suspense fallback={null}>
          <Physics interpolate gravity={[0, -20, 0]}>
            <HubRoom playerBody={playerBody}/>
            <CharacterController bodyRef={playerBody} />
            <ReadySignal onReady={() => setReady(true)} />
          </Physics>
          <ambientLight intensity={0.5} color="#aaaaff" />
          <EffectComposer>
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