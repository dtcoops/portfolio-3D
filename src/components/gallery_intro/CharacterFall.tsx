import { useState, useEffect, useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from 'three'

const PORTAL_POS = new THREE.Vector3(5, 9.5, 25)
const LAND_Y = 0.1

interface CharacterFallProps {
    visualGroupRef: React.RefObject<THREE.Group | null>
    onLand: () => void
    onGetup: () => void
    onAnimationChange: (name: string) => void
}

export default function CharacterFall({ visualGroupRef, onLand, onGetup, onAnimationChange }: CharacterFallProps) {
  const { camera } = useThree()
  const [portalVisible, setPortalVisible] = useState(false)
  const [falling, setFalling] = useState(false)
  const fallY = useRef(PORTAL_POS.y)
  const done = useRef(false)

  useEffect(() => {
    onAnimationChange('Falling')
    setTimeout(() => setPortalVisible(true), 500)
    setTimeout(() => setFalling(true), 800)
  }, [])

  useFrame((_, delta) => {
    if (!visualGroupRef.current || done.current) return

    visualGroupRef.current.rotation.y = Math.PI

    if (falling) {
      fallY.current = Math.max(fallY.current - delta * 15, LAND_Y)
      visualGroupRef.current.position.y = fallY.current
      const { x, y, z } = visualGroupRef.current.position
      camera.lookAt(x, y + 0.5, z)

      if (fallY.current <= LAND_Y) {
        done.current = true
        onAnimationChange('Fall Flat')
        onLand()
        setTimeout(() => onAnimationChange('Get Up'), 1500)
        setTimeout(() => onGetup(), 1500 + 2800)
      }
    } else {
      // Hold character at portal height so it appears to come through
      visualGroupRef.current.position.y = PORTAL_POS.y + 2
      camera.lookAt(PORTAL_POS.x, PORTAL_POS.y, PORTAL_POS.z)
    }
  })

  return (
    <>
      {portalVisible && (
        <mesh position={PORTAL_POS.toArray()} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[3, 3]} />
          <meshStandardMaterial
            color="#4444ff"
            emissive="#4444ff"
            emissiveIntensity={2}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </>
  )
}
