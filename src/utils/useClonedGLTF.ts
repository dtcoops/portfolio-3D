import { useMemo } from "react"
import { useGLTF } from "@react-three/drei"

import * as THREE from 'three'

export function useClonedGLTF(path: string) {
  const { scene } = useGLTF(path)
  return useMemo(() => {
    const c = scene.clone()
    const box = new THREE.Box3().setFromObject(c)
    const center = new THREE.Vector3()
    box.getCenter(center)
    c.position.sub(center)
    return c
  }, [scene])
}
