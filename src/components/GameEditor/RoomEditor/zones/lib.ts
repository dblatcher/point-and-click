import { HotspotZone, RoomData, SupportedZoneShape, Zone } from "@/definitions";
import { Point } from "physics-worlds/dist/src/geometry";
import { ClickEffect, NewHotspotEffect } from "../ClickEffect";

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