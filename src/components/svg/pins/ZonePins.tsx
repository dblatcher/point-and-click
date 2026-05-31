import type { RoomData, Zone } from "point-click-lib"
import { PolygonPins } from "./PolygonPins"
import { CirclePins } from "./CirclePins"
import { RectanglePins } from "./RectanglePins"
import { getXShift, getYShift, useRoomRender } from "point-click-components"

interface Props {
    zone: Zone;
    parallax?: number;
}

const getPlacement = (
    zone: Zone,
    parallax: number,
    roomData: RoomData,
    viewAngleX: number,
    viewAngleY: number
) => {
    const x = zone.x + getXShift(viewAngleX, parallax, roomData)
    const y = roomData.height - zone.y + getYShift(viewAngleY, parallax, roomData)
    return { x, y }
}

export const ZonePins = ({ zone, parallax }: Props) => {
    const { polygon, rect, circle } = zone
    const { roomData, viewAngleX, viewAngleY } = useRoomRender()

    const { x, y } = typeof parallax === 'number' ? getPlacement(zone, parallax, roomData, viewAngleX, viewAngleY) : { x: 0, y: 0 }

    return <svg
        x={x} y={y} style={{ overflow: 'visible', fill: 'transparent' }}
    >
        {polygon && <PolygonPins polygon={polygon} />}
        {circle && <CirclePins radius={circle} />}
        {rect && <RectanglePins width={rect[0]} height={rect[1]} />}
    </svg>
}