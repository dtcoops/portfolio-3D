
import { PhysicsModel } from './PhysicsModel'

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