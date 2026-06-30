import { useBuddyThrow } from "../hooks/useBuddyThrow"
import { RigidBody, CapsuleCollider } from "@react-three/rapier"
import { Suspense, type RefObject } from "react"
import Character from "./player/Character"
import { RapierRigidBody } from "@react-three/rapier"

interface BuddyProps {
    position: [number, number, number]
    playerBody: React.RefObject<RapierRigidBody | null>
    controlDisabledRef: RefObject<boolean>
    throwTarget: [number, number, number]

}

export default function Buddy({ position, playerBody, controlDisabledRef, throwTarget }: BuddyProps) {
  
  const { catchPlayer } = useBuddyThrow({
    playerBody,
    buddyPosition: position,
    throwTarget,
    controlDisabledRef,
    options: { throwHeight: 6, holdDelay: 0.4 },
  })

  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CapsuleCollider args={[0.385, 0.385]} sensor onIntersectionEnter={catchPlayer} />
      <group rotation={[0, -Math.PI / 4, 0]}>
        <Suspense fallback={null}>
          <Character animationName="Idle" />
        </Suspense>
      </group>
    </RigidBody>
  )
}