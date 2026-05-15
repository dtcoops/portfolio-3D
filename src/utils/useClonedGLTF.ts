import { useMemo } from "react"
import { useGLTF } from "@react-three/drei"

import * as THREE from 'three'

export function useClonedGLTF(path: string, recenter = true, color?: string) {
  const { scene } = useGLTF(path)
  return useMemo(() => {
    const c = scene.clone()
    if (recenter) {
      const box = new THREE.Box3().setFromObject(c)
      const center = new THREE.Vector3()
      box.getCenter(center)
      c.position.sub(center)
    }
    if (color) {
      c.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          (child as THREE.Mesh).material = new THREE.MeshStandardMaterial({ color })
        }
      })
    }
    return c
  }, [scene, recenter, color])
}
