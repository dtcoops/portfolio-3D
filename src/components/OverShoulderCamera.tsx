import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const _offset = new THREE.Vector3()
const _desiredPos = new THREE.Vector3()
const _lookTarget = new THREE.Vector3()
const _quat = new THREE.Quaternion()

export function OverShoulderCamera({
  visualGroupRef,
  offset = new THREE.Vector3(0, 1.5, -4),
  lerpFactor = 0.1,
  disabled = false,
}: {
  visualGroupRef: React.RefObject<THREE.Group | null>
  offset?: THREE.Vector3
  lerpFactor?: number
  disabled?: boolean
}) {
  const { camera } = useThree()
  const lookTargetRef = useRef(new THREE.Vector3())

  useFrame(() => {
    if (disabled || !visualGroupRef.current) return

    visualGroupRef.current.getWorldQuaternion(_quat)
    visualGroupRef.current.getWorldPosition(_desiredPos)

    _offset.copy(offset).applyQuaternion(_quat)
    _desiredPos.add(_offset)

    camera.position.lerp(_desiredPos, lerpFactor)

    visualGroupRef.current.getWorldPosition(_lookTarget)
    _lookTarget.y += 1
    lookTargetRef.current.lerp(_lookTarget, lerpFactor)
    camera.lookAt(lookTargetRef.current)
  })

  return null
}
