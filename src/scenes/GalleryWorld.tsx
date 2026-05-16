import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { CuboidCollider, RapierRigidBody } from '@react-three/rapier'
import { GalleryModel, RopeBarrier } from '../utils/models/GalleryModels'
import Portal from '../components/Portal'
import InteractIcon from '../components/InteractIcon'
import { FluorescentLight } from '../utils/models/HubAndHallModels'

function FloorDebug() {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/GalleryFloor.glb`)
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const center = new THREE.Vector3()
    box.getCenter(center)
  }, [scene])
  return null
}

export function GalleryWorld( {playerBody} :
    {playerBody: React.RefObject<RapierRigidBody | null>
}) {
    return (
        <>
            <FloorDebug />
            <GalleryModel
                position={[-18.22, 0, -81.33]}
                rotation={[0, 0, 0]}
                scale={1.25}
                type="fixed"
                floorColor='#5c3d2e'
                ceilingColor='#c4a882'
            />

            {/* Side Wing */}
            <RopeBarrier position={[-15, 0, 25.25]} rotation={[0, Math.PI /2, 0]} type="fixed"/>
            <InteractIcon position={[-15, 1, 25.25]} playerBody={playerBody} label="Under Construction" info="Coming Soon..."/>
            <CuboidCollider args={[2.5, 5, .5]} position={[-16, 1, 25.25]} rotation={[0,Math.PI / 2,0]}/>
            
            {/* Pictures */}
            <Portal 
                position={[5, 2, -11.85]} 
                rotation={[0, 0, 0]} 
                portal={false} 
                destination="" 
                frameSize={[1, 1, 1]} 
                pictureScale={[1.5, 2.25]}
            />

            <FluorescentLight position={[5, 4.75, -10]} />
            {/* Portals */}
            <Portal position={[4.5, 7.6, -11.85]} rotation={[0, 0, 0]} destination="/Tiledrop" frameSize={[6, 1.75, 1]} pictureScale={[9.75, 4]}/>
        </>
    )
}