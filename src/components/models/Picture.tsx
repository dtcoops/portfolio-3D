import { useRef } from 'react'
import { useTexture, shaderMaterial } from '@react-three/drei'
import { useFrame, extend } from '@react-three/fiber'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import type { RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'

import { useClonedGLTF } from '../../utils/useClonedGLTF'

const PortalShaderMaterial = shaderMaterial(
  { uTime: 0 as number, uTexture: null as unknown as THREE.Texture },
  /* vertex */ 
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* fragment */ 
  `
    uniform float uTime;
    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;

      // Subtle ripple distortion
      uv.x += sin(uv.y * 12.0 + uTime * 1.5) * 0.012;
      uv.y += sin(uv.x * 10.0 + uTime * 1.2) * 0.008;

      gl_FragColor = texture2D(uTexture, uv);
    }
  `
)

extend({ PortalShaderMaterial })

type PortalShaderMaterialType = InstanceType<typeof PortalShaderMaterial>

declare module '@react-three/fiber' {
  interface ThreeElements {
    portalShaderMaterial: {
      ref?: React.Ref<PortalShaderMaterialType>
      uTime?: number
      uTexture?: THREE.Texture | null
      attach?: string
    }
  }
}

interface PictureProps {
  position?: [number, number, number]
  onEnter?: () => void
  imagePath?: string
  portal?: boolean
  frameSize?: [number, number, number]
  pictureScale?: [number, number]
  playerBody?: React.RefObject<RapierRigidBody | null>
}

export function Picture({
  position,
  onEnter,
  imagePath = `${import.meta.env.BASE_URL}images/my-photo.jpg`,
  portal = false,
  frameSize,
  pictureScale,
  playerBody }: PictureProps
)
  {
  const cloned = useClonedGLTF(`${import.meta.env.BASE_URL}models/Frame.glb`)
  const texture = useTexture(imagePath)
  const matRef = useRef<PortalShaderMaterialType>(null)

  useFrame(({ clock }) => {
      if (matRef.current && portal) matRef.current.uTime = clock.getElapsedTime()
  })

  return (
    <group>
      {/* Visual frame */}
      <primitive object={cloned} scale={frameSize}/>

      {/* Rapier sensor — triggers navigation when character enters */}
      {portal && (
        <RigidBody type="fixed" sensor onIntersectionEnter={({ other }) => {
          if (playerBody && other.rigidBody?.handle !== playerBody.current?.handle) return
          onEnter?.()
        }}>
          <CuboidCollider args={frameSize ? [1,1, 0.05] : [0.8, 1.15, 0.05]} position={position ?? [0, 0, 0.01]} />
        </RigidBody>
      )}


      {/* Image plane — shader handles ripple distortion + edge shimmer */}
      <mesh position={position ?? [0, 0, 0.01]}>
        <planeGeometry args={pictureScale ? pictureScale : [1.6, 2.3]} />
        {portal ? (
          <portalShaderMaterial ref={matRef} uTexture={texture} />
        ) : (
          <meshStandardMaterial map={texture} dithering/>
        )}
      </mesh>
    </group>
  )
}