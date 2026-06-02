import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, Suspense } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

function FallingCharacter() {
  const { scene, animations } = useGLTF(`${import.meta.env.BASE_URL}models/character.glb`)
  const group = useRef<THREE.Group>(null)
  const { actions } = useAnimations(animations, group)

  useEffect(() => {
    actions['Falling']?.reset().fadeIn(0.2).play()
  }, [actions])

  return (
    <group ref={group}>
      <primitive object={scene} position={[0,-1,0]} rotation={[0, Math.PI * 2.25, 0]} />
    </group>
  )
}

export default function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'black',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ width: 400, height: 500 }}>
        <Canvas camera={{ position: [0, .5, 3], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <FallingCharacter />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}