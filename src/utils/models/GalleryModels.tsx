
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