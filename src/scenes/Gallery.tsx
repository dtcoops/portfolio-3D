import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics, RapierRigidBody } from '@react-three/rapier'
import { Suspense, useState, useRef, useCallback } from 'react'
import { ToneMapping, EffectComposer, Bloom } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'

import type { IntroPhase } from '../types/GalleryStates'
import { useGameStore } from '../store/gameStore'
import { CONTROLS } from '../constants/controls'
import { GalleryWorld } from './GalleryWorld'

import LoadingScreen from '../components/LoadingScreen'
import CharacterController from '../components/CharacterController'
import { FollowCamera } from '../components/FollowCamera'
import { CharacterFall, CameraSettle, GalleryIntro } from '../components/gallery_intro'

export default function Gallery() {
  const { visitedLevels, markVisited } = useGameStore()
  const [physicsPaused, setPhysicsPaused] = useState(true)
  const [sceneReady, setSceneReady] = useState(false)
  const [introPhase, setIntroPhase] = useState<IntroPhase>(
    visitedLevels.has('gallery-intro') ? 'playing' : 'flying'
  )
  const playerBody = useRef<RapierRigidBody>(null)
  const visualGroupRef = useRef<THREE.Group>(null)
  const [introAnimation, setIntroAnimation] = useState('Falling')

  const handleAnimationChange = useCallback((name: string) => {
    setIntroAnimation(name)
  }, [])

  return (
    <KeyboardControls map={CONTROLS}>
      <>
      {!sceneReady && <LoadingScreen />}
      <Canvas shadows camera={{ position: [0, 15, 0], fov: 60 }}>
        <Suspense fallback={null}>
          <Physics interpolate gravity={[0, -20, 0]} paused={physicsPaused}>
            <GalleryWorld 
              playerBody={playerBody}
            />
            <CharacterController
              bodyRef={playerBody}
              visualGroupRef={visualGroupRef}
              spawnPosition={[5, 1, 25]}
              spawnRotation={[0, -Math.PI, 0]}
              movementMode="follow"
              disabled={introPhase !== 'playing'}
              hidden={introPhase === 'flying' || introPhase === 'settling'}
              onReady={() => { setPhysicsPaused(false); setSceneReady(true) }}
              forcedAnimation={introPhase !== 'playing' ? introAnimation : undefined}
            />
            <FollowCamera
              target={visualGroupRef}
              disabled={introPhase !== 'playing'}
            />
          </Physics>

          {introPhase === 'flying' && (
            <GalleryIntro onComplete={() => setIntroPhase('settling')} />
          )}

          {introPhase === 'settling' && (
            <CameraSettle
              lookTarget={[5, 9.5, 25]}
              onComplete={() => setIntroPhase('falling')}
            />
          )}

          {introPhase === 'falling' && (
            <CharacterFall
              visualGroupRef={visualGroupRef}
              onLand={() => setIntroPhase('landing')}
              onGetup={() => { setIntroPhase('playing'); markVisited('gallery-intro') }}
              onAnimationChange={handleAnimationChange}
            />
          )}

          <directionalLight
            position={[0, 30, 0]}
            intensity={2}
            color="#fff5e0"
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-near={1}
            shadow-camera-far={150}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
            shadow-bias={-0.0005}
            shadow-normalBias={0.02}
          />
          <ambientLight 
            intensity={1} 
            color="#fffff3" 
          />
          <directionalLight 
            position={[0, -10, 0]} 
            intensity={1.5} 
            color="#fff5e0" 
          />
    
          <EffectComposer>
            <ToneMapping 
              mode={ToneMappingMode.ACES_FILMIC}
            />
            <Bloom 
              intensity={0.5}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
      </>
    </KeyboardControls>
  )
}