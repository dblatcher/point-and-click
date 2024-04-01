import { HotspotZone, SupportedZoneShape, Zone } from "@/definitions";
import { Point } from "physics-worlds/dist/src/geometry";
import { NewHotspotEffect } from "../ClickEffect";

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