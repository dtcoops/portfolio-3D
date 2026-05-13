import { useGameStore } from '../store/gameStore'

export default function FadeOverlay() {
  const isTransitioning = useGameStore(s => s.isTransitioning)

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'black',
      opacity: isTransitioning ? 1 : 0,
      transition: 'opacity 0.4s ease',
      pointerEvents: isTransitioning ? 'all' : 'none',
      zIndex: 100
    }} />
  )
}