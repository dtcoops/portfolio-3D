import { useRef, useEffect } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { CatmullRomCurve3 } from "three"
import { Vector3 } from "three"
import { easeInOutSineBlend } from "../../../utils/easing"

interface GalleryIntroProps {
    onComplete: () => void
    skip?: boolean
}

export function GalleryIntro({ onComplete, skip }: GalleryIntroProps) {
    const { camera } = useThree()
    const progress = useRef(0)
    const done = useRef(false)

    const path = new CatmullRomCurve3([
        new Vector3(5, 8, 25),       // start high
        new Vector3(-10, 9, -2),     // blender corner
        new Vector3(18, 9, -2),      // back wall
        new Vector3(-10, 4, 45),      // left side
        new Vector3(4, 7, 50),      // left side
        new Vector3(18.5, 4, 45),      // balcony area
        new Vector3(19, 2, 35),      // balcony area
        new Vector3(5, 4, 31),       // settle toward spawn
    ])

    useEffect(() => {
        if (!skip || done.current) return
        done.current = true
        camera.position.copy(path.getPoint(1))
        camera.lookAt(5, 9.5, 25)
        onComplete()
    }, [skip])

    useFrame((_, delta) => {
    if (done.current) {
        return
    }
    
    progress.current = Math.min(progress.current + delta * 0.04, 1)
    const t = easeInOutSineBlend(progress.current)
    const point = path.getPoint(t)
    const tangent = path.getTangent(t)
    camera.position.copy(point)

    const SETTLE_BLEND_START = 0.9
    const blendFactor = Math.max(0, (progress.current - SETTLE_BLEND_START) / (1 - SETTLE_BLEND_START))
    const tangentLook = new Vector3(point.x + tangent.x, point.y + tangent.y, point.z + tangent.z)
    const settleLook = new Vector3(5, 9.5, 25)
    const lookTarget = tangentLook.lerp(settleLook, blendFactor)
    camera.lookAt(lookTarget)

    if (progress.current >= 1) {
        done.current = true
        onComplete()
    }
  })

  return null
}