import { PhysicsModel } from './PhysicsModel'

export function GalleryModel({
  position,
  rotation,
  scale = 1,
  type = 'fixed',
  floorColor,
  ceilingColor
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
  floorColor?: string
  ceilingColor?: string
}) {
  return (
    <>
      <GalleryFloor position={position} rotation={rotation} scale={scale} type={type} color={floorColor} />
      <GalleryWalls position={position} rotation={rotation} scale={scale} type={type} />
      <GalleryCeiling position={position} rotation={rotation} scale={scale} type={type} color={ceilingColor} />
    </>
  )
}

function GalleryFloor({
  position,
  rotation,
  scale = 1,
  type = 'fixed',
  color
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
  color?: string
}) {
  return (
    <PhysicsModel
      path={`${import.meta.env.BASE_URL}models/GalleryFloor.glb`}
      position={position}
      rotation={rotation}
      scale={scale}
      type={type}
      colliders="trimesh"
      recenter={false}
      color={color}
      dithering={true}
      roughness={0.85}
    />
  )
}

function GalleryWalls({
  position,
  rotation,
  scale = 1,
  type = 'fixed'
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel
      path={`${import.meta.env.BASE_URL}models/GalleryWalls.glb`}
      position={position}
      rotation={rotation}
      scale={scale}
      type={type}
      colliders="trimesh"
      recenter={false}
      dithering={true}
      roughness={0.85}
    />
  )
}

function GalleryCeiling({
  position,
  rotation,
  scale = 1,
  type = 'fixed',
  color
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
  color?: string
}) {
  return (
    <PhysicsModel
      path={`${import.meta.env.BASE_URL}models/GalleryCeiling.glb`}
      position={position}
      rotation={rotation}
      scale={scale}
      type={type}
      colliders="trimesh"
      recenter={false}
      color={color}
      receiveShadowOnly
      dithering={true}
      roughness={0.85}
    />
  )
}

export function InfoDesk({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/infodesksmall.glb`}
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function InfoDeskLarge({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/infodeskbig.glb`}
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function RopeBarrier({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/ropebarrier.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function RopeBarrierSquare({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/RopeSquare.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function Bench({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/Bench.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
      colliders='trimesh'
    />
  )
}

export function Desk({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/Desk.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function LightWall({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/LightWall.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function LightWallSmall({
  position,
  rotation,
  scale = 1,
  type = 'fixed'
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <group position={position} rotation={rotation}>
      <PhysicsModel
        path={`${import.meta.env.BASE_URL}models/LightWallSmall.glb`}
        position={[0, 0, 0]}
        scale={scale}
        type={type}
      />

      {/* Bulbs â€” local-space positions so they rotate with the wall */}
      <mesh
        position={[0, -0.075, 0.05]}
        rotation={[Math.PI / 2, Math.PI * 1.5, Math.PI * 0.3]}
        scale={0.5}
      >
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffaa" emissiveIntensity={2} />
      </mesh>
      <mesh
        position={[-0.49, -0.08, 0.08]}
        rotation={[Math.PI / 2, Math.PI * 1.6, Math.PI * 0.3]}
        scale={0.5}
      >
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffaa" emissiveIntensity={2} />
      </mesh>
      <mesh
        position={[0.49, -0.08, 0.08]}
        rotation={[Math.PI / 2, Math.PI * 1.4, Math.PI * 0.3]}
        scale={0.5}
      >
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffaa" emissiveIntensity={2} />
      </mesh>
      <rectAreaLight 
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        width={2}
        height={0.2}
        intensity={4}
        color="#e8f0ff"
      />
    </group>
  )
}

export function LightWallBig({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/LightWallBig.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function PedestalSmall({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/PedestalSmall.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function PedestalBig({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/PedestalLarge.glb`} 
      position={position}
      rotation={rotation}
      scale={scale}
      type={type}
    />
  )
}

export function Stool({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/Stool.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function Table({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/Table.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function PotLight({ position }: {
  position: [number, number, number]
}) {
  return (
    <>
      {/* Housing */}
      <mesh position={position}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#222222" roughness={0.8} dithering />
      </mesh>

      {/* Bulb */}
      <mesh position={[position[0], position[1] - 0.05, position[2]]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffaa"
          emissiveIntensity={2}
        />
      </mesh>
    </>
  )
}

export function Stairs({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/Stairs.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function Dinosaur({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/Dinosaur.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function Girl({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/Girl.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function Book({ 
  position, 
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path={`${import.meta.env.BASE_URL}models/Book.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}






