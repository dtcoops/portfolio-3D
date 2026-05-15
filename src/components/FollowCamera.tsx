import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function FollowCamera({ target }: { 
  target: React.RefObject<THREE.Group | null> 
}) {
  const { camera } = useThree()
  const offset = new THREE.Vector3(0, 4, 8)

  useFrame(() => {
    if (!target.current) return

    const targetPos = target.current.position

    // desired camera position
    const desired = new THREE.Vector3(
      targetPos.x + offset.x,
      targetPos.y + offset.y,
      targetPos.z + offset.z
    )

    // lerp camera to desired position
    camera.position.lerp(desired, 0.1)

    // look at player
    camera.lookAt(targetPos.x, targetPos.y + 1, targetPos.z)
  })

  return null
}