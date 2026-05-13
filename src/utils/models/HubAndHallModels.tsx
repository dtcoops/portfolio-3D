import { useRef, useEffect, useState } from 'react'
import { RigidBody, RapierRigidBody } from '@react-three/rapier'
import { CatmullRomCurve3, Vector3 } from 'three'
import { useTexture, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import * as THREE from 'three'

import { PhysicsModel } from './PhysicsModel'

export function Arrow({ position, rotation, scale = 1,type = 'fixed' }: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  type?: 'dynamic' | 'fixed'
}) {
  return (
    <PhysicsModel 
      path="/models/arrow.glb" 
      position={position}
      rotation={rotation} 
      scale={scale}
      type={type}
    />
  )
}

export function ServerRack({ position, rotation }: { position: [number, number, number], rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="hull">
      {/* Main chassis */}
      <mesh>
        <boxGeometry args={[1, 2.2, 0.6]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
      </mesh>

      {/* Shelf lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, -0.9 + i * 0.3, 0.31]}>
          <boxGeometry args={[0.9, 0.02, 0.02]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      ))}

      {/* Status lights */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0.4, -0.85 + i * 0.3, 0.31]}>
          <boxGeometry args={[0.05, 0.05, 0.02]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#00ff88' : '#ff4400'}
            emissive={i % 2 === 0 ? '#00ff88' : '#ff4400'}
            emissiveIntensity={2}
          />
        </mesh>
      ))}
      </RigidBody>
    </group>
  )
}

export function ServerRackBank({ position, rotation }: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <ServerRack position={[-1.2, 1, 0]} />
      <ServerRack position={[0, 1, 0]} />
      <ServerRack position={[1.2, 1, 0]} />

      {/* Base strip connecting racks */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[3.8, 0.1, 0.7]} />
        <meshStandardMaterial color="#0a0a0f" />
      </mesh>
    </group>
  )
}

export function Wire({ points, color = '#111111' }: { 
  points: [number, number, number][]
  color?: string 
}) {
  const curve = new CatmullRomCurve3(
    points.map(p => new Vector3(...p))
  )

  return (
    <mesh>
      <tubeGeometry args={[curve, 20, 0.02, 6, false]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  )
}

export function Screen({ position, rotation,width = 1.1,height = 0.7,content,imagePath,wallMounted = false }: {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  content?: string
  imagePath?: string
  wallMounted?: boolean
}) {
  const texture = useTexture(imagePath ?? '/Textures/Kenney/Dark/texture_01.png')
  const activeTexture = imagePath ? texture : null

  return (
    <group position={position} rotation={rotation}>
      <RigidBody type="fixed" colliders="hull">
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[width + 0.2, height + 0.2, 0.08]} />
        <meshStandardMaterial color="#111122" />
      </mesh>

      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width, height, 0.05]} />
        <meshStandardMaterial
          color="#000011"
          map={activeTexture ?? undefined}
          emissive={activeTexture ? '#ffffff' : '#001133'}
          emissiveIntensity={activeTexture ? 0.1 : 1}
        >
          
        </meshStandardMaterial>
      </mesh>
      </RigidBody>
      <pointLight position={[0, 0, 0.5]} intensity={0.5} distance={3} color="#0044ff" />

      {content && !imagePath && (
        <Text position={[0, 0.1, 0.01]} fontSize={wallMounted ? 0.12 : 0.1}
          color="#00ffaa" anchorX="center" anchorY="middle"
          maxWidth={width - 0.1} textAlign="left">
          {content}
        </Text>
      )}

      {!wallMounted && (
        <>
          <mesh position={[0, -height / 2 - 0.1, 0]}>
            <boxGeometry args={[0.1, 0.2, 0.1]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          <mesh position={[0, -height / 2 - 0.2, 0]}>
            <boxGeometry args={[0.4, 0.05, 0.2]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
        </>
      )}
    </group>
  )
}

