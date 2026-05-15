import { RigidBody } from "@react-three/rapier"

import { useClonedGLTF } from "../useClonedGLTF"

export function PhysicsModel({
  path,
  position,
  rotation,
  scale = 1,
  type = 'fixed',
  colliders = 'hull'
}: {
  path: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
  colliders?: 'hull' | 'trimesh' | 'cuboid' | 'ball'
}) {
  const model = useClonedGLTF(path)

  return (
    <RigidBody type={type} colliders={colliders} position={position} rotation={rotation}>
      <primitive object={model} scale={scale}/>
    </RigidBody>
  )
}