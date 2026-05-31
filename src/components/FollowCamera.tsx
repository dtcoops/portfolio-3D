import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useRapier } from '@react-three/rapier'
import * as THREE from 'three'

const TRANSITION_DURATION = 1.5 // seconds to blend in when first activating

export function FollowCamera({ target, disabled = false }: {
  target: React.RefObject<THREE.Group | null>
  disabled?: boolean
}) {
  const { camera } = useThree()
  const { world, rapier } = useRapier()
  const wasDisabled = useRef(disabled)
  const transitionT = useRef(disabled ? 0 : 1)

  useFrame((_, delta) => {
    // Detect the moment FollowCamera becomes active and start the transition
    if (wasDisabled.current && !disabled) {
      transitionT.current = 0
    }
    wasDisabled.current = disabled

    if (disabled || !target.current) return

    transitionT.current = Math.min(transitionT.current + delta / TRANSITION_DURATION, 1)
    const t = transitionT.current

    const targetPos = target.current.position
    const targetRot = target.current.rotation

    const backward = new THREE.Vector3(0, 0, -1)
    backward.applyEuler(targetRot)

    const desired = new THREE.Vector3(
      targetPos.x + backward.x * 6,
      targetPos.y + 2,
      targetPos.z + backward.z * 6
    )

    const origin = new THREE.Vector3(targetPos.x, targetPos.y + 1.5, targetPos.z)
    const dir = desired.clone().sub(origin)
    const maxDistance = dir.length()
    dir.normalize()

    const ray = new rapier.Ray(origin, dir)
    const hit = world.castRay(ray, maxDistance, true)

    let finalPos: THREE.Vector3
    if (hit) {
      const hitDist = Math.max(hit.timeOfImpact - 0.3, 0.5)
      finalPos = origin.clone().addScaledVector(dir, hitDist)
    } else {
      finalPos = desired
    }

    // Position: lerp faster as transition completes
    const posLerp = 0.02 + t * 0.06
    camera.position.lerp(finalPos, posLerp)

    // Rotation: slerp during transition, hard lookAt once settled
    const lookAt = new THREE.Vector3(targetPos.x, targetPos.y + 1, targetPos.z)
    if (t < 1) {
      const m = new THREE.Matrix4().lookAt(camera.position, lookAt, camera.up)
      const desiredQuat = new THREE.Quaternion().setFromRotationMatrix(m)
      camera.quaternion.slerp(desiredQuat, posLerp)
    } else {
      camera.lookAt(lookAt)
    }
  })

  return null
}
