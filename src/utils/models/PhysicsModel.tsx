import { RigidBody } from "@react-three/rapier"

import { useClonedGLTF } from "../useClonedGLTF"

export function PhysicsModel({ 
  path, 
  position,
  rotation, 
  scale = 1,
  type = 'fixed'
}: { 
  path: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  const model = useClonedGLTF(path)
  
  return (
    <RigidBody type={type} colliders="hull">
      <primitive object={model} position={position} rotation={rotation} scale={scale}/>
    </RigidBody>
  )
}