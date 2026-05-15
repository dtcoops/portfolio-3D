import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

export function FollowCamera({ target }: { 
  target: React.RefObject<THREE.Group | null> 
}) {
  const { camera } = useThree()
  
   useFrame(() => {
    if (!target.current) return

    const targetPos = target.current.position
    const targetRot = target.current.rotation

    // model faces +Z locally, so its backward is -Z
    const backward = new THREE.Vector3(0, 0, -1)
    backward.applyEuler(targetRot)

    // desired camera position — behind and above player
    const desired = new THREE.Vector3(
      targetPos.x + backward.x * 6,
      targetPos.y + 2,
      targetPos.z + backward.z * 6
    )

    // lerp camera to desired
    camera.position.lerp(desired, 0.08)

    // look slightly above player center
    const lookAt = new THREE.Vector3(targetPos.x, targetPos.y + 1, targetPos.z)
    camera.lookAt(lookAt)
  })

  return null
}