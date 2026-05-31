import { useRef, useState, useEffect, Suspense } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { RigidBody, CapsuleCollider, useRapier, RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import Character from './Character'
import { AnimationController } from './animationController'
import { useReadySignal } from '../hooks/useReadySignal'
import { CONTROLS } from '../constants/controls'

const SPEED = 6
const JUMP_DOWN_MS = (10 / 30) * 1000

const JUMP_FORCE = {
  standing: 5,
  moving: 5,
  running: 6,
}

interface CharacterControllerProps {
  bodyRef: React.RefObject<RapierRigidBody | null>
  visualGroupRef?: React.RefObject<THREE.Group | null>
  spawnPosition?: [number, number, number]
  spawnRotation?: [number, number, number]
  movementMode?: 'radial' | 'flat' | 'follow'
  onReady?: () => void
  disabled?: boolean
  hidden?: boolean
  forcedAnimation?: string
}

export default function CharacterController({ bodyRef, visualGroupRef, spawnPosition = [0, 1, 10], spawnRotation, movementMode = 'radial', onReady, disabled = false, hidden = false,
  forcedAnimation }: CharacterControllerProps) {
  useReadySignal(onReady)
  const body = bodyRef
  const { camera } = useThree()
  const [animationName, setAnimationName] = useState('Idle')
  const currentAnimRef = useRef('Idle')
  const [, getKeys] = useKeyboardControls()
  const { rapier, world } = useRapier()

  const animController = useRef(new AnimationController())

  const handleAnimationFinish = (name: string) => {
    if (name === 'Jump Up' || name === 'Running Jump') animController.current.onJumpUpFinished()
    if (name === 'Jump Down') animController.current.onJumpDownFinished()
  }

  const isGrounded = useRef(false)
  const justJumped = useRef(false)
  const ungroundedFrames = useRef(0)
  const internalVisualRef = useRef<THREE.Group>(null)
  const visualRef = (visualGroupRef ?? internalVisualRef) as React.RefObject<THREE.Group>
  const canJump = useRef(true)
  const targetScale = useRef(new THREE.Vector3(1, 1, 1))
  const firstFrame = useRef(true)

  useEffect(() => {
    window.focus()
    const onBlur = () => {
      const keys = CONTROLS.flatMap(c => c.keys)

      keys.forEach(code => {
        window.dispatchEvent(new KeyboardEvent('keyup', { code, bubbles: true }))
      })
    }
    window.addEventListener('blur', onBlur)
    return () => window.removeEventListener('blur', onBlur)
  }, [])

  useFrame((_, delta) => {
    if (!body.current) return
    const dt = Math.min(delta, 0.1)

    if (disabled) {
      if (visualRef.current) {
        const pos = body.current.translation()
        if (forcedAnimation === 'Get Up') {
          // Smoothly rise toward standing height over the getup animation duration
          const standTarget = new THREE.Vector3(pos.x, pos.y + 0.2, pos.z)
          const yLerp = 1 - Math.pow(0.97, dt * 60)
          visualRef.current.position.lerp(standTarget, yLerp)
        } else if (forcedAnimation) {
          // Freeze Y so ground-level animations (Falling, Fall Flat) don't float
          visualRef.current.position.x = THREE.MathUtils.lerp(visualRef.current.position.x, pos.x, 0.1)
          visualRef.current.position.z = THREE.MathUtils.lerp(visualRef.current.position.z, pos.z, 0.1)
        } else {
          const target = new THREE.Vector3(pos.x, pos.y + 0.2, pos.z)
          visualRef.current.position.lerp(target, 0.1)
        }
      }
      if (forcedAnimation && forcedAnimation !== currentAnimRef.current) {
        currentAnimRef.current = forcedAnimation
        setAnimationName(forcedAnimation)
      }
      return
    }

    const { forward, back, left, right, jump, run } = getKeys()
    const vel = body.current.linvel()
    const pos = body.current.translation()
    const lerpFactor = 1 - Math.pow(0.75, dt * 60)

    // Ground check
    const feetPos = { x: pos.x, y: pos.y - 0.75, z: pos.z }
    const ray = new rapier.Ray(feetPos, { x: 0, y: -1, z: 0 })
    const hit = world.castRay(ray, 0.25, true, undefined, undefined, undefined, body.current)
    const actuallyGrounded = hit !== null
    isGrounded.current = actuallyGrounded && !justJumped.current

    ungroundedFrames.current = actuallyGrounded ? 0 : ungroundedFrames.current + 1

    if (!isGrounded.current) {
      if (vel.y < 0) {
        body.current.applyImpulse({ x: 0, y: -6 * dt * 60, z: 0 }, true)
      } else if (vel.y < 2) {
        // apex pull — starts before the peak to cut floatiness
        body.current.applyImpulse({ x: 0, y: -4 * dt * 60, z: 0 }, true)
      }

      // Fell off a ledge without jumping — require 3 consecutive ungrounded frames
      // to avoid triggering on single-frame physics jitter from box surfaces
      if (ungroundedFrames.current >= 3 && !animController.current.isAirborne() && !justJumped.current && vel.y < 0) {
        animController.current.onFall()
      }
    }

    const moveDir = new THREE.Vector3()
    if (movementMode === 'flat') {
      if (forward) moveDir.add(new THREE.Vector3(1, 0, 0))
      if (back)    moveDir.add(new THREE.Vector3(-1, 0, 0))
      if (right)   moveDir.add(new THREE.Vector3(0, 0, 1))
      if (left)    moveDir.add(new THREE.Vector3(0, 0, -1))
    } else if (movementMode === 'follow') {
      const camForward = new THREE.Vector3()
      camera.getWorldDirection(camForward)
      camForward.y = 0
      camForward.normalize()
      const camRight = new THREE.Vector3().crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize()
      if (forward) moveDir.add(camForward)
      if (back)    moveDir.sub(camForward)
      if (right)   moveDir.add(camRight)
      if (left)    moveDir.sub(camRight)
    } else {
      const toWall = new THREE.Vector3(pos.x, 0, pos.z).normalize()
      const tangent = new THREE.Vector3(-toWall.z, 0, toWall.x)
      if (forward) moveDir.add(toWall)
      if (back)    moveDir.sub(toWall)
      if (right)   moveDir.add(tangent)
      if (left)    moveDir.sub(tangent)
    }
    moveDir.normalize()

    const isMoving = moveDir.lengthSq() > 0.01

    if (animController.current.getJumpPhase() === 'up' && vel.y < -0.5) {
      animController.current.onJumpUpFinished()
    }

    // Landing
    if (actuallyGrounded && !justJumped.current && vel.y <= 0 && animController.current.isAirborne()) {
      const firstLanding = animController.current.onLand()
      if (firstLanding) {
        const squash = isMoving
          ? new THREE.Vector3(1.1, 0.8, 1.1)
          : new THREE.Vector3(1.05, 0.9, 1.05)
        targetScale.current.copy(squash)
        setTimeout(() => { targetScale.current.set(1, 1, 1) }, 150)
        setTimeout(() => { animController.current.onJumpDownFinished() }, JUMP_DOWN_MS)
      }
    }

    // Visual follow
    if (visualRef.current) {
      const target = new THREE.Vector3(pos.x, pos.y + 0.2, pos.z)
      if (firstFrame.current) {
        visualRef.current.position.copy(target)
        if (spawnRotation) visualRef.current.rotation.set(spawnRotation[0], spawnRotation[1], spawnRotation[2])
        firstFrame.current = false
      } else {
        const posLerp = 1 - Math.pow(0.8, dt * 60)
        visualRef.current.position.lerp(target, posLerp)
      }
      visualRef.current.scale.lerp(targetScale.current, 1 - Math.pow(0.85, dt * 60))
    }

    // Rotation
    if (isMoving && visualRef.current) {
      const angle = Math.atan2(moveDir.x, moveDir.z)
      const current = visualRef.current.rotation.y
      const diff = Math.atan2(Math.sin(angle - current), Math.cos(angle - current))
      visualRef.current.rotation.y += diff * (1 - Math.pow(0.85, dt * 60))
    }

    // Movement
    const speed = run ? 10 : SPEED
    const grounded = isGrounded.current && !justJumped.current
    body.current.setLinvel({
      x: grounded && !isMoving ? 0 : THREE.MathUtils.lerp(vel.x, isMoving ? moveDir.x * speed : 0, lerpFactor),
      y: grounded ? 0 : vel.y,
      z: grounded && !isMoving ? 0 : THREE.MathUtils.lerp(vel.z, isMoving ? moveDir.z * speed : 0, lerpFactor),
    }, true)

    // Jump
    if (jump && isGrounded.current && canJump.current) {
      const isRunningBack = run
      const jumpKey = run ? 'running' : isMoving ? 'moving' : 'standing'

      targetScale.current.set(0.9, 1.1, 0.85)
      setTimeout(() => { targetScale.current.set(1, 1, 1) }, 200)

      body.current.applyImpulse({ x: 0, y: JUMP_FORCE[jumpKey], z: 0 }, true)
      animController.current.onJump(isRunningBack)

      canJump.current = false
      justJumped.current = true
      setTimeout(() => { justJumped.current = false }, 600)
      setTimeout(() => { canJump.current = true }, 500)
    }

    // Animation
    animController.current.update(isMoving, run)
    const newAnim = forcedAnimation ?? animController.current.getAnimation()
    if (newAnim !== currentAnimRef.current) {
      currentAnimRef.current = newAnim
      setAnimationName(newAnim)
    }
  })

  return (
    <>
      <RigidBody ref={body} position={spawnPosition} lockRotations colliders={false} ccd>
        <CapsuleCollider args={[0.4, 0.4]} />
      </RigidBody>
      <group ref={visualRef} visible={!hidden} position={[spawnPosition[0], spawnPosition[1] + 0.2, spawnPosition[2]]} castShadow>
        <group rotation={[0, -Math.PI / 4, 0]}>
          <Suspense fallback={null}>
            <Character animationName={animationName} onAnimationFinish={handleAnimationFinish} />
          </Suspense>
        </group>
      </group>
    </>
  )
}
