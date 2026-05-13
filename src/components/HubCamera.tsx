import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

interface HubCameraProps {
  bodyRef: React.RefObject<RapierRigidBody | null>
}

export default function HubCamera({ bodyRef }: HubCameraProps) {
  const lookTarget = useRef(new THREE.Vector3(0, 5, 10))

  useFrame((state, delta) => {
    if (!bodyRef.current) return
    const pos = bodyRef.current.translation()
    const camLerp = 1 - Math.pow(0.9, delta * 60)
    lookTarget.current.lerp(new THREE.Vector3(pos.x, pos.y + 1, pos.z), camLerp)
    state.camera.position.set(0, 3, 0)
    state.camera.lookAt(lookTarget.current)
  })

  return null
}