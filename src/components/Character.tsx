import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

const ONE_SHOT_ANIMS = new Set(['Jump Up', 'Running Jump', 'Jump Down'])

interface CharacterProps {
  animationName?: string
  onAnimationFinish?: (name: string) => void
}

export default function Character({ animationName = 'Idle', onAnimationFinish }: CharacterProps) {
  const { scene, animations } = useGLTF('/models/character.glb')
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const currentAction = useRef<THREE.AnimationAction | null>(null)
  const onFinishRef = useRef(onAnimationFinish)

  useEffect(() => { onFinishRef.current = onAnimationFinish }, [onAnimationFinish])

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true
      }
    })
    const mixer = new THREE.AnimationMixer(scene)
    mixerRef.current = mixer

    const handleFinished = (e: THREE.Event) => {
      const clip = (e as THREE.Event & { action: THREE.AnimationAction }).action.getClip()
      onFinishRef.current?.(clip.name)
    }
    mixer.addEventListener('finished', handleFinished)
    return () => mixer.removeEventListener('finished', handleFinished)
  }, [scene])

  useEffect(() => {
    animations.forEach(clip => {
      clip.tracks = clip.tracks.filter(track => !track.name.endsWith('.position'))
    })
    console.log('Animations:', animations.map(a => a.name))
  }, [animations])

  useEffect(() => {
    if (!mixerRef.current || animations.length === 0) return
    const clip = animations.find(a => a.name === animationName)
    if (!clip) return
    const next = mixerRef.current.clipAction(clip)

    if (ONE_SHOT_ANIMS.has(animationName)) {
      next.setLoop(THREE.LoopOnce, 1)
      next.clampWhenFinished = true
    } else {
      next.setLoop(THREE.LoopRepeat, Infinity)
      next.clampWhenFinished = false
    }

    if (currentAction.current && currentAction.current !== next) {
      currentAction.current.fadeOut(0.2)
    }
    next.reset().fadeIn(0.2).play()
    currentAction.current = next
  }, [animationName, animations])

  useFrame((_, delta) => {
    mixerRef.current?.update(delta)
  })

  return <primitive object={scene} castShadow />
}

useGLTF.preload('/models/character.glb')
