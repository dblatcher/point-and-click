import { RoomData, ActorData, HotspotZone } from "../definitions";
import { clamp } from "./util";

export const putActorsInDisplayOrder = (a: ActorData, b: ActorData) => (b.y + (b.baseline ? b.baseline : 0)) - (a.y + (a.baseline ? a.baseline : 0))

export function getLayerWidth(parallax: number, roomData: RoomData) {
    const { frameWidth, width } = roomData
    return frameWidth + (parallax * (width - frameWidth))
}

export function getShift(viewAngle: number, parallax: number, roomData: RoomData) {
    const layerWidth = getLayerWidth(parallax, roomData)
    const shiftRange = (layerWidth - roomData.frameWidth) / 2
    return viewAngle * shiftRange
}

export function calculateScreenX(xPosition: number, viewAngle: number, roomData: RoomData) {
    const { width, frameWidth } = roomData
    const offCenter = 2 * (xPosition - width / 2) / width
    const shift = getShift(viewAngle, 1, roomData)
    return (frameWidth / 2) + (offCenter * (width / 2)) + shift
}

export function locateClickInWorld(clickXPosition: number, clickYposition: number, viewAngle: number, roomData: RoomData) {
    const { width, frameWidth, height } = roomData
    const shift = getShift(viewAngle, 1, roomData)
    const offCenterInPoints = (clickXPosition - frameWidth / 2)
    const centerOfScreenXPosition = (width / 2) - shift
    const x = offCenterInPoints + centerOfScreenXPosition
    const y = height - clickYposition
    return { x: Math.round(x), y: Math.round(y) }
}

export function getViewAngleCenteredOn(xPosition: number, roomData: RoomData) {
    const { width } = roomData
    const offCenter = 2 * (xPosition - width / 2) / width
    return clamp(-offCenter * 2, 1, -1)
}

export function getTargetPoint(target: ActorData | HotspotZone, roomData: RoomData): { x: number; y: number } {

    switch (target.type) {
        case 'actor': {
            const { x, y, walkToX = 0, walkToY = 0 } = target
            return {
                x: x + walkToX,
                y: y + walkToY,
            }
        }
        case 'hotspot': {
            const { x, y, walkToX, walkToY, parallax } = target
            const { frameWidth } = roomData

            let pointX: number;
            if (typeof walkToX === 'undefined') {
                const layerWidth = getLayerWidth(parallax, roomData)
                const offset = (layerWidth - frameWidth) / 2
                pointX = x + offset
            } else {
                pointX = walkToX
            }

            let pointY: number;
            if (typeof walkToY === 'undefined') {
                pointY = y
            } else {
                pointY = walkToY
            }

            return {
                x: pointX,
                y: pointY,
            }
        }
    }

}
