/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { RoomData, ActorData, HotspotZone } from "src";

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

export function placeOnScreen(xPosition: number, viewAngle: number, roomData: RoomData) {
    const { width, frameWidth } = roomData
    const offCenter = 2 * (xPosition - width / 2) / width
    const shift = getShift(viewAngle, 1, roomData)
    const result = (frameWidth / 2) + (offCenter * (width / 2)) + shift
    return result
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
    return -offCenter * 2
}

export function getTargetPoint(target: ActorData | HotspotZone): { x: number; y: number } {

    if (target.type === 'actor') {
        const { x, y, walkToX = 0, walkToY = 0 } = target
        return {
            x: x + walkToX,
            y: y + walkToY,
        }
    }

    return {
        x: target.walkToX || target.x,
        y: target.walkToY || target.y,
    }
}
