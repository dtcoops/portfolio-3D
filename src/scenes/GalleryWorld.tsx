import { CuboidCollider, RapierRigidBody } from '@react-three/rapier'
import { GalleryModel, RopeBarrier, Table } from '../utils/models/GalleryModels'
import Portal from '../components/Portal'
import InteractIcon from '../components/InteractIcon'
import { FluorescentLight, Desk, Stool, PotLight, LightWallSmall, Stairs } from '../utils/models'

export function GalleryWorld( {playerBody} :
    {playerBody: React.RefObject<RapierRigidBody | null>
}) {
    const base = import.meta.env.BASE_URL
    const tiledropPortalImg = `${base}images/TileDrop.png`
    const potLightPositions: [number, number, number][] = []

    const ceilingHeight = 10.04
    const xPositions = [-11, -4, 3, 10, 17]
    const zPositions = [-8, 0, 8, 16, 24, 32, 40, 48]

    xPositions.forEach(x => {
        zPositions.forEach(z => {
            potLightPositions.push([x, ceilingHeight, z])
        })
    })


    return (
        <>
            <Stairs position={[-3.5,2.45,6]} scale={1.3}/>
            <Stairs position={[12,2.45,6]} scale={1.3}/>

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

            {potLightPositions.map((pos, i) => (
                <PotLight key={i} position={pos} />
            ))}

            {/* Pictures */}
            <LightWallSmall position={[5, 4, -11.8]} />
            <Portal 
                position={[5, 2, -11.85]} 
                rotation={[0, 0, 0]} 
                portal 
                imagePath='https://opengraph.githubassets.com/1/dtcoops'
                destination="https://github.com/dtcoops" 
                frameSize={[1, 1, 1]} 
                pictureScale={[1.5, 2.25]}
                external
            />
            
            <LightWallSmall position={[13.8, 4, -3]} rotation={[0, -Math.PI / 2, 0]} />
            <Portal
                position={[14, 2, -3]} 
                rotation={[0, -Math.PI / 2, 0]} 
                portal={false} 
                destination="" 
                frameSize={[1, 1, 1]} 
                pictureScale={[1.5, 2.25]}
            />
            
            <LightWallSmall position={[-5.25, 4, -3]} rotation={[0, Math.PI / 2, 0]} />
            <Portal 
                position={[-5.25, 2, -3]} 
                rotation={[0, Math.PI / 2, 0]} 
                portal={false} 
                destination="" 
                frameSize={[1, 1, 1]} 
                pictureScale={[1.5, 2.25]}
            />


            <Table position={[-14, 0.5,20]} rotation={[0, Math.PI / 2, 0]}scale={2.5}/>
            <Desk position={[5, 0.6, 35]} rotation={[0, Math.PI, 0]}type='fixed' scale={1.5}/>
            <Stool position={[5.5, 0.5, 36]} rotation={[0, Math.PI * 1.1, 0]} type='dynamic' scale={1.5}/>
            <FluorescentLight position={[5, 3, 35]} />
            
            <FluorescentLight position={[5, 4.75, -10]} />
            {/* Portals */}
            <Portal imagePath={tiledropPortalImg} position={[4.5, 7.6, -11.85]} rotation={[0, 0, 0]} destination="/Tiledrop" frameSize={[6, 1.75, 1]} pictureScale={[9.75, 4]} portal={false}/>
            <Portal position={[18.5, 2, 55]} rotation={[0, Math.PI, 0]} destination="/Tiledrop" frameSize={[1, 1, 1]} pictureScale={[1.5, 2.25]}/>
            <Portal position={[-10, 2, 55]} rotation={[0, Math.PI, 0]} destination="/Tiledrop" frameSize={[1, 1, 1]} pictureScale={[1.5, 2.25]}/>
        </>
    )
}