import { Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import MobileGate from './components/ui/MobileGate'
import Hub from './scenes/hub/Hub'
import { lazy } from 'react'
import { useEffect } from 'react'

import LoadingScreen from './components/ui/LoadingScreen'
import backgroundMusic from './assets/music/696408__bloodpixelhero__adventure-theme-9.mp3'
// import paradiseAudio from './assets/music/Paradise_Found.mp3'
import { soundManager } from './utils/soundManager'

const AboutHallway = lazy(() => import('./scenes/about/AboutHallway'))
const Gallery = lazy(() => import('./scenes/gallery/Gallery'))
const TileDrop = lazy(() => import('./scenes/tiledrop/TileDrop'))


function App() {

  useEffect(() => {
    soundManager.preloadMusic(backgroundMusic)

    const startAudio = () => {
      soundManager.playMusic(backgroundMusic, 'background', 0)
      window.removeEventListener('click', startAudio)
      window.removeEventListener('keydown', startAudio)
    }

  window.addEventListener('click', startAudio)
  window.addEventListener('keydown', startAudio)

  return () => {
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
