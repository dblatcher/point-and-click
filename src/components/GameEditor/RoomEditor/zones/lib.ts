import { HotspotZone, RoomData, SupportedZoneShape, Zone } from "@/definitions";
import { ClickEffect } from "../ClickEffect";
import { getShift, locateClickInWorld } from "@/lib/roomFunctions";
import { cloneData } from "@/lib/clone";
import { Polygon } from "@/definitions/Zone";

interface Point { x: number; y: number }

export function makeNewZone(point: Point, shape: SupportedZoneShape): Zone {
    const zone: Zone = { x: point.x, y: point.y }
    switch (shape) {
        case 'circle': zone.circle = 20;
            break;
        case 'rect': zone.rect = [20, 20]
            break;
        case 'polygon': zone.polygon = [[0, 0]]
    }
    return zone
}

export const makeNewHotspot = (point: Point, shape: SupportedZoneShape, idNumber: number): HotspotZone => {
    const zone: HotspotZone = { ...point, type: 'hotspot', id: `HOTSPOT_${idNumber}`, parallax: 1 }
    switch (shape) {
        case 'circle': zone.circle = 20;
            break;
        case 'rect': zone.rect = [20, 20]
            break;
        case 'polygon': zone.polygon = [[0, 0]]
    }
    return zone
}

export const getNextClickEffect = (clickEffect: ClickEffect, room: RoomData): ClickEffect | undefined => {
    const { obstacleAreas = [], walkableAreas = [], hotspots = [] } = room

    switch (clickEffect.type) {
        case 'ADD_NEW': {
            if (clickEffect.shape === 'polygon') {
                const list =
                    clickEffect.zoneType === 'hotspot' ? hotspots :
                        clickEffect.zoneType === 'obstacle' ? obstacleAreas :
                            walkableAreas
                return { type: 'ADD_POLYGON_POINT', index: list.length - 1, zoneType: clickEffect.zoneType }
            }

            return undefined
        }

        default:
            return clickEffect
    }
}

export type ChangesFromClick = {
    roomChange: Pick<RoomData, 'obstacleAreas' | 'hotspots' | 'walkableAreas'>;
    activeHotspotIndex?: number,
    activeObstacleIndex?: number,
    activeWalkableIndex?: number,
}

const getTargetPoint = (
    pointClicked: { x: number; y: number },
    clickEffect: ClickEffect,
    viewAngle: number,
    room: RoomData,
    parallax: number,
): { x: number; y: number } => {
    const roundedPoint = {
        x: Math.round(pointClicked.x),
        y: Math.round(pointClicked.y),
    }
    const isForWalkableOrObstacle = clickEffect.type === 'HOTSPOT_WALKTO_POINT' ? true : clickEffect.zoneType !== 'hotspot'
    if (isForWalkableOrObstacle) {
        return locateClickInWorld(roundedPoint.x, roundedPoint.y, viewAngle, room)
    }
    return {
        x: roundedPoint.x - getShift(viewAngle, parallax, room),
        y: room.height - roundedPoint.y
    }
}

const changePolygonPoint = (polygon: Polygon, pointIndex: number, mod: Partial<Point>) => {
    const pointToChange = polygon?.[pointIndex]
    if (!pointToChange) {
        return
    }
    const moddedPoint: [number, number] = [pointToChange[0], pointToChange[1]]
    if (typeof mod.x === 'number') {
        moddedPoint[0] = mod.x as number
    }
    if (typeof mod.y === 'number') {
        moddedPoint[1] = mod.y as number
    }
    const newPolygon = [...polygon.slice(0, pointIndex), moddedPoint, ...polygon.slice(pointIndex + 1)]
    return newPolygon
}

export const getChangesFromClick = (
    pointClicked: { x: number; y: number },
    viewAngle: number,
    clickEffect: ClickEffect,
    room: RoomData,
    activeHotspotIndex?: number,
    activeObstacleIndex?: number,
    activeWalkableIndex?: number,
): ChangesFromClick => {

    const {
        obstacleAreas = [], hotspots = [], walkableAreas = []
    } = cloneData(room)

    const getZoneList = () => {
        const zoneType = clickEffect.zoneType ?? 'hotspot';
        switch (zoneType) {
            case "hotspot": return hotspots
            case "obstacle": return obstacleAreas
            case "walkable": return walkableAreas
        }
    }
    const listOfZones = getZoneList()

    const getParallax = () => {
        if (clickEffect.zoneType === 'hotspot') {
            if (typeof clickEffect.index === 'number') {
                const zone = hotspots[clickEffect.index]
                if (zone) {
                    return zone.parallax
                }
            }
        }
        return 1
    }

    const targetPoint = getTargetPoint(pointClicked, clickEffect, viewAngle, room, getParallax())

    switch (clickEffect.type) {
        case 'ADD_NEW':
            switch (clickEffect.zoneType) {
                case "hotspot":
                    hotspots.push(makeNewHotspot(targetPoint, clickEffect.shape, hotspots.length + 1))
                    activeHotspotIndex = hotspots.length - 1;
                    break;
                case "obstacle":
                    obstacleAreas.push(makeNewZone(targetPoint, clickEffect.shape))
                    activeObstacleIndex = obstacleAreas.length - 1;
                    break;
                case "walkable":
                    walkableAreas.push(makeNewZone(targetPoint, clickEffect.shape))
                    activeWalkableIndex = walkableAreas.length - 1;
                    break;
            }
            break;

        case "ADD_POLYGON_POINT": {
            const zone = listOfZones[clickEffect.index]
            if (zone?.polygon) {
                zone.polygon.push([
                    targetPoint.x - zone.x,
                    targetPoint.y - zone.y
                ])
            }
            break;
        }
        case 'HOTSPOT_WALKTO_POINT': {
            const hotspot = hotspots[clickEffect.index]
            console.log(hotspot, targetPoint)
            hotspot.walkToX = targetPoint.x
            hotspot.walkToY = targetPoint.y
            break;
        }
        case "MOVE_POLYGON_POINT": {
            const { index, pointIndex } = clickEffect
            const zone = listOfZones[index]
            const polygon = zone?.polygon
            if (polygon) {
                zone.polygon = changePolygonPoint(polygon, pointIndex, {
                    x: targetPoint.x - zone.x,
                    y: targetPoint.y - zone.y
                })
            }
            break;
        }
        case "ZONE_POSITION": {
            const zone = listOfZones[clickEffect.index]
            if (zone) {
                zone.x = targetPoint.x
                zone.y = targetPoint.y
            }
            break;
        }
    }

    return {
        activeHotspotIndex, activeObstacleIndex, activeWalkableIndex,
        roomChange: { obstacleAreas, hotspots, walkableAreas },
    }

}