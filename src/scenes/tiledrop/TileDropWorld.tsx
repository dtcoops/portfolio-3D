
import { useRef, useEffect } from 'react'
import { RigidBody, RapierRigidBody, CuboidCollider } from '@react-three/rapier'
import * as THREE from 'three'
import { usePatrolCollider } from '../../hooks/usePatrolCollider'
import Portal from '../../components/Portal'
import Teleporter from '../../components/Teleporter'
import InteractIcon from '../../components/InteractIcon'
import { Tile } from './Tile'
import { Enemy } from './Enemy'
import { useArcTo } from '../../hooks/useArcTo'

interface TileDropWorldProps {
  playerBody: React.RefObject<RapierRigidBody | null>
  visualGroupRef: React.RefObject<THREE.Group | null>
  onViewPortal: (v: boolean) => void
  tileResetKey: number
}

const base = import.meta.env.BASE_URL
const tiledropDesignImg = `${base}images/TileDropDesign.png`
const tiledropVistaImg = `${base}images/TileDropVista.png`
const galleryImg = `${base}images/GalleryCam.png`
const gitImg = `${base}images/git.png`

export function TileDropWorld({ playerBody, visualGroupRef, onViewPortal, tileResetKey }: TileDropWorldProps) {
  const endPlatformReverse = useRef<(() => void) | null>(null)

  return (
    <>
      {/* Tile grid */}
      <TileSetup playerBody={playerBody} visualGroupRef={visualGroupRef} tileResetKey={tileResetKey} />

      {/* Start platform */}
      <StartPlatform playerBody={playerBody} visualGroupRef={visualGroupRef} onViewPortal={onViewPortal} />
      <Enemy position={[-5, 1.25, 0]} playerBody={playerBody} patrolPoints={[[0,0,-6], [0,0,6]]} />

      {/* First Checkpoint */}
      <Platform position={[27, 0, 0]} size={[4, 0.3, 16]}/>
      <spotLight
        position={[27, 10, 0]}
        target-position={[27, 0, 0]}
        angle={3}
        penumbra={1}
        intensity={30}
        distance={15}
        decay={.6}
        color="#dcdcd4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* End Platform */}
      <Platform
        position={[76, 0, 0]}
        size={[4, 0.3, 16]}
        playerBody={playerBody}
        reverseRef={endPlatformReverse}
        arcCenter={[40, 0, 0]}
        arcRadius={36}
        arcStartAngle={0}
        arcEndAngle={Math.PI / 2}
        arcEndY={15}
        arcSpeed={0.25}
      />
      <spotLight
        position={[76, 10, 0]}
        target-position={[76, 0, 0]}
        angle={3}
        penumbra={1}
        intensity={30}
        distance={15}
        decay={.6}
        color="#dcdcd4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />


      {/* Landing island — sends end platform back to start */}
      <LandingIsland
        position={[40, 15, 55]}
        size={[4, 0.3, 16]}
        playerBody={playerBody}
        onLand={() => endPlatformReverse.current?.()}
      />

      <Portal
        position={[45, 17, 68]}
        rotation={[0, -Math.PI * 0.85, 0]}
        destination="/gallery"
        imagePath={galleryImg}
        frameSize={[2.15, 0.9, 1]}
        pictureScale={[3.5, 2]}
        portal={true}
      />

      <Portal
        position={[35, 17, 68]}
        rotation={[0, -Math.PI * 1.2, 0]}
        destination="https://github.com/dtcoops/Tile-Drop-2"
        imagePath={gitImg}
        frameSize={[2.15, 0.9, 1]}
        pictureScale={[3.5, 2]}
        portal={true}
        external
      />

      <InteractIcon
        position={[40, 16.5, 60]}
        size={[2.7, 1]}
        label="Tile Drop"
        info="A puzzle platformer prototype built in Unity.

        One player controlling two characters simultaneously via mouse buttons, with a cooperative throw mechanic between them.
        
        Solo project, originally built as a VFS game design prelude.
        "
        playerBody={playerBody}
      />

      {/* Occluder - Block sight line of end island */}
      <mesh position={[40, 9.5, 47.5]} renderOrder={-1}>
        <planeGeometry args={[60, 10]} />
        <meshStandardMaterial colorWrite={false} side={THREE.BackSide} />
      </mesh>

      <spotLight
        position={[40, 25, 65]}
        target-position={[40, 15, 62.5]}
        angle={3}
        penumbra={1}
        intensity={30}
        distance={15}
        decay={.6}
        color="#dcdcd4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight 
        position={[40, 25, 55]}
        target-position={[40, 15, 55]}
        angle={3}
        penumbra={1}
        intensity={30}
        distance={15}
        decay={.7}
        color="#dcdcd4"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

    </>
  )
}

