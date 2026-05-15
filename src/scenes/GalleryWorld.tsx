import { RapierRigidBody } from '@react-three/rapier'
import { GalleryModel } from '../utils/models/GalleryModels'

export function GalleryWorld( {playerBody} : 
    {playerBody: React.RefObject<RapierRigidBody | null> 
}) {
    return (
        <>
            <GalleryModel 
                position={[0, 0, 0]} 
                rotation={[0, (-Math.PI / 2) * 0.9, 0]}
                scale={1.25}
                type="fixed"
            />
        </>
    )
}