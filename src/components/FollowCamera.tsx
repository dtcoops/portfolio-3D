import { useFrame, useThree } from '@react-three/fiber'
import { useRapier } from '@react-three/rapier'
import * as THREE from 'three'

export function FollowCamera({ target }: { 
  target: React.RefObject<THREE.Group | null> 
}) {
  const { camera } = useThree()
  const { world, rapier } = useRapier()

   useFrame(() => {
    if (!target.current) return

    const targetPos = target.current.position
    const targetRot = target.current.rotation

    // model faces +Z locally, so its backward is -Z
    const backward = new THREE.Vector3(0, 0, -1)
    backward.applyEuler(targetRot)

    const desired = new THREE.Vector3(
      targetPos.x + backward.x * 6,
      targetPos.y + 2,
      targetPos.z + backward.z * 6
    )

    // ray origin: player's head/shoulder height
    const origin = new THREE.Vector3(targetPos.x, targetPos.y + 1.5, targetPos.z)
    const dir = desired.clone().sub(origin)
    const maxDistance = dir.length()
    dir.normalize()

    const ray = new rapier.Ray(origin, dir)
    const hit = world.castRay(ray, maxDistance, true)

    let finalPos: THREE.Vector3
    if (hit) {
      // pull the camera slightly in front of the wall to avoid clipping
      const hitDist = Math.max(hit.timeOfImpact - 0.3, 0.5)
      finalPos = origin.clone().addScaledVector(dir, hitDist)
    } else {
      finalPos = desired
    }

    // lerp camera to desired
    camera.position.lerp(finalPos, 0.08)

    // look slightly above player center
    const lookAt = new THREE.Vector3(targetPos.x, targetPos.y + 1, targetPos.z)
    camera.lookAt(lookAt)
  })

  return null
}