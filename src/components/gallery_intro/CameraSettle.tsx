import { useRef, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import * as THREE from 'three'
import { easeInOutSineBlend } from "../../utils/easing"

interface CameraSettleProps {
    lookTarget: [number, number, number]
    onComplete: () => void
    skip?: boolean
}

export function CameraSettle({ lookTarget, onComplete, skip }: CameraSettleProps) {
  const { camera } = useThree()
  const progress = useRef(0)
  const done = useRef(false)
  useEffect(() => {
    if (!skip || done.current) return
    done.current = true
    onComplete()
  }, [skip])

  const startQuat = useRef<THREE.Quaternion>(camera.quaternion.clone())
  const endQuat = useRef<THREE.Quaternion>((() => {
    const m = new THREE.Matrix4()
    m.lookAt(camera.position, new THREE.Vector3(...lookTarget), new THREE.Vector3(0, 1, 0))
    return new THREE.Quaternion().setFromRotationMatrix(m)
  })())

  useFrame((_, delta) => {
    if (done.current) return
    progress.current = Math.min(progress.current + delta * 0.5, 1)
    const t = easeInOutSineBlend(progress.current)
    camera.quaternion.slerpQuaternions(startQuat.current, endQuat.current, t)
    if (progress.current >= 1) {
      done.current = true
      onComplete()
    }
  })

  return null
}
