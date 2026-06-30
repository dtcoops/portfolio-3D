import { Billboard, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { RapierRigidBody } from '@react-three/rapier'

interface InteractIconProps {
    position: [number, number, number]
    label?: string
    info?: string
    size?: [number, number]
    playerBody: React.RefObject<RapierRigidBody | null>
    onInteract?: () => void
}

export default function InteractIcon({position, label, info, size, playerBody, onInteract} : InteractIconProps) {
    const [nearby, setNearby] = useState(false)
    const groupRef = useRef<THREE.Group>(null)
    // Scale Pulse
    const scaleRef = useRef(1)
    const pulsed = useRef(false)
    const pulseStart = useRef<number | null>(null)
    const [active, setActive] = useState(false)

    useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code !== 'KeyE') return
        if (!nearby) return
        setActive(o => !o)
        onInteract?.()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    }, [nearby, onInteract])

    useFrame(({ clock }) => {
        if (!playerBody.current || !groupRef.current) return
        
        const pos = playerBody.current.translation()
        const dx = pos.x - position[0]
        const dz = pos.z - position[2]
        const distance = Math.sqrt(dx * dx + dz * dz)
        const isNear = distance < 1.5
        
        if (!isNear) setActive(false)

         // hover animation
        const hover = Math.sin(clock.getElapsedTime() * 2) * 0.03
        groupRef.current.position.y = hover

        // trigger pulse once on enter
        if (isNear && !pulsed.current) {
            pulsed.current = true
            pulseStart.current = clock.getElapsedTime()
        }
        if (!isNear) pulsed.current = false

        setNearby(isNear)

        // single pulse — grows then returns to 1
        let targetScale = 1
        if (pulseStart.current !== null) {
        const elapsed = clock.getElapsedTime() - pulseStart.current
        if (elapsed < 0.5) {
            targetScale = 1 + Math.sin(elapsed * Math.PI / 0.5) * 0.3
        } else {
            pulseStart.current = null
        }
        }

        scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale, 0.1)
        groupRef.current.scale.setScalar(scaleRef.current)
    })

    return (
        <Billboard position={position}>
            <group ref={groupRef}>
                {/* Outer Border */}
                <mesh rotation={[0, 0, Math.PI / 4]}>
                    <planeGeometry args={[0.25, 0.25]} />
                    <meshStandardMaterial 
                        color="#6644aa"
                        emissive="#6644aa"
                        emissiveIntensity={nearby ? 3 : 1.5}
                        transparent
                        opacity={0.9}
                    />
                </mesh>

                {/* Inner Icon */}
                <mesh rotation={[0, 0, Math.PI / 4]} position={[0, 0, 0.01]}>
                    <planeGeometry args={[0.2, 0.2]} />
                    <meshStandardMaterial
                        color="#111122"
                        emissive="#4422aa"
                        emissiveIntensity={0.5}
                        transparent
                        opacity={0.95}
                    />
                </mesh>

                <Text
                    position={[0, 0, 0.02]}
                    fontSize={0.1}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    fillOpacity={nearby ? 1 : 0}
                >
                    E
                </Text>

                {!active && nearby && (
                    <>
                        <mesh position={[0.65, 0, -0.1]}>
                            <planeGeometry args={[1.25, .2]} />
                            <meshStandardMaterial color="#4422aa" transparent opacity={1} />
                        </mesh>

                        <Text 
                            position={[0.65, 0, 0]} 
                            fontSize={0.09}
                            color="#ffffff"
                            anchorX="center" 
                            anchorY="middle"
                        >
                            {label}
                        </Text>
                    </>
                )}

                {active && info && (
                    <>
                        <mesh position={[0, 0.5, -0.001]}>
                            <planeGeometry args={size ? size : [1, 1]} />
                            <meshStandardMaterial 
                                color="#4422aa" 
                                emissive="#4422aa"
                                transparent 
                                opacity={1} 
                            />
                        </mesh>

                        <Text 
                            position={[0, 0.5, -0.0005]} 
                            fontSize={0.09}
                            color="#ffffff"
                            anchorX="center" 
                            anchorY="middle"
                            maxWidth={size ? size[0] - 0.05 : 0.95}
                            textAlign="center"
                        >
                            {info}
                        </Text>
                    </>
                )}

                {/* Glow light */}
                <pointLight
                intensity={nearby ? 0.8 : 0.3}
                distance={1.5}
                color="#6644aa"
                />
            </group>
        </Billboard>
    )
}