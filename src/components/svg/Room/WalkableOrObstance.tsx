import { Zone } from "@/definitions"
import ZoneSvg from "../ZoneSvg"
import { obstableClassNames, walkableClassNames, ZoneOptions } from "./zoneCssClasses"
import { useRoomRender } from "@/hooks/useRoomRender"

interface Props {
    zone: Zone,
    markVertices: boolean
    zoneType: 'walkable' | 'obstacle'
    zoneOptions: ZoneOptions
}


export const WalkableOrObstacle = ({ zone, markVertices, zoneType, zoneOptions }: Props) => {
    const { roomData, surfaceXOffcenter, surfaceYOffcenter } = useRoomRender()

    if (zoneType === 'walkable') {
        return <ZoneSvg
            className={walkableClassNames(zoneOptions)}
            stopPropagation={false}
            zone={zone}
            x={zone.x + surfaceXOffcenter}
            y={roomData.height - zone.y + surfaceYOffcenter}
            markVertices={markVertices}
        />
    }
    return <ZoneSvg
        className={obstableClassNames(zoneOptions)}
        stopPropagation={false}
        zone={zone}
        x={zone.x + surfaceXOffcenter}
        y={roomData.height - zone.y + surfaceYOffcenter}
        markVertices={markVertices}
    />
}