interface StartPlatformProps {
  playerBody: React.RefObject<RapierRigidBody | null>
  visualGroupRef: React.RefObject<THREE.Group | null>
  onViewPortal: (v: boolean) => void
}

function StartPlatform({ playerBody, visualGroupRef, onViewPortal }: StartPlatformProps) {

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

      <InteractIcon
        position={[-14.5, 1, 0]}
        label="Skip"
        info="Jump in to reach the end!"
        playerBody={playerBody}
      />
      <Teleporter
        position={[-15.5, 2.5, 0]}
        rotation={[0, Math.PI/2, 0]}
        teleportTo={[40, 16.5, 55]}
        teleportRotation={-Math.PI}
        imagePath={tiledropVistaImg}
        frameSize={[1.9, 1.3, 1]}
        pictureScale={[3, 3]}
        playerBody={playerBody}
        visualGroupRef={visualGroupRef}
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

interface PlatformProps {
  position: [number, number, number]
  size: [number, number, number]
  playerBody?: React.RefObject<RapierRigidBody | null>
  reverseRef?: React.RefObject<(() => void) | null>
  arcCenter?: [number, number, number]
  arcRadius?: number
  arcStartAngle?: number
  arcEndAngle?: number
  arcEndY?: number
  arcSpeed?: number
}

function Platform({ position, size, playerBody, reverseRef, arcCenter, arcRadius, arcStartAngle, arcEndAngle, arcEndY, arcSpeed }: PlatformProps) {
  const rb = useRef<RapierRigidBody>(null)
  const isMoving = !!arcCenter && !!playerBody
  const triggerRef = useRef<(() => void) | null>(null)

  const r = arcRadius ?? 1
  const a0 = arcStartAngle ?? 0
  const startPos: [number, number, number] = arcCenter
    ? [arcCenter[0] + r * Math.cos(a0), position[1], arcCenter[2] + r * Math.sin(a0)]
    : position

  const { onStepEnter, onStepExit, playerOnMovingTile } = usePatrolCollider(
    playerBody ?? { current: null },
    { onEnter: isMoving ? () => triggerRef.current?.() : undefined }
  )

  const { trigger, reverse } = useArcTo({
    rb,
    center: arcCenter ?? [0, 0, 0],
    radius: r,
    startAngle: a0,
    endAngle: arcEndAngle ?? Math.PI / 2,
    startY: position[1],
    endY: arcEndY ?? position[1],
    playerBody,
    playerOnMovingTile,
    options: { speed: arcSpeed },
  })

  useEffect(() => {
    triggerRef.current = trigger
    if (reverseRef) reverseRef.current = reverse
  })

  return (
    <RigidBody ref={rb} type={isMoving ? 'kinematicPosition' : 'fixed'} colliders={isMoving ? false : 'cuboid'} position={startPos}>
      {isMoving && <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} friction={0} />}
      {isMoving && <CuboidCollider args={[size[0] / 2, size[1] / 2 + 0.1, size[2] / 2]} sensor onIntersectionEnter={onStepEnter} onIntersectionExit={onStepExit} />}
      <mesh receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#111111" roughness={0.85} dithering/>
      </mesh>
    </RigidBody>
  )
}

interface LandingIslandProps {
  position: [number, number, number]
  size: [number, number, number]
  playerBody: React.RefObject<RapierRigidBody | null>
  onLand: () => void
}

function LandingIsland({ position, size, playerBody, onLand }: LandingIslandProps) {
  const { onStepEnter, onStepExit } = usePatrolCollider(playerBody, { onEnter: onLand })

  return (
    <>
      <RigidBody type="fixed" colliders={false} position={position}>
        <CuboidCollider args={[size[0] / 2, size[1] / 2, size[2] / 2]} />
        <CuboidCollider args={[size[0] / 2, size[1] / 2 + 0.1, size[2] / 2]} sensor onIntersectionEnter={onStepEnter} onIntersectionExit={onStepExit} />
        <mesh receiveShadow>
          <boxGeometry args={size} />
          <meshStandardMaterial color="#111111" roughness={0.85} dithering/>
        </mesh>
      </RigidBody>
      <Platform position={[40, 15, 62.5]} size={[15, 0.3, 15]} />
    </>
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
  { position: [58, 0, 0], patrol: null, isMovable: false },
  { position: [58, 0, -6], patrol: null, isMovable: false },
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