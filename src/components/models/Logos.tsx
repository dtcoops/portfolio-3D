import { PhysicsModel } from './PhysicsModel'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function BlenderLogo({ 
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
      path={`${import.meta.env.BASE_URL}models/BlenderLogo.glb`} 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function GitLogo({ 
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
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.005
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <PhysicsModel 
        path={`${import.meta.env.BASE_URL}models/3d_github_logo.glb`} 
        position={[0, 0, 0]}
        scale={scale}
        type={type}
      />
    </group>
  )
}

export function LinkedinLogo({ 
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
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.005
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <PhysicsModel 
        path={`${import.meta.env.BASE_URL}models/3d_linkedin_logo.glb`} 
        position={[0, 0, 0]}
        scale={scale}
        type={type}
      />
    </group>
  )
}

export function MailLogo({ 
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
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.rotation.y += 0.005
  })

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <PhysicsModel 
        path={`${import.meta.env.BASE_URL}models/mail_icon.glb`} 
        position={[0, 0, 0]}
        scale={scale}
        type={type}
      />
    </group>
  )
}