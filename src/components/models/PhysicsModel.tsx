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
  roughness,
  dithering = true,
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
  roughness?: number
  dithering?: boolean
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
        const mat = mesh.material as THREE.MeshStandardMaterial
        if (color) mat.color.set(color)
        if (roughness !== undefined) mat.roughness = roughness
        if (dithering) mat.dithering = true
        if (doubleSide) mat.side = THREE.DoubleSide
        if (dithering || doubleSide) mat.needsUpdate = true
      }
    })
  }, [model, color, roughness, dithering, receiveShadowOnly, doubleSide])

  return (
    <RigidBody type={type} colliders={colliders}>
      <group position={position} rotation={rotation} scale={scale}>
        <primitive object={model} />
      </group>
    </RigidBody>
  )
}