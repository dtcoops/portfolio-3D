
import { RigidBody, RapierRigidBody } from '@react-three/rapier'
import Portal from '../../components/Portal'
import InteractIcon from '../../components/InteractIcon'

interface TileDropWorldProps {
  playerBody: React.RefObject<RapierRigidBody | null>
  onViewPortal: (v: boolean) => void
}

export function TileDropWorld({ playerBody, onViewPortal }: TileDropWorldProps) {

  return (
    <>
      {/* Start platform */}
      <StartPlatform playerBody={playerBody} onViewPortal={onViewPortal} />

      {/* Tile grid */}
      <TileGrid />

      {/* End platform */}
      <EndPlatform />
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
          <meshStandardMaterial color="#636363" />
        </mesh>

        <mesh receiveShadow position={[-28, 0, 0]}>
          <boxGeometry args={[10, 0.3, 10]} />
          <meshStandardMaterial color="#636363" />
        </mesh>

        <mesh receiveShadow position={[-16, 5, 0]}>
          <boxGeometry args={[1, 10, 16]} />
          <meshStandardMaterial color="#636363" />
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
          intensity={8}
          distance={10}
          decay={0.8}
          color="#ffe8c0"
          castShadow={false}
      />

      <Portal
        position={[-15.5, 2.5, 0]}
        rotation={[0, Math.PI/2, 0]}
        destination="/gallery"
        imagePath={galleryImg}
        frameSize={[1.9, 1.3, 1]}
        pictureScale={[3, 3]}
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
