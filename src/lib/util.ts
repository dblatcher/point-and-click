import { RoomData } from "./RoomData";
export function clamp(value: number, max = 1, min = 0) {
    return Math.max(Math.min(value, max), min)
}

export function placeOnScreen(xPosition: number, viewAngle: number, roomData: RoomData) {
    const layerWidth = getLayerWidth(1, roomData)
    const offCenter = 2 * (xPosition - layerWidth / 2) / layerWidth
    const shift = getShift(viewAngle, 1, roomData)
    return (roomData.frameWidth / 2) + (offCenter * roomData.frameWidth) + shift
}

export function locateClickInWorld(clickXPosition: number, viewAngle: number, roomData: RoomData) {
    const layerWidth = getLayerWidth(1, roomData)
    const shift = getShift(viewAngle, 1, roomData)
    const offCenterInPoints = (clickXPosition - roomData.frameWidth / 2)
    const centerOfScreenXPosition = (layerWidth / 2) - shift
    const xPosition = offCenterInPoints + centerOfScreenXPosition
    return xPosition
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