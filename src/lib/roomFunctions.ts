import { RoomData, ActorData, HotspotZone } from "../definitions";
import { clamp } from "./util";

export const putActorsInDisplayOrder = (a: ActorData, b: ActorData) => (b.y + (b.baseline ? b.baseline : 0)) - (a.y + (a.baseline ? a.baseline : 0))

export function getLayerWidth(parallax: number, roomData: RoomData) {
    const { frameWidth, width } = roomData
    return frameWidth + (parallax * (width - frameWidth))
}

export function getXShift(viewAngleX: number, parallax: number, roomData: RoomData) {
    const layerWidth = getLayerWidth(parallax, roomData)
    const shiftRange = (layerWidth - roomData.frameWidth) / 2
    return viewAngleX * shiftRange
}

export function calculateScreenX(xPosition: number, viewAngleX: number, roomData: RoomData) {
    const { width, frameWidth } = roomData
    const shift = getXShift(viewAngleX, 1, roomData)
    return (frameWidth / 2) + (xPosition - width / 2) + shift
}

export function getLayerHeight(parallax: number, roomData: RoomData) {
    const { height, frameHeight = height } = roomData
    return frameHeight + (parallax * (height - frameHeight))
}

export function getYShift(viewAngleY: number, parallax: number, roomData: RoomData) {
    const { height, frameHeight = height } = roomData
    const layerHeight = getLayerHeight(parallax, roomData)
    const shiftRange = (layerHeight - frameHeight) / 2
    return viewAngleY * shiftRange
}

export function calculateScreenY(yPosition: number, viewAngleY: number, roomData: RoomData) {
    const { height, frameHeight = height } = roomData
    const shift = getYShift(viewAngleY, 1, roomData)
    return (frameHeight / 2) + (yPosition - height / 2) + shift
}

export function locateClickInWorld(clickXPosition: number, clickYposition: number, viewAngleX: number, viewAngleY: number, roomData: RoomData) {
    const { width, frameWidth, height, frameHeight = height } = roomData
    const shiftX = getXShift(viewAngleX, 1, roomData)
    const offCenterXInPoints = (clickXPosition - frameWidth / 2)
    const centerOfScreenXPosition = (width / 2) - shiftX
    const x = offCenterXInPoints + centerOfScreenXPosition


    const shiftY = getYShift(viewAngleY, 1, roomData)
    const offCenterYInPoints = (clickYposition - frameHeight / 2)
    const centerOfScreenYPosition = (height / 2) - shiftY

    const y = height - (offCenterYInPoints + centerOfScreenYPosition)
    return { x: Math.round(x), y: Math.round(y) }
}

export function getViewAngleXCenteredOn(xPosition: number, roomData: RoomData) {
    const { width } = roomData
    const offCenter = 2 * (xPosition - width / 2) / width
    return clamp(-offCenter * 2, 1, -1)
}

export function getViewAngleYCenteredOn(yPosition: number, roomData: RoomData) {
    const { height } = roomData
    const offCenter = 2 * (yPosition - height / 2) / height
    return clamp(offCenter * 2, 1, -1)
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
