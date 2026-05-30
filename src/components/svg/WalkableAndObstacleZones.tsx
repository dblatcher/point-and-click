import type { RoomData } from "point-click-lib";
import { WalkabilityZone } from "./WalkabilityZone";


interface Props {
    roomData: RoomData;
    renderAllZones?: boolean;
    walkableIndexToMark?: number;
    obstacleIndexToMark?: number;
}

/**
 * goes inside ParallaxFrame
 */
export const WalkableAndObstacleZones = ({ roomData, renderAllZones, walkableIndexToMark, obstacleIndexToMark }: Props) => {

    const { walkableAreas = [], obstacleAreas = [] } = roomData

    return <>
        {walkableAreas.map((zone, index) => {
            if (!renderAllZones && walkableIndexToMark !== index) {
                return null
            }
            return <WalkabilityZone key={index}
                zone={zone}
                className={walkableIndexToMark === index ? 'flashing-zone' : undefined}
                markVertices={walkableIndexToMark == index}
                zoneType="walkable"
            />
        })}

        {obstacleAreas.map((zone, index) => {
            if (!renderAllZones && obstacleIndexToMark !== index) {
                return null
            }
            return <WalkabilityZone key={index}
                zone={zone}
                className={obstacleIndexToMark === index ? 'flashing-zone' : undefined}
                markVertices={obstacleIndexToMark === index}
                zoneType="obstacle"
            />
        })}
    </>
}