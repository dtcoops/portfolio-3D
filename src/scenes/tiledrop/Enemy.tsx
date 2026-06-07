import { useRef } from 'react'
import { BallCollider, RigidBody, RapierRigidBody, useRapier } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'

import { usePatrolCollider } from '../../hooks/usePatrolCollider'
import { usePatrolMovement } from "../../hooks/usePatrolMovement"

const EXPLOSION_RADIUS = 9
const EXPLOSION_FORCE = 10

interface EnemyProps {
  position: [number, number, number]
  playerBody: React.RefObject<RapierRigidBody | null>
  patrolPoints?: [number, number, number][]
}

export function Enemy({ position, playerBody, patrolPoints }: EnemyProps) {
    const enemyRigidBody = useRef<RapierRigidBody>(null)
    const { world } = useRapier()

    // Keyed by handle (stable number) so useFrame can resolve fresh WASM references
    const pendingImpulses = useRef<Map<number, { ix: number; iz: number }>>(new Map())

    useFrame(() => {
        if (pendingImpulses.current.size === 0) return
        world.bodies.forEach(body => {
            const impulse = pendingImpulses.current.get(body.handle)
            if (!impulse) return
            const vel = body.linvel()
            // setLinvel preserves the existing fall velocity (y) and blasts horizontally
            body.setLinvel({ x: impulse.ix, y: vel.y, z: impulse.iz }, true)
        })
        pendingImpulses.current.clear()
    })

    const explode = () => {
        const enemyPos = enemyRigidBody.current?.translation()
        if (!enemyPos) return

        world.bodies.forEach(body => {
            if ((body.userData as Record<string, unknown>)?.type !== 'tile') return

            const pos = body.translation()
            const dx = pos.x - enemyPos.x
            const dz = pos.z - enemyPos.z
            const dist = Math.sqrt(dx * dx + dz * dz)
            if (dist > EXPLOSION_RADIUS) return

            // Skip setBodyType on already-dynamic tiles — it resets fall velocity
            if (!body.isDynamic()) body.setBodyType(0, true)

            const strength = (1 - dist / EXPLOSION_RADIUS) * EXPLOSION_FORCE
            const nx = dist > 0 ? dx / dist : 0
            const nz = dist > 0 ? dz / dist : 0
            pendingImpulses.current.set(body.handle, { ix: nx * strength, iz: nz * strength })
        })
    }

    const { onStepEnter, onStepExit } = usePatrolCollider(playerBody, {
        onEnter: explode,
        onExit: () => {},
    })

    usePatrolMovement(enemyRigidBody, position, patrolPoints, playerBody, undefined, undefined, undefined, 0.2)

    return (
        <RigidBody
            ref={enemyRigidBody}
            position={position}
            type="kinematicPosition"
            colliders={false}
        >
            {/* friction=0: Rapier kinematic friction would shift the player on top of the explicit setTranslation below, causing double movement */}
            <BallCollider
                args={[0.5]}
                friction={0}
                onCollisionEnter={onStepEnter}
                onCollisionExit={onStepExit}
            />
            <mesh receiveShadow castShadow>
                <sphereGeometry args={[0.5]} />
                <meshStandardMaterial color={'#ff0000'} roughness={0.85} dithering/>
            </mesh>
        </RigidBody>
    )
}
