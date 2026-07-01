import { CuboidCollider, RapierRigidBody } from '@react-three/rapier'
import { Text } from '@react-three/drei'
import Portal from '../../components/Portal'
import InteractIcon from '../../components/InteractIcon'
import { 
    FluorescentLight, Desk, Stool, PotLight, LightWallSmall, Stairs, PedestalBig, Dinosaur, 
    Girl,  BlenderLogo, GalleryModel, RopeBarrier, Table, Book,
    Bench
} from '../../components/models'

export function GalleryWorld( {playerBody} :
    {playerBody: React.RefObject<RapierRigidBody | null>
}) {
    const base = import.meta.env.BASE_URL
    const portfolioPortal = `${base}images/portfolio.png`
    const gitImg = `${base}images/git.png`
    const linkedinImg = `${base}images/linkedin.png`
    const mailImg = `${base}images/mail.png`
    const tiledropPortalImg = `${base}images/TileDrop.png`
    const dinoImg = `${base}images/Dinosaur.png`
    const dungeonImg = `${base}images/Dungeon.png`
    const lightHouseImg = `${base}images/Lighthouse.png`
    const girlImg = `${base}images/girl.png`
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
                floorColor='#5a4c45'
                ceilingColor='#c4a882'
            />

            {/* Side Wing */}
            <RopeBarrier position={[-15, 0.5, 25.25]} rotation={[0, Math.PI /2, 0]} type="fixed"/>
            <InteractIcon position={[-15, 1, 25.25]} playerBody={playerBody} label="Under Construction" info="Coming Soon..."/>
            <CuboidCollider args={[2.5, 5, .5]} position={[-16, 1, 25.25]} rotation={[0,Math.PI / 2,0]}/>

            {potLightPositions.map((pos, i) => (
                <>
                    <PotLight key={`l-${i}`} position={pos} />
                    <pointLight
                        key={`pl-${i}`}
                        position={[pos[0], pos[1] - 0.8, pos[2]]}
                        intensity={3}
                        decay={1.4}
                        color="#ffe8c0"
                        castShadow={false}
                    />
                </>
            ))}

            {/* Under-balcony pot lights */}
            {[
                [-3, 4.85, -8] as [number, number, number],
                [ 4, 4.85, -8] as [number, number, number],
                [11, 4.85, -8] as [number, number, number],
                [ 4, 4.85,  0] as [number, number, number],
            ].map((pos, i) => (
                <>
                    <PotLight key={`bp-${i}`} position={pos} />
                    <pointLight
                        key={`bpl-${i}`}
                        position={[pos[0], pos[1] - 1, pos[2]]}
                        intensity={8}
                        decay={2}
                        color="#ffe8c0" 
                        castShadow={false}
                    />
                </>
            ))}


            {/* Pictures */}
            <LightWallSmall position={[0, 4.6, -11.75]} />
            <Portal
                position={[0, 2.5, -11.85]}
                rotation={[0, 0, 0]}
                portal
                imagePath={gitImg}
                destination="https://github.com/dtcoops"
                frameSize={[1.75, 1.75, 1.5]}
                pictureScale={[2.7, 3.9]}
                external
                playerBody={playerBody}
            />

            <LightWallSmall position={[8, 4.6, -11.75]} rotation={[0, 0, 0]} />
            <Portal
                position={[8, 2.5, -11.85]}
                rotation={[0, 0, 0]}
                portal
                imagePath={portfolioPortal}
                destination="https://dtcoops.github.io/portfolio/"
                frameSize={[1.75, 1.75, 1.5]}
                pictureScale={[2.7, 3.9]}
                external
                playerBody={playerBody}
            />

            <LightWallSmall position={[13.8, 4.6, -3]} rotation={[0, -Math.PI / 2, 0]} />
            <Portal
                position={[14, 2.5, -3]}
                rotation={[0, -Math.PI / 2, 0]}
                imagePath={linkedinImg}
                destination="https://linkedin.com/in/dcooper-15895"
                frameSize={[1.75, 1.75, 1.5]}
                pictureScale={[2.7, 3.9]}
                external
                playerBody={playerBody}
            />

            <LightWallSmall position={[-5.1, 4.6, -3]} rotation={[0, Math.PI / 2, 0]} />
            <Portal
                position={[-5.25, 2.5, -3]}
                rotation={[0, Math.PI / 2, 0]}
                imagePath={mailImg}
                portal={true}
                destination="mailto:dtcooper@sfu.ca"
                frameSize={[1.75, 1.75, 1.5]}
                pictureScale={[2.7, 3.9]}
                external
                playerBody={playerBody}
            />

            {/* 
            <PedestalSmall position={[5, 0.45, -6]} rotation={[0, Math.PI / 2, 0]}/>
            <GitLogo position={[5, 1.5, -6]} rotation={[0, 0, 0]} scale={0.5}/>

            <PedestalSmall position={[8, 0.45, -3.5]} rotation={[0, Math.PI / 2, 0]}/>
            <LinkedinLogo position={[8, 1.5, -3.5]} rotation={[0, Math.PI / 2, 0]} scale={0.4}/>

            <PedestalSmall position={[2, 0.45, -3.5]} rotation={[0, Math.PI / 2, 0]}/>
            <MailLogo position={[2, 1.5, -3.5]} rotation={[0, Math.PI / 2, 0]} scale={0.2} />
            */}
            {/* Blender Area */}
            <BlenderLogo position={[-15.25, 9, -2]} rotation={[0, Math.PI / 2, 0]} scale={0.11}/>
            <Text position={[-15.25, 8.25, -2]} rotation={[0, Math.PI/2, 0]} fontSize={0.3} color="#ebddc1" anchorX="center" textAlign="center">
                {`3D Art - Blender`}
            </Text>
            <PedestalBig position={[-10, 5.4, 4]} rotation={[0, Math.PI / 2, 0]} scale={1.5}/>
            <Dinosaur position={[-10.5, 7.2, 4.25]} rotation={[0, Math.PI, 0]} scale={1} />
            <PedestalBig position={[-10, 5.4, -9]} rotation={[0, Math.PI / 2, 0]} scale={1.5}/>
            <Girl position={[-10, 6.85, -9]} rotation={[0, Math.PI * 0.35, 0]} scale={0.6}/>
            <Bench position={[-10, 5.6, -1.5]} rotation={[0, 0, 0]} scale={1.5}/>
            <Bench position={[-10, 5.6, -2.5]} rotation={[0, Math.PI, 0]} scale={1.5}/>
            <Portal imagePath={dinoImg} position={[-15.25, 8.25, 4]} rotation={[0, Math.PI / 2, 0]} destination="" frameSize={[1.9, 0.45,1]} pictureScale={[3, 1]} portal={false} />
            <Portal imagePath={lightHouseImg} position={[-15.25, 6.5, 5]} rotation={[0, Math.PI / 2, 0]} destination="" frameSize={[1.9, 0.45,1]} pictureScale={[3, 1]} portal={false} />
            <Portal imagePath={dungeonImg} position={[-15.25, 6.75, -2]} rotation={[0, Math.PI / 2, 0]} destination="" frameSize={[4.4,1.1, 1]} pictureScale={[7, 2.5]} portal={false} />
            <Portal imagePath={girlImg} position={[-15.25, 7.5, -9.5]} rotation={[0, Math.PI / 2, 0]} destination="" frameSize={[1.25, 0.75, 1]} pictureScale={[2, 1.75]} portal={false} />
            
            {/* Signup Area */}
            <Book position={[-14, 1, 20]} rotation={[0, Math.PI * 0.4, 0]} scale={2}/>
            <Table position={[-14, 0.5,20]} rotation={[0, Math.PI / 2, 0]}scale={2.5}/>
 
            {/* Reception Area */}
            <Desk position={[5, 0.6, 35]} rotation={[0, Math.PI, 0]} type='fixed' scale={1.5}/>
            <Stool position={[5.5, 0.5, 36]} rotation={[0, Math.PI * 1.1, 0]} type='dynamic' scale={1.5}/>w
            <FluorescentLight position={[5, 3, 35]}  playerBody={playerBody} soundKey="gallery-fluo-1"/>
            

            {/* Portals */}
            <Portal imagePath={tiledropPortalImg} position={[4.5, 7.6, -11.85]} rotation={[0, 0, 0]} destination="/Tiledrop" frameSize={[6, 1.75, 1]} pictureScale={[9.75, 4]}/>
            <Portal position={[18.5, 2, 55]} rotation={[0, Math.PI, 0]} destination="/Tiledrop" frameSize={[1, 1, 1]} pictureScale={[1.5, 2.25]} portal={false}/>
            <Portal position={[-10, 2, 55]} rotation={[0, Math.PI, 0]} destination="/Tiledrop" frameSize={[1, 1, 1]} pictureScale={[1.5, 2.25]} portal={false}/>
        </>
    )
}