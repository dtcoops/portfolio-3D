import { RigidBody, CuboidCollider, RapierRigidBody } from '@react-three/rapier'
import { useMemo } from 'react'
import { useTexture, Text } from '@react-three/drei'
import * as THREE from 'three'

import Portal from '../components/Portal'
import { FluorescentLight } from './../utils/models/Models'
import { TimeLine, TimeLineNode } from '../utils/models/HubAndHallModels'
import { InfoDeskLarge } from '../utils/models/GalleryModels'
import InteractIcon from '../components/InteractIcon'

export function AboutHallwayWorld( {playerBody} : 
    {playerBody: React.RefObject<RapierRigidBody | null> 
}) {
    const base = import.meta.env.BASE_URL
    const entrancePortalImg = `${base}images/hubRoom.png`
    const baseTexture = useTexture(`${base}Textures/Kenney/Dark/texture_03.png`)

    const wallTexture = useMemo(() => {
        const t = baseTexture.clone()
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(14, 3)
        t.needsUpdate = true
        return t
    }, [baseTexture])

    const sideWallTexture = useMemo(() => {
        const t = baseTexture.clone()
        t.wrapS = t.wrapT = THREE.RepeatWrapping
        t.repeat.set(3, 3)
        t.needsUpdate = true
        return t
    }, [baseTexture])
  
  const floorTexture = useTexture(`${base}Textures/Kenney/Dark/texture_08.png`, (t) => {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(3, 10)
  })

  return (
    <>
        {/* Floor */}
        <RigidBody type="fixed" colliders='hull'>
            <mesh position={[0, 0, 0]} receiveShadow>
                <boxGeometry args={[4, 1, 30]} />
                <meshStandardMaterial map={floorTexture} />
            </mesh>
        </RigidBody>

        {/* Walls */}
        <RigidBody type="fixed" colliders='hull' >
            <mesh position={[2.25, 3, 0]} receiveShadow>
                <boxGeometry args={[1, 5, 30]} />
                <meshStandardMaterial map={wallTexture} />
            </mesh>
        </RigidBody>
        <CuboidCollider args={[1, 5, 30]} position={[-3, 3, 0]} />
        <RigidBody type="fixed" colliders='hull'>
            <mesh position={[0, 3, -16]} receiveShadow>
                <boxGeometry args={[4, 5, 3]} />
                <meshStandardMaterial map={sideWallTexture} />d
            </mesh>
        </RigidBody>
        <RigidBody type="fixed" colliders='hull'>
            <mesh position={[0, 3, 16]} receiveShadow>
                <boxGeometry args={[4, 5, 3]} />
                <meshStandardMaterial map={sideWallTexture} />
            </mesh>
        </RigidBody>

        {/* Lighting */}
        <FluorescentLight position={[0, 3.95, -10.5]} rotation={[0, Math.PI / 2, 0]} />
        <FluorescentLight position={[0, 3.95, -5.5]} rotation={[0, Math.PI / 2, 0]} />
        <FluorescentLight position={[0, 3.95, 0]} rotation={[0, Math.PI / 2, 0]} />
        <FluorescentLight position={[0, 3.95, 5.5]} rotation={[0, Math.PI / 2, 0]} />
        <FluorescentLight position={[0, 3.95, 10.5]} rotation={[0, Math.PI / 2, 0]} />

        <InteractIcon 
            position={[1.25, 1.85, -12.5]} 
            label={`Welcome`}
            info={`\tWelcome To:\nThe Lore Dump`}
            playerBody={playerBody}
        />
        <InfoDeskLarge 
            position={[1.25, 0.6, -12.5]} 
            rotation={[0, (-Math.PI / 2) * 0.9, 0]}
            scale={1.25}
            type="fixed"
        />

        {/* UVic and SFU */}
        <TimeLineNode position={[1.75, 2, -10.5]} color="#ffaa00"/>
        <TimeLine position={[1.75, 2, -8.75]} length={3.5} color="#ffaa00" label="Uvic" info="Began Writing B.A." playerBody={playerBody}/>
        <TimeLineNode position={[1.75, 2, -7]} color="#ffaa00"/>
        <TimeLineNode position={[1.75, 2, -6]} color="#ffaa00"/>
        <TimeLine position={[1.75, 2, -4.75]} length={2.5} color="#ffaa00" label="SFU" info="Transferred to an English B.A." playerBody={playerBody}/>
        <TimeLineNode position={[1.75, 2, -3.5]} color="#ffaa00"/>

        {/* Envision */}
        <TimeLineNode position={[1.75, 2.5, -7]} color="#0629c5"/>
        <TimeLine position={[1.75, 2.5, -5.75]} length={2.5} color="#0629c5" label="Bank Teller" info="Learnt Customer Service and Financial Literacy skills" playerBody={playerBody}/>
        <TimeLineNode position={[1.75, 2.5, -4.5]} color="#0629c5" />

        {/* Line Cook */}
        <TimeLineNode position={[1.75, 2.5, -3.5]} color="#0629c5"/>
        <TimeLine position={[1.75, 2.5, 1.75]} length={10.5} color="#0629c5" label="Line Cook" info="From Pizza Cook to Lead Kitchen Cook, " playerBody={playerBody}/>
        <TimeLineNode position={[1.75, 2.5, 7]} color="#0629c5" />

        {/* Game Writer */}
        <TimeLineNode position={[1.75, 3, -3.5]} color="#0629c5"/>
        <TimeLine position={[1.75, 3, -2.5]} length={2} color="#0629c5" label="Game News Writer" info="Took a job as a Game Journalist to gain industry connections" playerBody={playerBody}/>
        <TimeLineNode position={[1.75, 3, -1.5]} color="#0629c5" />

        {/* Douglas*/}
        <TimeLineNode position={[1.75, 2, 2]} color="#ffaa00"/>
        <TimeLine position={[1.75, 2, 3.5]} length={3} color="#ffaa00" label="Douglas College" info={`Information Systems Diploma\n`} playerBody={playerBody}/>
        <TimeLineNode position={[1.75, 2, 5]} color="#ffaa00"/>
        
        {/* SFU */}
        <TimeLineNode position={[1.75, 2, 7]} color="#ffaa00"/>
        <TimeLine position={[1.75, 2, 8.75]} length={3.5} color="#ffaa00" label="SFU" info="Upgrading my Diploma into a Computer Science B.Sc" playerBody={playerBody}/>
        <TimeLineNode position={[1.75, 2, 10.5]} color="#ffaa00" />

        {/* Years and full Timeline */}
        <TimeLine position={[1.75, 1.5, 0]} length={21} />
        <TimeLineNode position={[1.75, 1.5, -10.5]} color="#4444ff" year="2009"/>
        <TimeLineNode position={[1.75, 1.5, -7]} color="#4444ff" year="2011"/>
        <TimeLineNode position={[1.75, 1.5, -6]} color="#4444ff" year="2012"/>
        <TimeLineNode position={[1.75, 1.5, -4.5]} color="#4444ff" year="2014"/>
        <TimeLineNode position={[1.75, 1.5, -3.5]} color="#4444ff" year="2015"/>
        <TimeLineNode position={[1.75, 1.5, -1.5]} color="#4444ff" year="2016"/>
        <TimeLineNode position={[1.75, 1.5, 2]} color="#4444ff" year="2018"/>
        <TimeLineNode position={[1.75, 1.5, 5]} color="#4444ff" year="2021"/>
        <TimeLineNode position={[1.75, 1.5, 7]} color="#4444ff" year="2023"/>
        <TimeLineNode position={[1.75, 1.5, 10.5]} color="#4444ff" year="Present"/>
        
        <Text position={[1.6, 2.5, 12.5]} rotation={[0, -Math.PI/2, 0]} fontSize={0.15} color="#aaaaff" anchorX="center" textAlign="center">
            {`Vancouver, BC\nSFU CS — 2027\nSeeking: Software Developer | Game Developer roles`}
        </Text>

        {/* Entrance and Exit - in that order*/}
        <Portal position={[0, 2.5, -14.5]} rotation={[0, 0, 0]}  destination="/" imagePath={entrancePortalImg}/>
        <Portal position={[0, 2.5, 14.5]} rotation={[0, Math.PI, 0]}  destination="/about" />
    </>
  )
}

