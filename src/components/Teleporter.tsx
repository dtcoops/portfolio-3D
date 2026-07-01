import { useRef } from 'react'
import type { RapierRigidBody } from '@react-three/rapier'
import type * as THREE from 'three'

import { useGameStore } from '../store/gameStore'
import { Picture } from './models/Picture'

import { soundManager } from '../../src/utils/soundManager'
import teleportSFX from '../assets/sfx/128590__timkahn__transport.mp3'

interface TeleporterProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  teleportTo: [number, number, number]
  teleportRotation?: number
  playerBody: React.RefObject<RapierRigidBody | null>
  visualGroupRef?: React.RefObject<THREE.Group | null>
  imagePath?: string
  frameSize?: [number, number, number]
  pictureScale?: [number, number]
}

export default function Teleporter({ position, rotation, teleportTo, teleportRotation, playerBody, visualGroupRef, imagePath, frameSize, pictureScale }: TeleporterProps) {
  const triggered = useRef(false)
  const setTransitioning = useGameStore(s => s.setTransitioning)

  const handleEnter = () => {
    if (triggered.current) return
    triggered.current = true
    
    soundManager.playSFX(teleportSFX)
    setTransitioning(true)

    setTimeout(() => {
      if (playerBody.current) {
        playerBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true)
        playerBody.current.setAngvel({ x: 0, y: 0, z: 0 }, true)
        playerBody.current.setTranslation({ x: teleportTo[0], y: teleportTo[1], z: teleportTo[2] }, true)
      }
      if (visualGroupRef?.current && teleportRotation !== undefined) {
        visualGroupRef.current.rotation.y = teleportRotation
      }
      triggered.current = false
      setTransitioning(false)
    }, 400)
  }

  return (
    <group position={position} rotation={rotation}>
      <Picture
        onEnter={handleEnter}
        portal={true}
        imagePath={imagePath}
        frameSize={frameSize}
        pictureScale={pictureScale}
        playerBody={playerBody}
      />
    </group>
  )
}