export function FluorescentLight({ position, rotation = [0, 0, 0] }: { 
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  // Light was shining at world origin regardless of rotation 
  // Used a Ref to get correct orientation
  const lightRef = useRef<THREE.SpotLight>(null)
  const targetRef = useRef<THREE.Object3D>(null)
  useEffect(() => {
    if (lightRef.current && targetRef.current) {
      lightRef.current.target = targetRef.current
    }
  }, [])

  return (
    <>
      <group position={position} rotation={rotation}>
        <mesh>
          <boxGeometry args={[2, 0.08, 0.2]} />
          <meshStandardMaterial color="#222233" />
        </mesh>
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[1.9, 0.04, 0.15]} />
          <meshStandardMaterial color="#ffffff" emissive="#aaaaff" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, -0.4, 0]} intensity={4} distance={1} color="#aaaaff" />
      </group>

      {/* Target placed directly below light */}
      <object3D ref={targetRef} position={[position[0], -10, position[2]]} />

      <spotLight
        ref={lightRef}
        position={[position[0], position[1] - 0.2, position[2]]}
        intensity={20}
        distance={30}
        angle={Math.PI / 2.5}
        penumbra={0.3}
        color="#aaaaff"
        castShadow
      />
    </>
  )
}

export function CameraModel({ position, rotation }: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main body */}
      <mesh>
        <boxGeometry args={[0.3, 0.2, 0.2]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>

      {/* Lens barrel */}
      <mesh position={[0, 0, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.2, 16]} />
        <meshStandardMaterial color="#222222" roughness={0.5} />
      </mesh>

      {/* Lens glass */}
      <mesh position={[0, 0, 0.26]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.02, 16]} />
        <meshStandardMaterial color="#001133" emissive="#001133" emissiveIntensity={0.5} />
      </mesh>

      {/* Viewfinder bump */}
      <mesh position={[0, 0.13, -0.02]}>
        <boxGeometry args={[0.1, 0.06, 0.08]} />
        <meshStandardMaterial color="#111111" roughness={0.8} />
      </mesh>

      {/* Mount bracket */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.06, 0.1, 0.06]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Recording light */}
      <mesh position={[0.12, 0.08, 0.1]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  )
}

export function TimeLine({ position, rotation, length, color = "#4444ff", label, playerBody }: { 
  position: [number, number, number]
  rotation?: [number, number, number]
  length?: number
  color?: string
  label?: string
  playerBody?: React.RefObject<RapierRigidBody | null>
}) {
  const [opacity, setOpacity] = useState(1)

  useFrame(() => {
    if (!playerBody?.current) return
    const pos = playerBody.current.translation()
    const dx = pos.x - position[0]
    const dz = pos.z - position[2]
    const distance = Math.sqrt(dx * dx + dz * dz)
    const target = distance < 3 ? 1 : distance < 3 ? (6 - distance) / 3 : 0
    setOpacity(prev => THREE.MathUtils.lerp(prev, target, 0.05))
  })
  return (
    <>
      <mesh position={position} rotation={rotation}>
        <boxGeometry args={[0.05, 0.05, length]} />
        <meshStandardMaterial emissive={color} emissiveIntensity={2} color={color} />
      </mesh>

      <Text 
        position={[position[0], position[1] + 0.25, position[2]]} 
        rotation={[0, -Math.PI / 2, 0]} 
        fontSize={0.15} 
        color={color} 
        anchorX="center"
        fillOpacity={opacity}
      >
        {label}
      </Text>
    </>
  )
}

export function TimeLineNode({ position, rotation, color = '#4444ff', year} : {
  position: [number, number, number]
  rotation?: [number, number, number]
  color?: string
  year?: string
}) {
  return (
    <>
    <mesh position={position} rotation={rotation}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial emissive={color} emissiveIntensity={2} color={color} />
    </mesh>
    {/* Year label */}
    <Text position={[position[0], position[1] - .25, position[2]]} rotation={[0, -Math.PI / 2, 0]}fontSize={0.3} color="#ffffff" anchorX="center">
      {year}
    </Text>
  </>
  )
}