import { useEffect, useCallback } from 'react'
import { RigidBody, CuboidCollider } from '@react-three/rapier'
import { RapierRigidBody } from '@react-three/rapier'
import { useTexture, Text } from '@react-three/drei'
import * as THREE from 'three'

import Portal from '../../components/Portal'
import { Screen, FluorescentLight, ServerRackBank, Wire, CameraModel } from '../../components/models'
import { useGameStore } from '../../store/gameStore'

// HubRoom props
export default function HubRoom({ playerBody }: {
  playerBody: React.RefObject<RapierRigidBody | null>
}) {
  const base = import.meta.env.BASE_URL
  const portfolioPortal = `${base}images/portfolio.png`
  const loreDumpCam = `${base}images/loreDumpCam.png`
  const hubRoomCam = `${base}images/hubRoomCam.png`
  const galleryCam = `${base}images/GalleryCam.png`
  const tiledropCam = `${base}images/tiledropCam.png`

  const online = useGameStore((s) => s.serverOnline)
  const setServerOnline = useGameStore((s) => s.setServerOnline)
  const handleInteract = useCallback(() => setServerOnline(!online), [online, setServerOnline])

  const radius = 14
  const wallHeight = 6

  const wallTexture = useTexture(`${base}Textures/Kenney/Dark/texture_03.png`, (t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(16,1.02)
  })

  const floorTexture = useTexture(`${base}Textures/Kenney/Dark/texture_08.png`, (t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(8, 8)
  })

  const ceilingTexture = useTexture(`${base}Textures/Kenney/Dark/texture_02.png`, (t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(8, 8)
  })

  return (
    <>
      <FluorescentLight position={[0, 5, 6]} />
      <FluorescentLight position={[0, 5, -6]} />
      <FluorescentLight position={[6, 5, 0]} rotation={[0, Math.PI / 2, 0]} />
      <FluorescentLight position={[-6, 5, 0]} rotation={[0, Math.PI / 2, 0]} />
      {/* Floor */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[radius + 1, 2, radius + 1]} position={[0, -2, 0]} />
        <mesh receiveShadow position={[0, -0.1, 0]}>
          <cylinderGeometry args={[radius + 1, radius + 1, 0.2, 32]} />
          <meshStandardMaterial map={floorTexture} dithering />
        </mesh>
      </RigidBody>

      {/* Circular wall */}
      <RigidBody type="fixed" colliders="trimesh">
        <mesh receiveShadow position={[0, wallHeight / 2, 0]}>
          <cylinderGeometry args={[radius, radius, wallHeight, 32, 1, true]} />
          <meshStandardMaterial map={wallTexture} side={THREE.BackSide} dithering />
        </mesh>
      </RigidBody>

      {/* Ceiling */}
      <mesh position={[0, wallHeight, 0]}>
        <cylinderGeometry args={[radius, radius, 0.2, 32]} />
        <meshStandardMaterial map={ceilingTexture} dithering />
      </mesh>

      <ControlsSign
        position={[0, 2.5, 13.5]}
        rotation={[0, Math.PI, 0]}
        online={online}
        playerBody={playerBody}
      /> 
    
      <ServerRackBank position={[10, 0, 4]} rotation={[0, -Math.PI / 2, 0]} />
      <ServerRackBank position={[10, 0, -4]} rotation={[0, -Math.PI / 2, 0]} />
      <ServerRackBank position={[-10, 0, 4]} rotation={[0, Math.PI / 2, 0]} />

      {/* Floor cables */}
      <Wire points={[[9, 0.05, 4], [5, 0.03, 2], [0, 0.05, -7.5]]} color="#6b02c2" />
      <Wire points={[[9, 0.06, -4], [5, 0.04, -2], [0, 0.06, -7.5]]} color="#0044cc" />
      <Wire points={[[-9, 0.05, 4], [-5, 0.03, 0], [0, 0.05, -7.5]]} color="#00aa44" />
      <Wire points={[[9, 0.07, 4], [3, 0.05, 0], [-9, 0.07, 4]]} color="#ffaa00" />
      <Wire points={[[-5.5, 0, 13], [3, 0.05, 0], [0, 0, -5.5],  [0, 0.05, -7.5]]} color="#cc0000" />
      <Wire points={[
        [0, 0.05, 13.5],    // portal wall
        [-4, 0.05, 12],     // curves left
        [-8, 0.05, 10],     // along wall
        [-11, 0.05, 6],     // continuing around
        [-13, 0.05, 2],     // near left wall
        [-12, 0.05, -3],    // starting to come inward
        [-10, 0.05, -5],    // heading toward desk
        [-5, 0.05, -6],     // approaching desk
        [0, 0.05, -7.5]     // arrives at desk
      ]} 
        color="#cc0000"
        />

      <ControlDesk position={[0, 0, -8.25]} online={online} onToggle={handleInteract} />
      <DeskInteraction
        deskPosition={[0, 0, -8.25]}
        playerBody={playerBody}
        onInteract={handleInteract}
      />

      <CameraModel 
        position={[0, 5, -12]} 
        rotation={[0, 0, 0]} 
      />

      {/* Main Screen */}
      <Screen
        position={[0, 3.25, -13]}
        rotation={[0, 0, 0]}
        width={5} height={3} wallMounted
        imagePath={online ? hubRoomCam : undefined}
        content={online ? '> portfolio-3d v1.0\n> Status: ONLINE\n> Portal: ONLINE' : '> portfolio-3d v1.0\n> Status: OFFLINE\n> Portal: OFFLINE'}
      />
      <Screen 
        position={[4.25, 4.5, -13]} 
        rotation={[0, -.4, 0]}
        width={3} height={1.6} wallMounted
        imagePath={online ? loreDumpCam : undefined}
        content={online ? '' : '> Languages Used:\n\t> TypeScript\n\t> GLSL'}
      />
      <Screen 
        position={[-4.25, 4.5, -13]} 
        rotation={[0, .4, 0]}
        width={3} height={1.6} wallMounted
        imagePath={online ? galleryCam : undefined}
        content={online ? '' : 'FrameWorks and Libraries:\n\t> React\n\t> Three.js\n\t> React Three Fibre'}
      />
      <Screen 
        position={[4.25, 2.5, -13]} 
        rotation={[0, -.4, 0]}
        width={3} height={1.6} wallMounted
        imagePath={online ? tiledropCam : undefined}
        content={online ? '' : '> Tooling:\n\t> Vite\n\t> Node.js'}
      />
      <Screen 
        position={[-4.25, 2.5, -13]} 
        rotation={[0, .4, 0]}
        width={3} height={1.6} wallMounted
        content={online ? '' : '> 3D Pipeline:\n\t> Mixamo\n\t> Blender'}
      />

      <Screen 
        position={[-5, 4, 12]} 
        rotation={[0, Math.PI * .9, 0]}
        width={3} height={1.6} 
        wallMounted
        content={"> Welcome\n> This portfolio is a game\n> Explore to learn more\n\n> Not a gamer?\n> Jump into the Portal below for a classic portfolio\n "} 
      />

      <Screen 
        position={[5, 4, 12]} 
        rotation={[0, Math.PI * 1.15, 0]}
        width={3} height={1.6} 
        wallMounted
        content={"> Daniel Cooper\n> Computer Science Student"} 
      />

      <Screen
        position={[12, 4, -5]}
        rotation={[0, -Math.PI / 2.5, 0]}
        width={3} height={1.6} wallMounted
        content={'> Days since last portal incident: 2'}
      />

      <Screen
        position={[12, 4, 5]}
        rotation={[0, -Math.PI / 1.5, 0]}
        width={3} height={1.6} wallMounted
        content={online ? 'Active Scenes: 2' :'> Active Scenes: 1'}
      />

      <Screen
        position={[-12, 4, 5]}
        rotation={[0, -Math.PI / 0.75, 0]}
        width={3} height={1.6} wallMounted
        content={'> Inspired by Super Mario 64 and Astro Bot'}
      />

      <Screen
        position={[-12, 4, -5]}
        rotation={[0, -Math.PI / 0.6, 0]}
        width={3} height={1.6} wallMounted
        content={'> Assets:\n> Kenney.nl - Prototype Textures\n> viravoloshyn.itch.io - Museum Models\n> Mixamo - Y-bot and Animations\n> Kevin MacLeod - Perspectives Music'}
      />

      <pointLight
        key={`a`}
        position={[0, 6, -10]}
        intensity={30}
        distance={9}
        decay={1}
        color="#aaaaff"
        castShadow={false}
    />

      <Portal position={[-5.25, 1.75, 12.5]} rotation={[0, Math.PI * 0.9, 0]} imagePath={portfolioPortal} destination="https://dtcoops.github.io/portfolio/" external playerBody={playerBody}/>
    </>
  )
}

