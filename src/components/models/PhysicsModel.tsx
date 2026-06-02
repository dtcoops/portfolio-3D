import { useEffect } from "react"
import * as THREE from 'three'
import { RigidBody } from '@react-three/rapier'
import type { RigidBodyProps } from '@react-three/rapier'

import { useClonedGLTF } from '../../utils/useClonedGLTF'

export function PhysicsModel({ 
  path, 
  position, 
  scale = 1,
  rotation,
  type = 'fixed',
  colliders = 'hull',
  recenter = true,
  color,
  receiveShadowOnly = false,
  doubleSide = false
}: {
  path: string
  position: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
  type?: 'dynamic' | 'fixed'
  colliders?: RigidBodyProps['colliders']
  recenter?: boolean
  color?: string
  receiveShadowOnly?: boolean
  doubleSide?: boolean
}) {
  const model = useClonedGLTF(path, recenter)

  useEffect(() => {
    model.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        mesh.receiveShadow = true
        mesh.castShadow = !receiveShadowOnly
        if (color) {
          (mesh.material as THREE.MeshStandardMaterial).color.set(color)
        }
        if (doubleSide) {
          const mat = mesh.material as THREE.MeshStandardMaterial
          mat.side = THREE.DoubleSide
          mat.needsUpdate = true
        }
      }
    })
  }, [model, color, receiveShadowOnly, doubleSide])

  return (
    <RigidBody type={type} colliders={colliders}>
      <group position={position} rotation={rotation} scale={scale}>
        <primitive object={model} />
      </group>
    </RigidBody>
  )
}