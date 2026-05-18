import { useRef, useEffect } from 'react'
import * as THREE from 'three'
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
    <>
      <PhysicsModel 
        path={`${import.meta.env.BASE_URL}models/LightWallSmall.glb`} 
        position={position}
        rotation={rotation} 
        scale={scale}
        type={type}
      />

      {/* Bulb */}
      <mesh position={[position[0], position[1] - 0.15, position[2] + 0.25]} scale={0.5}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffaa"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[position[0]-0.49, position[1] - 0.15, position[2] + 0.25]} scale={0.5}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffaa"
          emissiveIntensity={2}
        />
      </mesh>
      <mesh position={[position[0] + 0.49, position[1] - 0.15, position[2] + 0.25]} scale={0.5}>
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
      path={`${import.meta.env.BASE_URL}models/PedestalBig.glb`} 
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
  const lightRef = useRef<THREE.SpotLight>(null)
  const targetRef = useRef<THREE.Object3D>(null)

  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current
    }
  }, [])

  return (
    <>
      {/* Housing */}
      <mesh position={position}>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#222222" />
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

      {/* Target directly below */}
      <object3D ref={targetRef} position={[position[0], -10, position[2]]} />

      <spotLight
        ref={lightRef}
        position={[position[0], position[1] - 0.1, position[2]]}
        intensity={25}
        distance={30}
        angle={Math.PI / 2}
        penumbra={0.1}
        color="#fff5e0"
        castShadow={false}
      />
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

