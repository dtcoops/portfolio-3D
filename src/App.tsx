import { Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import MobileGate from './components/MobileGate'
import Hub from './scenes/Hub'
import { lazy } from 'react'
import { useEffect, useRef } from 'react'

import LoadingScreen from './components/LoadingScreen'
import perspectivesAudio from './assets/Perspectives.mp3'

const AboutHallway = lazy(() => import('./scenes/AboutHallway'))
const Gallery = lazy(() => import('./scenes/Gallery'))
const TileDrop = lazy(() => import('./scenes/TileDrop'))


function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
  const audio = new Audio(perspectivesAudio)
  audio.loop = true
  audio.volume = 0.3
  audioRef.current = audio

  const startAudio = () => {
    audio.play().catch(() => {})
    window.removeEventListener('click', startAudio)
    window.removeEventListener('keydown', startAudio)
  }

  window.addEventListener('click', startAudio)
  window.addEventListener('keydown', startAudio)

  return () => {
    audio.pause()
    window.removeEventListener('click', startAudio)
    window.removeEventListener('keydown', startAudio)
  }
}, [])

  return (
    <MobileGate>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/about" element={<AboutHallway />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/tiledrop" element={<TileDrop />} />
        </Routes>
      </Suspense>
    </MobileGate>
  )
}

export default App