function ControlsSign({ position, rotation, online, playerBody }: {
  position: [number, number, number]
  rotation: [number, number, number]
  online: boolean
  playerBody: React.RefObject<RapierRigidBody | null>
}) {
  const base = import.meta.env.BASE_URL
  const exitPortal = `${base}images/loreDump.png`

  return (
    <>
      {!online && (
        <group position={position} rotation={rotation}>
          {/* Backing board */}
          <mesh position={[0, 0, -0.05]}>
            <boxGeometry args={[3, 2.5, 0.1]} />
            <meshStandardMaterial color="#111122" roughness={0.8} dithering />
          </mesh>
          {/* Border */}
          <mesh position={[0, 0, -0.06]}>
            <boxGeometry args={[3.2, 2.7, 0.05]} />
            <meshStandardMaterial color="#6644aa" roughness={0.8} dithering />
          </mesh>
          <Text position={[0, 0.9, 0.1]} fontSize={0.25} color="#ffffff" anchorX="center">
            CONTROLS
          </Text>
          <Text position={[0, 0.45, 0.1]} fontSize={0.18} color="#aaaaff" anchorX="center">
            W A S D - Move
          </Text>
          <Text position={[0, 0.1, 0.1]} fontSize={0.18} color="#aaaaff" anchorX="center">
            SHIFT - Run
          </Text>
          <Text position={[0, -0.25, 0.1]} fontSize={0.18} color="#aaaaff" anchorX="center">
            SPACE - Jump
          </Text>
        </group>
      )}

      {online && (
        <Portal
          position={position}
          rotation={rotation}
          destination="/about"
          frameSize={[2, 2, 1]}
          pictureScale={[3, 4.5]}
          imagePath={exitPortal}
          playerBody={playerBody}
        />
      )}
    </>
  )
}

