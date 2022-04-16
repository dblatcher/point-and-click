import { RoomData } from "./RoomData";
export function clamp(value: number, max = 1, min = 0) {
    return Math.max(Math.min(value, max), min)
}

export function placeOnScreen(xPosition: number, viewAngle: number, roomData: RoomData) {
    const { width, frameWidth } = roomData
    const offCenter = 2 * (xPosition - width / 2) / width
    const shift = getShift(viewAngle, 1, roomData)
    return (frameWidth / 2) + (offCenter * frameWidth) + shift
}

// only works when layerWidth = frameWidth/2
export function locateClickInWorld(clickXPosition: number, viewAngle: number, roomData: RoomData) {
    const { width , frameWidth} = roomData
    const shift = getShift(viewAngle, 1, roomData)
    const offCenterInPoints = (clickXPosition - frameWidth / 2)
    const centerOfScreenXPosition = (width / 2) - shift
    const xPosition = offCenterInPoints + centerOfScreenXPosition

    console.log({ offCenterInPoints, centerOfScreenXPosition })
    return xPosition
}

export function getViewAngleCenteredOn(xPosition: number, roomData: RoomData) {
    const { width } = roomData
    const offCenter = 2 * (xPosition - width / 2) / width
    return -offCenter * 2
}

export function getLayerWidth(parallax: number, roomData: RoomData) {
    const { frameWidth, width } = roomData
    return frameWidth + (parallax * (width - frameWidth))
}

export function getShift(viewAngle: number, parallax: number, roomData: RoomData) {
    const layerWidth = getLayerWidth(parallax, roomData)
    const shiftRange = (layerWidth - roomData.frameWidth) / 2
    return viewAngle * shiftRange
}