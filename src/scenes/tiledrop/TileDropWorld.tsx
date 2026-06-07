
import { RigidBody, RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import Portal from '../../components/Portal'
import InteractIcon from '../../components/InteractIcon'
import { Tile } from './Tile'
import { Enemy } from './Enemy'

interface TileDropWorldProps {
  playerBody: React.RefObject<RapierRigidBody | null>
  visualGroupRef: React.RefObject<THREE.Group | null>
  onViewPortal: (v: boolean) => void
  tileResetKey: number
}

export function TileDropWorld({ playerBody, visualGroupRef, onViewPortal, tileResetKey }: TileDropWorldProps) {

  return (
    <>
      {/* Start platform */}
      <StartPlatform playerBody={playerBody} onViewPortal={onViewPortal} />

      {/* Tile grid */}
      <TileSetup playerBody={playerBody} visualGroupRef={visualGroupRef} tileResetKey={tileResetKey} />
      
      <Platform position={[27, 0, 0]} size={[4, 0.3, 16]}/>
      <Enemy position={[-5, 1.25, 0]} playerBody={playerBody} patrolPoints={[[0,0,-6], [0,0,6]]} />
    </>
  )
}

interface StartPlatformProps {
  playerBody: React.RefObject<RapierRigidBody | null>
  onViewPortal: (v: boolean) => void
}

function StartPlatform({ playerBody, onViewPortal }: StartPlatformProps) {

  const base = import.meta.env.BASE_URL
  const tiledropDesignImg = `${base}images/TileDropDesign.png`
  const galleryImg = `${base}images/GalleryCam.png`

  return (
    <>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow position={[-16, 0, 0]}>
          <boxGeometry args={[16, 0.3, 24]} />
          <meshStandardMaterial color="#636363" roughness={0.85} dithering/>
        </mesh>

        <mesh receiveShadow position={[-28, 0, 0]}>
          <boxGeometry args={[10, 0.3, 10]} />
          <meshStandardMaterial color="#636363" roughness={0.85} dithering/>
        </mesh>

        <mesh receiveShadow position={[-16, 5, 0]}>
          <boxGeometry args={[1, 10, 16]} />
          <meshStandardMaterial color="#636363" roughness={0.85} dithering/>
        </mesh>
      </RigidBody>

      <Portal
        position={[-16.5, 4, 0]}
        rotation={[0, -Math.PI/2, 0]}
        destination=""
        imagePath={tiledropDesignImg}
        frameSize={[3.25, 3, 1]}
        pictureScale={[5, 7]}
        portal={false}
      />
      <InteractIcon
        position={[-17.5, 1, 0]}
        label="View Design"
        playerBody={playerBody}
        onInteract={() => onViewPortal(true)}
      />
      <pointLight
          key={`b`}
          position={[-22, 7, 0]}
          intensity={1.2}
          decay={0.15}
          color="#f8f0e2"
          castShadow={false}
      />

      <Portal
        position={[-15.5, 2.5, 0]}
        rotation={[0, Math.PI/2, 0]}
        destination="/gallery"
        imagePath={galleryImg}
        frameSize={[1.9, 1.3, 1]}
        pictureScale={[3, 3]}
        playerBody={playerBody}
      />

      <InteractIcon
        position={[-10, 1, 0]}
        label="The Chasm"
        info="Tile Drop requires one player controlling two characters. This is a solo adaptation of that crossing."
        playerBody={playerBody}
      />

  
    </>
  )
}

function Platform({position, size} : {position : [number, number, number], size: [number, number, number]}) {
  return (
    <RigidBody type="fixed" colliders="cuboid" position={position}>
      <mesh receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#111111" roughness={0.85} dithering/>
      </mesh>
    </RigidBody>
  )
}

interface TileConfig {
  position: [number, number, number]
  patrol: [number, number, number][] | null
  isMovable: boolean
}

const TILES: TileConfig[] = [
  // Section 1
  { position: [-4, 0, 0], patrol: null, isMovable: false  },
  { position: [2, 0, 0], patrol: null, isMovable: false  },
  { position: [8, 0, 0], patrol: null, isMovable: false },
  { position: [14, 0, 0], patrol: null, isMovable: false },
  { position: [20, 0, 0], patrol: null, isMovable: false },

  // Section 2 
  // Section 2 - Buddy path
  { position: [34, 0, 6], patrol: null, isMovable: false },
  { position: [40, 0, 6], patrol: null, isMovable: false },
  { position: [46, 0, 6], patrol: null, isMovable: false },
  { position: [52, 0, 6], patrol: null, isMovable: false },
  { position: [58, 0, 6], patrol: null, isMovable: false },
  { position: [64, 0, 6], patrol: null, isMovable: false },
  { position: [70, 0, 6], patrol: null, isMovable: false },

  // Section 2 - player path
  { position: [34, 0, -6], patrol: null, isMovable: false },
  { position: [40, 0, -6], patrol: null, isMovable: false },
  { position: [46, 0, -6], patrol: null, isMovable: false },
  { position: [46, 0, 0], patrol: null, isMovable: false },
  // Help from buddy here
  { position: [46, 0, 12], patrol: null, isMovable: false },
  { position: [46, 0, 18], patrol: null, isMovable: false },
  { position: [52, 0, 18], patrol: null, isMovable: false },
  { position: [58, 0, 18], patrol: null, isMovable: false },
  { position: [58, 0, 12], patrol: null, isMovable: false },
  // Help from buddy here
  { position: [64, 0, 0], patrol: null, isMovable: false },
  { position: [64, 0, -6], patrol: null, isMovable: false },
  { position: [70, 0, -6], patrol: null, isMovable: false },

]

function TileSetup({playerBody, visualGroupRef, tileResetKey}:
  {
    playerBody: React.RefObject<RapierRigidBody | null>
    visualGroupRef: React.RefObject<THREE.Group | null>
    tileResetKey: number
  }
) {
  return (
    <>
      {TILES.map((t, i) => (
        <Tile
          key={`tile-${i}-${tileResetKey}`}
          position={t.position}
          playerBody={playerBody}
          visualGroupRef={visualGroupRef}
          isMovable={t.isMovable}
          patrolPoints={t.patrol ?? undefined}
        />
      ))}
    </>
  )
}