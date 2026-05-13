import { Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import MobileGate from './components/MobileGate'
import Hub from './scenes/Hub'
import { lazy } from 'react'
import { useEffect, useRef } from 'react'

import LoadingScreen from './components/LoadingScreen'

const AboutHallway = lazy(() => import('./scenes/AboutHallway'))

function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    //const audio = new Audio('src/assets/Getting it Done.mp3')
    //const audio = new Audio('src/assets/Life of Riley.mp3')
    const audio = new Audio('src/assets/Perspectives.mp3')
    //const audio = new Audio('src/assets/Paradise_Found.mp3')
    audio.loop = true
    audio.volume = 0.4
    audio.play().catch(() => {})
    audioRef.current = audio

    return () => { audio.pause() }
  }, [])

  return (
    <MobileGate>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/about" element={<AboutHallway />} />
        </Routes>
      </Suspense>
    </MobileGate>
  )
}

export default App
