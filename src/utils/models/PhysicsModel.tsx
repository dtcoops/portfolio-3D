import { RigidBody } from "@react-three/rapier"

import { useClonedGLTF } from "../useClonedGLTF"

export function PhysicsModel({
  path,
  position,
  rotation,
  scale = 1,
  type = 'fixed',
  colliders = 'hull',
  recenter = true,
  color
}: {
  path: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
  colliders?: 'hull' | 'trimesh' | 'cuboid' | 'ball'
  recenter?: boolean
  color?: string
}) {
  const model = useClonedGLTF(path, recenter, color)

  return (
    <RigidBody type={type} colliders={colliders}>
      <primitive object={model} position={position} rotation={rotation} scale={scale}/>
    </RigidBody>
  )
}