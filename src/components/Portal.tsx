import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { RapierRigidBody } from '@react-three/rapier'

import { useGameStore } from '../store/gameStore'
import { Picture } from '../utils/models/Picture'

interface PortalProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  portal?: boolean
  destination: string
  color?: string
  imagePath?: string
  external?: boolean
  frameSize?: [number, number, number]
  pictureScale?: [number, number]
  playerBody?: React.RefObject<RapierRigidBody | null>
}

export default function Portal({ position, rotation, portal = true, destination, imagePath, external = false, frameSize, pictureScale, playerBody }: PortalProps) {
  const navigate = useNavigate()
  const triggered = useRef(false)
  const setTransitioning = useGameStore(s => s.setTransitioning)

  const handleEnter = () => {
    if (triggered.current) return
    triggered.current = true
    setTransitioning(true)

    setTimeout(() => {
      if (external) {
        window.open(destination, '_blank')
        triggered.current = false
        setTransitioning(false)
      } else {
        navigate(destination)
        setTimeout(() => setTransitioning(false), 100)
      }
    }, 400)
  }

  return (
    <group position={position} rotation={rotation}>
      <Picture
        onEnter={handleEnter}
        portal={portal}
        imagePath={imagePath}
        frameSize={frameSize}
        pictureScale={pictureScale}
        playerBody={playerBody}
      />
    </group>
  )
}