function ControlDesk({ position, online }: { 
  position: [number, number, number]
  online: boolean
  onToggle: () => void
}) {
  
  return (
    <group position={position}>
      <RigidBody type="fixed" colliders="trimesh">
      {/* Main desk body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 0.8, 1.2]} />
        <meshStandardMaterial color="#111122" roughness={0.8} dithering />
      </mesh>

      {/* Slanted top surface */}
      <mesh position={[0, 0.5, -0.1]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[4, 0.05, 1.2]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} dithering />
      </mesh>
      </RigidBody>

      <Screen position={[-1.3, 1.2, -0.3]} 
        content={online ? '> ONLINE\n> systems active' : '> OFFLINE\n> press Button'} 
      />
      <Screen position={[0, 1.2, -0.3]} 
        content={online ? '> status: OK' : '> status: STANDBY\n> Press \'E\''} 
      />
      <Screen position={[1.3, 1.2, -0.3]} 
        content={online ? '> portfolio loaded' : '> waiting...'} 
      />

      {/* Button */}
      <mesh 
        position={[0, 0.46, 0.3]}
      >
        <cylinderGeometry args={[0.12, 0.12, 0.08, 16]} />
        <meshStandardMaterial 
          color={online ? '#00ff44' : '#ff2200'}
          emissive={online ? '#00ff44' : '#ff2200'}
          emissiveIntensity={0.8}
          roughness={0.85} 
          dithering
        />
      </mesh>
    </group>
  )
}

function DeskInteraction({ 
  deskPosition, 
  playerBody, 
  onInteract 
}: { 
  deskPosition: [number, number, number]
  playerBody: React.RefObject<RapierRigidBody | null>
  onInteract: () => void
}) {
  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code !== 'KeyE') return

    const player = playerBody.current
    if (!player) return

    const pos = player.translation()
    const dx = pos.x - deskPosition[0]
    const dz = pos.z - deskPosition[2]
    const distance = Math.sqrt(dx * dx + dz * dz)

    if (distance < 4) {
      onInteract()
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [deskPosition, onInteract, playerBody])

  return null
}
