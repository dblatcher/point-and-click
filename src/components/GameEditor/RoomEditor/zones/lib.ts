import { HotspotZone, RoomData, SupportedZoneShape, Zone } from "@/definitions";
import { Point } from "physics-worlds/dist/src/geometry";
import { ClickEffect } from "../ClickEffect";
import { getShift, locateClickInWorld } from "@/lib/roomFunctions";
import { cloneData } from "@/lib/clone";
import { Polygon } from "@/definitions/Zone";

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
        case 'ADD_NEW':
            if (clickEffect.shape === 'polygon') {
                switch (clickEffect.zoneType) {
                    case "hotspot":
                        return { type: 'POLYGON_POINT_HOTSPOT', index: hotspots.length - 1 }
                    case "obstacle":
                        return { type: 'POLYGON_POINT_OBSTACLE', index: obstacleAreas.length - 1 }
                    case "walkable":
                        return { type: 'POLYGON_POINT_WALKABLE', index: walkableAreas.length - 1 }
                }
            }
            return undefined


        default:
            return clickEffect
    }
}

export type ChangesFromClick = {
    roomChange?: Pick<RoomData, 'obstacleAreas' | 'hotspots' | 'walkableAreas'>;
    activeHotspotIndex?: number,
    activeObstacleIndex?: number,
    activeWalkableIndex?: number,
}

const getTargetPoint = (
    pointClicked: { x: number; y: number },
    clickEffect: ClickEffect,
    viewAngle: number,
    room: RoomData
): { x: number; y: number } => {
    const roundedPoint = {
        x: Math.round(pointClicked.x),
        y: Math.round(pointClicked.y),
    }

    const isForWalkableOrObstacle = 'zoneType' in clickEffect
        ? clickEffect.zoneType !== 'hotspot'
        : [
            'POLYGON_POINT_OBSTACLE', 'POLYGON_POINT_WALKABLE', 'HOTSPOT_WALKTO_POINT'
        ].includes(clickEffect.type)

    if (isForWalkableOrObstacle) {
        return locateClickInWorld(roundedPoint.x, roundedPoint.y, viewAngle, room)
    }

    return {
        x: roundedPoint.x - getShift(viewAngle, 1, room),
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


    if (!clickEffect) { }

    const targetPoint = getTargetPoint(pointClicked, clickEffect, viewAngle, room)

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

        case 'POLYGON_POINT_OBSTACLE':
            const obstacle = obstacleAreas[clickEffect.index]
            if (!obstacle?.polygon) { return { activeHotspotIndex, activeObstacleIndex, activeWalkableIndex } }
            obstacle.polygon.push([
                targetPoint.x - obstacle.x,
                targetPoint.y - obstacle.y
            ])
            break;
        case 'POLYGON_POINT_WALKABLE':
            const walkable = walkableAreas[clickEffect.index]
            if (!walkable?.polygon) { return { activeHotspotIndex, activeObstacleIndex, activeWalkableIndex } }
            walkable.polygon.push([
                targetPoint.x - walkable.x,
                targetPoint.y - walkable.y
            ])
            break;
        case 'POLYGON_POINT_HOTSPOT': {
            const hotspot = hotspots[clickEffect.index]
            if (!hotspot?.polygon) { return { activeHotspotIndex, activeObstacleIndex, activeWalkableIndex } }
            hotspot.polygon.push([
                targetPoint.x - hotspot.x, targetPoint.y - hotspot.y
            ])
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
            const { zoneType, index, pointIndex } = clickEffect
            console.log("**", targetPoint)
            switch (zoneType) {
                case "hotspot": {
                    const zone = hotspots[index]
                    const polygon = zone?.polygon
                    if (polygon) {
                        zone.polygon = changePolygonPoint(polygon, pointIndex, {
                            x: targetPoint.x - zone.x,
                            y: targetPoint.y - zone.y
                        })
                    }
                    break;
                }
                case "obstacle": {
                    const zone = obstacleAreas[clickEffect.index]
                    const polygon = zone?.polygon
                    if (polygon) {
                        zone.polygon = changePolygonPoint(polygon, pointIndex, {
                            x: targetPoint.x - zone.x,
                            y: targetPoint.y - zone.y
                        })
                    }
                    break;
                }
                case "walkable": {
                    const zone = walkableAreas[clickEffect.index]
                    const polygon = zone?.polygon
                    if (polygon) {
                        zone.polygon = changePolygonPoint(polygon, pointIndex, {
                            x: targetPoint.x - zone.x,
                            y: targetPoint.y - zone.y
                        })
                    }
                    break;
                }
            }

            break;
        }
        case "ZONE_POSITION": {
            switch (clickEffect.zoneType) {
                case "hotspot":
                    const hotspot = hotspots[clickEffect.index]
                    console.log(hotspot, targetPoint)
                    if (hotspot) {
                        hotspot.x = targetPoint.x
                        hotspot.y = targetPoint.y
                    }
                    break;
                case "obstacle":
                    const obstacle = obstacleAreas[clickEffect.index]
                    console.log(obstacle, targetPoint)
                    if (obstacle) {
                        obstacle.x = targetPoint.x
                        obstacle.y = targetPoint.y
                    }
                    break;
                case "walkable":
                    const walkable = walkableAreas[clickEffect.index]
                    console.log(walkable, targetPoint)
                    if (walkable) {
                        walkable.x = targetPoint.x
                        walkable.y = targetPoint.y
                    }
                    break;
            }
        }
    }

    return {
        activeHotspotIndex, activeObstacleIndex, activeWalkableIndex,
        roomChange: { obstacleAreas, hotspots, walkableAreas },
    }

}