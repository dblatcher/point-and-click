import { Zone } from "point-click-lib"
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
    const className = zoneType === 'walkable' ? walkableClassNames(zoneOptions) : obstableClassNames(zoneOptions);

    return <ZoneSvg
        className={className}
        stopPropagation={false}
        zone={zone}
        x={zone.x + surfaceXOffcenter}
        y={roomData.height - zone.y + surfaceYOffcenter}
        markVertices={markVertices}
    />
}