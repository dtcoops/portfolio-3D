import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import { Physics, RapierRigidBody } from '@react-three/rapier'
import { Suspense, useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import CharacterController from '../../components/CharacterController'
import { CONTROLS } from '../../constants/controls'
import { TileDropWorld } from './TileDropWorld'
import { ToneMapping, EffectComposer, Bloom } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { OverShoulderCamera } from '../../components/OverShoulderCamera'

const SPAWN_POSITION = new THREE.Vector3(-30, 1, 0)
const RESPAWN_BELOW_Y = -12

function RespawnGuard({
  playerBody,
  visualGroupRef,
}: {
  playerBody: React.RefObject<RapierRigidBody | null>
  visualGroupRef: React.RefObject<THREE.Group | null>
}) {
  useFrame(() => {
    if (!playerBody.current) return
    const pos = playerBody.current.translation()
    if (pos.y < RESPAWN_BELOW_Y) {
      playerBody.current.setTranslation(SPAWN_POSITION, true)
      playerBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
      playerBody.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
      if (visualGroupRef.current) {
        visualGroupRef.current.position.set(SPAWN_POSITION.x, SPAWN_POSITION.y + 0.2, SPAWN_POSITION.z)
      }
    }
  })
  return null
}

// Camera position and look target for viewing the design portal
const PORTAL_VIEW_POS = new THREE.Vector3(-22.5, 4.5, 0)
const PORTAL_LOOK_AT  = new THREE.Vector3(-16.5, 4, 0)

function PortalCameraView({ active, onExit }: { active: boolean; onExit: () => void }) {
  const { camera } = useThree()

  useEffect(() => {
    if (!active) return
    const handleKey = () => onExit()
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [active, onExit])

  useFrame((_, delta) => {
    if (!active) return
    camera.position.lerp(PORTAL_VIEW_POS, 1 - Math.pow(0.01, delta))
    camera.lookAt(PORTAL_LOOK_AT)
  })

  return null
}

export default function TileDrop() {
  const [physicsPaused, setPhysicsPaused] = useState(true)
  const [viewingPortal, setViewingPortal] = useState(false)
  const playerBody = useRef<RapierRigidBody>(null)
  const visualGroupRef = useRef<THREE.Group>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTimeout(() => setPhysicsPaused(false), 100)
  }, [])

  return (
    <KeyboardControls map={CONTROLS}>

      <div style={{ 
        position: 'absolute',
        bottom: '2rem',
        left: '50%',
        top: '30%',
        transform: 'translateX(-50%)',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '5rem',
        letterSpacing: '0.1em',
        pointerEvents: 'none',
        userSelect: 'none',
        zIndex: 10,
        opacity: visible ? 1 : 0, 
        transition: 'opacity 0.5s ease' }}
      >
        Tile Drop
      </div>

      <Canvas shadows camera={{ position: [-13, 5, 1.5], fov: 60 }}>
        <Suspense fallback={null}>
          <Physics interpolate gravity={[0, -20, 0]} paused={physicsPaused}>
            <TileDropWorld playerBody={playerBody} onViewPortal={setViewingPortal} />
            <CharacterController
              bodyRef={playerBody}
              visualGroupRef={visualGroupRef}
              spawnRotation={[0, Math.PI / 2, 0]}
              spawnPosition={[-30, 1, 0]}
              movementMode="tank"
              disabled={viewingPortal}
            />
            <OverShoulderCamera visualGroupRef={visualGroupRef} disabled={viewingPortal} />
            <RespawnGuard playerBody={playerBody} visualGroupRef={visualGroupRef} />
          </Physics>
          <PortalCameraView active={viewingPortal} onExit={() => setViewingPortal(false)} />
          <fog attach="fog" args={['#000000', 10, 40]} />
        </Suspense>

        <hemisphereLight args={["#c8a882", "#1a0a00", 0.7]} />
        <directionalLight position={[5, 15, 5]} castShadow intensity={1} />

        <EffectComposer>
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC}/>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.8}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>

      </Canvas>
    </KeyboardControls>
  )
}
