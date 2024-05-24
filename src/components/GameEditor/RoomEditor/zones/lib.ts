import { HotspotZone, RoomData, SupportedZoneShape, Zone } from "@/definitions";
import { Point } from "physics-worlds/dist/src/geometry";
import { ClickEffect, NewHotspotEffect } from "../ClickEffect";
import { getShift, locateClickInWorld } from "@/lib/roomFunctions";
import { cloneData } from "@/lib/clone";

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

export const makeNewHotspot = (point: Point, effect: NewHotspotEffect, idNumber: number): HotspotZone => {
    const zone: HotspotZone = { ...point, type: 'hotspot', id: `HOTSPOT_${idNumber}`, parallax: 1 }
    switch (effect.shape) {
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
        case 'OBSTACLE':
            return clickEffect.shape === 'polygon' ? { type: 'POLYGON_POINT_OBSTACLE', index: obstacleAreas.length - 1 } : undefined
        case 'WALKABLE':
            return clickEffect.shape === 'polygon' ? { type: 'POLYGON_POINT_WALKABLE', index: walkableAreas.length - 1 } : undefined
        case 'HOTSPOT':
            return clickEffect.shape === 'polygon' ? { type: 'POLYGON_POINT_HOTSPOT', index: hotspots.length - 1 } : undefined
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
    const roundedPoint = {
        x: Math.round(pointClicked.x),
        y: Math.round(pointClicked.y),
    }

    const targetPoint = [
        'OBSTACLE', 'POLYGON_POINT_OBSTACLE', 'WALKABLE', 'POLYGON_POINT_WALKABLE', 'HOTSPOT_WALKTO_POINT'
    ].includes(clickEffect.type)
        ? locateClickInWorld(roundedPoint.x, roundedPoint.y, viewAngle, room)
        : {
            x: roundedPoint.x - getShift(viewAngle, 1, room),
            y: room.height - roundedPoint.y
        }

    switch (clickEffect.type) {
        case 'OBSTACLE':
            obstacleAreas.push(makeNewZone(targetPoint, clickEffect.shape))
            activeObstacleIndex = obstacleAreas.length - 1;
            break;
        case 'WALKABLE':
            walkableAreas.push(makeNewZone(targetPoint, clickEffect.shape))
            activeWalkableIndex = walkableAreas.length - 1;
            break;
        case 'HOTSPOT':
            hotspots.push(makeNewHotspot(targetPoint, clickEffect, hotspots.length + 1))
            activeHotspotIndex = hotspots.length - 1;
            break;
        case 'POLYGON_POINT_OBSTACLE':
            const obstacle = obstacleAreas[clickEffect.index]
            if (!obstacle?.polygon) { return { activeHotspotIndex, activeObstacleIndex, activeWalkableIndex } }
            obstacle.polygon.push([
                targetPoint.x - obstacle.x, targetPoint.y - obstacle.y
            ])
            break;
        case 'POLYGON_POINT_WALKABLE':
            const walkable = walkableAreas[clickEffect.index]
            if (!walkable?.polygon) { return { activeHotspotIndex, activeObstacleIndex, activeWalkableIndex } }
            walkable.polygon.push([
                targetPoint.x - walkable.x, targetPoint.y - walkable.y
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
    }

    return {
        activeHotspotIndex, activeObstacleIndex, activeWalkableIndex,
        roomChange: { obstacleAreas, hotspots, walkableAreas },
    }

}