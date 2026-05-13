import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { useMemo } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

import Portal from '../components/Portal'
import { FluorescentLight } from './../utils/models/Models'


export function AboutHallwayWorld() {
  const baseTexture = useTexture('/Textures/Kenney/Dark/texture_03.png')

  const wallTexture = useMemo(() => {
    const t = baseTexture.clone()
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(14, 3)
    t.needsUpdate = true
    return t
  }, [baseTexture])

  const sideWallTexture = useMemo(() => {
    const t = baseTexture.clone()
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(3, 3)
    t.needsUpdate = true
    return t
}, [baseTexture])
  
  const floorTexture = useTexture('/Textures/Kenney/Dark/texture_08.png', (t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(3, 10)
  })

  return (
    <>
        {/* Floor */}
        <RigidBody type="fixed" colliders='hull'>
            <mesh position={[0, 0, 0]} receiveShadow>
                <boxGeometry args={[4, 1, 30]} />
                <meshStandardMaterial map={floorTexture} />
            </mesh>
        </RigidBody>

        {/* Walls */}
        <RigidBody type="fixed" colliders='hull' >
            <mesh position={[2.25, 3, 0]} receiveShadow>
                <boxGeometry args={[1, 5, 30]} />
                <meshStandardMaterial map={wallTexture} />
            </mesh>
        </RigidBody>
        <CuboidCollider args={[1, 5, 30]} position={[-3, 3, 0]} />
        <RigidBody type="fixed" colliders='hull'>
            <mesh position={[0, 3, -16]} receiveShadow>
                <boxGeometry args={[4, 5, 3]} />
                <meshStandardMaterial map={sideWallTexture} />d
            </mesh>
        </RigidBody>
        <RigidBody type="fixed" colliders='hull'>
            <mesh position={[0, 3, 16]} receiveShadow>
                <boxGeometry args={[4, 5, 3]} />
                <meshStandardMaterial map={sideWallTexture} />
            </mesh>
        </RigidBody>

        {/* Lighting */}
        <FluorescentLight position={[0, 3.95, -10.5]} rotation={[0, Math.PI / 2, 0]} />
        <FluorescentLight position={[0, 3.95, -5.5]} rotation={[0, Math.PI / 2, 0]} />
        <FluorescentLight position={[0, 3.95, 0]} rotation={[0, Math.PI / 2, 0]} />
        <FluorescentLight position={[0, 3.95, 5.5]} rotation={[0, Math.PI / 2, 0]} />
        <FluorescentLight position={[0, 3.95, 10.5]} rotation={[0, Math.PI / 2, 0]} />

        {/* Entrance and Exit */}
        <Portal position={[0, 2.5, 14.5]} rotation={[0, Math.PI, 0]}  destination="/about"/>
        <Portal position={[0, 2.5, -14.5]} rotation={[0, 0, 0]}  destination="/"/>

    </>
  )
}

