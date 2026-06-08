import { Canvas, useFrame } from '@react-three/fiber'
import { useLayoutEffect, useEffect, useRef, Suspense, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { EffectComposer, ToneMapping, Bloom } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { HalfFloatType } from 'three'
import * as THREE from 'three'

const MODEL_URL = `${import.meta.env.BASE_URL}models/character.glb`

useGLTF.preload(MODEL_URL)

const FADE_MS = 400
const PARTICLE_COUNT = 150

const NOISE_BG = `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/></filter><rect width='256' height='256' filter='url(%23n)' opacity='0.06'/></svg>")`

const { particlePositions, particleSpeeds } = (() => {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const speeds = new Float32Array(PARTICLE_COUNT)
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 12
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8
    speeds[i] = 1.5 + Math.random() * 3.5
  }
  return { particlePositions: positions, particleSpeeds: speeds }
})()

const circleTexture = (() => {
  const canvas = document.createElement('canvas')
  canvas.width = 32
  canvas.height = 32
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 32, 32)
  return new THREE.CanvasTexture(canvas)
})()

function RisingParticles() {
  const ref = useRef<THREE.Points>(null)

  useFrame((_, delta) => {
    if (!ref.current) return
    const pos = ref.current.geometry.attributes.position.array as Float32Array
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3 + 1] += delta * particleSpeeds[i]
      if (pos[i * 3 + 1] > 5) pos[i * 3 + 1] = -5
    }
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#aaccff"
        size={0.07}
        map={circleTexture}
        transparent
        opacity={0.5}
        sizeAttenuation
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  )
}

function FallingCharacter() {
  const { scene, animations } = useGLTF(MODEL_URL)
  const group = useRef<THREE.Group>(null)
  const { actions } = useAnimations(animations, group)

  useLayoutEffect(() => {
    actions['Falling']?.reset().play()
  }, [actions])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y -= delta * 0.22
  })

  return (
    <group ref={group}>
      <primitive object={scene} position={[0, -1, 0]} rotation={[0, Math.PI * 2.25, 0]} />
    </group>
  )
}

export default function LoadingScreen({ visible = true }: { visible?: boolean }) {
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    if (visible) return
    const id = setTimeout(() => setMounted(false), FADE_MS)
    return () => clearTimeout(id)
  }, [visible])

  if (!mounted) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'radial-gradient(ellipse at 50% 60%, #0d0a2e 0%, #050510 70%, #000000 100%)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      opacity: visible ? 1 : 0,
      transition: `opacity ${FADE_MS}ms ease-out`,
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: NOISE_BG,
        backgroundRepeat: 'repeat',
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
        <Canvas camera={{ position: [0, .5, 5], fov: 60 }} gl={{ alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}>
          <ambientLight intensity={0.25} />
          <directionalLight position={[0, 10, 1]} intensity={2.2} color="#fff8ee" />
          <Suspense fallback={null}>
            <FallingCharacter />
            <EffectComposer frameBufferType={HalfFloatType}>
              <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
              <Bloom intensity={0.5} luminanceThreshold={0.8} luminanceSmoothing={0.9} />
            </EffectComposer>
          </Suspense>
          <RisingParticles />
        </Canvas>
      </div>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.72) 100%)',
        pointerEvents: 'none',
        zIndex: 3,
      }} />
    </div>
  )
}
