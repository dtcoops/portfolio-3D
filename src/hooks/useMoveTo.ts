import { useRef, type RefObject } from "react"
import { useFrame } from "@react-three/fiber";
import * as THREE from 'three'
import { RapierRigidBody } from "@react-three/rapier";
import { usePlayerCarry } from "./usePlayerCarry";

interface UseMoveToProps {
  rb: RefObject<RapierRigidBody | null>,
  from: [number, number, number],
  to: [number, number, number],
  playerBody?: RefObject<RapierRigidBody | null>
  playerOnMovingTile?: RefObject<boolean>
  options?: { speed?: number; onArrive?: () => void }
}

export function useMoveTo({ rb, from, to, playerBody, playerOnMovingTile, options }: UseMoveToProps) {
    const triggered = useRef(false)
    const arrived = useRef(false)
    const currentPos = useRef(new THREE.Vector3(...from))
    const targetPos = useRef(new THREE.Vector3(...to))
    const directionVector = useRef(new THREE.Vector3())
    const carry = usePlayerCarry(playerBody, playerOnMovingTile, from[0], from[2])

    useFrame((_, delta) => {
        if (!triggered.current || !rb.current || arrived.current) return

        directionVector.current.copy(targetPos.current).sub(currentPos.current)
        if (directionVector.current.length() < 0.05) {
            if (!arrived.current) {
                arrived.current = true; options?.onArrive?.()
            }
            return
        }

        currentPos.current.addScaledVector(directionVector.current.normalize(), (options?.speed ?? 2) * delta)
        rb.current.setNextKinematicTranslation(currentPos.current)
        carry(currentPos.current.x, currentPos.current.z)
    }, 1)

    return { trigger: () => { triggered.current = true } }
}
